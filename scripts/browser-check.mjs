// Requiere el servidor local y herramientas de QA opcionales; ver VALIDACION.md.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROJECTS } from '../assets/js/projects.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(resolve(root, '.qa-tools/package.json'));
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4173';
const output = resolve(root, '.qa-output');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { browser: await browser.version(), date: new Date().toISOString(), checks: [], accessibility: [], pageErrors: [], consoleErrors: [], failedRequests: [], screenshots: [] };
let injectingFaults = false;
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const page = await context.newPage();
page.on('pageerror', error => report.pageErrors.push(error.message));
page.on('console', message => {
  if (message.type() === 'error' && !injectingFaults) report.consoleErrors.push(message.text());
});
page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText, expected: injectingFaults || request.failure()?.errorText === 'net::ERR_ABORTED' }));
const check = message => { report.checks.push(message); console.log(`OK: ${message}`); };
const visibleCards = () => page.locator('.project-card:visible').count();
async function screenshot(name, fullPage = false) {
  await page.screenshot({ path: resolve(output, name), fullPage, animations: 'disabled' });
  report.screenshots.push(name);
}
async function axe(label) {
  await page.evaluate(async () => {
    const finiteAnimations = document.getAnimations().filter(animation => animation.effect?.getTiming().iterations !== Infinity);
    await Promise.all(finiteAnimations.map(animation => animation.finished.catch(() => {})));
  });
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  report.accessibility.push({ label, violations: results.violations.map(({ id, impact, nodes, help }) => ({ id, impact, help, nodes: nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })), incomplete: results.incomplete.map(result => result.id) });
  assert.equal(results.violations.length, 0, `${label}: ${JSON.stringify(report.accessibility.at(-1).violations)}`);
}
try {
  await page.goto(base);
  await page.locator('.project-card').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await visibleCards(), 7);
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  for (const project of PROJECTS) {
    const card = page.locator(`[data-project="${project.id}"]`);
    assert.equal(await card.locator('h3').textContent(), project.titulo);
    assert.equal(await card.locator('.project-actions a').first().getAttribute('href'), new URL(project.demo, base).href);
  }
  check('Siete proyectos, títulos y enlaces originales');
  const nodeBefore = await page.locator('.project-card').first().elementHandle();
  for (const [category, count] of Object.entries({ frontend: 3, backend: 5, bbdd: 3, ia: 2, fullstack: 2, otros: 0, all: 7 })) {
    await page.locator(`[data-filter="${category}"]`).click();
    assert.equal(await visibleCards(), count, category);
    assert.equal(await page.locator('.filter[aria-pressed="true"]').count(), 1);
  }
  assert.ok(await nodeBefore.evaluate(node => node.isConnected));
  await page.locator('#projectSearch').fill('simulacion');
  assert.equal(await visibleCards(), 1);
  await page.locator('#projectSearch').fill('PHP SQLite');
  assert.equal(await visibleCards(), 1);
  await page.locator('#projectSearch').fill('FastAPI');
  assert.equal(await visibleCards(), 2);
  await page.locator('[data-filter="frontend"]').click();
  assert.equal(await visibleCards(), 0);
  assert.ok(await page.locator('#emptyProjects').isVisible());
  await page.locator('#resetProjects').click();
  assert.equal(await visibleCards(), 7);
  assert.ok(await page.locator('#projectSearch').evaluate(node => node === document.activeElement));
  check('Siete filtros, búsqueda por palabras y acentos, combinación, vacío y reinicio sin reconstruir tarjetas');

  for (const project of PROJECTS) {
    const trigger = page.locator(`[data-details="${project.id}"]`);
    await trigger.click();
    assert.ok(await page.locator('#projectDialog').evaluate(node => node.open));
    assert.equal(await page.locator('#dialogTitle').textContent(), project.titulo);
    assert.equal(await page.locator('#dialogDescription').textContent(), project.descripcion);
    assert.equal(await page.locator('#dialogStack li').count(), project.stack.length);
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      assert.ok(await page.locator('#projectDialog').evaluate(node => node.contains(document.activeElement)), 'El foco debe permanecer en el diálogo');
    }
    if (project.id === 'gastos-simples') await axe('Diálogo oscuro');
    await page.keyboard.press('Escape');
    assert.ok(await trigger.evaluate(node => node === document.activeElement), 'Restaurar foco');
  }
  check('Los siete diálogos conservan el detalle, contienen el foco y cierran con Escape');

  for (const theme of ['dark', 'light']) {
    if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#toggleTheme').click();
    await page.reload();
    await page.locator('.project-card').first().waitFor();
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
    for (const width of [320, 390, 768, 1024, 1440, 2560]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${theme} a ${width}px sin desbordamiento`);
      if ([390, 1440].includes(width)) {
        await page.goto(`${base}/#inicio`);
        await page.evaluate(() => document.fonts.ready);
        await screenshot(`${theme}-${width}.png`, true);
        await axe(`${theme} a ${width}px`);
      }
    }
  }
  check('Dos temas persistentes, seis anchos entre 320 y 2560 px, sin desbordamiento y auditoría axe');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.locator('#menuToggle').click();
  assert.ok(await page.locator('#mobileMenu').isVisible());
  await page.keyboard.press('Escape');
  assert.ok(await page.locator('#mobileMenu').isHidden());
  assert.ok(await page.locator('#menuToggle').evaluate(node => node === document.activeElement));
  await page.locator('#menuToggle').click();
  await page.locator('#mobileMenu a[href="#skills"]').click();
  assert.ok(await page.locator('#mobileMenu').isHidden());
  await page.waitForFunction(() => document.querySelector('.mobile-menu a[href="#skills"]').getAttribute('aria-current') === 'location');
  await page.locator('#menuToggle').click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'), 'false');
  check('Menú móvil, Escape, foco, enlaces, indicador activo y cambio a escritorio');

  const second = await context.newPage();
  await second.goto(base);
  await second.locator('#toggleTheme').waitFor({ state: 'visible' });
  await page.locator('#toggleTheme').click();
  await second.waitForFunction(theme => document.documentElement.dataset.theme === theme, await page.locator('html').getAttribute('data-theme'));
  await second.close();
  check('Sincronización del tema entre pestañas');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base);
  assert.equal(await page.locator('html').evaluate(node => getComputedStyle(node).scrollBehavior), 'auto');
  await page.locator('[data-filter="ia"]').click();
  assert.equal(await visibleCards(), 2);
  check('Movimiento reducido en navegación y filtros');

  await page.goto(`${base}/reloj.html`);
  await page.waitForFunction(() => document.querySelector('#clockTime').textContent.length === 8);
  assert.match(await page.locator('#clockNote').textContent(), /una vez por segundo/);
  const firstTime = await page.locator('#clockTime').textContent();
  await page.waitForFunction(previous => document.querySelector('#clockTime').textContent !== previous, firstTime);
  assert.ok(await page.locator('canvas').evaluate(node => node.getContext('2d').getImageData(node.width / 2, node.height / 2, 1, 1).data[3] > 0));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const theme of ['dark', 'light']) {
    if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#toggleTheme').click();
    await screenshot(`clock-${theme}.png`);
    await axe(`Reloj ${theme}`);
  }
  await page.setViewportSize({ width: 320, height: 700 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.setViewportSize({ width: 390, height: 844 });
  await screenshot('clock-mobile.png');
  await page.locator('a[href="./#proyectos"]').first().click();
  await page.locator('.project-card').first().waitFor();
  check('Canvas dibujado y actualizado, temas, tamaño móvil y enlace de vuelta');

  const highDpi = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const dpiPage = await highDpi.newPage();
  await dpiPage.goto(`${base}/reloj.html`);
  await dpiPage.waitForFunction(() => document.querySelector('canvas').width === Math.round(document.querySelector('canvas').getBoundingClientRect().width * 2));
  await highDpi.close();
  check('Canvas con densidad 2x');

  const noStorage = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await noStorage.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Bloqueado', 'SecurityError'); } }));
  const blocked = await noStorage.newPage();
  blocked.on('pageerror', error => report.pageErrors.push(error.message));
  await blocked.goto(base);
  await blocked.locator('.project-card').first().waitFor();
  await blocked.locator('#toggleTheme').click();
  assert.equal(await blocked.locator('html').getAttribute('data-theme'), 'light');
  await noStorage.close();
  check('Almacenamiento bloqueado: proyectos y tema siguen funcionando');

  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
  const staticPage = await noJS.newPage();
  await staticPage.goto(base);
  assert.ok(await staticPage.locator('#projectFallback').isVisible());
  assert.equal(await staticPage.locator('#projectFallback a').count(), 7);
  assert.ok(await staticPage.locator('.menu').isVisible());
  assert.ok(await staticPage.locator('#projectControls').isHidden());
  assert.ok(await staticPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await staticPage.screenshot({ path: resolve(output, 'no-javascript.png'), fullPage: true });
  await noJS.close();
  check('Sin JavaScript: siete proyectos, navegación móvil, contacto y contenido accesibles');

  assert.deepEqual(report.consoleErrors, []);
  injectingFaults = true;
  await page.route('**/assets/img/optimized/**', route => route.abort());
  await page.goto(base);
  for (const img of await page.locator('.project-media img').all()) await img.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => [...document.querySelectorAll('.project-media img')].every(img => img.complete && img.naturalWidth > 0));
  check('Fallo de WebP: carga de las imágenes originales');
  await page.route('**/assets/img/proyectos/**', route => route.abort());
  await page.reload();
  for (const card of await page.locator('.project-card').all()) await card.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelectorAll('.media-placeholder').length === 7);
  check('Fallo de todas las capturas: siete estados alternativos legibles');
  assert.deepEqual(report.pageErrors, []);
  check('Sin excepciones JavaScript durante la validación');
} catch (error) {
  report.error = error.stack;
  await page.screenshot({ path: resolve(output, 'failure.png'), fullPage: true }).catch(() => {});
  process.exitCode = 1;
  console.error(error);
} finally {
  await writeFile(resolve(output, 'browser-report.json'), JSON.stringify(report, null, 2));
  await browser.close();
}
