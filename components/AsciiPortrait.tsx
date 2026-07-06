"use client";

import { useEffect, useRef } from "react";
import data from "./asciiPortrait.data.json";

// Character-cell aspect used by the generator (16x27 px cells)
const CELL_ASPECT = 27 / 16;
const INK: [number, number, number] = [12, 12, 12];
const PINK: [number, number, number] = [226, 29, 112]; // brand accent #E21D70

// A few characters glow pink at any moment; the set continuously re-picks.
const TWINKLE_COUNT = 16;

interface Particle {
  ch: string;
  homeX: number;
  homeY: number;
  spawnX: number;
  spawnY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  delay: number;
  settled: boolean;
}

interface Twinkle {
  c: number;
  r: number;
  ch: string;
  t: number; // elapsed (negative = stagger delay before it starts)
  ttl: number; // full black→pink→black cycle length
}

const AsciiPortrait = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { cols, rows, base, extra } = data as {
      cols: number;
      rows: number;
      base: [number, number, string][];
      extra: [number, number, string][];
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cw = 0;
    let chH = 0;
    let fontPx = 0;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let baseLayer: HTMLCanvasElement | null = null;
    let particles: Particle[] = [];
    let twinkles: Twinkle[] = [];
    let hovered = false;
    let raf = 0;
    let running = false;
    let onScreen = true;
    let last = 0;

    const gridAspect = (rows * CELL_ASPECT) / cols;

    const spawnFor = (hx: number, hy: number): [number, number] => {
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.hypot(W, H) * (0.55 + Math.random() * 0.35);
      return [hx + Math.cos(ang) * dist, hy + Math.sin(ang) * dist];
    };

    const newTwinkle = (stagger: boolean): Twinkle => {
      const [c, r, ch] = base[(Math.random() * base.length) | 0];
      return {
        c,
        r,
        ch,
        t: stagger ? -Math.random() * 2.2 : 0,
        ttl: 0.9 + Math.random() * 1.4,
      };
    };

    const layout = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      let gw = rect.width;
      let gh = gw * gridAspect;
      if (gh > rect.height) {
        gh = rect.height;
        gw = gh / gridAspect;
      }
      W = gw;
      H = gh;
      canvas.width = Math.round(gw * dpr);
      canvas.height = Math.round(gh * dpr);
      canvas.style.width = `${gw}px`;
      canvas.style.height = `${gh}px`;
      cw = gw / cols;
      chH = cw * CELL_ASPECT;
      fontPx = chH * 0.9;

      baseLayer = document.createElement("canvas");
      baseLayer.width = canvas.width;
      baseLayer.height = canvas.height;
      const bctx = baseLayer.getContext("2d")!;
      bctx.scale(dpr, dpr);
      bctx.font = `${fontPx}px Menlo, Consolas, monospace`;
      bctx.textBaseline = "top";
      bctx.fillStyle = `rgb(${INK[0]},${INK[1]},${INK[2]})`;
      for (const [c, r, ch] of base) bctx.fillText(ch, c * cw, r * chH);

      particles = extra.map(([c, r, ch]) => {
        const homeX = c * cw;
        const homeY = r * chH;
        const [sx, sy] = spawnFor(homeX, homeY);
        return {
          ch,
          homeX,
          homeY,
          spawnX: sx,
          spawnY: sy,
          x: hovered ? homeX : sx,
          y: hovered ? homeY : sy,
          vx: 0,
          vy: 0,
          delay: 0,
          settled: true,
        };
      });

      if (twinkles.length === 0 && !reduceMotion) {
        twinkles = Array.from({ length: TWINKLE_COUNT }, () => newTwinkle(true));
      }
      drawFrame();
    };

    const drawFrame = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (baseLayer) ctx.drawImage(baseLayer, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontPx}px Menlo, Consolas, monospace`;
      ctx.textBaseline = "top";

      // moving/settled extra characters (black)
      ctx.fillStyle = `rgb(${INK[0]},${INK[1]},${INK[2]})`;
      const maxDist = Math.hypot(W, H) * 0.5;
      for (const p of particles) {
        if (p.settled && !hovered) continue;
        const dHome = Math.hypot(p.x - p.homeX, p.y - p.homeY);
        const alpha = Math.max(0, Math.min(1, 1 - dHome / maxDist));
        if (alpha <= 0.01) continue;
        ctx.globalAlpha = alpha;
        ctx.fillText(p.ch, p.x, p.y);
      }
      ctx.globalAlpha = 1;

      // pink twinkle — redraw selected base chars in an animated colour
      for (const tw of twinkles) {
        if (tw.t < 0) continue;
        const a = Math.sin(Math.PI * Math.min(tw.t / tw.ttl, 1)); // 0→1→0
        if (a <= 0.01) continue;
        const cr = Math.round(INK[0] + (PINK[0] - INK[0]) * a);
        const cg = Math.round(INK[1] + (PINK[1] - INK[1]) * a);
        const cb = Math.round(INK[2] + (PINK[2] - INK[2]) * a);
        ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
        ctx.fillText(tw.ch, tw.c * cw, tw.r * chH);
      }
    };

    const STIFF = 120;
    const DAMP = 14;

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      let particlesActive = false;
      for (const p of particles) {
        const tx = hovered ? p.homeX : p.spawnX;
        const ty = hovered ? p.homeY : p.spawnY;
        if (p.settled && p.x === tx && p.y === ty) continue;
        if (p.delay > 0) {
          p.delay -= dt;
          particlesActive = true;
          continue;
        }
        const ax = (tx - p.x) * STIFF - p.vx * DAMP;
        const ay = (ty - p.y) * STIFF - p.vy * DAMP;
        p.vx += ax * dt;
        p.vy += ay * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (
          Math.abs(p.x - tx) < 0.4 &&
          Math.abs(p.y - ty) < 0.4 &&
          Math.abs(p.vx) < 6 &&
          Math.abs(p.vy) < 6
        ) {
          p.x = tx;
          p.y = ty;
          p.vx = 0;
          p.vy = 0;
          p.settled = true;
        } else {
          p.settled = false;
          particlesActive = true;
        }
      }

      // advance twinkle; recycle finished ones onto new random cells
      for (let i = 0; i < twinkles.length; i++) {
        twinkles[i].t += dt;
        if (twinkles[i].t >= twinkles[i].ttl) twinkles[i] = newTwinkle(false);
      }

      drawFrame();

      // keep looping while pink twinkle is on, or while characters are moving
      if ((twinkles.length > 0 || particlesActive) && onScreen) {
        raf = requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running || !onScreen) return;
      if (reduceMotion && !hovered) {
        // still allow a one-shot settle draw handled elsewhere
      }
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const onEnter = () => {
      hovered = true;
      if (reduceMotion) {
        for (const p of particles) {
          p.x = p.homeX;
          p.y = p.homeY;
          p.settled = true;
        }
        drawFrame();
        return;
      }
      for (const p of particles) {
        p.settled = false;
        p.delay = Math.random() * 0.22;
      }
      start();
    };

    const onLeave = () => {
      hovered = false;
      if (reduceMotion) {
        for (const p of particles) {
          p.x = p.spawnX;
          p.y = p.spawnY;
          p.settled = true;
        }
        drawFrame();
        return;
      }
      for (const p of particles) {
        p.settled = false;
        p.delay = Math.random() * 0.15;
      }
      start();
    };

    layout();
    if (!reduceMotion) start(); // run the ambient pink twinkle

    const ro = new ResizeObserver(layout);
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen && !reduceMotion) start();
      },
      { threshold: 0 }
    );
    io.observe(wrap);

    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label="ASCII art portrait of Shareef Padar"
      className="relative flex h-full w-full items-start justify-center"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default AsciiPortrait;
