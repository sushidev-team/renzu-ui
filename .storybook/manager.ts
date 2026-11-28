import {addons} from 'storybook/manager-api';
import {create} from 'storybook/theming';
addons.setConfig({theme:create({base:'dark',brandTitle:'Renzu UI',brandImage:'./renzu-character.svg',brandUrl:'https://renzu.app/docs/components',brandTarget:'_self',colorPrimary:'#7dd8e8',colorSecondary:'#7dd8e8'})});
