/**
 * Dino Runner score history.
 *
 * Local to the visitor's own device. There is no server and no leaderboard:
 * "rank" here means where a run sits among that person's own past runs, which
 * is the only ranking this site can make honestly without a backend.
 *
 * Every read and write is wrapped. localStorage throws rather than returning
 * null in two ordinary situations — Safari private browsing, and any browser
 * with site data blocked — and a game that crashes the homepage because
 * storage is disabled is a much worse outcome than a game that forgets.
 */

const KEY = "dino.runs.v1";

/** Kept small on purpose: enough to rank against, not a lifetime archive. */
const MAX_RUNS = 50;

export type Runs = number[];

export function loadRuns(): Runs {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    // Anything can be in localStorage — another script, an older build, a
    // hand-edited value. Only keep what is actually a finite score.
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((n): n is number => typeof n === "number" && Number.isFinite(n) && n >= 0)
      .slice(0, MAX_RUNS);
  } catch {
    return [];
  }
}

/** Appends a run, newest first, and returns the trimmed list. */
export function saveRun(score: number): Runs {
  const next = [score, ...loadRuns()].slice(0, MAX_RUNS);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Storage full or blocked. The run still counts for this session.
    }
  }
  return next;
}

export type Standing = {
  /** 1 = best run they have ever had. */
  place: number;
  total: number;
  best: number;
  /** Percent of their runs this one beat, 0-100. Null on a first-ever run. */
  beatPct: number | null;
  isBest: boolean;
};

/**
 * Where `score` places among `runs`. `runs` must already include this score.
 *
 * Ties place optimistically: matching your best reads as first, not second,
 * because being told you came second to yourself is a strange way to describe
 * equalling a record.
 */
export function standing(score: number, runs: Runs): Standing {
  const total = runs.length;
  const better = runs.filter((r) => r > score).length;
  const place = better + 1;
  const best = runs.length ? Math.max(...runs) : score;
  // Compared against the OTHER runs, so a first-ever run has nothing to beat
  // rather than beating 100% of a field of one.
  const others = total - 1;
  const beaten = runs.filter((r) => r < score).length;
  return {
    place,
    total,
    best,
    beatPct: others > 0 ? Math.round((beaten / others) * 100) : null,
    isBest: score >= best,
  };
}
