# Era · YYYY — <name>

> Copy this file to `docs/eras/<era>.md` and replace every `TODO`.
> An era file describes **how** the era looks. It never changes **what** components exist or how they behave — that's `core.md`.
> Read only this era file while building it. Do not open other era files for reference.

**Status:** ⬜ Not started · 🟨 Specified · 🟦 Built · ✅ Passes specimen

---

## 1. Identity

**Reference point:** TODO — the specific products/hardware this era evokes
**One-line look:** TODO
**What arrives in this era** (vs. the previous one): TODO
**What leaves:** TODO

**Evoke, don't copy.** List anything that must be drawn original rather than reproduced (system fonts, OS chrome, trademarked UI):
- TODO

## 2. Fonts

| Role | Face | Licence | Why this face |
|---|---|---|---|
| Statement | TODO | TODO | TODO |
| Label | TODO | TODO | TODO |
| Sentence | TODO — must pass `core.md` §2.3a | TODO | TODO |

Weights loaded: TODO

Sentence face legibility test (`core.md` §2.3a) — result and date: TODO
Fallback metrics (`size-adjust` / `ascent-override`): TODO

- Sentence face must ship real **400, 500, 600** — no synthesised weights (`font-synthesis: none` is global)
- Single-weight statement face? Set `--statement-weight` and `--statement-weight-strong` to the same value
Statement case: TODO (`uppercase` / `none`)

## 3. Colour tokens

Fill all 19. Give each pair its contrast ratio.

| Token | Value | Notes |
|---|---|---|
| `--bg` | TODO | |
| `--bg-inverse` | TODO | |
| `--surface` | TODO | |
| `--surface-sunk` | TODO | |
| `--line` | TODO | |
| `--outline` | TODO | |
| `--text` | TODO | ratio on bg: |
| `--text-muted` | TODO | ratio on bg (≥4.5): |
| `--text-inverse` | TODO | ratio on bg-inverse: |
| `--text-inverse-muted` | TODO | ratio (≥4.5): |
| `--accent` | TODO | |
| `--on-accent` | TODO | ratio (≥4.5): |
| `--action` | TODO | |
| `--on-action` | TODO | ratio (≥4.5): |
| `--error` | TODO | ratio on bg (≥4.5): |
| `--error-surface` | TODO | |
| `--focus` | TODO | ratio vs neighbours (≥3): |
| `--selection` | TODO | |
| `--on-selection` | TODO | |

## 4. Frames

**Frame kind:** `sprite` or `css` — TODO

How raised looks: TODO
How sunk looks: TODO

If this era renders raised and sunk similarly (flat eras), say how the **meaning** is still expressed:
TODO

## 5. Shape and depth

| Token | Value | Notes |
|---|---|---|
| `--corner` | TODO | |
| `--corner-tab` | TODO | |
| `--radius` | TODO | |
| `--border-w` | TODO | |
| `--shadow-raised` | TODO | |
| `--shadow-sunk` | TODO | |
| `--shadow-offset` | TODO | |

## 6. Motion

| Token | Value |
|---|---|
| `--reveal-anim` | TODO — keyframes named `*-<era>` |
| `--reveal-duration` | TODO |
| `--reveal-timing` | TODO |
| `--statement-reveal` | TODO |
| `--type-speed` | TODO |
| `--hover-timing` | TODO |

Reveal technique in words: TODO

## 7. Assets

| Token | Value | Notes |
|---|---|---|
| `--icon-set` | TODO | |
| `--frame-kind` | TODO | |
| `--portrait` | TODO | describe the technique |

## 8. Era-specific rules

**Always in this era:**
- TODO

**Never in this era:**
- TODO

## 9. Open questions

- TODO — anything not yet decided. Move to `DECISIONS.md` once resolved.
