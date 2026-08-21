"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { INK, PAPER, PLATE } from "@/lib/tokens";
import { loadRuns, saveRun, standing, type Runs, type Standing } from "@/lib/dino-scores";

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

/* World is drawn in logical pixels and scaled by PX, so edges stay hard. */
const W = 400;
const H = 120;
const PX = 3;
const GROUND_Y = 98;

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
  pebbles: { x: number; y: number; w: number }[];
  legTimer: number;
  legFrame: 0 | 1;
  wingTimer: number;
  wingFrame: 0 | 1;
  shake: number;
};

type Status = "idle" | "running" | "over";

/** 1st, 2nd, 3rd, 4th … 11th/12th/13th are the exceptions that catch people. */
function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

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
  const [sound, setSound] = useState(true);

  /* Both start empty and are filled from localStorage in an effect, never in
     the initial state. Reading storage during render makes the server emit 0
     and the client emit the stored value, which is a hydration mismatch. */
  const [runs, setRuns] = useState<Runs>([]);
  const [result, setResult] = useState<Standing | null>(null);

  const soundRef = useRef(sound);
  soundRef.current = sound;
  const statusRef = useRef(status);
  statusRef.current = status;

  const hi = runs.length ? Math.max(...runs) : 0;
  // The loop closes over this, so it must be a ref, not the derived value.
  const runsRef = useRef<Runs>([]);
  runsRef.current = runs;

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
        x: Math.random() * W,
        y: 10 + Math.random() * 34,
        w: 10 + Math.floor(Math.random() * 14),
      })),
      pebbles: Array.from({ length: 26 }, () => ({
        x: Math.random() * W,
        y: GROUND_Y + 3 + Math.random() * 12,
        w: 1 + Math.floor(Math.random() * 3),
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
    ctx.fillRect(0, 0, W, H);

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

    ctx.fillStyle = INK;
    ctx.fillRect(0, GROUND_Y + 1, W, 1);
    ctx.fillStyle = PLATE;
    for (const p of g.pebbles) ctx.fillRect(Math.round(p.x), Math.round(p.y), p.w, 1);

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
    setRuns(loadRuns());
    newGame();
    draw();
  }, [newGame, draw]);

  const ensureAudio = () => {
    if (!soundRef.current) return;
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
    if (soundRef.current) blip(audioRef.current, 660, 0.07);
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
        if (next > 0 && next % 100 === 0 && soundRef.current) {
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
          c.x = W + Math.random() * 40;
          c.y = 10 + Math.random() * 34;
        }
      }
      for (const p of g.pebbles) {
        p.x -= move;
        if (p.x < -4) {
          p.x = W + Math.random() * 60;
          p.y = GROUND_Y + 3 + Math.random() * 12;
        }
      }

      g.spawnIn -= move;
      if (g.spawnIn <= 0) {
        g.spawnIn = 120 + g.speed * 22 + Math.random() * 90;
        const roll = Math.random();
        if (g.score > 260 && roll < 0.24) {
          // Both lanes sit low enough to clear with a jump.
          const lanes = [GROUND_Y - 17, GROUND_Y - 28];
          g.obstacles.push({
            kind: "bird",
            x: W + 10,
            y: lanes[Math.floor(Math.random() * lanes.length)],
          });
        } else if (roll < 0.62) {
          g.obstacles.push({
            kind: "small",
            x: W + 10,
            count: 1 + Math.floor(Math.random() * 3),
            w: 11,
            h: 16,
          });
        } else {
          g.obstacles.push({
            kind: "large",
            x: W + 10,
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
        if (soundRef.current) {
          blip(audioRef.current, 200, 0.16, 0.05);
          setTimeout(() => soundRef.current && blip(audioRef.current, 120, 0.22, 0.05), 90);
        }
        const next = saveRun(g.score);
        setRuns(next);
        setResult(standing(g.score, next));
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
    frameRef.current?.focus();
    ensureAudio();
    press();
  };

  const pad = (n: number) => String(n).padStart(5, "0");

  return (
    <div className="mx-auto w-full max-w-[760px]">
      {/* .focusable gives the notched blue focus plate (§4.2). It ships as
          inline-block; the utility overrides that so the frame still fills
          the column. */}
      <div className="focusable block w-full">
        <div
          ref={frameRef}
          tabIndex={0}
          role="application"
          aria-label="Dino Runner. Press space or tap to jump."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onPointerDown={onPointerDown}
          onPointerUp={release}
          onPointerLeave={release}
          className="well relative block touch-none select-none bg-paper outline-none"
        >
          <canvas
            ref={canvasRef}
            width={W * PX}
            height={H * PX}
            className="pixelated block h-auto w-full"
          />

          <div className="pointer-events-none absolute right-12 top-12 flex gap-16 font-pix text-[11px] leading-none tracking-[0.08em]">
            <span className="text-mute">HI {pad(hi)}</span>
            <span className="text-ink">{pad(score)}</span>
          </div>

          {status !== "running" && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 px-16 text-center">
              <p
                className="font-pix tracking-[0.14em] text-ink"
                style={{ fontSize: status === "over" ? 20 : 16 }}
              >
                {status === "over" ? "GAME OVER" : "DINO RUNNER"}
              </p>

              {/* The standing only means something once there is history to
                  rank against, so a first-ever run says nothing rather than
                  claiming a meaningless 1st of 1. */}
              {status === "over" && result && (
                <p className="font-mono text-[11px] uppercase tracking-[0.1em]">
                  {result.isBest ? (
                    <span className="bg-lime px-8 py-4 text-ink">New best</span>
                  ) : result.beatPct !== null ? (
                    <span className="text-ink">
                      {ordinal(result.place)} of {result.total} runs
                      <span className="text-mute"> · beat {result.beatPct}%</span>
                    </span>
                  ) : null}
                </p>
              )}

              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-mute">
                {focused ? "Press space to run" : "Click to focus, then space"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Only appears once there is something to show, so a first-time visitor
          sees a game rather than an empty stats panel. */}
      {runs.length > 1 && (
        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.1em] text-mute">
          Recent{" "}
          {runs.slice(0, 5).map((r, i) => (
            <span key={i} className={r === hi ? "text-ink" : undefined}>
              {i > 0 && " · "}
              {pad(r)}
            </span>
          ))}
          <span className="text-mute"> · {runs.length} runs on this device</span>
        </p>
      )}

      <div className="mt-12 flex flex-wrap items-center justify-between gap-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-mute">
          Space or tap to jump · hold for height
        </p>
        <span className="focusable">
          <button
            type="button"
            onClick={() => {
              setSound((s) => !s);
              frameRef.current?.focus();
            }}
            aria-pressed={sound}
            className={`sp sp-neutral-3 sp-s3 ${sound ? "" : "sp-sunk"} inline-flex min-h-[44px] items-center px-12 font-mono text-[9px] uppercase tracking-[0.11em] ${
              sound ? "text-ink" : "text-mute"
            }`}
          >
            Sound {sound ? "on" : "off"}
          </button>
        </span>
      </div>
    </div>
  );
}
