import { existsSync } from 'node:fs';
import { cp, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repository = resolve(source, '..');
if (!existsSync(resolve(repository, '.git')) || !existsSync(resolve(repository, 'PAGES_LAYOUT.md'))) {
  throw new Error('Run this command from the source/ folder of the GitHub Pages checkout.');
}
const html = await readFile(resolve(source, 'dist/index.html'), 'utf8');
for (const directory of ['assets', 'images', 'licenses']) {
  if (existsSync(resolve(source, 'dist', directory))) await cp(resolve(source, 'dist', directory), resolve(repository, directory), { recursive: true });
}
await writeFile(resolve(repository, 'index.html'), html);
await writeFile(resolve(repository, '.nojekyll'), '');
console.log('Built files copied to the repository root. Review, commit and push to main to publish.');
