import type {Preview} from '@storybook/react-vite';
import '../src/styles.css';
const preview:Preview={decorators:[Story=><div className="renzu-ui" style={{padding:28,minHeight:200}}><Story/></div>],parameters:{layout:'fullscreen',a11y:{test:'error'},controls:{expanded:true}},tags:['autodocs']};export default preview;
