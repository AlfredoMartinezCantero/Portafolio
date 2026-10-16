// Comprobaciones estáticas sin dependencias: node scripts/check.mjs
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROJECTS } from '../assets/js/projects.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const clock = await readFile(resolve(root, 'reloj.html'), 'utf8');
const expected = ['gastos-simples', 'copilot-ventas-ia', 'discord-marketing-bot', 'sistema-facturacion-erp', 'simulacion-npcs', 'satori', 'reloj-canvas'];
assert.deepEqual(PROJECTS.map(project => project.id), expected, 'Deben conservarse los siete proyectos');
assert.equal(new Set(PROJECTS.map(project => project.id)).size, 7, 'Identificadores únicos');
for (const project of PROJECTS) {
  assert.ok(project.titulo && project.descripcion && project.resumen && project.stack.length, `Datos completos: ${project.id}`);
  assert.ok(project.width > 0 && project.height > 0, `Dimensiones: ${project.id}`);
  assert.ok(project.categorias.includes(project.categoria), `Categoría principal conservada: ${project.id}`);
  assert.ok(html.includes(project.demo.replaceAll('&', '&amp;')), `Enlace alternativo sin JS: ${project.id}`);
  assert.ok(['http:', 'https:'].includes(new URL(project.demo, 'http://localhost/').protocol));
  await access(resolve(root, project.img));
  if (project.preview) await access(resolve(root, project.preview));
  if (project.previewLarge) await access(resolve(root, project.previewLarge));
}
for (const [name, source] of [['index.html', html], ['reloj.html', clock]]) {
  assert.match(source, /<html lang="es"/);
  assert.equal((source.match(/<h1\b/g) || []).length, 1, `Un h1: ${name}`);
  assert.ok(!/\son\w+\s*=/i.test(source), `Sin eventos inline: ${name}`);
  const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `Sin IDs duplicados: ${name}`);
  for (const match of source.matchAll(/(?:src|href)="(\.\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
    const path = resolve(root, decodeURIComponent(match[1]));
    await access(path);
  }
  for (const match of source.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Ancla existente: ${match[1]}`);
  for (const match of source.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(match[0], /rel="[^"]*noopener/);
    assert.match(match[0], /rel="[^"]*noreferrer/);
  }
}
console.log('OK: siete proyectos, datos, imágenes, dimensiones, enlaces alternativos, anclas, IDs y marcado básico.');
