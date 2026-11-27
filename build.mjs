import {spawnSync} from 'node:child_process';
import {copyFile,mkdir,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
const build=spawnSync('tsc',['-p','tsconfig.json'],{stdio:'inherit'});if(build.status!==0)process.exit(build.status??1);
await mkdir('dist',{recursive:true});await copyFile('src/styles.css','dist/styles.css');
