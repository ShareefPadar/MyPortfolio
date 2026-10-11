/**
 * Client-side behaviour shared by every era. Behaviour only — no markup, no styling.
 * Each era decides how the portrait looks and how the guide speaks; these helpers
 * just decode the shared content and run the guide's timing, the same way live does.
 *
 *   portraitJS  → decodePortrait(P, halo): { W, H, px, clear, rgb }
 *                 halo = also clear the near-white edge pixels touching the background (for dark eras, where they show as a fringe)
 *                 px = palette index per pixel, clear = 1 where the background is
 *                 (palette 0 connected to the edge — live's "transparent" mode), rgb = palette as [r,g,b]
 *   guideJS     → guideBrain(G, ui, opts): section messages, idle chatter, dismiss + comeback, poke
 *                 opts.said = the line already showing at load (not repeated); quiet = no chatter (touch / reduced motion)
 *                 ui.say(text, at) shows a line and returns how long it stays busy (ms); ui.hide(); ui.show()
 *                 at = what the line is about: a section id (hero, work, nda, live) or an idle line's "at" (resume, contact).
 *                 Eras that don't point at things ignore it. Idle lines may be strings or { text, at }.
 *                 api.wake() brings it back after a dismiss (for eras with a "call it back" control)
 *                 api.look() repeats the line for the part of the page in view (1986's LOOK command)
 */

export const portraitJS = `
function decodePortrait(P, halo = false) {
  const W = P.width, H = P.height, px = new Uint8Array(W * H); let r = 0, a = 0; const s = P.pixels;
  while (r < s.length) { const n = s.charCodeAt(r++) - 65, i = r; while (r < s.length) { const c = s.charCodeAt(r); if (c >= 65 && c <= 79) break; r++; }
    const d = r > i ? parseInt(s.slice(i, r), 36) : 1; px.fill(n, a, a + d); a += d; }
  const clear = new Uint8Array(W * H), st = [];
  for (let x = 0; x < W; x++) st.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) st.push(y * W, y * W + W - 1);
  const bg = halo ? P.palette.map(h => { const v = parseInt(h.slice(1), 16); return (v >> 16 & 255) + (v >> 8 & 255) + (v & 255) > 690; }) : P.palette.map((_, i) => i === 0);
  while (st.length) { const n = st.pop(); if (clear[n] || !bg[px[n]]) continue; clear[n] = 1; const x = n % W;
    if (x > 0) st.push(n - 1); if (x < W - 1) st.push(n + 1); if (n >= W) st.push(n - W); if (n < (H - 1) * W) st.push(n + W); }
  const rgb = P.palette.map(h => { const v = parseInt(h.slice(1), 16); return [v >> 16 & 255, v >> 8 & 255, v & 255]; });
  return { W, H, px, clear, rgb };
}`;

export const guideJS = `
function guideBrain(G, ui, { idleEvery = 11000, backAfter = 15000, quiet = false, said = '' } = {}) {
  let busyUntil = 0, hidden = false, gone = 0, current = null;
  const now = () => Date.now(), pick = a => a[Math.floor(Math.random() * a.length)];
  const say = (t, at) => { if (hidden) return; if (t && typeof t === 'object') { at = t.at; t = t.text; } busyUntil = now() + ui.say(t, at); };
  const api = {
    poke() { say(G.replies[3]); },
    wake() { if (!hidden) { api.poke(); return; } hidden = false; ui.show(); say(G.replies[1]); },   // a "bring it back" control
    tell(t) { say(t); },   // say something now and count it as talking (so idle chatter doesn't talk over it)
    look() { const s = inView() ?? sections[0]; if (s) say(s.text, s.id); },
    dismiss() {
      if (hidden) return; say(G.replies[0]); gone++;
      setTimeout(() => { hidden = true; ui.hide();
        if (!quiet) setTimeout(() => { hidden = false; ui.show(); say(G.replies[gone > 1 ? 2 : 1]); }, backAfter); }, 2600);
    },
  };
  const sections = Object.entries(G.sections).map(([id, text]) => ({ id, text, el: document.querySelector('[data-guide-id="' + id + '"]') })).filter(s => s.el);
  const inView = () => { const mid = innerHeight / 2; let best = null, d = Infinity;
    for (const s of sections) { const r = s.el.getBoundingClientRect(); if (r.bottom <= 0 || r.top >= innerHeight) continue;
      const k = Math.abs(r.top + r.height / 2 - mid); if (k < d) { d = k; best = s; } }
    return best; };
  if (said) busyUntil = now() + 6000;
  if (quiet) return api;   // touch / reduced motion: the opening line only, like live
  current = sections.find(s => s.text === said) ?? null;   // the opening line is already on screen
  setInterval(() => {
    if (hidden) return; const best = inView();
    if (best && best !== current) { current = best; say(best.text, best.id); }
  }, 300);
  setInterval(() => { if (!hidden && now() > busyUntil + 2000) say(pick(G.idle)); }, idleEvery);
  return api;
}`;

