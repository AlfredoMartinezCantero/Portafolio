// Opcional: npm install --prefix .qa-tools --no-save sharp
// Genera derivados WebP sin modificar las capturas originales.
import { createRequire } from 'node:module';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROJECTS } from '../assets/js/projects.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(resolve(root, '.qa-tools/package.json'));
const sharp = require('sharp');
await mkdir(resolve(root, 'assets/img/optimized'), { recursive: true });
let originalBytes = 0;
let previewBytes = 0;
for (const project of PROJECTS) {
  originalBytes += (await stat(resolve(root, project.img))).size;
  project.preview = `./assets/img/optimized/${project.id}-640.webp`;
  await sharp(resolve(root, project.img)).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 82 }).toFile(resolve(root, project.preview));
  project.previewLarge = project.width > 640 ? `./assets/img/optimized/${project.id}-1280.webp` : project.preview;
  if (project.width > 640) await sharp(resolve(root, project.img)).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 84 }).toFile(resolve(root, project.previewLarge));
  previewBytes += (await stat(resolve(root, project.preview))).size;
}
await writeFile(resolve(root, 'assets/js/projects.js'), `// Fuente única de los siete proyectos. Enlaces y descripciones originales conservados.\nexport const PROJECTS = ${JSON.stringify(PROJECTS, null, 2)};\n`);
console.log(JSON.stringify({ originalBytes, previewBytes, reduction: `${Math.round((1 - previewBytes / originalBytes) * 100)}%` }, null, 2));
