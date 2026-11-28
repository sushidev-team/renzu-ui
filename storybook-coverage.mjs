import ts from 'typescript';
import {readFile, readdir, access} from 'node:fs/promises';
import {resolve, dirname, relative, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const componentName = name => /^[A-Z][A-Za-z0-9]*$/.test(name);
const exported = node => node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
const isDefault = node => node.modifiers?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword);
function containsJsx(node) {
  let found = false;
  function visit(child) { if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child) || ts.isJsxFragment(child)) found = true; else ts.forEachChild(child, visit); }
  visit(node); return found;
}

export async function checkStoryCoverage({root, sourceDirectories, additionalFiles = [], composed = {}}) {
  const files = [];
  const portable = path => relative(root, path).split(sep).join('/');
  async function walk(directory) {
    for (const entry of await readdir(directory, {withFileTypes: true})) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (/\.[tj]sx?$/.test(path)) files.push(path);
    }
  }
  for (const directory of sourceDirectories) await walk(resolve(root, directory));
  for (const path of additionalFiles) files.push(resolve(root, path));
  const cache = new Map();
  const parse = async path => {
    if (!cache.has(path)) cache.set(path, ts.createSourceFile(path, await readFile(path, 'utf8'), ts.ScriptTarget.Latest, true, path.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS));
    return cache.get(path);
  };
  async function modulePath(from, specifier) {
    const base = specifier === '@renzu/ui' ? resolve(root, 'packages/ui/src/index') : specifier.startsWith('.') ? resolve(dirname(from), specifier.replace(/\.[cm]?js$/, '')) : null;
    if (!base) return null;
    for (const candidate of [base, ...['.tsx', '.ts', '/index.tsx', '/index.ts'].map(suffix => base + suffix)]) {
      if (await access(candidate).then(() => true, () => false)) {
        if (/\.[tj]sx?$/.test(candidate)) return candidate;
      }
    }
    return null;
  }
  const components = new Map();
  for (const path of files.filter(path => path.endsWith('.tsx') && !/\.(stories|test)\./.test(path))) {
    const source = await parse(path);
    for (const node of source.statements) {
      if (ts.isExportAssignment(node) && !node.isExportEquals) {
        const declaration = ts.isIdentifier(node.expression) ? source.statements.find(statement =>
          ts.isFunctionDeclaration(statement) && statement.name?.text === node.expression.text ||
          ts.isVariableStatement(statement) && statement.declarationList.declarations.some(d => ts.isIdentifier(d.name) && d.name.text === node.expression.text)) : node.expression;
        if (declaration && containsJsx(declaration)) {
          const name = ts.isIdentifier(node.expression) ? node.expression.text : 'default';
          components.set(`${portable(path)}#${name}`, {path, name, exportName: 'default', stories: new Set()});
        }
        continue;
      }
      if (!exported(node)) continue;
      const names = (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) && (componentName(node.name?.text ?? '') || isDefault(node)) && containsJsx(node)
        ? [node.name?.text ?? 'default']
        : ts.isVariableStatement(node) ? node.declarationList.declarations.filter(d => ts.isIdentifier(d.name) && componentName(d.name.text) && d.initializer && containsJsx(d.initializer)).map(d => d.name.text) : [];
      for (const name of names) {
        const key = `${portable(path)}#${name}`;
        components.set(key, {path, name, exportName: isDefault(node) ? 'default' : name, stories: new Set()});
      }
    }
  }
  async function lookup(path, name, visited = new Set()) {
    const key = `${path}#${name}`;
    if (visited.has(key)) return null;
    visited.add(key);
    const direct = [...components].find(([, c]) => c.path === path && c.exportName === name);
    if (direct) return direct[0];
    const source = await parse(path);
    for (const node of source.statements) {
      if (ts.isExportAssignment(node) && name === 'default' && ts.isIdentifier(node.expression)) {
        const found = [...components].find(([, c]) => c.path === path && c.name === node.expression.text);
        if (found) return found[0];
      }
      if (!ts.isExportDeclaration(node) || node.isTypeOnly || !node.moduleSpecifier) continue;
      const target = await modulePath(path, node.moduleSpecifier.text);
      if (!target) continue;
      if (!node.exportClause) { const result = await lookup(target, name, visited); if (result) return result; }
      else if (ts.isNamedExports(node.exportClause)) {
        const specifier = node.exportClause.elements.find(e => !e.isTypeOnly && e.name.text === name);
        if (specifier) return lookup(target, specifier.propertyName?.text ?? specifier.name.text, visited);
      }
    }
    return null;
  }
  const storyFiles = files.filter(path => /\.stories\.[tj]sx?$/.test(path));
  for (const path of storyFiles) {
    const source = await parse(path), bindings = new Map();
    // A meta-only file is not a usable component scenario.
    const hasScenario = source.statements.some(node => exported(node) && !isDefault(node) &&
      (ts.isVariableStatement(node) || ts.isFunctionDeclaration(node)));
    if (!hasScenario) continue;
    for (const node of source.statements) {
      if (!ts.isImportDeclaration(node) || node.importClause?.isTypeOnly) continue;
      const target = await modulePath(path, node.moduleSpecifier.text);
      if (!target) continue;
      const clause = node.importClause;
      if (clause?.name) bindings.set(clause.name.text, await lookup(target, 'default'));
      if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const binding of clause.namedBindings.elements) if (!binding.isTypeOnly) bindings.set(binding.name.text, await lookup(target, binding.propertyName?.text ?? binding.name.text));
      }
    }
    function visit(node) {
      const reference = (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && ts.isIdentifier(node.tagName) ? node.tagName.text
        : ts.isPropertyAssignment(node) && node.name.getText(source) === 'component' && ts.isIdentifier(node.initializer) ? node.initializer.text : null;
      const component = reference && bindings.get(reference);
      if (component) components.get(component).stories.add(portable(path));
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  async function importsTransitively(from, target, seen = new Set()) {
    if (from === target) return true;
    if (seen.has(from)) return false;
    seen.add(from);
    for (const node of (await parse(from)).statements) {
      if (!ts.isImportDeclaration(node) || node.importClause?.isTypeOnly) continue;
      const imported = await modulePath(from, node.moduleSpecifier.text);
      if (imported && await importsTransitively(imported, target, seen)) return true;
    }
    return false;
  }
  for (const [key, entry] of Object.entries(composed)) {
    const component = components.get(key), parent = components.get(entry.via);
    if (!component || !parent?.stories.size || !entry.reason || !await importsTransitively(parent.path, component.path)) throw new Error(`Invalid composed coverage: ${key}`);
    for (const story of parent.stories) component.stories.add(story);
    component.composed = entry.reason;
  }
  const missing = [...components].filter(([, component]) => !component.stories.size).map(([key]) => key);
  return {components: [...components].map(([key, c]) => ({key, stories: [...c.stories], ...(c.composed ? {composed: c.composed} : {})})), storyFiles: storyFiles.length, missing};
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await checkStoryCoverage({root: dirname(fileURLToPath(import.meta.url)), sourceDirectories: ['src']});
  if (report.missing.length) { console.error('Components without Storybook coverage:\n' + report.missing.join('\n')); process.exitCode = 1; }
  else console.log(`${report.components.length} public UI components covered by ${report.storyFiles} story files.`);
}
