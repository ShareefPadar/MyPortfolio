/**
 * ERA · 1986 — the home page's easter egg: SHIP THE BACKLOG, a brick breaker.
 * 1995 → 1986: live's Dino Runner has no box — the page is its sky and the footer's top edge is its ground.
 * Here the navy screen is the field, the wall is the backlog (tickets with punched ends), and the paddle rides
 * the top border of the CONTINUE? box. Drop the ball and that border flashes red.
 *   gameMarkup(c) → the hint line + the field (sits between <main> and the footer, same width as the footer box)
 *   gameScript    → runs inside the layout's script, after gameJS (gameField) is defined
 * Text comes from content.games['1986']; the canvas draws only shapes.
 */
import { esc } from './layout.mjs';

export const gameMarkup = c => {
  const g = c.games['1986'];
  return `  <section class="arcade" aria-label="${esc(g.title)}">
    <p class="arcade-hint"><span data-input="keys">${esc(g.hint.keys)}</span><span data-input="touch">${esc(g.hint.touch)}</span></p>
    <div class="arcade-field" data-game data-pad="5" tabindex="0" role="application" aria-label="${esc(g.label)}">
      <canvas aria-hidden="true"></canvas>
      <div class="arcade-score" data-score>00000</div>
      <div class="arcade-say">
        <p class="say-title"><span data-say="idle">${esc(g.title)}</span><span data-say="over">${esc(g.over)}</span></p>
        <p class="say-sub"><span data-say="idle-pointer over-pointer">${esc(g.start.pointer)}</span><span data-say="idle-touch">${esc(g.start.touch)}</span><span data-say="over-keys">${esc(g.again.keys)}</span><span data-say="over-touch">${esc(g.again.touch)}</span></p>
      </div>
    </div>
  </section>`;
};

