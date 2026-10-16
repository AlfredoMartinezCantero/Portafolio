import { initTheme } from './ui.js';

initTheme();
const canvas = document.getElementById('clockCanvas');
const ctx = canvas.getContext('2d');
const time = document.getElementById('clockTime');
const date = document.getElementById('clockDate');
const note = document.getElementById('clockNote');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const timeFormat = new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
const dateFormat = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
let size = 0;
let frame;
let timer;
let lastPaint = 0;
let lastSecond = -1;
let colors;

function readColors() {
  const style = getComputedStyle(document.documentElement);
  colors = Object.fromEntries(['surface', 'surface-raised', 'line', 'line-strong', 'text', 'muted', 'accent'].map(name => [name, style.getPropertyValue(`--${name}`).trim()]));
}

function resize() {
  const nextSize = Math.round(canvas.getBoundingClientRect().width);
  const ratio = Math.min(devicePixelRatio || 1, 3);
  if (size === nextSize && canvas.width === Math.round(size * ratio)) return;
  size = nextSize;
  canvas.width = Math.round(size * ratio);
  canvas.height = Math.round(size * ratio);
  ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
  draw();
}

function draw() {
  const now = new Date();
  if (now.getSeconds() !== lastSecond) {
    lastSecond = now.getSeconds();
    time.dateTime = now.toISOString();
    time.textContent = timeFormat.format(now);
    date.textContent = dateFormat.format(now);
  }
  if (!ctx || !size) return;
  const r = size / 2;
  const faceRadius = r * .92;
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(r, r);
  const face = ctx.createRadialGradient(-r * .3, -r * .4, 0, 0, 0, faceRadius);
  face.addColorStop(0, colors['surface-raised']);
  face.addColorStop(1, colors.surface);
  ctx.fillStyle = face;
  ctx.strokeStyle = colors['line-strong'];
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, faceRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.lineCap = 'round';

  for (let i = 0; i < 60; i++) {
    const angle = i * Math.PI / 30 - Math.PI / 2;
    const hour = i % 5 === 0;
    const outer = faceRadius * .91;
    const inner = faceRadius * (hour ? .84 : .88);
    ctx.lineWidth = hour ? 2.5 : 1;
    ctx.strokeStyle = hour ? colors.text : colors['line-strong'];
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    ctx.stroke();
  }
  ctx.fillStyle = colors.text;
  ctx.font = `500 ${r * .11}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let n = 1; n <= 12; n++) {
    const angle = n * Math.PI / 6 - Math.PI / 2;
    ctx.fillText(String(n), Math.cos(angle) * faceRadius * .72, Math.sin(angle) * faceRadius * .72);
  }
  ctx.fillStyle = colors.muted;
  ctx.font = `${r * .045}px ui-monospace, monospace`;
  ctx.fillText('CANVAS / JAVASCRIPT', 0, r * .38);

  const seconds = now.getSeconds() + (motion.matches ? 0 : now.getMilliseconds() / 1000);
  const minutes = now.getMinutes() + seconds / 60;
  const hours = now.getHours() % 12 + minutes / 60;
  function hand(angle, length, width, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
    ctx.stroke();
  }
  hand(hours * Math.PI / 6 - Math.PI / 2, faceRadius * .47, r * .035, colors.text);
  hand(minutes * Math.PI / 30 - Math.PI / 2, faceRadius * .67, r * .025, colors.text);
  hand(seconds * Math.PI / 30 - Math.PI / 2, faceRadius * .8, r * .009, colors.accent);
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.arc(0, 0, r * .028, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function stop() {
  cancelAnimationFrame(frame);
  clearTimeout(timer);
}

function tick(timestamp) {
  if (timestamp - lastPaint >= 1000 / 30) {
    draw();
    lastPaint = timestamp;
  }
  frame = requestAnimationFrame(tick);
}

function start() {
  stop();
  note.textContent = motion.matches ? 'Movimiento reducido: el reloj se actualiza una vez por segundo.' : 'Manecillas continuas con requestAnimationFrame. Se pausa cuando esta pestaña está oculta.';
  if (document.hidden) return;
  draw();
  if (motion.matches) timer = setTimeout(start, 1000 - new Date().getMilliseconds());
  else frame = requestAnimationFrame(tick);
}

readColors();
resize();
new ResizeObserver(resize).observe(canvas);
new MutationObserver(() => { readColors(); draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
motion.addEventListener('change', start);
document.addEventListener('visibilitychange', start);
window.addEventListener('resize', resize);
window.addEventListener('pagehide', stop);
window.addEventListener('pageshow', start);
start();
