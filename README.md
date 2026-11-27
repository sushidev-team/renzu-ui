<p><img src="https://raw.githubusercontent.com/sushidev-team/renzu-ui/main/.github/assets/renzu.png" width="64" height="64" alt="Renzu" /></p>

# Renzu UI

Standalone React components for Renzu extension authors. This package contains the selected public UI surface, not the desktop application or its native services.

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

Package scope and distribution license are pending confirmation before first publication. The current `UNLICENSED` marker is deliberate; this is not an open-source license for the application.
