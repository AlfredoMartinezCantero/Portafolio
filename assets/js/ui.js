// Tema compartido por el portafolio y la demo Canvas.
export function initTheme() {
  const toggle = document.getElementById('toggleTheme');
  const update = (theme, persist = false) => {
    document.documentElement.dataset.theme = theme;
    toggle.setAttribute('aria-label', theme === 'light' ? 'Activar tema oscuro' : 'Activar tema claro');
    document.querySelector('meta[name="theme-color"]').content = theme === 'light' ? '#f5f5f2' : '#101217';
    if (persist) {
      try { localStorage.setItem('pf-theme', theme); } catch { /* Tema funcional sin persistencia. */ }
    }
  };
  update(document.documentElement.dataset.theme);
  toggle.hidden = false;
  toggle.addEventListener('click', () => update(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true));
  window.addEventListener('storage', event => {
    if (event.key === 'pf-theme') update(event.newValue === 'light' ? 'light' : 'dark');
  });
}
