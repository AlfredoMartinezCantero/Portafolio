/* Se ejecuta antes del CSS para evitar un destello del tema incorrecto. */
(() => {
  'use strict';
  let theme = 'dark';
  try {
    const saved = localStorage.getItem('pf-theme');
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch { /* El modo oscuro sigue disponible sin almacenamiento. */ }
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f5f5f2' : '#101217');
})();
