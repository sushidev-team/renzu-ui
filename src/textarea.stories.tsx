import type {Meta,StoryObj} from '@storybook/react-vite';import {Textarea} from './input.js';
const meta={title:'Components/Textarea',component:Textarea,args:{'aria-label':'Description',rows:4,placeholder:'Describe your view'}} satisfies Meta<typeof Textarea>;export default meta;type Story=StoryObj<typeof meta>;
export const Empty:Story={};export const Filled:Story={args:{defaultValue:'A synthetic Kubernetes overview.\nNo cluster access is required.'}};export const ReadOnly:Story={args:{readOnly:true,defaultValue:'Read only notes'}};export const Disabled:Story={args:{disabled:true}};
