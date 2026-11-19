const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const hasAnimation = typeof Element.prototype.animate === 'function';
const ease = 'cubic-bezier(.22, .8, .2, 1)';
const wipeEase = 'cubic-bezier(.66, .02, .18, 1)';

function play(element, frames, options) {
  return element.animate(frames, { easing: ease, fill: 'backwards', ...options });
}

function enhanceNavigation() {
  const root = document.documentElement;
  const nav = document.querySelector('.site-nav');
  const menu = document.querySelector('#chapter-menu');
  const open = document.querySelector('.menu-toggle');
  const close = menu.querySelector('.menu-close');
  const curtain = document.querySelector('.chapter-curtain');
  const curtainParent = curtain.parentElement;
  const curtainLabel = curtain.querySelector('span');
  let curtainAnimation;
  let labelAnimation;
  let menuAnimation;
  let closing = false;
  let navigation = 0;

  const syncNav = () => {
    for (const link of nav.querySelectorAll('a')) {
      if (link.hash === (location.hash || '#top')) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  syncNav();
  addEventListener('hashchange', syncNav);
  addEventListener('popstate', syncNav);

  if (typeof menu.showModal === 'function') {
    menu.querySelector('.menu-nav').append(nav);
    open.hidden = false;
    root.classList.add('menu-ready');

    open.addEventListener('click', () => {
      menu.showModal();
      if (!hasAnimation || reducedMotion.matches) return;

      menuAnimation = play(menu, [
        { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 17%)' },
        { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }
      ], { duration: 660 });
      [...nav.querySelectorAll('a')].forEach((link, index) => {
        play(link, [
          { opacity: 0, transform: 'translate(4vw, 45%) skewY(-5deg)' },
          { opacity: 1, transform: 'none' }
        ], { duration: 640, delay: 95 + index * 55 });
      });
    });

    async function dismissMenu() {
      if (closing) return;
      menuAnimation?.cancel();
      if (!hasAnimation || reducedMotion.matches) {
        menu.close();
        return;
      }
      closing = true;
      const exit = play(menu, [
        { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
        { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 17%)' }
      ], { duration: 360, fill: 'both' });
      menuAnimation = exit;
      try { await exit.finished; } catch {}
      if (menuAnimation === exit && menu.open) menu.close();
    }

    close.addEventListener('click', dismissMenu);
    menu.addEventListener('cancel', event => {
      event.preventDefault();
      dismissMenu();
    });
    menu.addEventListener('close', () => {
      if (curtain.parentElement === menu) curtainParent.append(curtain);
      menuAnimation?.cancel();
      menuAnimation = null;
      closing = false;
    });
  }

  function goTo(target) {
    const hash = '#' + target.id;
    if (hash !== location.hash) history.pushState(null, '', hash);
    if (target.id === 'top') {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.querySelector('.wordmark').focus({ preventScroll: true });
    } else {
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
      target.focus({ preventScroll: true });
    }
    syncNav();
  }

  async function transitionTo(target) {
    const sequence = ++navigation;
    curtainAnimation?.cancel();
    labelAnimation?.cancel();
    if (!hasAnimation || reducedMotion.matches) {
      curtain.hidden = true;
      if (menu.open) menu.close();
      goTo(target);
      return;
    }

    if (menu.open) {
      menuAnimation?.cancel();
      menu.append(curtain);
    }
    curtainLabel.textContent = target.querySelector('h2')?.textContent.trim() || 'Home';
    curtain.hidden = false;
    try {
      labelAnimation = play(curtainLabel, [
        { opacity: 0, transform: 'translateY(36px) skewY(-3deg)' },
        { opacity: 1, transform: 'none' }
      ], { duration: 460, delay: 100 });
      curtainAnimation = play(curtain, [
        { transform: 'translateY(122%) skewY(-7deg)' },
        { transform: 'translateY(0) skewY(0)' }
      ], { duration: 540, easing: wipeEase, fill: 'both' });
      await curtainAnimation.finished;
      if (menu.open) {
        curtainParent.append(curtain);
        menu.close();
      }
      goTo(target);
      curtainAnimation.cancel();
      labelAnimation.cancel();
      labelAnimation = play(curtainLabel, [
        { opacity: 1, transform: 'none' },
        { opacity: 0, transform: 'translateY(-42px) skewY(-3deg)' }
      ], { duration: 470, fill: 'both' });
      curtainAnimation = play(curtain, [
        { transform: 'translateY(0) skewY(0)' },
        { transform: 'translateY(-122%) skewY(-7deg)' }
      ], { duration: 620, easing: wipeEase, fill: 'both' });
      await curtainAnimation.finished;
    } catch {}
    finally {
      if (sequence === navigation) {
        curtain.hidden = true;
        curtainAnimation?.cancel();
        labelAnimation?.cancel();
      }
    }
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[href^="#"]:not(.skip-link)');
    const target = link && document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    transitionTo(target);
  });
}

function enhanceProjects() {
  const deck = document.querySelector('#project-deck');
  const slides = [...deck.querySelectorAll('.project')];
  const controls = document.querySelector('.project-controls');
  const status = controls.querySelector('.project-position');
  let current = 0;
  let animations = [];
  let touch;
  let tap;
  let touchActivation;

  function select(index, direction = 0) {
    const outgoing = slides[current];
    for (const animation of animations) animation.cancel();
    for (const slide of slides) {
      slide.hidden = true;
      slide.inert = true;
      slide.classList.remove('is-leaving');
    }
    current = (index + slides.length) % slides.length;
    const active = slides[current];
    active.hidden = false;
    active.inert = false;
    status.textContent = `Project ${current + 1} of ${slides.length}`;
    if (!direction || !hasAnimation || reducedMotion.matches) return;

    outgoing.classList.add('is-leaving');
    const slideMotion = { duration: 590, easing: wipeEase };
    const departure = play(outgoing, [
      { transform: 'translateX(0)' },
      { transform: `translateX(${direction * -100}%)` }
    ], { ...slideMotion, fill: 'both' });
    departure.finished.then(() => outgoing.classList.remove('is-leaving'), () => {});
    animations = [
      departure,
      play(active, [
        { transform: `translateX(${direction * 100}%)` },
        { transform: 'translateX(0)' }
      ], slideMotion)
    ];
  }

  deck.classList.add('is-deck');
  for (const slide of slides.slice(1)) slide.hidden = true;
  select(0);
  controls.hidden = false;

  function move(direction) {
    select(current + direction, direction);
  }

  for (const button of controls.querySelectorAll('button')) {
    const direction = Number(button.dataset.projectDirection);
    button.addEventListener('click', event => {
      const followsTouch = event.pointerType === 'touch'
        || event.sourceCapabilities?.firesTouchEvents
        || (!event.pointerType && event.detail > 0);
      const duplicate = followsTouch && touchActivation?.button === button
        && performance.now() - touchActivation.time < 500;
      if (!duplicate) move(direction);
    });
    button.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch' && event.isPrimary) {
        tap = { id: event.pointerId, x: event.clientX, y: event.clientY };
      }
    });
    button.addEventListener('pointerup', event => {
      if (tap?.id !== event.pointerId) return;
      const distance = Math.hypot(event.clientX - tap.x, event.clientY - tap.y);
      tap = null;
      if (distance > 12 || !button.contains(document.elementFromPoint(event.clientX, event.clientY))) return;

      // Chromium can suppress the synthetic click when a tap follows a swipe.
      touchActivation = { button, time: performance.now() };
      move(direction);
    });
    button.addEventListener('pointercancel', event => {
      if (tap?.id === event.pointerId) tap = null;
    });
  }
  controls.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    move(direction);
  });

  deck.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' && event.isPrimary) {
      touch = { id: event.pointerId, x: event.clientX, y: event.clientY };
    }
  });
  deck.addEventListener('pointerup', event => {
    if (touch?.id !== event.pointerId) return;
    const dx = event.clientX - touch.x;
    const dy = event.clientY - touch.y;
    touch = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const direction = dx < 0 ? 1 : -1;
    move(direction);
  });
  deck.addEventListener('pointercancel', event => {
    if (touch?.id === event.pointerId) touch = null;
  });
}

