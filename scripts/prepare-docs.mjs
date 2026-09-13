import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = path.resolve(root, 'docs');
if (path.dirname(output) !== path.resolve(root) || path.basename(output) !== 'docs') {
  throw new Error('Expected the docs directory inside this project');
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, 'out'), output, { recursive: true });
await writeFile(path.join(output, '.nojekyll'), '');
console.log('Static website ready in docs/.');
