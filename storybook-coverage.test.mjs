import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, dirname} from 'node:path';
import {checkStoryCoverage} from './storybook-coverage.mjs';

async function fixture(files, run) {
  const root = await mkdtemp(join(tmpdir(), 'renzu-storybook-coverage-'));
  try {
    for (const [path, source] of Object.entries(files)) {
      await mkdir(dirname(join(root, path)), {recursive: true});
      await writeFile(join(root, path), source);
    }
    return await run(root);
  } finally { await rm(root, {recursive: true, force: true}); }
}
const inspect = root => checkStoryCoverage({root, sourceDirectories: ['src']});

test('an imported but unrendered component does not count as a story', async () => {
  await fixture({'src/Button.tsx': 'export function Button(){return <button/>}', 'src/Button.stories.tsx': "import {Button} from './Button'; export default {title:'Unused'};"}, async root => {
    assert.deepEqual((await inspect(root)).missing, ['src/Button.tsx#Button']);
  });
});
test('meta alone cannot hide a missing scenario', async () => {
  await fixture({'src/Button.tsx': 'export function Button(){return <button/>}', 'src/Button.stories.tsx': "import {Button} from './Button'; export default {component:Button};"}, async root => {
    assert.deepEqual((await inspect(root)).missing, ['src/Button.tsx#Button']);
  });
});
test('anonymous defaults and class components are included in the inventory', async () => {
  await fixture({'src/Anonymous.tsx': 'export default () => <button/>;', 'src/Legacy.tsx': 'export class Legacy extends Component {render(){return <span/>}}'}, async root => {
    assert.deepEqual((await inspect(root)).missing, ['src/Anonymous.tsx#default', 'src/Legacy.tsx#Legacy']);
  });
});
test('barrel exports, renamed imports and default components are resolved', async () => {
  await fixture({
    'src/Input.tsx': 'export const Input=forwardRef(()=> <input/>);',
    'src/Panel.tsx': 'export default function Panel(){return <section/>}',
    'src/index.ts': "export {Input as Field} from './Input.js'; export {default as Panel} from './Panel.js';",
    'src/Components.stories.tsx': "import {Field as TextField,Panel} from './index.js'; export default {component:Panel}; export const Form={render:()=> <TextField/>};",
  }, async root => { assert.deepEqual((await inspect(root)).missing, []); });
});
test('adding a new component breaks previously complete coverage', async () => {
  await fixture({'src/Button.tsx': 'export function Button(){return <button/>}', 'src/Button.stories.tsx': "import {Button} from './Button'; export default {component:Button}; export const Ready={};"}, async root => {
    assert.deepEqual((await inspect(root)).missing, []);
    await writeFile(join(root, 'src/NewControl.tsx'), 'export function NewControl(){return <input/>}');
    assert.deepEqual((await inspect(root)).missing, ['src/NewControl.tsx#NewControl']);
  });
});
test('composed coverage requires a documented renderer that actually imports the child', async () => {
  await fixture({'src/Child.tsx': 'export function Child(){return <path/>}', 'src/Parent.tsx': "import {Child} from './Child'; export function Parent(){return <svg><Child/></svg>}", 'src/Parent.stories.tsx': "import {Parent} from './Parent'; export default {component:Parent}; export const Ready={};"}, async root => {
    const options = {root, sourceDirectories: ['src'], composed: {'src/Child.tsx#Child': {via: 'src/Parent.tsx#Parent', reason: 'Needs the parent SVG definitions.'}}};
    assert.deepEqual((await checkStoryCoverage(options)).missing, []);
    await writeFile(join(root, 'src/Parent.tsx'), 'export function Parent(){return <svg/>}');
    await assert.rejects(checkStoryCoverage(options), /Invalid composed coverage/);
  });
});
