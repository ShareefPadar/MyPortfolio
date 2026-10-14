"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { INK, PAPER, PLATE } from "@/lib/tokens";

/**
 * Dino Runner — an endless runner with no image assets. Every sprite is an
 * ASCII grid baked to a 1px-per-cell offscreen canvas at runtime and blitted
 * with drawImage, which is about as on-theme as an implementation can get.
 *
 * Ported into the system from a standalone file. What changed:
 *   - colours come from lib/tokens rather than literals. The original was
 *     written against the old warm palette (#FAFAF8 paper) and would have
 *     quietly reintroduced it on a page that is now #F0EFF4.
 *   - the frame is a sunk well with the standard focus plate, not a 2px rule
 *     that eased its border colour on focus (constraint #4 forbids the ease,
 *     and §4.2 forbids the square outline).
 *   - no `cursor: pointer`. The site replaces the native cursor with a drawn
 *     one; re-enabling a native cursor here would show two at once.
 *
 * Motion: the canvas only animates once you press to start, so there is
 * nothing moving to suppress under prefers-reduced-motion. Keyboard binds
 * only while the frame has focus, so Space never stops scrolling the page.
 */

/* World is drawn in logical pixels and scaled by PX, so edges stay hard.
   H ends one row below GROUND_Y so the ground line is the LAST row of the
   canvas. The canvas then butts straight onto the footer, and because the
   footer is bg-night with no top border, the paper-to-night edge continues
   the ground line across the full width of the page — the dino runs along
   the top of the footer rather than inside a box above it. */
const GROUND_Y = 98;
const H = GROUND_Y + 2; // ground line at GROUND_Y + 1, nothing below it
const PX = 3;

/* The world WIDTH is measured from the element, so going full-bleed shows
   more world instead of magnifying the same world.

   A fixed 400-wide world stretched edge to edge would be 4:1, which at 1920px
   is a 480px-tall band of mostly empty sky with a 96px dino in it. Measuring
   instead keeps a logical pixel at roughly CELL css px at every size, so the
   band stays a constant height and wider screens simply see further ahead.

   Clamped at both ends. Below MIN_W a phone would have so little world that
   an obstacle would appear and reach the dino in a fraction of a second;
   above MAX_W the pixels start growing again rather than the view. */
const CELL = 3; // css px per logical pixel, the target
const MIN_W = 360;
const MAX_W = 720;
const DEFAULT_W = 400; // used for the first paint, before measurement

const DINO_BODY = [
  "...........XXXXXXX..",
  "...........XXXXXXXX.",
  "...........XX..XXXX.",
  "...........XXXXXXXX.",
  "...........XXXXXXXX.",
  "...........XXXXX....",
  "...........XXXXXXX..",
  "X..........XXXXX....",
  "XX.........XXXXX....",
  "XXX.......XXXXXX....",
  "XXXX.....XXXXXXX....",
  "XXXXX...XXXXXXXX....",
  ".XXXXXXXXXXXXXXX....",
  "..XXXXXXXXXXXXXX....",
  "...XXXXXXXXXXXXX....",
  "....XXXXXXXXXXX.....",
  ".....XXXXXXXXXX.....",
  "......XXXXXXXX......",
];

const LEGS_A = [
  "......XXXXXX........",
  "......XX.XXX........",
  "......XX.XXX........",
  ".....XXX..XXX.......",
];

const LEGS_B = [
  "......XXXXXX........",
  "......XXX.XX........",
  ".....XXX..XX........",
  "....XXX....XX.......",
];

const LEGS_STILL = [
  "......XXXXXX........",
  "......XX.XXX........",
  "......XX.XXX........",
  "......XX..XXX.......",
];

const BIRD_UP = [
  ".......XX.........",
  "......XXXX........",
  ".....XXXXXX.......",
  "....XXXXXXXX......",
  "...XXXXXXXXX......",
  "..XXXXXXXXXX......",
  "....XXXXXXXXXXXXXX",
  "....XXXXXXXXXXX...",
  ".....XXXXXXX......",
  "......XXXX........",
];

const BIRD_DOWN = [
  "...........XXXXXXX",
  "....XXXXXXXXXXXXXX",
  "....XXXXXXXXXX....",
  ".....XXXXXXX......",
  "......XXXXX.......",
  ".......XXXX.......",
  "........XXX.......",
  ".......XXXX.......",
  "......XXXXXX......",
  ".....XXXXXXXX.....",
];

