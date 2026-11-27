import type {StorybookConfig} from '@storybook/react-vite';
const config:StorybookConfig={stories:['../src/**/*.stories.tsx'],addons:['@storybook/addon-docs','@storybook/addon-a11y'],framework:'@storybook/react-vite',core:{disableTelemetry:true},viteFinal:async config=>({...config,build:{...config.build,sourcemap:false,target:'es2022'},server:{...config.server,host:'127.0.0.1',strictPort:true}})};
export default config;