function revealSections() {
  if (!hasAnimation || !('IntersectionObserver' in window)) return;
  const items = document.querySelectorAll('[data-reveal], .job, .credentials > li, .education > article');
  const observer = new IntersectionObserver(entries => {
    let order = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (reducedMotion.matches || entry.target.matches(':focus-within') || entry.target.closest('section')?.matches(':focus')) continue;
      play(entry.target, [
        { clipPath: 'inset(0 0 42% 0)', transform: 'translateY(32px)', opacity: .4 },
        { clipPath: 'inset(0 0 0 0)', transform: 'none', opacity: 1 }
      ], { duration: 740, delay: Math.min(order++, 3) * 55 });
    }
  }, { rootMargin: '0px 0px 4% 0px' });
  items.forEach(item => observer.observe(item));
}

function openHero() {
  if (!hasAnimation || reducedMotion.matches || (location.hash && location.hash !== '#top')) return;
  [...document.querySelectorAll('.title-line > span')].forEach((line, index) => {
    play(line, [
      { transform: 'translateY(105%) skewY(7deg)' },
      { transform: 'translateY(0) skewY(0)' }
    ], { duration: 920, delay: 100 + index * 110 });
  });
  play(document.querySelector('.id-card'), [
    { opacity: 0, clipPath: 'inset(0 0 0 100%)', transform: 'translateX(36px) scale(.91)' },
    { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'none' }
  ], { duration: 1050, delay: 110 });
}

