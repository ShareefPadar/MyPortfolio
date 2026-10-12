/**
 * ERA · now — the page background: a sky that follows the visitor's own clock (Shareef's call, after gauravi.design).
 * Night, 19:00 to 06:00: stars, a faint Milky Way, thin cloud, a shooting star now and then.
 * Day: a pale morning sky with clouds drifting across it.
 * The page's light / dark colours follow the sky through [data-sky] on <html> (style.css), not the device setting.
 *   skyHeadJS        → in <head>: sets data-sky before first paint. ?sky=day or ?sky=night previews either at any hour
 *   skyMarkup(quiet) → the fixed layer behind the page. Its gradient is CSS, so the sky is there before any script runs
 *   skyScript        → runs inside the layout's script (uses its reduce / touch). Two canvases: what stays put is drawn
 *                      once on the first; clouds, twinkle and shooting stars are redrawn on the second
 * Case studies pass quiet: one still frame, dimmer, so the article stays easy to read. Reduced motion: one still frame.
 * Ornament only: aria-hidden, no text. The galaxy is tiny stars with barely a glow, and clouds are weather, so this
 * stays clear of the de-slop rule against blurred colour blobs.
 */
export const skyHeadJS = `<script>try{var m=/[?&]sky=(day|night)/.exec(location.search),h=new Date().getHours();document.documentElement.dataset.sky=m?m[1]:(h>=19||h<6?'night':'day')}catch(e){}</script>`;

export const skyMarkup = quiet => `<div class="sky" aria-hidden="true"${quiet ? ' data-quiet' : ''}><canvas></canvas><canvas></canvas></div>`;

