'use strict';

/* 1. TEMA (oscuro / claro) */
const html        = document.documentElement;
const themeToggle = document.getElementById('toggleTheme');
const THEME_KEY   = 'pf-theme';

const setTheme = (mode) => {
  html.dataset.theme = mode;
  localStorage.setItem(THEME_KEY, mode);
  if (themeToggle) {
    themeToggle.querySelector('.theme-icon').textContent = mode === 'light' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', mode === 'light' ? 'Activar tema oscuro' : 'Activar tema claro');
  }
};

// Aplicar tema guardado o preferencia del sistema
const savedTheme  = localStorage.getItem(THEME_KEY);
const systemDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme ?? (systemDark ? 'dark' : 'light'));

themeToggle?.addEventListener('click', () => {
  setTheme(html.dataset.theme === 'light' ? 'dark' : 'light');
});

/* 2. MENÚ MÓVIL */
const menuToggle  = document.getElementById('menuToggle');
const mobileMenu  = document.getElementById('mobileMenu');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.hidden = isOpen;
});

// Cerrar menú al hacer clic en un enlace
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
  });
});

/* 3. AÑO EN EL FOOTER */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* 4. DATOS DE PROYECTOS  */
const PROJECTS = [
  {
    id:          'reloj-canvas',
    titulo:      'Reloj Analógico Dinámico',
    descripcion: 'Reloj en tiempo real con Canvas API y requestAnimationFrame. Gradientes, manecillas suavizadas y marcas horarias/minuteras.',
    stack:       ['JavaScript', 'Canvas API', 'requestAnimationFrame'],
    categoria:   'frontend',
    img:         './assets/img/proyectos/reloj.jpg',
    demo:        './reloj.html',
    code:        null,
  },
  {
    id:          'simulacion-npcs',
    titulo:      "Simulación de NPC's",
    descripcion: 'Modelo de comportamiento con movimiento errático y rebote de entidades. Backend en Flask + Python, front con Canvas.',
    stack:       ['Python', 'Flask', 'Canvas'],
    categoria:   'backend',
    img:         './assets/img/proyectos/npcs.jpg',
    demo:        'https://www.linkedin.com/posts/alfredomart%C3%ADnez_ya-hace-3-meses-que-empec%C3%A9-a-estudiar-desarrollo-activity-7400521730491842560-QLwG',
    code:        null,
  },
  {
    id:          'satori',
    titulo:      'Satori — Buscador',
    descripcion: 'Buscador rápido con deduplicación y filtrado por título. Demo estática con fuente JSON.',
    stack:       ['JavaScript', 'HTML', 'UI/UX'],
    categoria:   'bbdd',
    img:         './assets/img/proyectos/satori.jpg',
    demo:        'https://www.linkedin.com/feed/update/urn:li:activity:7414698829125550080/',
    code:        null,
  },
  {
    id:          'Gastos Simples',
    titulo:      'Gastos Simples AMC',
    descripcion: 'App web en PHP + MySQL para gestionar gastos: alta/edición/borrado, filtros por mes/categoría, balance mensual, import/export CSV y gráfico con Chart.js (PDO + CSRF).',
    stack:       ['PHP 8', 'MySQL/MariaDB', 'PDO', 'HTML', 'CSS', 'JavaScript', 'Chart.js'],
    categoria:   'fullstack',
    img:         './assets/img/proyectos/gastos simples.jpg',
    demo:        'https://www.linkedin.com/feed/update/urn:li:activity:7447660647817003008/?originTrackingId=e5nToS94RDz2ox8Wffkx5A%3D%3D',
    code:        null,
  },
];

/* 5. RENDER DE TARJETAS  */
const grid = document.getElementById('gridProyectos');

/**
 * Genera el HTML de una tarjeta de proyecto.
 * @param {Object} p — objeto de proyecto
 * @returns {string} HTML de la tarjeta
 */
const cardTemplate = (p) => {
  const badges  = p.stack.map(s => `<span class="badge">${s}</span>`).join('');
  const safeAlt = p.titulo.replace(/"/g, '&quot;');

  const media = `
    <img
      class="card-thumb"
      src="${p.img}"
      alt="${safeAlt}"
      loading="lazy"
      onerror="this.outerHTML='<div class=&quot;card-thumb-placeholder&quot; aria-hidden=&quot;true&quot;>Sin imagen</div>'"
    />`;

  const demoBtn = p.demo
    ? `<a class="btn btn-primary" href="${p.demo}" target="_blank" rel="noopener noreferrer">Ver proyecto</a>`
    : `<span class="btn btn-ghost" aria-disabled="true" style="pointer-events:none;opacity:.5;">Próximamente</span>`;

  const codeBtn = p.code
    ? `<a class="btn btn-ghost" href="${p.code}" target="_blank" rel="noopener noreferrer">Código</a>`
    : '';

  return `
    <article class="card" data-cat="${p.categoria}" aria-label="${p.titulo}">
      ${media}
      <div class="card-body">
        <h3>${p.titulo}</h3>
        <p>${p.descripcion}</p>
        <div class="badges" aria-label="Tecnologías usadas">${badges}</div>
      </div>
      <div class="card-actions">
        ${demoBtn}
        ${codeBtn}
      </div>
    </article>`;
};

/**
 * Renderiza la lista de proyectos en el grid.
 * @param {Array} list — array filtrado de proyectos
 */
const renderProjects = (list) => {
  if (!grid) return;
  grid.setAttribute('aria-busy', 'true');

  if (list.length === 0) {
    grid.innerHTML = '<p class="txt-muted" style="grid-column:1/-1;padding:2rem 0">No hay proyectos en esta categoría aún.</p>';
  } else {
    grid.innerHTML = list.map(cardTemplate).join('');
  }

  grid.setAttribute('aria-busy', 'false');
};

renderProjects(PROJECTS);

/* 6. FILTROS */
const filterBtns = document.querySelectorAll('.filter');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Actualizar estados aria y clase activa
    filterBtns.forEach(b => {
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');

    const f = btn.dataset.filter;
    const filtered = f === 'all' ? PROJECTS : PROJECTS.filter(p => p.categoria === f);
    renderProjects(filtered);
  });
});
