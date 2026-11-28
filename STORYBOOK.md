# Component catalog

The public catalog documents all eight exported components and their TypeScript props with interactive examples: buttons, badges, inputs, selects, textareas, panels, metrics and resource tables. The examples use synthetic data and do not require a Renzu installation or cluster credentials.

```sh
npm ci
npm run storybook -- --port 16007
npm run storybook:check
npm run storybook:build
npm test
```

Add each new exported component alongside a `Component.stories.tsx`. Reference the actual component in `meta.component` or render it in a scenario. Include its normal state plus relevant pending, empty, disabled, read-only, invalid and narrow-screen states. Use controls for props and a small stateful example when demonstrating callbacks.

The coverage check resolves component imports, aliases and barrel exports. It rejects missing stories, unused imports and meta-only files without a named scenario. Type checking catches invalid story props; the test suite checks the coverage guard itself. CI runs these checks before publishing.

Use the standalone kit inside `.renzu-ui` and import `@renzu/ui/styles.css`. This catalog contains no application views, native IPC fixture or service implementation.
