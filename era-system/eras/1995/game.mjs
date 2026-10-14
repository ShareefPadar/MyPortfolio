/**
 * ERA · 1995 — the home page's Dino Runner, ported from live (shareefpadar.com, chunk module 85610) line for line:
 * same sprites, physics (60fps-step units), spawn rules, hit boxes, sounds, canvas scale and DOM overlay.
 * Live's rule the other eras translate: no box — the canvas is filled with the page colour, and its last row is the
 * ground line (ink with light gaps) that sits directly on the dark footer.
 *   gameMarkup(c) → the hint line + the field (between <main> and the footer — layout's beforeFooter slot)
 *   gameScript    → runs inside the layout's script. Own code, not gameJS: 1995 matches live exactly.
 * Text comes from content.games['1995'].
 */
import { esc } from './layout.mjs';

export const gameMarkup = c => {
  const g = c.games['1995'];
  return `<section class="dino" aria-label="${esc(g.title)}"><div class="reveal"><div class="dino-in">
  <p class="dino-hint mono"><span class="m-only">${esc(g.hint.touch)}</span><span class="d-only">${esc(g.hint.keys)}</span></p>
  <div class="dino-field" tabindex="0" role="application" aria-label="${esc(g.label)}" data-state="idle" data-focus="false" data-ring="false">
    <canvas width="1200" height="300" aria-hidden="true"></canvas>
    <div class="dino-score">00000</div>
    <div class="dino-say">
      <p class="dino-title"><span data-say="idle">${esc(g.title)}</span><span data-say="over">${esc(g.over)}</span></p>
      <p class="dino-sub mono"><span class="m-only"><span data-say="idle">${esc(g.start.touch)}</span><span data-say="over">${esc(g.again.touch)}</span></span><span class="d-only"><span data-say="idle over-blur">${esc(g.start.pointer)}</span><span data-say="over-focus">${esc(g.again.keys)}</span></span></p>
    </div>
  </div>
</div></div></section>`;
};