export const skyScript = `
  // ── the sky: the gradient is CSS; this draws what's in it ──
  (() => {
    const box = document.querySelector('.sky'); if (!box) return;
    const [far, near] = box.querySelectorAll('canvas'), fx = far.getContext('2d'), nx = near.getContext('2d');
    const night = document.documentElement.dataset.sky === 'night', still = reduce || box.hasAttribute('data-quiet');
    const TAU = Math.PI * 2, rnd = (a, b) => a + Math.random() * (b - a), bell = () => (Math.random() + Math.random() + Math.random()) / 1.5 - 1;
    const TINT = ['255,255,255', '206,222,255', '255,236,208'], DEPTH = [[.55, 4, .6], [.8, 7, .78], [1.1, 11, .92]];   // cloud depth: size, px a second, opacity
    let W = 0, H = 0, D = 1, stars = [], clouds = [], shot = null, nextShot = 0, last = 0;

    const sprite = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w * D); c.height = Math.ceil(h * D); return c; };
    const puff = (g, px, py, r, rgb, a) => { const rg = g.createRadialGradient(px, py, 0, px, py, r); rg.addColorStop(0, 'rgba(' + rgb + ',' + a + ')'); rg.addColorStop(1, 'rgba(' + rgb + ',0)');
      g.fillStyle = rg; g.beginPath(); g.arc(px, py, r, 0, TAU); g.fill(); };
    // a morning cloud, drawn once: white puffs piled on a flat base, with a cool shadow under the lit top
    function cloud(w, h) {
      const c = sprite(w, h), g = c.getContext('2d'), puffs = []; g.scale(D, D);
      for (let i = 0; i < 30; i++) { const u = Math.random() + Math.random() - 1, arch = Math.sqrt(1 - u * u), r = h * (.1 + arch * .16) * rnd(.7, 1.1);
        puffs.push([w / 2 + u * w * .38, h * .8 - r * .55 - Math.random() * arch * h * .24, r]); }
      for (const [px, py, r] of puffs) puff(g, px, py + h * .07, r, '150,176,216', .24);
      for (const [px, py, r] of puffs) puff(g, px, py, r, '255,255,255', .56);
      return c;
    }
    // a wisp of high cloud for the night: one long thin streak that thins out at both ends
    function wisp(w, h) {
      const c = sprite(w, h), g = c.getContext('2d'), tall = h / .3, ph = rnd(0, TAU); g.scale(D, D * .3);
      for (let i = 0; i < 40; i++) { const u = i / 39, r = tall * .4 * Math.sqrt(Math.sin(Math.PI * u)) * rnd(.65, 1);
        if (r > 2) puff(g, w * (.2 + .6 * u), tall / 2 + Math.sin(u * 5 + ph) * tall * .08, Math.min(r, w * .2), '160,176,216', .014); }
      return c;
    }

    function setup() {
      W = box.clientWidth; H = box.clientHeight;
      const small = touch || W < 700; D = Math.min(devicePixelRatio || 1, small ? 1.5 : 2);
      for (const c of [far, near]) { c.width = Math.round(W * D); c.height = Math.round(H * D); }
      fx.setTransform(D, 0, 0, D, 0, 0); nx.setTransform(D, 0, 0, D, 0, 0);
      stars = []; clouds = []; shot = null;
      if (night) {
        // the Milky Way: a band of tiny dim stars from lower left to upper right, with barely a glow behind it
        const ax = -W * .1, ay = H * .92, bx = W * 1.1, by = H * .06, len = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / len, uy = (by - ay) / len, wide = Math.min(W, H) * .14, ph = rnd(0, TAU);
        for (let i = 0; i < 16; i++) puff(fx, ax + (bx - ax) * i / 15, ay + (by - ay) * i / 15, wide * 1.5, '120,140,220', .03);
        for (let i = 0, n = small ? 800 : 3000; i < n; i++) { const t = Math.random(), o = bell() * wide;   // phones: thinner and dimmer, since text covers most of the screen
          if (Math.random() > .6 + .4 * Math.sin(t * 11 + ph) * Math.sin(t * 5.3 + 1)) continue;   // thicker in places, the way it is
          fx.fillStyle = 'rgba(214,224,255,' + (rnd(.1, .5) * (small ? .7 : 1) * (1 - Math.abs(o) / wide * .7)).toFixed(3) + ')';
          fx.beginPath(); fx.arc(ax + (bx - ax) * t - uy * o, ay + (by - ay) * t + ux * o, rnd(.35, .95), 0, TAU); fx.fill(); }
        // the rest of the sky: dim stars that stay put, brighter ones that twinkle, thin cloud
        for (let i = 0, n = small ? 110 : 240; i < n; i++) { fx.fillStyle = 'rgba(' + TINT[i % 3] + ',' + rnd(.3, .8).toFixed(2) + ')'; fx.beginPath(); fx.arc(rnd(0, W), rnd(0, H), rnd(.4, 1.2), 0, TAU); fx.fill(); }
        for (let i = 0, n = small ? 40 : 80; i < n; i++) stars.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(.9, 1.9), a: rnd(.6, 1), sp: rnd(.5, 1.6), ph: rnd(0, TAU), c: TINT[i % 3] });
        for (let i = 0; i < 3; i++) { const w = rnd(700, 1000), h = w * .13; clouds.push({ im: wisp(w, h), w, h, x: (i + rnd(.1, .9)) / 3 * (W + w) - w, y: rnd(0, H * .7), v: rnd(3, 6), a: rnd(.7, 1) }); }
        nextShot = performance.now() + rnd(4000, 9000);
      } else {
        // the sun, low and off to the right: a warm glow, not a disc
        const sx = W * .88, sy = H * .06, r = Math.max(W, H) * .6, g = fx.createRadialGradient(sx, sy, 0, sx, sy, r);
        g.addColorStop(0, 'rgba(255,238,204,.7)'); g.addColorStop(.35, 'rgba(255,238,204,.22)'); g.addColorStop(1, 'rgba(255,238,204,0)'); fx.fillStyle = g; fx.fillRect(0, 0, W, H);
        // clouds at three depths: far ones small, slow and faint; near ones big and quicker
        for (let i = 0, n = small ? 4 : 6; i < n; i++) { const [s, v, a] = DEPTH[i % 3], w = rnd(440, 600) * s, h = w * .36;
          clouds.push({ im: cloud(w, h), w, h, x: (i + rnd(.1, .9)) / n * (W + w) - w, y: rnd(H * .04, H * .72), v, a }); }
        clouds.sort((p, q) => p.v - q.v);   // far ones first, so near ones pass in front
      }
      draw(performance.now());
    }

    function draw(now) {
      const t = now / 1000; nx.clearRect(0, 0, W, H);
      for (const s of stars) { const a = s.a * (still ? .85 : .62 + .38 * Math.sin(t * s.sp + s.ph));
        if (s.r > 1.6) puff(nx, s.x, s.y, s.r * 4, s.c, (a * .22).toFixed(3));   // the few brightest get a small halo
        nx.fillStyle = 'rgba(' + s.c + ',' + a.toFixed(3) + ')'; nx.beginPath(); nx.arc(s.x, s.y, s.r, 0, TAU); nx.fill(); }
      for (const c of clouds) { nx.globalAlpha = c.a; nx.drawImage(c.im, c.x, c.y, c.w, c.h); }
      nx.globalAlpha = 1;
      if (shot) {   // a shooting star: the tail grows behind the head, and the whole streak fades in and out
        const p = (now - shot.t0) / shot.ms, k = Math.hypot(shot.dx, shot.dy), hx = shot.x + shot.dx * p, hy = shot.y + shot.dy * p, tail = Math.min(1, p * 3) * shot.len;
        const tx = hx - shot.dx / k * tail, ty = hy - shot.dy / k * tail, g = nx.createLinearGradient(hx, hy, tx, ty);
        g.addColorStop(0, 'rgba(255,255,255,' + (.9 * Math.sin(Math.PI * p)).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,255,255,0)');
        nx.strokeStyle = g; nx.lineWidth = 1.5; nx.lineCap = 'round'; nx.beginPath(); nx.moveTo(hx, hy); nx.lineTo(tx, ty); nx.stroke();
      }
    }

    function tick(now) {
      requestAnimationFrame(tick);
      if (now - last < 32) return;   // about 30 a second is plenty for a sky
      const dt = Math.min(.1, (now - last) / 1000); last = now;
      for (const c of clouds) { c.x += c.v * dt; if (c.x > W) { c.x = -c.w; c.y = rnd(H * .04, H * .7); } }
      if (shot && now - shot.t0 >= shot.ms) shot = null;
      if (night && !shot && now > nextShot) { const ang = rnd(.35, .66), d = rnd(360, 620);
        shot = { t0: now, ms: rnd(650, 900), x: rnd(W * .15, W * .85), y: rnd(0, H * .35), dx: Math.cos(ang) * d * (Math.random() < .5 ? -1 : 1), dy: Math.sin(ang) * d, len: rnd(110, 190) };
        nextShot = now + rnd(10000, 20000); }
      draw(now);
    }

    setup(); if (!still) requestAnimationFrame(tick);
    let resized; addEventListener('resize', () => { clearTimeout(resized); resized = setTimeout(() => { if (box.clientWidth !== W || box.clientHeight !== H) setup(); }, 180); });
  })();
`;
