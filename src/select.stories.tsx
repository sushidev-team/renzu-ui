import type {Meta,StoryObj} from '@storybook/react-vite';import {Select} from './input.js';
const meta={title:'Components/Select',component:Select,args:{'aria-label':'Namespace',defaultValue:'production',children:<><option value="production">Production</option><option value="staging">Staging</option><option value="restricted" disabled>Restricted</option></>}} satisfies Meta<typeof Select>;export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={};export const Disabled:Story={args:{disabled:true}};export const Invalid:Story={args:{'aria-invalid':true}};
