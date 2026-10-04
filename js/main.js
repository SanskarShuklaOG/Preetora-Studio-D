(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement, clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(pointer:fine)').matches;
  const calm = reduce || navigator.connection?.saveData === true;

  /* Owner-edited copy from admin.html (keeps the styled markup unless text actually changed) */
  try {
    const s = JSON.parse(localStorage.getItem('preetoraAdmin') || 'null');
    const set = (el, txt, def) => { if (el && txt && txt !== def) el.textContent = txt; };
    if (s) { set($('.hero h1'), s.headline, 'Make the scroll stop.'); set($('.cta-inner h2'), s.cta, 'Want to make something scroll-stopping?'); }
  } catch (_) {}

  /* Word-by-word masked text reveal */
  const splitWords = el => { let n = 0; const walk = node => [...node.childNodes].forEach(c => {
    if (c.nodeType === 3) { const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) return f.append(' ');
        const w = document.createElement('span'), i = document.createElement('span'); w.className = 'w'; i.className = 'wi'; i.style.setProperty('--i', n++); i.textContent = t; w.append(i); f.append(w); });
      c.replaceWith(f);
    } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c); }); walk(el); };
  if (!reduce) $$('[data-split]').forEach(splitWords);
  $$('.hero-copy > *').forEach((e, i) => e.style.setProperty('--k', i));
  $$('.menu-link').forEach((l, i) => l.style.setProperty('--i', i));
  $('.menu-footer')?.style.setProperty('--i', 5);

  /* Page-load curtain + hero sequence */
  const curtain = $('.curtain');
  const start = () => requestAnimationFrame(() => { root.classList.add('ready'); curtain?.classList.add('go'); });
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();

  /* Page transitions (internal links only) */
  if (curtain && !reduce) {
    document.addEventListener('click', e => {
      const a = e.target.closest?.('a[href]');
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target || a.hasAttribute('download')) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || u.pathname === location.pathname) return;
      e.preventDefault(); curtain.classList.remove('go'); setTimeout(() => { location.href = u.href; }, 480);
    });
    addEventListener('pageshow', e => { if (e.persisted) curtain.classList.add('go'); });
  }

  /* Scroll progress, header state, parallax */
  const header = $('#siteHeader'), progress = $('#scrollProgress'), par = $$('[data-parallax]');
  let tick = false;
  const onScroll = () => {
    const max = root.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    header?.classList.toggle('scrolled', scrollY > 24);
    if (!reduce && scrollY < innerHeight * 1.3) par.forEach(el => el.style.setProperty('--py', (scrollY * el.dataset.parallax).toFixed(1) + 'px'));
    tick = false;
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  $('.orb-a')?.setAttribute('data-parallax', '.14'); $('.orb-b')?.setAttribute('data-parallax', '-.1'); $('.hero-card')?.setAttribute('data-parallax', '.06');
  par.push(...$$('[data-parallax]').filter(e => !par.includes(e)));

  /* Menu: focus trap, inert background, Esc */
  const menuBtn = $('#menuButton'), menu = $('#sideMenu'), closeBtn = $('#closeMenu');
  let last = null;
  const setMenu = open => {
    if (!menu) return;
    menu.classList.toggle('open', open); menu.setAttribute('aria-hidden', String(!open));
    menuBtn?.setAttribute('aria-expanded', String(open)); menuBtn?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    $$('main,.site-footer').forEach(el => { el.inert = open; });
    if (open) { last = document.activeElement; setTimeout(() => closeBtn?.focus(), 60); } else { last?.focus?.({ preventScroll: true }); last = null; }
  };
  menuBtn?.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  closeBtn?.addEventListener('click', () => setMenu(false));
  $('[data-menu-close]')?.addEventListener('click', () => setMenu(false));
  $$('.menu-link').forEach(l => l.addEventListener('click', () => { if (l.getAttribute('href')?.startsWith('#')) setMenu(false); }));
  document.addEventListener('keydown', e => {
    if (!menu?.classList.contains('open')) return;
    if (e.key === 'Escape') return setMenu(false);
    if (e.key === 'Tab') { const f = $$('button,a[href]', menu).filter(x => x.offsetParent !== null); if (!f.length) return;
      const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });

  /* Reveal + animated counters */
  const count = el => { const to = +el.dataset.count, t0 = performance.now();
    const step = t => { const p = clamp((t - t0) / 1400, 0, 1); el.textContent = String(Math.round(to * (1 - (1 - p) ** 3))).padStart(2, '0'); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
  const items = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (!en.isIntersecting) return; en.target.classList.add('visible'); $$('[data-count]', en.target).forEach(count); io.unobserve(en.target); }), { threshold: .12, rootMargin: '0px 0px -7% 0px' });
    items.forEach(el => io.observe(el));
  } else items.forEach(el => el.classList.add('visible'));

  /* Cursor interactions: glow, spotlight, magnetic, hero tilt */
  $$('.service-card,.review,.founder-card,.rating-card,.project').forEach(el => el.setAttribute('data-spot', ''));
  if (fine && !reduce) {
    const glow = $('.cursor-glow'); let raf = 0, x = 0, y = 0;
    addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY;
      if (glow && !raf) raf = requestAnimationFrame(() => { glow.style.opacity = '.9'; glow.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`; raf = 0; });
      const c = e.target.closest?.('[data-spot]'); if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px'); }
    }, { passive: true });
    $$('.magnetic').forEach(b => { b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate3d(${(e.clientX - r.left - r.width / 2) * .15}px,${(e.clientY - r.top - r.height / 2) * .15}px,0)`; }); b.addEventListener('pointerleave', () => { b.style.transform = ''; }); });
    const hero = $('.hero'), card = $('.hero-card');
    hero?.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); card?.style.setProperty('--tx', ((e.clientX - r.left) / r.width - .5) * -18 + 'px'); card?.style.setProperty('--ty', ((e.clientY - r.top) / r.height - .5) * -18 + 'px'); }, { passive: true });
  }

  /* Portfolio videos: lazy, capped concurrency, pause/play control, data-saver + reduced-motion aware */
  const videos = $$('.portfolio-video'), MAX = 3, live = new Set(), vis = new Map();
  const frameOf = v => v.closest('.video-frame');
  const prep = v => { if (v.dataset.poster && !v.poster) v.poster = v.dataset.poster; };
  const load = v => { if (v.dataset.src && !v.src) { prep(v); v.src = v.dataset.src; v.load(); frameOf(v)?.classList.add('loading'); } };
  const play = v => { load(v); const p = v.play(); p?.catch?.(() => {}); };
  videos.forEach(v => {
    const f = frameOf(v); if (!f) return;
    const pb = document.createElement('button'); pb.type = 'button'; pb.className = 'play-toggle'; pb.setAttribute('aria-label', 'Play video'); f.append(pb);
    const msg = document.createElement('p'); msg.className = 'video-msg'; msg.textContent = 'This preview is unavailable right now.'; f.append(msg);
    pb.addEventListener('click', () => { if (v.paused) { v.dataset.userPaused = ''; play(v); } else { v.dataset.userPaused = '1'; v.pause(); } });
    v.addEventListener('play', () => { live.add(v); f.classList.add('is-playing'); pb.setAttribute('aria-label', 'Pause video');
      if (live.size > MAX) { const o = [...live].find(x => x !== v); live.delete(o); o.pause(); } });
    v.addEventListener('pause', () => { live.delete(v); f.classList.remove('is-playing'); pb.setAttribute('aria-label', 'Play video'); });
    v.addEventListener('loadeddata', () => f.classList.add('loaded'), { once: true });
    v.addEventListener('loadedmetadata', () => { f.dataset.orient = v.videoWidth > v.videoHeight * 1.1 ? 'landscape' : 'portrait'; });
    v.addEventListener('error', () => { f.classList.add('video-error'); f.classList.remove('loading'); });
    const snd = $('.sound-toggle', f);
    snd?.addEventListener('click', () => {
      videos.forEach(o => { if (o !== v && !o.muted) { o.muted = true; const b = $('.sound-toggle', frameOf(o)); if (b) { b.textContent = 'Sound'; b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', 'Unmute video'); } } });
      v.muted = !v.muted; snd.textContent = v.muted ? 'Sound' : 'Mute'; snd.setAttribute('aria-pressed', String(!v.muted)); snd.setAttribute('aria-label', v.muted ? 'Unmute video' : 'Mute video'); v.dataset.userPaused = ''; play(v);
    });
  });
  const wants = v => vis.get(v) && !('userPaused' in v.dataset && v.dataset.userPaused) && !calm;
  if ('IntersectionObserver' in window) {
    const vo = new IntersectionObserver(es => es.forEach(en => {
      const v = en.target; prep(v); vis.set(v, en.intersectionRatio >= .5);
      if (en.isIntersecting && calm === false && en.intersectionRatio > 0) load(v);
      if (wants(v)) play(v); else if (!en.isIntersecting) v.pause();
    }), { threshold: [0, .5], rootMargin: '200px 0px' });
    videos.forEach(v => vo.observe(v));
  }
  document.addEventListener('visibilitychange', () => videos.forEach(v => { if (document.hidden) v.pause(); else if (wants(v)) play(v); }));
})();