/**
 * Era switcher — behaviour only. Markup contract (each era draws it its own way):
 *   [data-era-switch]                 wrapper
 *     button[data-era-toggle]         aria-expanded / aria-controls
 *     [data-era-menu] (hidden)        the open state
 *       a[data-era="<id>"] …          real links: <path>?era=<id>; the current one has aria-current="true"
 * Opens on click, ↑↓ / ←→ / Home / End move between years, Esc and outside clicks close.
 * Choosing a year remembers it (localStorage "era") and flags the arrival effect for the next page.
 */
export const eraSwitchJS = `
function eraSwitch(root) {
  if (!root) return;
  const btn = root.querySelector('[data-era-toggle]'), menu = root.querySelector('[data-era-menu]'), links = [...menu.querySelectorAll('a[data-era]')];
  const set = (open, focus) => { menu.hidden = !open; root.dataset.open = open; btn.setAttribute('aria-expanded', open);
    if (open && focus) (links.find(a => a.getAttribute('aria-current')) || links[0]).focus(); };
  btn.addEventListener('click', e => set(menu.hidden, e.detail === 0));   // keyboard opens straight onto the current year
  root.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); return; }
    const i = links.indexOf(document.activeElement); if (i < 0) return;
    const to = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: links.length - 1 }[e.key];
    if (to === undefined) return; e.preventDefault(); links[(to + links.length) % links.length].focus();
  });
  document.addEventListener('pointerdown', e => { if (!menu.hidden && !root.contains(e.target)) set(false); });
  root.addEventListener('focusout', e => { if (!menu.hidden && !root.contains(e.relatedTarget)) set(false); });
  links.forEach(a => a.addEventListener('click', () => { try { localStorage.setItem('era', a.dataset.era); sessionStorage.setItem('era-arrive', a.dataset.era); } catch (_) {} }));
  try { localStorage.setItem('era', document.documentElement.dataset.era); } catch (_) {}
}`;

/** Inline in <head>: flags the arrival effect before first paint (each era styles html.era-arrive .arrive). */
export const arriveHeadJS = `<script>try{if(sessionStorage.getItem('era-arrive')){sessionStorage.removeItem('era-arrive');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('era-arrive');setTimeout(function(){document.documentElement.classList.remove('era-arrive')},1600)}}catch(e){}</script>`;

/**
 * Work-index filter — behaviour only. Inside root:
 *   button[data-filter="*"|<domain>]   aria-pressed; single select (as live)
 *   [data-domain="<domain>"]           a project; hidden when it doesn't match
 *   [data-group]                       a group; hidden when none of its projects show
 * Fires a "filter" event on root ({ detail: { filter, shown } }) so an era can move an indicator or update a count.
 */
export const filterJS = `
function workFilter(root) {
  if (!root) return;
  const chips = [...root.querySelectorAll('[data-filter]')];
  const apply = f => {
    chips.forEach(x => { const on = x.dataset.filter === f; x.setAttribute('aria-pressed', on); x.classList.toggle('on', on); });
    let shown = 0;
    root.querySelectorAll('[data-domain]').forEach(el => { el.hidden = f !== '*' && el.dataset.domain !== f; if (!el.hidden) shown++; });
    root.querySelectorAll('[data-group]').forEach(g => { g.hidden = ![...g.querySelectorAll('[data-domain]')].some(x => !x.hidden); });
    root.dispatchEvent(new CustomEvent('filter', { detail: { filter: f, shown } }));
  };
  chips.forEach(b => b.addEventListener('click', () => apply(b.dataset.filter)));
  apply('*');
}`;

/**
 * Easter-egg game field — behaviour only (each era draws its own game, look and markup). Live's Dino Runner works this way:
 * the game has no box; the page is its sky and the footer's top edge is its floor.
 *   root  [data-game] role="application" tabindex="0"; optional <canvas> (fills root), optional [data-score]
 *         gets data-state = idle | running | over, data-focus = true | false, data-kbd = true when focused from the keyboard
 *         — eras show their overlay text and focus ring from these
 *   make(api) → game { unit(cssWidth)?  css px per game unit (pixel eras use 3–4) · holdTouch? false = touch keeps scrolling while running
 *                      reset()          fresh board, back to idle
 *                      resize(W, H, widthChanged)   size in game units
 *                      start()?         idle/over → running (the press that starts a game does nothing else)
 *                      update(dt)?      every frame while on screen (game checks api.state)
 *                      draw(ctx, W, H)? canvas already cleared and scaled to game units
 *                      key(e, down)?    keys only reach the game while it has focus (as live); return true to swallow
 *                      startKey(e)?     which keys start it (default: Space, Enter, ↑)
 *                      pointer(type, x, y, e)?  'move' | 'down' | 'up' in game units }
 *   api: state · set(state) · start() · focus() (no ring) · score(n) (pads to root[data-pad]) · tone(freq, secs, wave, vol, slideTo) · W() · H()
 * Off screen or in a hidden tab the loop stops (the game freezes where it was). Touch scrolls the page until a game is running.
 */
