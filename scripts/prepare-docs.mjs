import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
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
// Keep both GitHub Pages publishing sources usable: main / and main /docs.
const generatedName = /^(?:_next|_not-found|404|assets|privacy|404\.html|icon\.svg|index\.html|index\.txt|og-image\.png|robots\.txt|sitemap\.xml|\.nojekyll|__next\..+\.txt)$/;
const entries = await readdir(output);
for (const entry of entries) {
  if (!generatedName.test(entry)) throw new Error(`Unexpected export entry: ${entry}`);
  const target = path.resolve(root, entry);
  if (path.dirname(target) !== path.resolve(root)) throw new Error('Export target must stay inside the project');
}
for (const entry of entries) {
  const target = path.resolve(root, entry);
  await rm(target, { recursive: true, force: true });
  await cp(path.join(output, entry), target, { recursive: true });
}
console.log('Static website ready in the repository root and docs/.');
