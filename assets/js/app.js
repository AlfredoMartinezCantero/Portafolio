import { PROJECTS } from './projects.js';
import { initTheme } from './ui.js';

const CATEGORY_LABELS = {
  frontend: 'Frontend', backend: 'Backend', bbdd: 'Bases de datos',
  ia: 'Inteligencia artificial', fullstack: 'Full Stack', otros: 'Otros',
};
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

/** Construye nodos sin interpretar los datos como HTML. */
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  svg.classList.add('icon');
  svg.setAttribute('aria-hidden', 'true');
  use.setAttribute('href', `#i-${name}`);
  svg.append(use);
  return svg;
}

function safeURL(value) {
  if (!value) return null;
  try {
    const url = new URL(value, document.baseURI);
    return ['http:', 'https:'].includes(url.protocol) ? url : null;
  } catch { return null; }
}

function projectLink(url, label, className = 'text-link') {
  const target = safeURL(url);
  if (!target) return null;
  const link = element('a', className, label);
  link.href = target.href;
  if (target.origin !== location.origin) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.append(icon('external'), element('span', 'sr-only', ' (nueva pestaña)'));
  } else {
    link.append(icon('arrow'));
  }
  return link;
}

function projectImage(project, full = false) {
  const img = element('img');
  img.src = project.img;
  // Versiones ligeras, conservando la imagen y ruta originales como respaldo.
  if (project.preview) {
    img.src = project.previewLarge;
    img.srcset = project.width > 640
      ? `${project.preview} 640w, ${project.previewLarge} ${Math.min(project.width, 1280)}w`
      : `${project.preview} ${project.width}w`;
    img.sizes = full ? '(max-width: 780px) 90vw, 700px' : '(max-width: 699px) 90vw, (max-width: 1099px) 45vw, (max-width: 1320px) 30vw, 400px';
  }
  img.alt = `Captura de ${project.titulo}`;
  img.width = project.width;
  img.height = project.height;
  img.loading = full ? 'eager' : 'lazy';
  img.decoding = 'async';
  img.addEventListener('error', () => {
    // Primero intenta el original; si también falla, muestra un estado legible.
    if (img.dataset.original !== 'true' && project.preview) {
      img.dataset.original = 'true';
      img.removeAttribute('srcset');
      img.src = project.img;
      return;
    }
    const placeholder = element('span', 'media-placeholder', 'Captura no disponible');
    img.replaceWith(placeholder);
  });
  return img;
}

function techList(technologies) {
  const list = element('ul', 'tech-list');
  list.setAttribute('aria-label', 'Tecnologías utilizadas');
  for (const technology of technologies) list.append(element('li', '', technology));
  return list;
}

function initMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  const desktop = matchMedia('(min-width: 800px)');
  function setOpen(open, restoreFocus = false) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.hidden = !open;
    if (restoreFocus) toggle.focus();
  }
  toggle.hidden = false;
  toggle.addEventListener('click', () => setOpen(menu.hidden));
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) setOpen(false, true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.topbar') && !menu.hidden) setOpen(false);
  });
  document.addEventListener('focusin', event => {
    if (!event.target.closest('.topbar') && !menu.hidden) setOpen(false);
  });
  desktop.addEventListener('change', () => setOpen(false));
  document.documentElement.classList.add('js');
}

function initProjectDialog() {
  const dialog = document.getElementById('projectDialog');
  let opener;
  const close = () => dialog.close();
  document.getElementById('closeDialog').addEventListener('click', close);
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]')].filter(node => node.getClientRects().length);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    opener?.focus({ preventScroll: true });
  });
  return (project, trigger) => {
    opener = trigger;
    document.getElementById('dialogTitle').textContent = project.titulo;
    document.getElementById('dialogDescription').textContent = project.descripcion;
    document.getElementById('dialogCategory').textContent = CATEGORY_LABELS[project.categoria];
    document.getElementById('dialogMedia').replaceChildren(projectImage(project, true));
    const stack = document.getElementById('dialogStack');
    stack.replaceChildren(...project.stack.map(technology => element('li', '', technology)));
    const links = [projectLink(project.demo, project.demo.startsWith('./') ? 'Abrir demo interactiva' : 'Ver presentación en LinkedIn', 'btn btn-primary'), projectLink(project.code, 'Ver código', 'btn btn-ghost')].filter(Boolean);
    document.getElementById('dialogLinks').replaceChildren(...links);
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
  };
}

