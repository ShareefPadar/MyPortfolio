/**
 * ERA · 2014 — the home page's easter egg: PAPER PLANE, a one-tap flyer.
 * 1995 → 2014: live's Dino Runner has no box — the page is its sky and the footer's top edge is its ground.
 * Here the grey band is the sky and the navy footer is the ground: the bottom pillars grow straight out of it
 * (same navy, lime caps, flat long shadows), and a crashed plane drops onto it. Full width, like live.
 *   gameMarkup(c) → the hint line + the field (last thing in <main>, directly on the footer)
 *   gameScript    → runs inside the layout's script, after gameJS (gameField) is defined
 * Text comes from content.games['2014']; the canvas draws only shapes.
 */
import { esc } from './layout.mjs';

export const gameMarkup = c => {
  const g = c.games['2014'];
  return `  <section class="flyband" aria-label="${esc(g.title)}">
    <div class="wrap"><p class="fly-hint"><span data-input="keys">${esc(g.hint.keys)}</span><span data-input="touch">${esc(g.hint.touch)}</span></p></div>
    <div class="fly-field" data-game tabindex="0" role="application" aria-label="${esc(g.label)}">
      <canvas aria-hidden="true"></canvas>
      <div class="fly-score" data-score>0</div>
      <div class="fly-say">
        <p class="say-title"><span data-say="idle">${esc(g.title)}</span><span data-say="over">${esc(g.over)}</span></p>
        <p class="say-sub"><span data-say="idle-pointer over-pointer">${esc(g.start.pointer)}</span><span data-say="idle-touch">${esc(g.start.touch)}</span><span data-say="over-keys">${esc(g.again.keys)}</span><span data-say="over-touch">${esc(g.again.touch)}</span></p>
      </div>
    </div>
  </section>`;
};