export const gameScript = `
  // ── SHIP THE BACKLOG: brick breaker on top of the CONTINUE? box ──
  (() => {
    const foot = document.querySelector('footer.continue');
    const C = { bg: '#15153A', fg: '#F2F2FF', mut: '#A6A6E0', lime: '#CDF22B', cyan: '#3CC8FF', red: '#FF6F61', line: '#34347A' };
    const ROWS = [C.red, C.lime, C.cyan, C.fg, C.mut];
    const flash = ms => { if (!foot) return; foot.classList.add('hit'); clearTimeout(flash.t); flash.t = setTimeout(() => foot.classList.remove('hit'), ms); };
    gameField(document.querySelector('.arcade-field'), api => {
      let W = 0, H = 0, P = 4, s = null, keys = {}, aimX = null;
      const pxs = v => v / P;                       // css px → game units
      const speed = () => pxs(230) * (1 + (s.level - 1) * .12) * (1 + Math.min(s.hits, 30) * .006);
      function wall() {
        const bw0 = P === 4 ? 18 : 14, cols = Math.max(6, Math.round((W + 1) / (bw0 + 1))), bw = Math.floor((W - (cols - 1)) / cols);
        const ox = Math.floor((W - (cols * bw + cols - 1)) / 2), bricks = [];
        ROWS.forEach((col, r) => { for (let i = 0; i < cols; i++) bricks.push({ x: ox + i * (bw + 1), y: 9 + r * 5, w: bw, h: 4, col, hp: s.level > 1 && r === 0 ? 2 : 1, born: r * .07 }); });
        s.bricks = bricks; s.wallT = 0;
      }
      function dock() { const b = s.ball; b.stuck = true; b.vx = b.vy = 0; }
      function fresh() {
        s = { level: 1, score: 0, lives: 3, hits: 0, pad: { x: 0, w: Math.round(pxs(P === 4 ? 96 : 84)) }, ball: { x: 0, y: 0, vx: 0, vy: 0, stuck: true }, bricks: [], bits: [], wallT: 0 };
        s.pad.x = Math.round((W - s.pad.w) / 2); wall(); dock(); api.score(0);
      }
      function launch() {
        const b = s.ball; if (!b.stuck) return;
        const a = -Math.PI / 2 + (Math.random() - .5) * .9, v = speed(); b.stuck = false; b.vx = Math.cos(a) * v; b.vy = Math.sin(a) * v;
        api.tone(523, .05);
      }
      function lose() {
        s.lives--; flash(s.lives > 0 ? 260 : 900);
        api.tone(196, .14, 'square', .045, 98);
        if (s.lives <= 0) { api.set('over'); return; }
        dock();
      }
      function hit(br, b) {
        br.hp--; s.hits++; const done = br.hp <= 0; s.score += done ? 10 * s.level : 5; api.score(s.score);
        api.tone(done ? 660 + (4 - ROWS.indexOf(br.col)) * 70 : 392, .045);
        if (done) for (let i = 0; i < 6; i++) s.bits.push({ x: br.x + Math.random() * br.w, y: br.y + Math.random() * br.h, vx: (Math.random() - .5) * 40, vy: -Math.random() * 30, t: 0, col: br.col });
      }
      return {
        unit: w => (P = w >= 600 ? 4 : 3),             // one 8-bit pixel = 4 css px (3 on phones)
        reset: () => { if (W) fresh(); },
        resize(w, h, changed) { W = Math.floor(w); H = Math.floor(h); if (!s || changed) { fresh(); if (api.state === 'running') api.set('idle'); } },
        start() { fresh(); launch(); },
        startKey: e => [' ', 'Enter', 'ArrowUp'].includes(e.key),
        key(e, down) {
          const k = { ArrowLeft: 'l', a: 'l', A: 'l', ArrowRight: 'r', d: 'r', D: 'r' }[e.key];
          if (k) { keys[k] = down; aimX = null; return true; }
          if (down && (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'Enter')) { launch(); return true; }
          return false;
        },
        blur() { keys = {}; },
        pointer(type, x) { if (type === 'move' || type === 'down') aimX = x; if (type === 'down' && api.state === 'running') launch(); },
        update(dt) {
          if (!s) return;
          s.wallT += dt;
          for (const p of s.bits) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 120 * dt; }
          s.bits = s.bits.filter(p => p.t < .45);
          const p = s.pad, b = s.ball;
          if (aimX != null) p.x = aimX - p.w / 2;
          if (api.state === 'running') { const v = pxs(420) * dt; if (keys.l) p.x -= v; if (keys.r) p.x += v; }
          p.x = Math.max(0, Math.min(W - p.w, p.x));
          if (b.stuck) { b.x = p.x + p.w / 2 - 1; b.y = H - 4; return; }
          if (api.state !== 'running') return;
          const n = 6;
          for (let i = 0; i < n; i++) {
            b.x += b.vx * dt / n; b.y += b.vy * dt / n;
            if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx); api.tone(330, .03); }
            if (b.x > W - 2) { b.x = W - 2; b.vx = -Math.abs(b.vx); api.tone(330, .03); }
            if (b.y < 0) { b.y = 0; b.vy = Math.abs(b.vy); api.tone(330, .03); }
            if (b.vy > 0 && b.y + 2 >= H - 2 && b.y + 2 <= H && b.x + 2 > p.x && b.x < p.x + p.w) {
              const h = Math.max(-1, Math.min(1, (b.x + 1 - (p.x + p.w / 2)) / (p.w / 2))), a = -Math.PI / 2 + h * 1.05, v = speed();
              b.vx = Math.cos(a) * v; b.vy = Math.sin(a) * v; b.y = H - 4; api.tone(440, .04);
            }
            for (const br of s.bricks) {
              if (br.hp <= 0 || b.x + 2 <= br.x || b.x >= br.x + br.w || b.y + 2 <= br.y || b.y >= br.y + br.h) continue;
              const ox = Math.min(b.x + 2 - br.x, br.x + br.w - b.x), oy = Math.min(b.y + 2 - br.y, br.y + br.h - b.y);
              if (ox < oy) b.vx = -b.vx; else b.vy = -b.vy;
              hit(br, b); break;
            }
            if (b.y > H) { lose(); return; }
          }
          if (s.bricks.every(br => br.hp <= 0)) {            // backlog shipped: a fresh wall, a little faster
            s.level++; s.score += 100; api.score(s.score); wall(); dock();
            [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => api.tone(f, .08), i * 80));
          }
        },
        draw(x) {
          if (!s) return;
          for (let i = 0; i < s.lives; i++) { x.fillStyle = C.cyan; x.fillRect(i * 6, 2, 4, 2); }   // lives: spare paddles
          for (const br of s.bricks) {
            if (br.hp <= 0 || s.wallT < br.born) continue;
            x.fillStyle = br.col; x.fillRect(br.x, br.y, br.w, br.h);
            x.fillStyle = 'rgba(10,10,30,.45)'; x.fillRect(br.x, br.y + br.h - 1, br.w, 1);
            x.fillStyle = C.bg; x.fillRect(br.x, br.y + 1, 1, 2); x.fillRect(br.x + br.w - 1, br.y + 1, 1, 2);   // punched ticket ends
            if (br.hp > 1) { x.fillStyle = C.bg; x.fillRect(br.x + 2, br.y + 1, br.w - 4, 1); }
          }
          for (const p of s.bits) { x.fillStyle = p.col; x.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); }
          const p = s.pad, px = Math.round(p.x);
          x.fillStyle = C.cyan; x.fillRect(px, H - 2, p.w, 2);
          x.fillStyle = C.lime; x.fillRect(px, H - 2, 2, 2); x.fillRect(px + p.w - 2, H - 2, 2, 2);
          x.fillStyle = C.fg; x.fillRect(Math.round(s.ball.x), Math.round(s.ball.y), 2, 2);
        },
      };
    });
  })();
`;
