/**
 * ERA · now — the page background: a sky that follows the visitor's own clock (Shareef's call, after gauravi.design).
 * Night, 19:00 to 06:00: stars that twinkle and now and then flare, a faint Milky Way, thin cloud, shooting stars.
 * Day: a pale morning sky, clouds crossing it, a sun that breathes, a few birds going over.
 * Scrolling moves it too, each layer at its own speed (the Milky Way slowest, then the stars, the clouds fastest),
 * and the whole sky leans a little away from the pointer.
 * The page's light / dark colours follow the sky through [data-sky] on <html> (style.css), not the device setting.
 *   skyHeadJS        → in <head>: sets data-sky before first paint. ?sky=day or ?sky=night previews either at any hour
 *   skyMarkup(quiet) → the fixed layer behind the page. Its gradient is CSS, so the sky is there before any script runs
 *   skyScript        → runs inside the layout's script (uses its reduce / touch). Two canvases: what stays put is drawn
 *                      once on the first; everything that moves is redrawn on the second, about 30 times a second
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
    const TAU = Math.PI * 2, rnd = (a, b) => a + Math.random() * (b - a), bell = () => (Math.random() + Math.random() + Math.random()) / 1.5 - 1, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const TINT = ['255,255,255', '206,222,255', '255,236,208'];
    const DEPTH = [[.55, 12, .6, .1], [.8, 20, .78, .18], [1.1, 32, .92, .28]];   // cloud depth: size, px a second, opacity, how far it moves per pixel scrolled
    const FAR = .04, SLACK = 200;   // the layer that stays put moves this much per pixel scrolled, and has this much spare height to do it in
    let W = 0, H = 0, FH = 0, D = 1, small = false, stars = [], clouds = [], birds = [], shot = null, glint = null, nextShot = 0, nextGlint = 0, nextBirds = 0, last = 0;
    let tx = 0, ty = 0, px = 0, py = 0, lastY = -1, placed = '';   // where the pointer wants the sky to lean, where it is, and the scroll position last drawn

    const sprite = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w * D); c.height = Math.ceil(h * D); return c; };
    const puff = (g, x, y, r, rgb, a) => { const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, 'rgba(' + rgb + ',' + a + ')'); rg.addColorStop(1, 'rgba(' + rgb + ',0)');
      g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); };
    // a morning cloud, drawn once: white puffs piled on a flat base, with a cool shadow under the lit top
    function cloud(w, h) {
      const c = sprite(w, h), g = c.getContext('2d'), puffs = []; g.scale(D, D);
      for (let i = 0; i < 30; i++) { const u = Math.random() + Math.random() - 1, arch = Math.sqrt(1 - u * u), r = h * (.1 + arch * .16) * rnd(.7, 1.1);
        puffs.push([w / 2 + u * w * .38, h * .8 - r * .55 - Math.random() * arch * h * .24, r]); }
      for (const [x, y, r] of puffs) puff(g, x, y + h * .07, r, '150,176,216', .24);
      for (const [x, y, r] of puffs) puff(g, x, y, r, '255,255,255', .56);
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
      W = near.clientWidth; H = near.clientHeight; FH = far.clientHeight;   // bigger than the screen (style.css), so no slide ever shows an edge
      small = touch || W < 760; D = Math.min(devicePixelRatio || 1, small ? 1.5 : 2);
      far.width = near.width = Math.round(W * D); near.height = Math.round(H * D); far.height = Math.round(FH * D);
      fx.setTransform(D, 0, 0, D, 0, 0); nx.setTransform(D, 0, 0, D, 0, 0);
      stars = []; clouds = []; birds = []; shot = glint = null;
      const t0 = performance.now();
      if (night) {
        // the Milky Way: a band of tiny dim stars from lower left to upper right, with barely a glow behind it
        const ax = -W * .1, ay = FH * .92, bx = W * 1.1, by = FH * .06, len = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / len, uy = (by - ay) / len, wide = Math.min(W, FH) * .14, ph = rnd(0, TAU);
        for (let i = 0; i < 16; i++) puff(fx, ax + (bx - ax) * i / 15, ay + (by - ay) * i / 15, wide * 1.5, '120,140,220', .03);
        for (let i = 0, n = small ? 800 : 3000; i < n; i++) { const t = Math.random(), o = bell() * wide;   // phones: thinner and dimmer, since text covers most of the screen
          if (Math.random() > .6 + .4 * Math.sin(t * 11 + ph) * Math.sin(t * 5.3 + 1)) continue;   // thicker in places, the way it is
          fx.fillStyle = 'rgba(214,224,255,' + (rnd(.1, .5) * (small ? .7 : 1) * (1 - Math.abs(o) / wide * .7)).toFixed(3) + ')';
          fx.beginPath(); fx.arc(ax + (bx - ax) * t - uy * o, ay + (by - ay) * t + ux * o, rnd(.35, .95), 0, TAU); fx.fill(); }
        // the rest of the sky: dim stars that stay put, brighter ones that twinkle, thin cloud
        for (let i = 0, n = Math.round((small ? 110 : 240) * FH / H); i < n; i++) { fx.fillStyle = 'rgba(' + TINT[i % 3] + ',' + rnd(.3, .8).toFixed(2) + ')'; fx.beginPath(); fx.arc(rnd(0, W), rnd(0, FH), rnd(.4, 1.2), 0, TAU); fx.fill(); }
        for (let i = 0, n = small ? 55 : 120; i < n; i++) stars.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(.9, 2), a: rnd(.7, 1), sp: rnd(1.2, 3.4), ph: rnd(0, TAU), c: TINT[i % 3], z: rnd(.06, .16), py: 0 });
        for (let i = 0; i < 3; i++) { const w = rnd(700, 1000), h = w * .13; clouds.push({ im: wisp(w, h), w, h, x: (i + rnd(.1, .9)) / 3 * (W + w) - w, y: rnd(0, H * .7), v: rnd(10, 18), a: rnd(.7, 1), z: rnd(.14, .22) }); }
        nextShot = t0 + rnd(1500, 4000); nextGlint = t0 + rnd(400, 1200);
      } else {
        // the sun, low and off to the right: a warm glow, not a disc. It's the only thing on this canvas, so CSS lets it breathe
        const sx = W * .88, sy = H * .06, r = Math.max(W, H) * .6, g = fx.createRadialGradient(sx, sy, 0, sx, sy, r);
        g.addColorStop(0, 'rgba(255,238,204,.8)'); g.addColorStop(.35, 'rgba(255,238,204,.26)'); g.addColorStop(1, 'rgba(255,238,204,0)'); fx.fillStyle = g; fx.fillRect(0, 0, W, H);
        // clouds at three depths: far ones small, slow and faint; near ones big and quicker
        for (let i = 0, n = small ? 5 : 8; i < n; i++) { const [s, v, a, z] = DEPTH[i % 3], w = rnd(440, 600) * s, h = w * .36;
          clouds.push({ im: cloud(w, h), w, h, x: (i + rnd(.1, .9)) / n * (W + w) - w, y: rnd(H * .04, H * .72), v, a, z }); }
        clouds.sort((p, q) => p.v - q.v);   // far ones first, so near ones pass in front
        nextBirds = t0 + rnd(2500, 5000);
      }
      lastY = -1; draw(t0, still ? 0 : scrollY);
    }

    // off is how far the page has scrolled. Each star and cloud slides up by its own share of that and comes round again
    // at the other edge, off screen, so the sky never runs out however long the page is
    const wrap = (y, span) => ((y % span) + span) % span;
    function draw(now, off) {
      const t = now / 1000; nx.clearRect(0, 0, W, H);
      // twinkle: each star swells and fades on its own beat
      for (const s of stars) { const w = still ? .7 : .5 + .5 * Math.sin(t * s.sp + s.ph), a = s.a * (.25 + .75 * w), r = s.r * (.85 + .3 * w), y = s.py = wrap(s.y - off * s.z, H);
        if (s.r > 1.5) puff(nx, s.x, y, r * 4.5, s.c, (a * .25).toFixed(3));   // the brightest carry a small halo
        nx.fillStyle = 'rgba(' + s.c + ',' + a.toFixed(3) + ')'; nx.beginPath(); nx.arc(s.x, y, r, 0, TAU); nx.fill(); }
      if (glint) {   // now and then one star catches the light: a four-point flare for most of a second
        const g = glint.s, a = Math.sin(Math.PI * clamp((now - glint.t0) / 800, 0, 1)), L = g.r * 9 * a;
        puff(nx, g.x, g.py, g.r * 7 * a + 1, g.c, (.35 * a).toFixed(3));
        nx.strokeStyle = 'rgba(' + g.c + ',' + (.8 * a).toFixed(3) + ')'; nx.lineWidth = .8; nx.lineCap = 'round';
        nx.beginPath(); nx.moveTo(g.x - L, g.py); nx.lineTo(g.x + L, g.py); nx.moveTo(g.x, g.py - L); nx.lineTo(g.x, g.py + L); nx.stroke();
      }
      for (const c of clouds) { nx.globalAlpha = c.a; nx.drawImage(c.im, c.x, wrap(c.y - off * c.z + c.h, H + c.h) - c.h, c.w, c.h); }
      nx.globalAlpha = 1;
      if (shot) {   // a shooting star: the tail grows behind the head, and the whole streak fades in and out
        const p = clamp((now - shot.t0) / shot.ms, 0, 1), k = Math.hypot(shot.dx, shot.dy), hx = shot.x + shot.dx * p, hy = shot.y + shot.dy * p, tail = Math.min(1, p * 3) * shot.len;
        const ex = hx - shot.dx / k * tail, ey = hy - shot.dy / k * tail, g = nx.createLinearGradient(hx, hy, ex, ey);
        g.addColorStop(0, 'rgba(255,255,255,' + (.9 * Math.sin(Math.PI * p)).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,255,255,0)');
        nx.strokeStyle = g; nx.lineWidth = shot.wide; nx.lineCap = 'round'; nx.beginPath(); nx.moveTo(hx, hy); nx.lineTo(ex, ey); nx.stroke();
      }
      if (birds.length) {   // a few birds going over: two curved strokes each, wings beating
        nx.strokeStyle = 'rgba(46,64,92,.6)'; nx.lineWidth = 1.4; nx.lineCap = nx.lineJoin = 'round';
        for (const b of birds) { const f = Math.sin(t * b.flap + b.ph), s = b.s, y = b.y - (off - b.off) * .2 + Math.sin(t * 1.3 + b.ph) * 2, tip = y - s * (.15 + .55 * f), mid = y - s * (.1 + .3 * f);
          nx.beginPath(); nx.moveTo(b.x - s, tip); nx.quadraticCurveTo(b.x - s * .45, mid, b.x, y); nx.quadraticCurveTo(b.x + s * .45, mid, b.x + s, tip); nx.stroke(); }
      }
    }

    function tick(now) {
      requestAnimationFrame(tick);
      // the sky leans a little away from the pointer, and the layer that stays put slides up slowly as the page scrolls:
      // transforms only, so every frame. By day that layer is the sun, which is too far away to move
      const sy = Math.max(0, scrollY), slide = night ? Math.min(sy * FAR, SLACK) : 0; px += (tx - px) * .06; py += (ty - py) * .06;
      const at = px.toFixed(1) + ',' + py.toFixed(1) + ',' + slide.toFixed(1);
      if (at !== placed) { placed = at; far.style.transform = 'translate3d(' + (px * .4).toFixed(1) + 'px,' + (py * .4 - slide).toFixed(1) + 'px,0)';
        near.style.transform = 'translate3d(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px,0)'; }
      if (sy === lastY && now - last < 32) return;   // about 30 drawings a second is plenty for a sky; every frame while the page is scrolling
      lastY = sy;
      const dt = Math.min(.1, (now - last) / 1000); last = now;
      for (const c of clouds) { c.x += c.v * dt; if (c.x > W) { c.x = -c.w; c.y = rnd(H * .04, H * .7); } }
      if (night) {
        if (shot && now - shot.t0 >= shot.ms) shot = null;
        if (!shot && now > nextShot) { const big = Math.random() < .25, ang = rnd(.35, .66), d = rnd(360, 620) * (big ? 1.4 : 1);
          shot = { t0: now, ms: rnd(650, 900) * (big ? 1.25 : 1), x: rnd(W * .15, W * .85), y: rnd(0, H * .35), dx: Math.cos(ang) * d * (Math.random() < .5 ? -1 : 1), dy: Math.sin(ang) * d, len: rnd(110, 190) * (big ? 1.6 : 1), wide: big ? 2 : 1.5 };
          nextShot = now + rnd(4000, 9000); }
        if (glint && now - glint.t0 >= 800) glint = null;
        if (!glint && now > nextGlint) { glint = { t0: now, s: stars[Math.floor(Math.random() * stars.length)] }; nextGlint = now + rnd(900, 2600); }
      } else {
        for (const b of birds) b.x += b.v * dt;
        birds = birds.filter(b => b.v > 0 ? b.x < W + 40 : b.x > -40);
        if (!birds.length && now > nextBirds) {   // a loose V, leader in front, crossing in about twenty seconds. High up, clear of the headline: over the words they read as stray accents
          const dir = Math.random() < .5 ? 1 : -1, n = small ? 3 : 3 + Math.floor(Math.random() * 3), y0 = rnd(H * .08, H * .17), v = rnd(55, 85) * dir;
          for (let i = 0; i < n; i++) birds.push({ x: (dir > 0 ? -30 : W + 30) - dir * i * rnd(22, 34), y: y0 + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * rnd(10, 18), off: sy, v, s: rnd(6, 9), flap: rnd(7, 9.5), ph: rnd(0, TAU) });
          nextBirds = now + rnd(30000, 45000); }
      }
      draw(now, sy);
    }

    setup();
    if (!still) {
      requestAnimationFrame(tick);
      addEventListener('pointermove', e => { if (e.pointerType !== 'touch') { tx = (.5 - e.clientX / innerWidth) * 24; ty = (.5 - e.clientY / innerHeight) * 16; } }, { passive: true });
    }
    let resized; addEventListener('resize', () => { clearTimeout(resized); resized = setTimeout(() => { if (near.clientWidth !== W || near.clientHeight !== H) setup(); }, 180); });
  })();
`;
