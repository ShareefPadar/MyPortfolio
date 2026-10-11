/**
 * ERA · now — the home page's easter egg: GLASS MERGE, a merge game (Shareef's pick, over Five).
 * 1995 → Now: live's Dino Runner has no box — the page is its sky and the footer's top edge is its ground.
 * Here the orbs fall over the page background with no panel behind them, the footer panel is the bottom of the jar,
 * and the jar's two walls rise straight out of it. Colours follow light / dark through CSS custom properties. Two orbs of a size merge into the next; keep the pile under the line.
 *   gameMarkup(c) → the hint line + the field (last thing in the page, directly on the footer)
 *   gameScript    → runs inside the layout's script, after gameJS (gameField) is defined
 * Text comes from content.games.now; the canvas draws only shapes.
 */
import { esc } from './layout.mjs';

export const gameMarkup = c => {
  const g = c.games.now;
  return `
  <section class="merge" aria-label="${esc(g.title)}">
    <p class="merge-hint"><span data-input="keys">${esc(g.hint.keys)}</span><span data-input="touch">${esc(g.hint.touch)}</span></p>
    <div class="merge-field" data-game tabindex="0" role="application" aria-label="${esc(g.label)}">
      <canvas aria-hidden="true"></canvas>
      <div class="merge-score" data-score>0</div>
      <div class="merge-say">
        <p class="say-title"><span data-say="idle">${esc(g.title)}</span><span data-say="over">${esc(g.over)}</span></p>
        <p class="say-sub"><span data-say="idle-pointer over-pointer">${esc(g.start.pointer)}</span><span data-say="idle-touch">${esc(g.start.touch)}</span><span data-say="over-keys">${esc(g.again.keys)}</span><span data-say="over-touch">${esc(g.again.touch)}</span></p>
      </div>
    </div>
  </section>`;
};