const CACTUS_S = [
  "....XX.....",
  "....XX.....",
  "X...XX.....",
  "X...XX...X.",
  "X...XX...X.",
  "XX..XX...X.",
  ".XXXXX..XX.",
  "....XXXXX..",
  "....XX.....",
  "....XX.....",
  "....XX.....",
  "....XX.....",
  "....XX.....",
  "....XX.....",
  "....XX.....",
  "....XX.....",
];

const CACTUS_L = [
  ".....XX......",
  ".....XX......",
  "X....XX......",
  "X....XX......",
  "X....XX...X..",
  "X....XX...X..",
  "XX...XX...X..",
  ".XX..XX..XX..",
  "..XXXXXXXX...",
  ".....XX......",
  ".....XX......",
  ".....XX......",
  ".....XX......",
  ".....XX......",
  ".....XX......",
  ".....XX......",
  ".....XX......",
  ".....XX......",
  ".....XX......",
  ".....XX......",
  ".....XX......",
  ".....XX......",
];

/** Bake an ASCII grid into a 1px-per-cell offscreen canvas. */
function bake(rows: string[], color: string): HTMLCanvasElement {
  const w = rows[0].length;
  const h = rows.length;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const g = cv.getContext("2d")!;
  g.fillStyle = color;
  for (let j = 0; j < h; j++) {
    const row = rows[j];
    for (let i = 0; i < w; i++) if (row[i] !== ".") g.fillRect(i, j, 1, 1);
  }
  return cv;
}

type Assets = {
  run: [HTMLCanvasElement, HTMLCanvasElement];
  still: HTMLCanvasElement;
  bird: [HTMLCanvasElement, HTMLCanvasElement];
  cactusS: HTMLCanvasElement;
  cactusL: HTMLCanvasElement;
};

function buildAssets(color: string): Assets {
  const stack = (a: string[], b: string[]) => a.concat(b);
  return {
    run: [bake(stack(DINO_BODY, LEGS_A), color), bake(stack(DINO_BODY, LEGS_B), color)],
    still: bake(stack(DINO_BODY, LEGS_STILL), color),
    bird: [bake(BIRD_UP, color), bake(BIRD_DOWN, color)],
    cactusS: bake(CACTUS_S, color),
    cactusL: bake(CACTUS_L, color),
  };
}

type Obstacle =
  | { kind: "bird"; x: number; y: number }
  | { kind: "small" | "large"; x: number; count: number; w: number; h: number };

type Game = {
  speed: number;
  dist: number;
  score: number;
  y: number;
  vy: number;
  holding: boolean;
  obstacles: Obstacle[];
  spawnIn: number;
  clouds: { x: number; y: number; w: number }[];
  /* Road marks, not pebbles: they live ON the ground line rather than below
     it, since there is no below any more. No y — the row is fixed. */
  marks: { x: number; w: number }[];
  legTimer: number;
  legFrame: 0 | 1;
  wingTimer: number;
  wingFrame: 0 | 1;
  shake: number;
};

type Status = "idle" | "running" | "over";

/** Square-wave blip. Cheap, and it sounds like the thing it is. */
function blip(ac: AudioContext | null, freq: number, dur: number, vol = 0.04) {
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "square";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + dur);
}