export const gameJS = `
function gameField(root, make) {
  if (!root) return;
  const cv = root.querySelector('canvas'), ctx = cv ? cv.getContext('2d') : null, scoreEl = root.querySelector('[data-score]');
  let W = 0, H = 0, unit = 1, cssW = 0, raf = 0, last = 0, onScreen = false, ac = null, pressStarted = false, viaPointer = false, game = null;
  const api = {
    state: 'idle',
    set(s) { api.state = s; root.dataset.state = s; root.style.touchAction = s === 'running' && game && game.holdTouch !== false ? 'none' : 'pan-y'; if (s === 'running') wake(); },
    score(n) { if (scoreEl) scoreEl.textContent = String(n).padStart(+(root.dataset.pad || 0), '0'); },
    tone(f, d = .06, type = 'square', v = .035, to = 0) {
      if (!ac) return; const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(1e-4, t + d); o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d + .02);
    },
    W: () => W, H: () => H,
  };
  api.start = () => start();
  api.focus = () => { viaPointer = true; root.focus({ preventScroll: true }); viaPointer = false; root.dataset.kbd = 'false'; };
  game = make(api);
  const audio = () => { if (!ac) { const A = window.AudioContext || window.webkitAudioContext; if (A) try { ac = new A(); } catch (_) {} } if (ac && ac.state === 'suspended') ac.resume(); };
  const draw = () => { if (!ctx || !game.draw) return; ctx.clearRect(0, 0, W, H); game.draw(ctx, W, H); };
  function fit() {
    const r = root.getBoundingClientRect(); if (!r.width || !r.height) return;
    const changed = Math.abs(r.width - cssW) > 1; cssW = r.width;
    unit = game.unit ? game.unit(r.width) : 1; W = r.width / unit; H = r.height / unit;
    if (cv) { const d = Math.min(devicePixelRatio || 1, 3); cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d);
      ctx.setTransform(unit * d, 0, 0, unit * d, 0, 0); ctx.imageSmoothingEnabled = false; }
    game.resize && game.resize(W, H, changed); draw();
  }
  function start() { audio(); if (api.state === 'over') game.reset(); api.set('running'); game.start && game.start(); }
  function frame(t) {
    raf = 0; if (!onScreen || document.hidden) return;
    const dt = Math.min(.033, Math.max(0, (t - last) / 1000)); last = t;
    game.update && game.update(dt); draw(); raf = requestAnimationFrame(frame);
  }
  function wake() { if (!raf && onScreen && !document.hidden && (game.update || ctx)) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  const at = e => { const r = root.getBoundingClientRect(); return [(e.clientX - r.left) / unit, (e.clientY - r.top) / unit]; };
  root.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    audio(); viaPointer = true; root.focus({ preventScroll: true }); viaPointer = false; root.dataset.kbd = 'false';
    if (api.state !== 'running') { pressStarted = true; start(); game.pointer && game.pointer('move', ...at(e), e); return; }
    pressStarted = false; game.pointer && game.pointer('down', ...at(e), e);
  });
  root.addEventListener('pointermove', e => { game.pointer && game.pointer('move', ...at(e), e); });
  const up = e => { if (pressStarted) { pressStarted = false; return; } game.pointer && game.pointer('up', ...at(e), e); };
  root.addEventListener('pointerup', up);
  root.addEventListener('pointercancel', e => { pressStarted = false; game.pointer && game.pointer('cancel', ...at(e), e); });
  const startKey = e => game.startKey ? game.startKey(e) : [' ', 'Enter', 'ArrowUp'].includes(e.key);
  root.addEventListener('keydown', e => {
    if (e.target !== root && e.target.closest('button, a') && (e.key === 'Enter' || e.key === ' ')) return;   // a button inside the game (Five's keys) activates itself
    audio();
    if (api.state !== 'running') { if (!e.repeat && startKey(e)) { e.preventDefault(); start(); } return; }
    if (game.key && game.key(e, true)) e.preventDefault();
  });
  root.addEventListener('keyup', e => { if (game.key && game.key(e, false)) e.preventDefault(); });
  root.addEventListener('focus', () => { root.dataset.focus = 'true'; root.dataset.kbd = String(!viaPointer); });   // data-kbd: show a focus ring only when Tab brought you here (as live)
  root.addEventListener('blur', () => { root.dataset.focus = 'false'; game.blur && game.blur(); });
  new IntersectionObserver(es => { onScreen = es[0].isIntersecting; if (onScreen) wake(); }).observe(root);
  document.addEventListener('visibilitychange', wake);
  new ResizeObserver(fit).observe(root);
  root.dataset.focus = 'false'; game.reset(); api.set('idle'); fit();
  return api;
}`;
