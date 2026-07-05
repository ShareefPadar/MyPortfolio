"use client";

import { useEffect, useRef } from "react";
import data from "./asciiPortrait.data.json";

// Character-cell aspect used by the generator (16x27 px cells)
const CELL_ASPECT = 27 / 16;
const INK = "#0c0c0c";

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
  delay: number; // seconds of stagger before it starts moving
  settled: boolean;
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

    let cw = 0; // cell width in css px
    let chH = 0; // cell height in css px
    let fontPx = 0;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let baseLayer: HTMLCanvasElement | null = null;
    let particles: Particle[] = [];
    let hovered = false;
    let raf = 0;
    let running = false;
    let last = 0;

    const gridAspect = (rows * CELL_ASPECT) / cols; // height / width

    const spawnFor = (hx: number, hy: number): [number, number] => {
      // random direction, pushed well outside the canvas — "from all sides"
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.hypot(W, H) * (0.55 + Math.random() * 0.35);
      return [hx + Math.cos(ang) * dist, hy + Math.sin(ang) * dist];
    };

    const layout = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      // object-contain fit of the grid inside the wrapper
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

      // pre-render the always-visible base layer
      baseLayer = document.createElement("canvas");
      baseLayer.width = canvas.width;
      baseLayer.height = canvas.height;
      const bctx = baseLayer.getContext("2d")!;
      bctx.scale(dpr, dpr);
      bctx.font = `${fontPx}px Menlo, Consolas, monospace`;
      bctx.textBaseline = "top";
      bctx.fillStyle = INK;
      for (const [c, r, ch] of base) bctx.fillText(ch, c * cw, r * chH);

      // (re)build particles at their homes
      particles = extra.map(([c, r, ch]) => {
        const homeX = c * cw;
        const homeY = r * chH;
        const [sx, sy] = spawnFor(homeX, homeY);
        const startAtHome = hovered;
        return {
          ch,
          homeX,
          homeY,
          spawnX: sx,
          spawnY: sy,
          x: startAtHome ? homeX : sx,
          y: startAtHome ? homeY : sy,
          vx: 0,
          vy: 0,
          delay: Math.random() * 0.22,
          settled: true,
        };
      });
      drawFrame();
    };

    const drawFrame = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (baseLayer) ctx.drawImage(baseLayer, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontPx}px Menlo, Consolas, monospace`;
      ctx.textBaseline = "top";
      ctx.fillStyle = INK;
      const maxDist = Math.hypot(W, H) * 0.5;
      for (const p of particles) {
        const tx = hovered ? p.homeX : p.spawnX;
        if (p.settled && !hovered) continue; // resting off-canvas
        const dHome = Math.hypot(p.x - p.homeX, p.y - p.homeY);
        const alpha = Math.max(0, Math.min(1, 1 - dHome / maxDist));
        if (alpha <= 0.01) continue;
        ctx.globalAlpha = alpha;
        ctx.fillText(p.ch, p.x, p.y);
        void tx;
      }
      ctx.globalAlpha = 1;
    };

    const STIFF = 120; // spring stiffness (1/s^2)
    const DAMP = 14; // damping (1/s)

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      let active = 0;
      for (const p of particles) {
        if (p.delay > 0) {
          p.delay -= dt;
          active++;
          continue;
        }
        const tx = hovered ? p.homeX : p.spawnX;
        const ty = hovered ? p.homeY : p.spawnY;
        const ax = (tx - p.x) * STIFF - p.vx * DAMP;
        const ay = (ty - p.y) * STIFF - p.vy * DAMP;
        p.vx += ax * dt;
        p.vy += ay * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const done =
          Math.abs(p.x - tx) < 0.4 &&
          Math.abs(p.y - ty) < 0.4 &&
          Math.abs(p.vx) < 6 &&
          Math.abs(p.vy) < 6;
        if (done) {
          p.x = tx;
          p.y = ty;
          p.vx = 0;
          p.vy = 0;
          p.settled = true;
        } else {
          p.settled = false;
          active++;
        }
      }
      drawFrame();
      if (active > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const kick = () => {
      for (const p of particles) {
        p.settled = false;
        p.delay = Math.random() * 0.22;
      }
      if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
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
      kick();
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
      kick();
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(wrap);
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
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