export default function DinoRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const assetsRef = useRef<Assets | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const gameRef = useRef<Game | null>(null);
  const rafRef = useRef(0);

  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [focused, setFocused] = useState(false);
  /* Separate from `focused`: whether to actually DRAW the ring. `onFocus`
     alone cannot tell a Tab from a click, and the frame calls .focus()
     itself on pointerdown so the browser's own :focus-visible heuristic
     cannot either — a scripted call is focus-visible-eligible in Chromium
     no matter what triggered it. `viaPointer` is set right before that
     scripted call and read once, in the very next onFocus, so the ring only
     ever shows for a focus that arrived some other way — Tab. */
  const [ringVisible, setRingVisible] = useState(false);
  const viaPointer = useRef(false);

  const statusRef = useRef(status);
  statusRef.current = status;

  /* World width lives in BOTH a ref and state on purpose: the draw loop and
     the physics read the ref every frame without re-subscribing, while the
     state exists only to resize the canvas element itself on re-render. */
  const [worldW, setWorldW] = useState(DEFAULT_W);
  const wRef = useRef(DEFAULT_W);

  const newGame = useCallback(() => {
    gameRef.current = {
      speed: 3.4,
      dist: 0,
      score: 0,
      y: 0,
      vy: 0,
      holding: false,
      obstacles: [],
      spawnIn: 220,
      clouds: Array.from({ length: 5 }, () => ({
        x: Math.random() * wRef.current,
        y: 10 + Math.random() * 34,
        w: 10 + Math.floor(Math.random() * 14),
      })),
      marks: Array.from({ length: 26 }, () => ({
        x: Math.random() * wRef.current,
        w: 2 + Math.floor(Math.random() * 4),
      })),
      legTimer: 0,
      legFrame: 0,
      wingTimer: 0,
      wingFrame: 0,
      shake: 0,
    };
    setScore(0);
  }, []);

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    const A = assetsRef.current;
    const g = gameRef.current;
    if (!cv || !A || !g) return;

    const ctx = cv.getContext("2d")!;
    ctx.setTransform(PX, 0, 0, PX, 0, 0);
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, wRef.current, H);

    const sx = g.shake > 0 ? (Math.random() < 0.5 ? -1 : 1) : 0;
    ctx.save();
    ctx.translate(sx, 0);

    ctx.fillStyle = PLATE;
    for (const c of g.clouds) {
      const x = Math.round(c.x);
      const y = Math.round(c.y);
      ctx.fillRect(x + 2, y, c.w - 4, 1);
      ctx.fillRect(x, y + 1, c.w, 2);
      ctx.fillRect(x + 3, y + 3, c.w - 6, 1);
    }

    /* Ground line, then light gaps scrolling through it. The gaps are the only
       speed cue left now that there is no ground below the line to scatter
       debris across, and they read as road surface rushing past. */
    ctx.fillStyle = INK;
    ctx.fillRect(0, GROUND_Y + 1, wRef.current, 1);
    ctx.fillStyle = PLATE;
    for (const m of g.marks) ctx.fillRect(Math.round(m.x), GROUND_Y + 1, m.w, 1);

    for (const o of g.obstacles) {
      if (o.kind === "bird") {
        ctx.drawImage(A.bird[g.wingFrame], Math.round(o.x), Math.round(o.y));
      } else {
        const img = o.kind === "large" ? A.cactusL : A.cactusS;
        for (let i = 0; i < o.count; i++) {
          ctx.drawImage(img, Math.round(o.x) + i * (img.width + 2), GROUND_Y + 1 - img.height);
        }
      }
    }

    const airborne = g.y > 0;
    const img = statusRef.current !== "running" || airborne ? A.still : A.run[g.legFrame];
    ctx.drawImage(img, 24, GROUND_Y + 1 - img.height - Math.round(g.y));

    ctx.restore();
  }, []);

  useEffect(() => {
    assetsRef.current = buildAssets(INK);
    newGame();
    draw();
  }, [newGame, draw]);

  /* Measure the element rather than the viewport, so this stays correct
     whatever the section is nested in. ResizeObserver also catches a
     scrollbar appearing or the device rotating, which a resize listener on
     window can miss. */
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => {
      const next = Math.max(MIN_W, Math.min(MAX_W, Math.round(el.clientWidth / CELL)));
      if (next === wRef.current) return;
      wRef.current = next;
      setWorldW(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Separate from the effect above on purpose. Setting worldW changes the
     canvas's `width` attribute, and changing that attribute CLEARS the
     canvas bitmap per spec — immediately, not on next paint. Drawing inside
     the same tick that calls setWorldW draws onto the canvas as it exists
     BEFORE React applies the new attribute, so the clear happens after and
     wins, leaving a blank, fully transparent canvas until something else
     happens to call draw() again. This effect runs once React has actually
     committed the new width, so it repaints the canvas it is really looking
     at. Caught by focusing the game with no game loop running: the canvas
     went blank and the blue focus plate showed straight through it. */
  useEffect(() => {
    draw();
  }, [worldW, draw]);

  const ensureAudio = () => {
    if (!audioRef.current) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC) audioRef.current = new AC();
    }
    if (audioRef.current?.state === "suspended") void audioRef.current.resume();
  };

  const press = () => {
    const g = gameRef.current;
    if (!g) return;
    if (statusRef.current !== "running") {
      ensureAudio();
      newGame();
      setStatus("running");
      return;
    }
    if (g.y > 0) return; // no double jump
    g.vy = -6.4;
    g.holding = true;
    blip(audioRef.current, 660, 0.07);
  };

  const release = () => {
    if (gameRef.current) gameRef.current.holding = false;
  };

  /* Keyboard binds ONLY while the frame has focus, so the game never takes
     Space away from scrolling the rest of the page. */
  useEffect(() => {
    const keys = [" ", "Spacebar", "ArrowUp", "w", "W", "Enter"];
    const down = (e: KeyboardEvent) => {
      if (!focused || e.repeat) return;
      if (keys.includes(e.key)) {
        e.preventDefault();
        press();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (keys.includes(e.key)) release();
    };
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused]);

  // Leaving the tab mid-run ends the run rather than letting it die unseen.
  useEffect(() => {
    const onHide = () => {
      if (document.hidden && statusRef.current === "running") setStatus("over");
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  useEffect(() => {
    if (status !== "running") {
      draw();
      return;
    }
    let last = performance.now();

    const step = (now: number) => {
      const g = gameRef.current;
      if (!g) return;
      const dt = Math.min((now - last) / (1000 / 60), 3);
      last = now;

      g.speed = Math.min(9.5, g.speed + 0.0016 * dt);
      const move = g.speed * dt;
      g.dist += move;

      const next = Math.floor(g.dist / 6);
      if (next !== g.score) {
        if (next > 0 && next % 100 === 0) {
          blip(audioRef.current, 880, 0.09, 0.03);
        }
        g.score = next;
        setScore(next);
      }

      // Lighter gravity while held, so a held key jumps higher.
      if (g.y > 0 || g.vy < 0) {
        const grav = g.holding && g.vy < 0 ? 0.34 : 0.5;
        g.vy += grav * dt;
        g.y -= g.vy * dt;
        if (g.y <= 0) {
          g.y = 0;
          g.vy = 0;
        }
      }

      g.legTimer += dt;
      if (g.legTimer > Math.max(3, 9 - g.speed)) {
        g.legTimer = 0;
        g.legFrame = g.legFrame === 0 ? 1 : 0;
      }
      g.wingTimer += dt;
      if (g.wingTimer > 10) {
        g.wingTimer = 0;
        g.wingFrame = g.wingFrame === 0 ? 1 : 0;
      }

      for (const c of g.clouds) {
        c.x -= move * 0.22;
        if (c.x < -30) {
          c.x = wRef.current + Math.random() * 40;
          c.y = 10 + Math.random() * 34;
        }
      }
      for (const m of g.marks) {
        m.x -= move;
        if (m.x < -8) {
          m.x = wRef.current + Math.random() * 60;
          m.w = 2 + Math.floor(Math.random() * 4);
        }
      }

      g.spawnIn -= move;
      if (g.spawnIn <= 0) {
        g.spawnIn = 120 + g.speed * 22 + Math.random() * 90;
        const roll = Math.random();
        if (g.score > 260 && roll < 0.24) {
          /* One height only, and a low one. There is no duck — jump is the
             only move — so a bird that flies any higher reads as a "duck
             under this" obstacle it is impossible to actually duck under.
             GROUND_Y - 17 clears with margin to spare even on the shortest
             possible tap (needs g.y >= 14; a bare tap reaches ~38). */
          g.obstacles.push({
            kind: "bird",
            x: wRef.current + 10,
            y: GROUND_Y - 17,
          });
        } else if (roll < 0.62) {
          g.obstacles.push({
            kind: "small",
            x: wRef.current + 10,
            count: 1 + Math.floor(Math.random() * 3),
            w: 11,
            h: 16,
          });
        } else {
          g.obstacles.push({
            kind: "large",
            x: wRef.current + 10,
            count: 1 + Math.floor(Math.random() * 2),
            w: 13,
            h: 22,
          });
        }
      }

      for (const o of g.obstacles) o.x -= move;
      g.obstacles = g.obstacles.filter((o) => o.x > -80);

      // Hitbox is inset, so a near miss reads as a miss.
      const dino = { x: 28, y: GROUND_Y + 1 - 22 - g.y, w: 12, h: 20 };
      let hit = false;
      for (const o of g.obstacles) {
        const box =
          o.kind === "bird"
            ? { x: o.x + 2, y: o.y + 2, w: 14, h: 7 }
            : {
                x: o.x + 2,
                y: GROUND_Y + 1 - o.h + 1,
                w: o.count * (o.w + 2) - 6,
                h: o.h - 2,
              };
        if (
          dino.x < box.x + box.w &&
          dino.x + dino.w > box.x &&
          dino.y < box.y + box.h &&
          dino.y + dino.h > box.y
        ) {
          hit = true;
          break;
        }
      }

      if (g.shake > 0) g.shake -= dt;

      if (hit) {
        g.shake = 8;
        blip(audioRef.current, 200, 0.16, 0.05);
        setTimeout(() => blip(audioRef.current, 120, 0.22, 0.05), 90);
        draw();
        setStatus("over");
        return;
      }

      draw();
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [status, draw]);

  const onPointerDown = () => {
    viaPointer.current = true;
    frameRef.current?.focus();
    ensureAudio();
    press();
  };

  const pad = (n: number) => String(n).padStart(5, "0");

  return (
    <div className="w-full">
      {/* The canvas goes full-bleed but the hint does not — text running to
          the very edge of the viewport reads as a bug. It keeps the same
          container as the rest of the page so it lines up with the sections
          above it. */}
      <p className="mx-auto mb-12 w-full max-w-wide px-16 font-mono text-[9px] tracking-[0.02em] text-mute">
        {/* Branch in CSS, not JS: picking the wording from a media query at
            render time would differ between server and client. */}
        <span className="md:hidden">Tap to jump</span>
        <span className="hidden md:inline">Space to jump · hold for height</span>
      </p>

      {/* No frame, and no .focusable plate. A filled bar across a full-bleed
          element read as a stray blue stripe rather than a focus ring, and it
          fired on a plain click as well as on Tab, which is not what "focus
          indicator" is for.

          Still not unconditionally invisible, though — §11 and the rule in
          globals.css both say never remove focus indication, and this
          element captures Space, so a keyboard user who tabs onto it needs
          SOME signal that the key now drives the dino instead of scrolling
          the page. `ringVisible` is driven in JS rather than CSS
          :focus-visible: the frame calls .focus() itself below, and a
          scripted call is focus-visible-eligible in Chromium no matter what
          triggered it, which made the CSS-only version show the ring on a
          plain click too. Explicit state means it shows for keyboard focus
          only, ever — and it is a thin inset ink ring, not a filled bar. */}
      <div
        ref={frameRef}
        tabIndex={0}
        role="application"
        aria-label="Dino Runner. Press space or tap to jump."
        onFocus={() => {
          setFocused(true);
          setRingVisible(!viaPointer.current);
          viaPointer.current = false;
        }}
        onBlur={() => {
          setFocused(false);
          setRingVisible(false);
        }}
        onPointerDown={onPointerDown}
        onPointerUp={release}
        onPointerLeave={release}
        className={`relative block w-full touch-none select-none ${
          ringVisible
            ? "outline outline-2 -outline-offset-2 outline-ink"
            : "outline-none"
        }`}
      >
        <canvas
          ref={canvasRef}
          width={worldW * PX}
          height={H * PX}
          className="pixelated block h-auto w-full"
        />

        <div className="pointer-events-none absolute right-12 top-12 font-pix text-[11px] leading-none tracking-[0.08em] text-ink">
          {pad(score)}
        </div>

        {status !== "running" && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 px-16 text-center">
            <p
              className="font-pix tracking-[0.14em] text-ink"
              style={{ fontSize: status === "over" ? 20 : 16 }}
            >
              {status === "over" ? "GAME OVER" : "DINO RUNNER"}
            </p>

            {/* Never "click to focus". Space is bound only while the frame
                has focus, so before the first click the honest instruction
                is to click — and clicking both focuses AND starts the run.
                Once they have played, the frame is focused and space is
                real, so the restart prompt can offer it. */}
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-mute">
              <span className="md:hidden">Tap to {status === "over" ? "run again" : "start"}</span>
              <span className="hidden md:inline">
                {status === "over" && focused ? "Press space to run again" : "Click to start"}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