function createCard(project, index) {
  const card = element('article', 'project-card');
  card.dataset.project = project.id;
  card.setAttribute('aria-labelledby', `title-${project.id}`);
  const media = element('div', 'project-media');
  media.append(projectImage(project));
  if (project.destacado) media.append(element('span', 'featured-label', 'Proyecto destacado'));
  const body = element('div', 'project-body');
  const meta = element('div', 'project-meta');
  meta.append(element('span', '', CATEGORY_LABELS[project.categoria]), element('span', '', String(index + 1).padStart(2, '0')));
  const title = element('h3', '', project.titulo);
  title.id = `title-${project.id}`;
  body.append(meta, title, element('p', 'project-summary', project.resumen));
  const tags = project.stack.slice(0, 4);
  const list = techList(tags);
  if (project.stack.length > tags.length) {
    const more = element('li', '', `+${project.stack.length - tags.length}`);
    more.setAttribute('aria-label', `${project.stack.length - tags.length} tecnologías más en los detalles`);
    list.append(more);
  }
  body.append(list);
  const actions = element('div', 'project-actions');
  const detail = element('button', 'detail-button', 'Ver detalles');
  detail.type = 'button';
  detail.dataset.details = project.id;
  detail.setAttribute('aria-haspopup', 'dialog');
  detail.setAttribute('aria-label', `Ver detalles de ${project.titulo}`);
  detail.append(element('span', '', '+'));
  const demo = projectLink(project.demo, project.demo.startsWith('./') ? 'Abrir demo' : 'Ver proyecto', 'btn btn-primary project-demo');
  if (demo) actions.append(demo);
  const code = projectLink(project.code, 'Código');
  if (code) actions.append(code);
  actions.append(detail);
  card.append(media, body, actions);
  return card;
}

function initProjects() {
  const grid = document.getElementById('gridProyectos');
  const filters = document.getElementById('projectFilters');
  const search = document.getElementById('projectSearch');
  const status = document.getElementById('projectStatus');
  const empty = document.getElementById('emptyProjects');
  const openDetails = initProjectDialog();
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
  const cards = PROJECTS.map((project, index) => ({
    project, node: createCard(project, index),
    searchText: normalize([project.titulo, ...project.stack].join(' ')),
  }));
  let category = 'all';
  grid.replaceChildren(...cards.map(card => card.node));
  document.getElementById('projectFallback').hidden = true;
  document.getElementById('projectControls').hidden = false;
  document.getElementById('resultsBar').hidden = false;
  document.querySelector('.filter-count').textContent = String(PROJECTS.length).padStart(2, '0');

  function filterProjects(animate = true) {
    const query = normalize(search.value);
    const words = query.split(/\s+/).filter(Boolean);
    let count = 0;
    grid.setAttribute('aria-busy', 'true');
    for (const card of cards) {
      const visible = (category === 'all' || card.project.categorias.includes(category)) && words.every(word => card.searchText.includes(word));
      const wasHidden = card.node.hidden;
      card.node.hidden = !visible;
      if (visible) count++;
      if (visible && wasHidden && animate && !reducedMotion.matches) card.node.classList.add('is-entering');
    }
    empty.hidden = count > 0;
    grid.hidden = count === 0;
    const categoryText = category === 'all' ? '' : ` en ${CATEGORY_LABELS[category]}`;
    status.textContent = `${count} de ${PROJECTS.length} proyectos${categoryText}${query ? ` para «${search.value.trim()}»` : ''}`;
    grid.setAttribute('aria-busy', 'false');
  }
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    category = button.dataset.filter;
    filters.querySelectorAll('button').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    filterProjects();
  });
  search.addEventListener('input', () => filterProjects());
  document.getElementById('resetProjects').addEventListener('click', () => {
    search.value = '';
    filters.querySelector('[data-filter="all"]').click();
    search.focus();
  });
  grid.addEventListener('animationend', event => event.target.classList.remove('is-entering'));
  grid.addEventListener('click', event => {
    const trigger = event.target.closest('button[data-details]');
    if (!trigger) return;
    const project = PROJECTS.find(item => item.id === trigger.dataset.details);
    if (project) openDetails(project, trigger);
  });
  filterProjects(false);
}

function initObservers() {
  if (!('IntersectionObserver' in window)) return;
  const links = document.querySelectorAll('.menu a, .mobile-menu a');
  const sectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of links) {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-18% 0px -60% 0px', threshold: 0 });
  document.querySelectorAll('main > section').forEach(section => sectionObserver.observe(section));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(node => revealObserver.observe(node));
}

initTheme();
initMenu();
document.getElementById('year').textContent = new Date().getFullYear();
initProjects();
initObservers();
