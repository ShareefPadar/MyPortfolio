import type { IconSize } from "@/lib/tokens";

/**
 * The icon set (spec §4.7). Twenty 8×8 pixel maps.
 *
 * Rendered as inline SVG rects rather than PNG because icons must inherit
 * `currentColor`, which a raster cannot do. Server-renderable, no extra
 * requests, and crisp at every allowed size.
 */
export const ICONS = {
  arrowR:   ["........", "...XX...", "....XX..", "XXXXXXX.", "XXXXXXX.", "....XX..", "...XX...", "........"],
  arrowL:   ["........", "...XX...", "..XX....", ".XXXXXXX", ".XXXXXXX", "..XX....", "...XX...", "........"],
  arrowU:   ["........", "...XX...", "..XXXX..", ".XX..XX.", "...XX...", "...XX...", "...XX...", "........"],
  arrowD:   ["........", "...XX...", "...XX...", "...XX...", ".XX..XX.", "..XXXX..", "...XX...", "........"],
  external: ["..XXXXX.", "..XXXXX.", ".....XX.", "....XX..", "...XX...", "..XX....", ".XX.....", "........"],
  download: ["...XX...", "...XX...", "...XX...", "XXXXXXXX", ".XXXXXX.", "..XXXX..", "...XX...", "........"],
  play:     [".XX.....", ".XXXX...", ".XXXXXX.", ".XXXXXXX", ".XXXXXXX", ".XXXXXX.", ".XXXX...", ".XX....."],
  close:    ["........", ".XX...XX", "..XX.XX.", "...XXX..", "...XXX..", "..XX.XX.", ".XX...XX", "........"],
  plus:     ["........", "...XX...", "...XX...", "XXXXXXXX", "XXXXXXXX", "...XX...", "...XX...", "........"],
  minus:    ["........", "........", "........", "XXXXXXXX", "XXXXXXXX", "........", "........", "........"],
  chevron:  ["........", "........", "XX....XX", ".XX..XX.", "..XXXX..", "...XX...", "........", "........"],
  check:    ["........", "......XX", ".....XX.", "XX..XX..", "XXX.XX..", ".XXXX...", "..XX....", "........"],
  warning:  ["...XX...", "...XX...", "..XXXX..", "..X..X..", ".XX..XX.", ".XXXXXX.", "XXX..XXX", "XXXXXXXX"],
  info:     ["XXXXXXXX", "X......X", "X..XX..X", "X......X", "X..XX..X", "X..XX..X", "X......X", "XXXXXXXX"],
  clock:    ["..XXXX..", ".X....X.", "X..X...X", "X..X...X", "X..XXX.X", "X......X", ".X....X.", "..XXXX.."],
  search:   [".XXXX...", "X....X..", "X....X..", "X....X..", ".XXXX...", "....XXX.", ".....XXX", "......XX"],
  mail:     ["........", "XXXXXXXX", "XXX..XXX", "X.XXXX.X", "X..XX..X", "X......X", "XXXXXXXX", "........"],
  copy:     ["..XXXXX.", "..X...X.", "XXXXX.X.", "X...X.X.", "X...XXX.", "X...X...", "X...X...", "XXXXX..."],
  grid:     ["XXX.XXX.", "XXX.XXX.", "XXX.XXX.", "........", "XXX.XXX.", "XXX.XXX.", "XXX.XXX.", "........"],
  menu:     ["........", "XXXXXXXX", "XXXXXXXX", "........", "XXXXXXXX", "XXXXXXXX", "........", "........"],
} as const;

export type IconName = keyof typeof ICONS;

type Props = {
  name: IconName;
  /** 8 | 16 | 24 | 32 | 48 only. Anything else is a type error, by design. */
  size?: IconSize;
  /** Accessible name. Omit for decorative icons beside a visible label. */
  label?: string;
  className?: string;
};

/**
 * Collapse each row's runs of X into single rects, so an icon is ~4 rects
 * instead of ~30. Keeps the DOM small when a page has many icons.
 */
function runs(map: readonly string[]) {
  const out: { x: number; y: number; w: number }[] = [];
  map.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] === "X") {
        let w = 1;
        while (row[x + w] === "X") w++;
        out.push({ x, y, w });
        x += w;
      } else x++;
    }
  });
  return out;
}

const PixelIcon = ({ name, size = 16, label, className = "" }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 8 8"
    fill="currentColor"
    shapeRendering="crispEdges"
    className={className}
    role={label ? "img" : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    focusable="false"
  >
    {runs(ICONS[name]).map((r, i) => (
      <rect key={i} x={r.x} y={r.y} width={r.w} height={1} />
    ))}
  </svg>
);

export default PixelIcon;