export const gameScript = `
  // ── Dino Runner: live's game, ported as-is ──
  (() => {
    const INK = '#14140F', MARK = '#D6D5DE', SKY = '#F0EFF4';
    const BODY = ["...........XXXXXXX..","...........XXXXXXXX.","...........XX..XXXX.","...........XXXXXXXX.","...........XXXXXXXX.","...........XXXXX....","...........XXXXXXX..","X..........XXXXX....","XX.........XXXXX....","XXX.......XXXXXX....","XXXX.....XXXXXXX....","XXXXX...XXXXXXXX....",".XXXXXXXXXXXXXXX....","..XXXXXXXXXXXXXX....","...XXXXXXXXXXXXX....","....XXXXXXXXXXX.....",".....XXXXXXXXXX.....","......XXXXXXXX......"];
    const LEG1 = ["......XXXXXX........","......XX.XXX........","......XX.XXX........",".....XXX..XXX......."];
    const LEG2 = ["......XXXXXX........","......XXX.XX........",".....XXX..XX........","....XXX....XX......."];
    const STAND = ["......XXXXXX........","......XX.XXX........","......XX.XXX........","......XX..XXX......."];
    const BIRD1 = [".......XX.........","......XXXX........",".....XXXXXX.......","....XXXXXXXX......","...XXXXXXXXX......","..XXXXXXXXXX......","....XXXXXXXXXXXXXX","....XXXXXXXXXXX...",".....XXXXXXX......","......XXXX........"];
    const BIRD2 = ["...........XXXXXXX","....XXXXXXXXXXXXXX","....XXXXXXXXXX....",".....XXXXXXX......","......XXXXX.......",".......XXXX.......","........XXX.......",".......XXXX.......","......XXXXXX......",".....XXXXXXXX....."];
    const CACT_S = ["....XX.....","....XX.....","X...XX.....","X...XX...X.","X...XX...X.","XX..XX...X.",".XXXXX..XX.","....XXXXX..","....XX.....","....XX.....","....XX.....","....XX.....","....XX.....","....XX.....","....XX.....","....XX....."];
    const CACT_L = [".....XX......",".....XX......","X....XX......","X....XX......","X....XX...X..","X....XX...X..","XX...XX...X..",".XX..XX..XX..","..XXXXXXXX...",".....XX......",".....XX......",".....XX......",".....XX......",".....XX......",".....XX......",".....XX......",".....XX......",".....XX......",".....XX......",".....XX......",".....XX......",".....XX......"];
    const sprite = rows => { const c = document.createElement('canvas'); c.width = rows[0].length; c.height = rows.length; const x = c.getContext('2d'); x.fillStyle = INK;
      rows.forEach((r, y) => { for (let i = 0; i < r.length; i++) if (r[i] !== '.') x.fillRect(i, y, 1, 1); }); return c; };
    const SPR = { run: [sprite(BODY.concat(LEG1)), sprite(BODY.concat(LEG2))], still: sprite(BODY.concat(STAND)), bird: [sprite(BIRD1), sprite(BIRD2)], cactusS: sprite(CACT_S), cactusL: sprite(CACT_L) };
    const beep = (ac, f, d, v = .04) => { if (!ac) return; const o = ac.createOscillator(), g = ac.createGain(); o.type = 'square'; o.frequency.value = f;
      g.gain.setValueAtTime(v, ac.currentTime); g.gain.exponentialRampToValueAtTime(1e-4, ac.currentTime + d); o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + d); };

    const field = document.querySelector('.dino-field'); if (!field) return;
    const cv = field.querySelector('canvas'), ctx = cv.getContext('2d'), scoreEl = field.querySelector('.dino-score');
    let G = 400, state = 'idle', focused = false, fromPointer = false, ac = null, g = null, raf = 0;
    const setState = s => { state = s; field.dataset.state = s; };
    const setScore = n => { scoreEl.textContent = String(n).padStart(5, '0'); };
    function fresh() {
      g = { speed: 3.4, dist: 0, score: 0, y: 0, vy: 0, holding: false, obstacles: [], spawnIn: 220,
        clouds: Array.from({ length: 5 }, () => ({ x: Math.random() * G, y: 10 + 34 * Math.random(), w: 10 + Math.floor(14 * Math.random()) })),
        marks: Array.from({ length: 26 }, () => ({ x: Math.random() * G, w: 2 + Math.floor(4 * Math.random()) })),
        legTimer: 0, legFrame: 0, wingTimer: 0, wingFrame: 0, shake: 0 };
      setScore(0);
    }
    function draw() {
      if (!g) return;
      const x = ctx; x.setTransform(3, 0, 0, 3, 0, 0); x.imageSmoothingEnabled = false; x.fillStyle = SKY; x.fillRect(0, 0, G, 100);
      const sh = g.shake > 0 ? (Math.random() < .5 ? -1 : 1) : 0;
      x.save(); x.translate(sh, 0); x.fillStyle = MARK;
      for (const c of g.clouds) { const t = Math.round(c.x), r = Math.round(c.y); x.fillRect(t + 2, r, c.w - 4, 1); x.fillRect(t, r + 1, c.w, 2); x.fillRect(t + 3, r + 3, c.w - 6, 1); }
      x.fillStyle = INK; x.fillRect(0, 99, G, 1); x.fillStyle = MARK;
      for (const m of g.marks) x.fillRect(Math.round(m.x), 99, m.w, 1);
      for (const o of g.obstacles) {
        if (o.kind === 'bird') x.drawImage(SPR.bird[g.wingFrame], Math.round(o.x), Math.round(o.y));
        else { const t = o.kind === 'large' ? SPR.cactusL : SPR.cactusS; for (let r = 0; r < o.count; r++) x.drawImage(t, Math.round(o.x) + r * (t.width + 2), 99 - t.height); }
      }
      const s = state !== 'running' || g.y > 0 ? SPR.still : SPR.run[g.legFrame];
      x.drawImage(s, 24, 99 - s.height - Math.round(g.y)); x.restore();
    }
    function size() { const w = Math.max(360, Math.min(720, Math.round(field.clientWidth / 3))); if (w !== G || cv.width !== 3 * w) { G = w; cv.width = 3 * G; cv.height = 300; draw(); } }
    const audio = () => { if (!ac) { const A = window.AudioContext || window.webkitAudioContext; if (A) ac = new A(); } if (ac && ac.state === 'suspended') ac.resume(); };
    function press() {
      if (!g) return;
      if (state !== 'running') { audio(); fresh(); setState('running'); loop(); return; }
      if (!(g.y > 0)) { g.vy = -6.4; g.holding = true; beep(ac, 660, .07); }
    }
    const release = () => { if (g) g.holding = false; };
    function loop() {
      let last = performance.now();
      const step = r => {
        const A = g; if (!A || state !== 'running') return;
        const n = Math.min((r - last) / (1000 / 60), 3); last = r;
        A.speed = Math.min(9.5, A.speed + .0016 * n);
        const i = A.speed * n; A.dist += i;
        const D = Math.floor(A.dist / 6);
        if (D !== A.score) { if (D > 0 && D % 100 === 0) beep(ac, 880, .09, .03); A.score = D; setScore(D); }
        if (A.y > 0 || A.vy < 0) { const e = A.holding && A.vy < 0 ? .34 : .5; A.vy += e * n; A.y -= A.vy * n; if (A.y <= 0) { A.y = 0; A.vy = 0; } }
        A.legTimer += n; if (A.legTimer > Math.max(3, 9 - A.speed)) { A.legTimer = 0; A.legFrame = +(A.legFrame === 0); }
        A.wingTimer += n; if (A.wingTimer > 10) { A.wingTimer = 0; A.wingFrame = +(A.wingFrame === 0); }
        for (const c of A.clouds) { c.x -= .22 * i; if (c.x < -30) { c.x = G + 40 * Math.random(); c.y = 10 + 34 * Math.random(); } }
        for (const m of A.marks) { m.x -= i; if (m.x < -8) { m.x = G + 60 * Math.random(); m.w = 2 + Math.floor(4 * Math.random()); } }
        A.spawnIn -= i;
        if (A.spawnIn <= 0) {
          A.spawnIn = 120 + 22 * A.speed + 90 * Math.random();
          const e = Math.random();
          if (A.score > 260 && e < .24) A.obstacles.push({ kind: 'bird', x: G + 10, y: 81 });
          else if (e < .62) A.obstacles.push({ kind: 'small', x: G + 10, count: 1 + Math.floor(3 * Math.random()), w: 11, h: 16 });
          else A.obstacles.push({ kind: 'large', x: G + 10, count: 1 + Math.floor(2 * Math.random()), w: 13, h: 22 });
        }
        for (const o of A.obstacles) o.x -= i;
        A.obstacles = A.obstacles.filter(o => o.x > -80);
        const d = { x: 28, y: 77 - A.y, w: 12, h: 20 }; let hit = false;
        for (const o of A.obstacles) {
          const t = o.kind === 'bird' ? { x: o.x + 2, y: o.y + 2, w: 14, h: 7 } : { x: o.x + 2, y: 99 - o.h + 1, w: o.count * (o.w + 2) - 6, h: o.h - 2 };
          if (d.x < t.x + t.w && d.x + d.w > t.x && d.y < t.y + t.h && d.y + d.h > t.y) { hit = true; break; }
        }
        if (A.shake > 0) A.shake -= n;
        if (hit) { A.shake = 8; beep(ac, 200, .16, .05); setTimeout(() => beep(ac, 120, .22, .05), 90); draw(); setState('over'); return; }
        draw(); raf = requestAnimationFrame(step);
      };
      cancelAnimationFrame(raf); raf = requestAnimationFrame(step);
    }
    const KEYS = [' ', 'Spacebar', 'ArrowUp', 'w', 'W', 'Enter'];
    addEventListener('keydown', e => { if (focused && !e.repeat && KEYS.includes(e.key)) { e.preventDefault(); press(); } }, { passive: false });
    addEventListener('keyup', e => { if (KEYS.includes(e.key)) release(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'running') { setState('over'); draw(); } });
    field.addEventListener('focus', () => { focused = true; field.dataset.focus = 'true'; field.dataset.ring = String(!fromPointer); fromPointer = false; });
    field.addEventListener('blur', () => { focused = false; field.dataset.focus = 'false'; field.dataset.ring = 'false'; });
    field.addEventListener('pointerdown', () => { fromPointer = true; field.focus(); audio(); press(); });
    field.addEventListener('pointerup', release); field.addEventListener('pointerleave', release);
    new ResizeObserver(size).observe(field);
    fresh(); size(); draw();
  })();
`;
