// Comprobaciones estáticas sin dependencias: node scripts/check.mjs
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROJECTS } from '../assets/js/projects.js';
import { PROJECTS_EN } from '../assets/js/projects-en.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const clock = await readFile(resolve(root, 'reloj.html'), 'utf8');
const english = await readFile(resolve(root, 'index-en.html'), 'utf8');
const englishClock = await readFile(resolve(root, 'reloj-en.html'), 'utf8');
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
assert.deepEqual(PROJECTS_EN.map(project => project.id), expected, 'Mismos siete proyectos en inglés');
for (const project of PROJECTS_EN) {
  assert.ok(project.titulo && project.descripcion && project.resumen, `Traducción completa: ${project.id}`);
  assert.ok(english.includes(project.demo.replaceAll('&', '&amp;')), `Enlace alternativo inglés: ${project.id}`);
  assert.ok(english.includes(project.titulo), `Título alternativo inglés: ${project.id}`);
}
for (const [name, source, language, alternate] of [
  ['index.html', html, 'es', 'index-en.html'],
  ['reloj.html', clock, 'es', 'reloj-en.html'],
  ['index-en.html', english, 'en', 'index.html'],
  ['reloj-en.html', englishClock, 'en', 'reloj.html'],
]) {
  assert.ok(source.includes(`<html lang="${language}"`), `Idioma: ${name}`);
  assert.ok(source.includes(`id="languageToggle" class="icon-btn language-switch" href="./${alternate}"`), `Cambio de idioma sin JS: ${name}`);
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
console.log('OK: siete proyectos en español e inglés, imágenes, enlaces, selectores de idioma, anclas, IDs y marcado básico.');
