<p><img src="https://raw.githubusercontent.com/sushidev-team/renzu-ui/main/.github/assets/renzu.png" width="64" height="64" alt="Renzu" /></p>

# Renzu UI

Standalone React components for Renzu extension authors. This package contains the selected public UI surface, not the desktop application or its native services.

## Install

After the first npm release:

```sh
npm install @renzu/ui react react-dom
```

Browse the [live Storybook](https://renzu.app/storybook/) or run `npm ci && npm run storybook` locally.

```tsx
import {Button, Panel, MetricCard, ResourceTable} from '@renzu/ui';
import '@renzu/ui/styles.css';

<div className="renzu-ui">
  <Panel title="My cockpit">
    <MetricCard label="Pods" value={3} />
    <ResourceTable rows={demoRows} />
    <Button onClick={refresh}>Refresh</Button>
  </Panel>
</div>
```

Exports: Button, Badge, Input, Select, Textarea, Panel, MetricCard, ResourceTable and their TypeScript contracts. React 19 is a peer dependency. Styles are scoped to `.renzu-ui`. Pass translated labels and data explicitly. No Tauri bridge, credentials, application stores or cluster client is included.

The public Storybook uses synthetic data only. The current installed extension format is declarative JSON; React components support authoring and previews and do not grant arbitrary executable code access to the desktop host.


## License

MIT. See [LICENSE](LICENSE). This license covers this package; it does not license the Renzu desktop application or hosted services.