export const gameScript = `
  // ── GLASS MERGE: the footer panel is the jar's floor, and its walls rise out of it ──
  (() => {
    const COL = ['#CDF22B', '#22D3EE', '#7C5CFF', '#FF5FA2', '#FFB547', '#4ADE80', '#5B8CFF', '#F5F6FF'], BASE = [14, 19, 25, 32, 40, 49, 59, 70];
    const hexA = (h, a) => { const v = parseInt(h.slice(1), 16); return 'rgba(' + (v >> 16 & 255) + ',' + (v >> 8 & 255) + ',' + (v & 255) + ',' + a + ')'; };
    const rnd = n => Math.floor(Math.random() * n), clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    function rr(x, X, Y, w, h, r) { x.beginPath(); if (x.roundRect) x.roundRect(X, Y, w, h, r); else x.rect(X, Y, w, h); }
    function orb(x, X, Y, R, col, a = 1) {
      if (R <= 0) return; x.globalAlpha = a;
      x.save(); x.shadowColor = hexA(col, .5); x.shadowBlur = R * .7;
      const g = x.createRadialGradient(X - R * .35, Y - R * .4, R * .08, X, Y, R);
      g.addColorStop(0, 'rgba(255,255,255,.85)'); g.addColorStop(.38, hexA(col, .5)); g.addColorStop(1, hexA(col, .88));
      x.beginPath(); x.arc(X, Y, R, 0, Math.PI * 2); x.fillStyle = g; x.fill(); x.restore();
      x.lineWidth = 1.2; x.strokeStyle = 'rgba(255,255,255,.45)'; x.beginPath(); x.arc(X, Y, Math.max(0, R - .6), 0, Math.PI * 2); x.stroke();
      x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.ellipse(X - R * .32, Y - R * .52, R * .3, R * .14, -0.5, 0, Math.PI * 2); x.fill();
      x.globalAlpha = 1;
    }
    const field = document.querySelector('.merge-field');
    let WALL = 'rgba(60,60,67,.2)', GUIDE = 'rgba(60,60,67,.3)';
    const theme = () => { const cs = getComputedStyle(field), v = n => cs.getPropertyValue(n).trim();
      WALL = v('--merge-wall') || WALL; GUIDE = v('--outline') || GUIDE; COL[7] = v('--merge-top') || COL[7]; };
    theme(); matchMedia('(prefers-color-scheme: dark)').addEventListener('change', theme);
    gameField(field, api => {
      let W = 0, H = 0, L = 0, RT = 0, TOPW = 0, LINE = 0, DROPY = 0, SZ = BASE, s = null, keys = {};
      function layout() { const JW = Math.min(W - 24, 460); L = (W - JW) / 2; RT = L + JW; SZ = BASE.map(r => r * JW / 360); TOPW = Math.max(84, H * .22); LINE = TOPW + 6; DROPY = TOPW - 40; }
      function fresh(demo) {
        s = { orbs: [], aim: W / 2, cur: rnd(3), next: rnd(4), cool: 0, score: 0, overT: 0, t: 0 };
        if (demo) [3, 0, 4, 1, 2].forEach((k, i) => s.orbs.push({ x: L + (RT - L) * (i + .5) / 5, y: H - SZ[k], vx: 0, vy: 0, r: SZ[k], k, born: -9, pop: 0 }));   // a few orbs resting on the footer
        api.score(0);
      }
      function drop() {
        if (api.state !== 'running' || s.cool > 0) return;
        const r = SZ[s.cur]; s.orbs.push({ x: clamp(s.aim, L + r, RT - r), y: DROPY, vx: 0, vy: 0, r, k: s.cur, born: s.t, pop: 0 });
        s.cur = s.next; s.next = rnd(4); s.cool = .45; api.tone(300, .06, 'triangle', .04, 200);
      }
      function physics(dt) {
        const n = 4, h = dt / n, born = [];
        for (let it = 0; it < n; it++) {
          for (const o of s.orbs) {
            o.vy += 1500 * h; o.x += o.vx * h; o.y += o.vy * h; o.vx *= .999;
            if (o.x - o.r < L) { o.x = L + o.r; o.vx = Math.abs(o.vx) * .3; } if (o.x + o.r > RT) { o.x = RT - o.r; o.vx = -Math.abs(o.vx) * .3; }
            if (o.y + o.r > H) { o.y = H - o.r; o.vy = -Math.abs(o.vy) * .15; o.vx *= .96; }               // the footer is the floor
          }
          for (let i = 0; i < s.orbs.length; i++) { const a = s.orbs[i]; if (a.dead) continue;
            for (let j = i + 1; j < s.orbs.length; j++) { const b = s.orbs[j]; if (b.dead) continue;
              const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .01, min = a.r + b.r; if (d >= min) continue;
              if (a.k === b.k && a.k < SZ.length - 1 && api.state === 'running') {
                a.dead = b.dead = true; const k2 = a.k + 1;
                born.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, vx: (a.vx + b.vx) / 2, vy: -120, r: SZ[k2], k: k2, born: s.t, pop: 1 });
                s.score += (k2 + 1) * (k2 + 1) * 2; api.score(s.score); api.tone(440 * Math.pow(1.122, k2), .12, 'sine', .05); break;
              }
              const nx = dx / d, ny = dy / d, ov = min - d, ma = a.r * a.r, mb = b.r * b.r, tot = ma + mb;
              a.x -= nx * ov * mb / tot; a.y -= ny * ov * mb / tot; b.x += nx * ov * ma / tot; b.y += ny * ov * ma / tot;
              const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
              if (rv < 0) { const jm = -1.15 * rv / (1 / ma + 1 / mb); a.vx -= jm * nx / ma; a.vy -= jm * ny / ma; b.vx += jm * nx / mb; b.vy += jm * ny / mb; } } }
          if (born.length || s.orbs.some(o => o.dead)) { s.orbs = s.orbs.filter(o => !o.dead).concat(born); born.length = 0; }
        }
      }
      return {
        reset: () => { if (W) fresh(true); },
        resize(w, h, changed) { W = w; H = h; layout(); if (!s || changed) { fresh(true); if (api.state === 'running') api.set('idle'); } },
        start() { fresh(false); },
        startKey: e => [' ', 'Enter', 'ArrowUp', 'ArrowDown'].includes(e.key),
        key(e, down) {
          const k = { ArrowLeft: 'l', a: 'l', A: 'l', ArrowRight: 'r', d: 'r', D: 'r' }[e.key];
          if (k) { keys[k] = down; return true; }
          if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') { if (down && !e.repeat) drop(); return true; }
          return false;
        },
        blur() { keys = {}; },
        pointer(type, px) { if (type !== 'cancel') s.aim = px; if (type === 'up') drop(); },
        update(dt) {
          if (!s) return;
          s.t += dt; if (s.cool > 0) s.cool -= dt;
          if (keys.l) s.aim -= 320 * dt; if (keys.r) s.aim += 320 * dt; s.aim = clamp(s.aim, L + SZ[s.cur], RT - SZ[s.cur]);
          if (api.state === 'over') return;
          physics(dt);
          for (const o of s.orbs) if (o.pop) o.pop = Math.max(0, o.pop - dt * 4);
          if (api.state !== 'running') return;
          const danger = s.orbs.some(o => s.t - o.born > 1.2 && o.y - o.r < LINE);
          s.overT = danger ? s.overT + dt : 0;
          if (s.overT > 1.6) { api.set('over'); api.tone(330, .5, 'sine', .05, 90); }
        },
        draw(x) {
          if (!s) return;
          // the jar: two walls rising out of the footer panel, in the system separator colour
          x.fillStyle = WALL;
          for (const wx of [L - 6, RT]) { rr(x, wx, TOPW, 6, H - TOPW + 8, [3, 3, 0, 0]); x.fill(); }
          x.setLineDash([5, 7]); x.strokeStyle = s.overT > 0 && Math.floor(s.t * 7) % 2 ? 'rgba(255,95,162,.95)' : 'rgba(255,95,162,.45)'; x.lineWidth = 1.5;
          x.beginPath(); x.moveTo(L, LINE); x.lineTo(RT, LINE); x.stroke(); x.setLineDash([]);
          for (const o of s.orbs) orb(x, o.x, o.y, o.r * (1 + o.pop * .15), COL[o.k]);
          if (api.state !== 'over') {
            x.setLineDash([2, 6]); x.strokeStyle = GUIDE; x.lineWidth = 1; x.beginPath(); x.moveTo(s.aim, DROPY); x.lineTo(s.aim, H); x.stroke(); x.setLineDash([]);
            orb(x, s.aim, DROPY, SZ[s.cur], COL[s.cur], s.cool > 0 ? .35 : 1);
          }
          orb(x, RT - 12, TOPW - 16, 7, COL[s.next], .9);                                  // what comes next
        },
      };
    });
  })();
`;
