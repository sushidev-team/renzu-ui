import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
import {copyFile,mkdir,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
const build=spawnSync(process.execPath,[require.resolve('typescript/bin/tsc'),'-p','tsconfig.json'],{stdio:'inherit'});if(build.status!==0)process.exit(build.status??1);
await mkdir('dist',{recursive:true});await copyFile('src/styles.css','dist/styles.css');
