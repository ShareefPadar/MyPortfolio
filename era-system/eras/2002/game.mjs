/**
 * ERA · 2002 — the home page's easter egg: BUBBLE POP, a bubble shooter.
 * 1995 → 2002: live's Dino Runner has no box — the page is its sky and the footer's top edge is its ground.
 * Here the bubbles hang over the pinstripes from a silver rail, the launcher is a silver gel cradle sitting on the
 * blue gel footer bar, and bubbles that come loose fall into that bar. Same width as the page and the footer bar.
 *   gameMarkup(c) → the hint line + the field (between the page and the footer bar — layout's beforeFooter slot)
 *   gameScript    → runs inside the layout's script, after gameJS (gameField) is defined
 * Text comes from content.games['2002']; the canvas draws only shapes.
 */
import { esc } from './layout.mjs';

export const gameMarkup = c => {
  const g = c.games['2002'];
  return `  <section class="pop" aria-label="${esc(g.title)}">
    <p class="pop-hint"><span data-input="keys">${esc(g.hint.keys)}</span><span data-input="touch">${esc(g.hint.touch)}</span></p>
    <div class="pop-field" data-game tabindex="0" role="application" aria-label="${esc(g.label)}">
      <canvas aria-hidden="true"></canvas>
      <div class="pop-score" data-score>0</div>
      <div class="pop-say">
        <p class="say-title"><span data-say="idle">${esc(g.title)}</span><span data-say="over">${esc(g.over)}</span></p>
        <p class="say-sub"><span data-say="idle-pointer over-pointer">${esc(g.start.pointer)}</span><span data-say="idle-touch">${esc(g.start.touch)}</span><span data-say="over-keys">${esc(g.again.keys)}</span><span data-say="over-touch">${esc(g.again.touch)}</span></p>
      </div>
    </div>
  </section>`;
};