function trackHero(onProgress) {
  const hero = document.querySelector('.hero');
  const sequence = document.querySelector('.hero-sequence');
  const header = document.querySelector('.site-header');
  const pinned = matchMedia('(min-width: 801px) and (min-height: 580px)');
  let progress = 0;
  let target = 0;
  let needsMeasure = false;
  let frame = 0;
  let previousTime;

  function measure() {
    const length = pinned.matches
      ? sequence.offsetHeight - hero.offsetHeight
      : Math.min(hero.offsetHeight, window.innerHeight) * .67;
    const scroll = header.offsetHeight - sequence.getBoundingClientRect().top;
    return Math.max(0, Math.min(1, scroll / Math.max(1, length)));
  }

  function update(now) {
    frame = 0;
    if (needsMeasure) {
      target = reducedMotion.matches ? 0 : measure();
      needsMeasure = false;
    }

    const elapsed = Math.min(now - (previousTime ?? now - 16.7), 64);
    const difference = target - progress;
    const next = Math.abs(difference) < .001 || reducedMotion.matches
      ? target
      : progress + difference * (1 - Math.exp(-elapsed / 95));
    if (next !== progress) {
      progress = next;
      hero.style.setProperty('--hero-progress', progress);
      onProgress(progress);
    }

    if (progress !== target) {
      previousTime = now;
      frame = requestAnimationFrame(update);
    } else {
      previousTime = undefined;
    }
  }

  function schedule() {
    needsMeasure = true;
    if (!frame) frame = requestAnimationFrame(update);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  reducedMotion.addEventListener('change', schedule);
  schedule();
}

export function enhanceMotion(onHeroProgress) {
  document.documentElement.classList.add('motion-ready');
  enhanceNavigation();
  enhanceProjects();
  openHero();
  revealSections();
  trackHero(onHeroProgress);

  const initialTarget = document.getElementById(location.hash.slice(1));
  if (initialTarget && initialTarget.id !== 'top') {
    requestAnimationFrame(() => initialTarget.scrollIntoView({ block: 'start', behavior: 'instant' }));
  }
}