export const gameScript = `
  // ── PAPER PLANE: pillars grow out of the navy footer ──
  (() => {
    const NAVY = '#1E3A5F', LIME = '#CDF22B', BLUE = '#1668C4', SHADE = 'rgba(30,58,95,.09)';
    gameField(document.querySelector('.fly-field'), api => {
      let W = 0, H = 0, PX = 80, GAP = 130, PW = 64, SPACE = 280, K = 1, s = null, t = 0;
      const clouds = [];
      function fresh() {
        s = { y: H * .42, vy: 0, pil: [], next: 0, score: 0, speed: 170, trail: [], rot: 0 };
        api.score(0);
      }
      function flap() { if (api.state !== 'running') return; s.vy = -(H < 320 ? 360 : 410); api.tone(520, .07, 'triangle', .05, 700); }
      function crash() { api.set('over'); s.vy = Math.min(s.vy, 0) - 80; api.tone(160, .3, 'sawtooth', .03, 60); }
      function longShadow(x, x2, y1, y2, L) { x.beginPath(); x.moveTo(x2, y1); x.lineTo(x2 + L, y1 + L); x.lineTo(x2 + L, y2 + L); x.lineTo(x2, y2); x.closePath(); x.fill(); }
      return {
        reset: () => { if (W) fresh(); },
        resize(w, h, changed) {
          W = w; H = h; PX = W < 600 ? 44 : Math.min(260, W * .18); GAP = H < 320 ? 118 : 132; PW = W < 600 ? 52 : 64; SPACE = W < 600 ? 230 : 290; K = W < 600 ? 1 : 1.25;   // plane size
          clouds.length = 0; for (let i = 0; i < Math.ceil(W / 220) + 1; i++) clouds.push({ x: i * 220 + Math.random() * 120, y: 16 + Math.random() * (H * .45), w: 60 + Math.random() * 70 });
          if (!s || changed) { fresh(); if (api.state === 'running') api.set('idle'); }
        },
        start() { fresh(); flap(); },
        key(e, down) { if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'Enter') { if (down && !e.repeat) flap(); return true; } return false; },
        pointer(type) { if (type === 'down') flap(); },
        update(dt) {
          if (!s) return; t += dt;
          const run = api.state === 'running';
          for (const c of clouds) { c.x -= (run ? 26 : 10) * dt; if (c.x + c.w < -20) { c.x = W + Math.random() * 80; c.y = 16 + Math.random() * (H * .45); } }
          if (api.state === 'idle') { s.y = H * .42 + Math.sin(t * 2.6) * 7; s.rot = Math.sin(t * 2.6 + 1) * .06; return; }
          // gravity runs while flying and after a crash (the plane drops onto the footer)
          s.vy = Math.min(s.vy + (H < 320 ? 1350 : 1500) * dt, 640); s.y += s.vy * dt;
          if (s.y < 6) { s.y = 6; s.vy = Math.max(0, s.vy); }
          if (s.y > H - 7) { s.y = H - 7; s.vy = 0; if (run) crash(); }
          s.rot = Math.max(-.45, Math.min(api.state === 'over' && s.y >= H - 7 ? .25 : .9, s.vy / 650));
          if (!run) return;
          s.speed = Math.min(270, 170 + s.score * 3);
          s.next -= s.speed * dt;
          if (s.next <= 0) { const m = 34, mid = m + GAP / 2 + Math.random() * (H - GAP - 2 * m); s.pil.push({ x: W + 20, top: mid - GAP / 2, bot: mid + GAP / 2, passed: false }); s.next = SPACE; }
          for (const p of s.pil) { p.x -= s.speed * dt; if (!p.passed && p.x + PW < PX - 12) { p.passed = true; s.score++; api.score(s.score); api.tone(880, .06, 'sine', .05); } }
          s.pil = s.pil.filter(p => p.x + PW + 200 > 0);
          s.trail.push([PX - 14 * K, s.y]); if (s.trail.length > 26) s.trail.shift();
          for (const p of s.trail) p[0] -= s.speed * dt;
          for (const p of s.pil) if (PX + 12 * K > p.x && PX - 14 * K < p.x + PW && (s.y - 6 * K < p.top || s.y + 6 * K > p.bot)) return crash();
        },
        draw(x) {
          if (!s) return;
          x.fillStyle = 'rgba(255,255,255,.75)';
          for (const c of clouds) { x.beginPath(); x.roundRect ? x.roundRect(c.x, c.y, c.w, 14, 7) : x.rect(c.x, c.y, c.w, 14); x.fill(); x.beginPath(); x.arc(c.x + c.w * .38, c.y + 2, 11, 0, Math.PI * 2); x.fill(); }
          x.fillStyle = SHADE;
          for (const p of s.pil) { longShadow(x, p.x + PW, 0, p.top, 160); longShadow(x, p.x + PW, p.bot, H, 160); }
          for (const p of s.pil) {
            x.fillStyle = NAVY; x.fillRect(p.x, 0, PW, p.top); x.fillRect(p.x, p.bot, PW, H - p.bot + 1);   // the bottom one runs into the footer
            x.fillStyle = LIME; x.fillRect(p.x, p.top - 8, PW, 8); x.fillRect(p.x, p.bot, PW, 8);
          }
          x.fillStyle = 'rgba(22,104,196,.35)';
          s.trail.forEach((p, i) => { if (i % 3 === 0) { x.beginPath(); x.arc(p[0], p[1], 1.6, 0, Math.PI * 2); x.fill(); } });
          x.save(); x.translate(PX, s.y); x.rotate(s.rot); x.scale(K, K);
          x.fillStyle = 'rgba(30,58,95,.12)'; x.beginPath(); x.moveTo(-14, 6); x.lineTo(22, 1); x.lineTo(30, 18); x.lineTo(-6, 22); x.closePath(); x.fill();   // its own long shadow
          x.fillStyle = BLUE; x.beginPath(); x.moveTo(-16, -8); x.lineTo(20, 0); x.lineTo(-16, 8); x.lineTo(-9, 0); x.closePath(); x.fill();
          x.fillStyle = '#0D4E9C'; x.beginPath(); x.moveTo(-9, 0); x.lineTo(20, 0); x.lineTo(-16, 8); x.closePath(); x.fill();
          x.restore();
        },
      };
    });
  })();
`;