export const gameScript = `
  // ── BUBBLE POP: bubbles hang over the pinstripes; the launcher sits on the gel footer bar ──
  (() => {
    const GEL = [['#9CC4F7', '#1A5DBF'], ['#EEFC9E', '#8FAE12'], ['#FFD08F', '#E0700F'], ['#F9B8D8', '#C2347A'], ['#D4C6F8', '#5A39B8']];
    const NK = GEL.length, PER_DROP = 8, rnd = n => Math.floor(Math.random() * n);
    function ball(x, cx, cy, R, k, a = 1) {
      if (R < .5) return; const [lt, dk] = GEL[k];
      x.globalAlpha = a;
      const g = x.createRadialGradient(cx - R * .35, cy - R * .4, R * .1, cx, cy, R); g.addColorStop(0, lt); g.addColorStop(1, dk);
      x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.fillStyle = g; x.fill(); x.strokeStyle = 'rgba(10,30,70,.25)'; x.lineWidth = 1; x.stroke();
      x.fillStyle = 'rgba(255,255,255,.62)'; x.beginPath(); x.ellipse(cx - R * .08, cy - R * .5, R * .58, R * .28, 0, 0, Math.PI * 2); x.fill();
      x.globalAlpha = 1;
    }
    function rrect(x, X, Y, w, h, r) { x.beginPath(); x.roundRect ? x.roundRect(X, Y, w, h, r) : x.rect(X, Y, w, h); }
    gameField(document.querySelector('.pop-field'), api => {
      let W = 0, H = 0, R = 16, D = 32, RH = 28, COLS = 20, ox = 0, TOP = 10, LIMIT = 0, GX = 0, GY = 0, s = null, keys = {}, held = false;
      const off = r => (r + s.par) % 2 === 1, ncols = r => off(r) ? COLS - 1 : COLS;
      const pos = (r, c) => ({ x: ox + R + c * D + (off(r) ? R : 0), y: TOP + R + r * RH - s.slide });
      const get = (r, c) => (s.grid[r] && s.grid[r][c] != null) ? s.grid[r][c] : null;
      const present = () => { const set = new Set(); for (const row of s.grid) for (const v of row) if (v != null) set.add(v); return [...set]; };
      const pick = () => { const p = present(); return p.length ? p[rnd(p.length)] : rnd(NK); };
      const neigh = (r, c) => (off(r) ? [[0, -1], [0, 1], [-1, 0], [-1, 1], [1, 0], [1, 1]] : [[0, -1], [0, 1], [-1, -1], [-1, 0], [1, -1], [1, 0]])
        .map(([a, b]) => [r + a, c + b]).filter(([a, b]) => a >= 0 && b >= 0 && b < ncols(a));
      function fill(n) { for (let r = 0; r < n; r++) { s.grid[r] = []; for (let c = 0; c < ncols(r); c++) s.grid[r][c] = rnd(NK); } }
      function fresh() {
        s = { score: 0, par: 0, grid: [], shots: 0, ang: -Math.PI / 2, proj: null, fx: [], slide: 0 };
        fill(5); s.cur = pick(); s.next = pick(); api.score(0);
      }
      function shoot() {
        if (api.state !== 'running' || s.proj) return;
        s.proj = { x: GX, y: GY, vx: Math.cos(s.ang) * 950, vy: Math.sin(s.ang) * 950, k: s.cur }; s.cur = s.next; s.next = pick();
        api.tone(260, .08, 'triangle', .05, 420);
      }
      function snap() {
        const p = s.proj; s.proj = null;
        const r0 = Math.max(0, Math.round((p.y + s.slide - TOP - R) / RH));
        let best = null, bd = 1e9;
        for (let r = Math.max(0, r0 - 1); r <= r0 + 1; r++) for (let c = 0; c < ncols(r); c++) {
          if (get(r, c) != null || (r > 0 && !neigh(r, c).some(([a, b]) => get(a, b) != null))) continue;
          const q = pos(r, c), d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2; if (d < bd) { bd = d; best = [r, c]; }
        }
        if (!best) best = [0, Math.max(0, Math.min(ncols(0) - 1, Math.round((p.x - ox - R - (off(0) ? R : 0)) / D)))];
        const [br, bc] = best;
        while (s.grid.length <= br) s.grid.push([]);
        s.grid[br][bc] = p.k; s.shots++;
        const seen = new Set([br + ',' + bc]), q = [[br, bc]], cl = [];
        while (q.length) { const [a, b] = q.pop(); cl.push([a, b]); for (const [na, nb] of neigh(a, b)) { const key = na + ',' + nb; if (!seen.has(key) && get(na, nb) === p.k) { seen.add(key); q.push([na, nb]); } } }
        if (cl.length >= 3) {
          for (const [a, b] of cl) { const q2 = pos(a, b); s.fx.push({ x: q2.x, y: q2.y, k: s.grid[a][b], t: 0, pop: true }); s.grid[a][b] = null; }
          s.score += cl.length * 10; api.tone(880, .07, 'sine', .06, 1320);
          const keep = new Set(), st = [];
          for (let c = 0; c < ncols(0); c++) if (get(0, c) != null) { keep.add('0,' + c); st.push([0, c]); }
          while (st.length) { const [a, b] = st.pop(); for (const [na, nb] of neigh(a, b)) { const key = na + ',' + nb; if (!keep.has(key) && get(na, nb) != null) { keep.add(key); st.push([na, nb]); } } }
          let dropped = 0;
          s.grid.forEach((rw, a) => rw.forEach((v, b) => { if (v != null && !keep.has(a + ',' + b)) { const q2 = pos(a, b); s.fx.push({ x: q2.x, y: q2.y, k: v, t: 0, vy: -60 - Math.random() * 80, vx: (Math.random() - .5) * 60 }); rw[b] = null; dropped++; } }));
          if (dropped) { s.score += dropped * 20; setTimeout(() => api.tone(620, .28, 'sine', .04, 180), 90); }
          api.score(s.score);
        } else api.tone(180, .05, 'triangle', .05);
        while (s.grid.length && !s.grid[s.grid.length - 1].some(v => v != null)) s.grid.pop();
        if (!s.grid.length) {                                         // cleared: bonus, and a fresh set of rows slides in
          s.score += 500; api.score(s.score); s.par = 0; fill(5); s.slide = RH * 5;
          [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => api.tone(f, .1, 'sine', .05), i * 90));
        } else if (s.shots % PER_DROP === 0) { s.par ^= 1; const rw = []; for (let c = 0; c < ncols(0); c++) rw[c] = pick(); s.grid.unshift(rw); s.slide = RH; api.tone(150, .12, 'triangle', .05); }
        for (let a = 0; a < s.grid.length; a++) if (s.grid[a].some(v => v != null) && TOP + R + a * RH + R > LIMIT) { api.set('over'); api.tone(440, .55, 'sine', .05, 110); return; }
        const pr = present(); if (!pr.includes(s.cur)) s.cur = pick(); if (!pr.includes(s.next)) s.next = pick();
      }
      const aim = (px, py) => { if (py < GY - 6) s.ang = Math.max(-Math.PI + .14, Math.min(-.14, Math.atan2(py - GY, px - GX))); };
      return {
        reset: () => { if (W) fresh(); },
        resize(w, h, changed) {
          W = w; H = h; R = Math.max(13, Math.min(17, Math.round(W / 36))); D = R * 2; RH = Math.round(R * 1.74);
          COLS = Math.floor(W / D); ox = (W - COLS * D) / 2; TOP = 10; GX = W / 2; GY = H - 21; LIMIT = H - 56;
          if (!s || changed) { fresh(); if (api.state === 'running') api.set('idle'); }
        },
        key(e, down) {
          const k = { ArrowLeft: 'l', a: 'l', A: 'l', ArrowRight: 'r', d: 'r', D: 'r' }[e.key];
          if (k) { keys[k] = down; return true; }
          if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowUp') { if (down && !e.repeat) shoot(); return true; }
          return false;
        },
        blur() { keys = {}; },
        pointer(type, px, py, e) {
          if (type === 'down') held = true;
          if (type === 'down' || (type === 'move' && (e.pointerType === 'mouse' || held))) aim(px, py);
          if (type === 'up') { held = false; aim(px, py); shoot(); }
          if (type === 'cancel') held = false;
        },
        update(dt) {
          if (!s) return;
          if (keys.l) s.ang -= 1.7 * dt; if (keys.r) s.ang += 1.7 * dt; s.ang = Math.max(-Math.PI + .14, Math.min(-.14, s.ang));
          s.slide = Math.max(0, s.slide - RH * 6 * dt);
          for (const f of s.fx) { f.t += dt; if (!f.pop) { f.vy += 1500 * dt; f.y += f.vy * dt; f.x += f.vx * dt; } }
          s.fx = s.fx.filter(f => f.pop ? f.t < .22 : f.y - R < H);          // loose bubbles fall into the footer bar
          if (api.state !== 'running' || !s.proj) return;
          const p = s.proj;
          for (let i = 0; i < 5; i++) {
            p.x += p.vx * dt / 5; p.y += p.vy * dt / 5;
            if (p.x < ox + R) { p.x = ox + R; p.vx = Math.abs(p.vx); } if (p.x > W - ox - R) { p.x = W - ox - R; p.vx = -Math.abs(p.vx); }
            if (p.y - R <= TOP) { snap(); return; }
            for (let a = 0; a < s.grid.length; a++) for (let b = 0; b < s.grid[a].length; b++) {
              if (s.grid[a][b] == null) continue; const q = pos(a, b);
              if ((q.x - p.x) ** 2 + (q.y - p.y) ** 2 < (D - 5) ** 2) { snap(); return; }
            }
          }
        },
        draw(x) {
          if (!s) return;
          // the rail the bubbles hang from — a silver title bar, like the page's panels
          const rail = x.createLinearGradient(0, 0, 0, TOP); rail.addColorStop(0, '#FFFFFF'); rail.addColorStop(1, '#D6DEEA');
          rrect(x, 0, 0, W, TOP, [0, 0, 5, 5]); x.fillStyle = rail; x.fill(); x.strokeStyle = '#B7C3D3'; x.lineWidth = 1; x.stroke();
          // danger line, just above the cradle
          x.setLineDash([2, 6]); x.strokeStyle = 'rgba(194,52,122,.35)'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, LIMIT); x.lineTo(W, LIMIT); x.stroke(); x.setLineDash([]);
          x.save(); x.beginPath(); x.rect(0, TOP, W, H); x.clip();
          s.grid.forEach((rw, a) => rw.forEach((v, b) => { if (v != null) { const q = pos(a, b); ball(x, q.x, q.y, R - 1, v); } }));
          x.restore();
          for (const f of s.fx) ball(x, f.x, f.y, f.pop ? (R - 1) * (1 + f.t * 2.4) : R - 1, f.k, f.pop ? Math.max(0, 1 - f.t / .22) : 1);
          if (api.state !== 'over') {                                     // aim guide, one bounce
            x.setLineDash([2, 8]); x.strokeStyle = 'rgba(26,93,191,.5)'; x.lineWidth = 2; x.beginPath();
            let px = GX, py = GY, vx = Math.cos(s.ang), vy = Math.sin(s.ang), left = Math.min(380, H * 1.1); x.moveTo(px, py);
            while (left > 0) { const tx = vx < 0 ? (ox + R - px) / vx : (W - ox - R - px) / vx, st = Math.min(left, tx); px += vx * st; py += vy * st; left -= st; x.lineTo(px, py); if (py < TOP + R) break; vx = -vx; }
            x.stroke(); x.setLineDash([]);
          }
          // the cradle: a silver gel sitting on the footer bar
          const cw = 84, ch = 26, cx0 = GX - cw / 2, cy0 = H - ch;
          const gel = x.createLinearGradient(0, cy0, 0, H); gel.addColorStop(0, '#FFFFFF'); gel.addColorStop(.6, '#E9EEF5'); gel.addColorStop(1, '#C9D3E1');
          rrect(x, cx0, cy0, cw, ch + 2, [ch, ch, 0, 0]); x.fillStyle = gel; x.fill(); x.strokeStyle = '#8E9BB0'; x.lineWidth = 1; x.stroke();
          x.fillStyle = 'rgba(255,255,255,.7)'; rrect(x, cx0 + 10, cy0 + 2, cw - 20, 7, 4); x.fill();
          if (s.proj) ball(x, s.proj.x, s.proj.y, R - 1, s.proj.k);
          ball(x, GX, GY, R - 1, s.cur);
          ball(x, GX + cw / 2 + 22, H - 13, Math.round(R * .62), s.next);
          for (let i = 0; i < PER_DROP; i++) {                           // shots until the rows push down
            const on = i < PER_DROP - s.shots % PER_DROP; x.beginPath(); x.arc(GX - cw / 2 - 16 - i * 10, H - 9, 3, 0, Math.PI * 2);
            x.fillStyle = on ? '#1A5DBF' : 'rgba(26,93,191,.18)'; x.fill();
          }
        },
      };
    });
  })();
`;
