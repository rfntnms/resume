import { enhanceMotion } from './portfolio-motion.js';

const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const darkPreference = matchMedia('(prefers-color-scheme: dark)');

function currentTheme() {
  return root.dataset.theme || (darkPreference.matches ? 'dark' : 'light');
}

function updateThemeLabel() {
  themeToggle.textContent = currentTheme() === 'dark' ? 'Light mode' : 'Dark mode';
}

themeToggle.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
  updateThemeLabel();
});
darkPreference.addEventListener('change', updateThemeLabel);
updateThemeLabel();
themeToggle.hidden = false;

const card = document.querySelector('#id-card');
const flip = card.querySelector('.flip-card');
const fallback = card.querySelector('.badge-fallback');
const front = card.querySelector('.badge-front');
const reverse = card.querySelector('.badge-back');
const canvas = card.querySelector('canvas');
const hint = card.querySelector('.id-hint');
const status = card.querySelector('[role="status"]');
let reversed = false;
let scene;
let heroProgress = 0;

enhanceMotion(progress => {
  heroProgress = progress;
  if (!canvas.hidden) scene.setScrollProgress(progress);
});

flip.addEventListener('click', () => {
  reversed = !reversed;
  flip.setAttribute('aria-pressed', String(reversed));
  front.hidden = reversed;
  reverse.hidden = !reversed;
  status.textContent = reversed
    ? 'Card back: threat hunting, detection engineering, and incident response.'
    : 'Card front: Rifqi Rofian Tanamas, L2 Security Analyst at ITSEC Asia.';
  if (!canvas.hidden) scene.showSide(reversed);
});
flip.hidden = false;

function showStaticCard() {
  fallback.hidden = false;
  canvas.hidden = true;
  hint.hidden = true;
}

function show3DCard() {
  canvas.hidden = false;
  scene.setScrollProgress(heroProgress);
  scene.showSide(reversed, false);
  fallback.hidden = true;
  hint.hidden = false;
}

async function loadBadge() {
  if (navigator.connection?.saveData) return;

  try {
    const context = canvas.getContext('webgl2', { alpha: true, antialias: true });
    if (!context) return;

    const { createBadgeScene } = await import('./id-card-3d.js');
    const portrait = document.querySelector('#badge-portrait');
    await Promise.allSettled([
      portrait.decode(),
      document.fonts.load('800 2rem "Barlow Condensed"'),
      document.fonts.load('1rem "JetBrains Mono"')
    ]);
    if (context.isContextLost()) return;

    scene = createBadgeScene(canvas, context, portrait);
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      showStaticCard();
    });
    canvas.addEventListener('webglcontextrestored', () => {
      if (!context.isContextLost()) show3DCard();
    });
    show3DCard();
  } catch {
    showStaticCard();
  }
}

function queueBadge() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadBadge, { timeout: 900 });
  } else {
    setTimeout(loadBadge, 120);
  }
}

if (document.readyState === 'complete') queueBadge();
else addEventListener('load', queueBadge, { once: true });
