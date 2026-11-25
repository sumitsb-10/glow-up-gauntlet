# Glow-Up Gauntlet

An offline, touch-first in-store game for the **Intel AI PC** — built for the Intel 1 Million Minds Round 1 brief.

A shopper walks up, taps once, and in about two and a half minutes feels the difference between a cheap laptop and an AI PC: the old machine lags and crashes under their finger, then three on-device AI challenges snap to life. It ends with a personalised match card they can screenshot and take to the counter.

**No install. No server. No network. No accounts. No API keys.** Open `index.html` and play.

---

## Run it

1. Use Windows Chrome or Edge.
2. Double-click `index.html` (or drag it into a browser window).
3. Press **F11** for fullscreen on a store demo machine.

Sound is **off by default** for store use. The toggle is bottom-right; the choice persists in `localStorage` under `gg.muted`.

The game works from `file://` because every script is a classic `<script>` tag, every asset is inline, and there is no build step.

---

## The 2:30 experience

| Beat | Scene | What happens |
| --- | --- | --- |
| 0:00 | Attract | `WOULD YOUR LAPTOP SURVIVE YOUR LIFE?` + `TAP TO PLAY`. Any tap starts. |
| 0:10 | Intro | Pick a vibe: Student, Creator or Hustler. This sets the final match. |
| 0:25 | Challenge 1 — The Deadline | Taps respond ~400 ms late, the fan spins up, the old PC stops responding. `OKAY. USE THE AI PC` rescues instantly. Then search 12 files, open the assignment, ask a question, submit. |
| 1:05 | Challenge 2 — The Photobomber | Export crashes at 99%. On the AI PC, tap the uninvited guy, remove him with on-device generative fill, drag the frame wider, post. |
| 1:45 | Challenge 3 — 2AM Idea | Wi-Fi is off. Pick Vibe / Type / Finish, watch the poster recompose, post it. |
| 2:15 | Verdict | Three receipts, then the trap flip: the pretty cheap laptop can't run any of it. The Intel AI PC runs all three. |
| 2:35 | Match | `YOUR MATCH`, the vibe line, the spec, `3 receipts · none uploaded · Wi-Fi off`, and `Screenshot this.` |

No shopper is ever timed out mid-challenge. Idle resets only on the attract screen (25 s) and the match card (45 s).

---

## Deep links (testing and judging)

`index.html?scene=<name>` boots straight into a scene:

`attract` · `intro` · `ch1` · `ch2` · `ch3` · `verdict` · `match`

Phase links for demos and screenshots:

- `?scene=ch1&phase=ai` — AI search already open
- `?scene=ch1&phase=doc` — document Q&A open
- `?scene=ch1&phase=crash` — the old PC has stopped responding
- `?scene=ch2&phase=remove` — the photobomber is ready to tap
- `?scene=ch2&phase=extend` — the frame handle is live
- `?scene=ch2&phase=done` — frame extended, ready to post
- `?scene=ch3&phase=receipt` — posts automatically, shows the receipt
- `?scene=verdict&phase=run` — runs the trap flip automatically

Deep links are debug/demo shortcuts. A real run always starts at the attract screen.

---

## 30-second demo script for the counter

> "Don't read the spec sheet. Try this."

1. **Hand it over at the attract screen.** Let them tap.
2. **Let them pick their vibe.** "That decides your match at the end."
3. **Challenge 1:** let them tap the file twice. Point at the fan meter and the `NOT RESPONDING` card. "That's the cheap one. Now the Intel one." Tap `OKAY. USE THE AI PC`. "Ask it anything about a 40-page PDF. Wi-Fi is off."
4. **Challenge 2:** "He was not invited." Let them tap him and remove him. "That happened on the laptop. The photo never uploaded."
5. **Challenge 3:** "Wi-Fi is still off. Make a poster." They pick three chips; it recomposes instantly.
6. **Verdict:** "Run the AI stuff." The pretty laptop greys out. "That's the one that looks better on the shelf."
7. **Match:** "That's your match. Screenshot it and ask for the AI PC at the counter."

If they only have a minute, start at `?scene=ch1&phase=ai`, do the document question and the photobomber, then jump to `?scene=verdict&phase=run`.

---

## What is real, what is authored

- The AI answers, search results, photo removal and poster compositions are **authored and deterministic**. There is no live model, no cloud call and no network request.
- Receipts are **qualitative on purpose** — no invented benchmark decimals, no fake percentages.
- Every screen carries `Concept demo · illustrative. Not a product claim.`
- The "pretty one" is a composite of budget-laptop compromises, not a real product.

This is a concept demo built for a hackathon brief, not a shipping product or an Intel statement.

---

## Accessibility and kiosk behaviour

- Touch targets are at least 64 px; every primary action is a real `<button>`.
- Keyboard: the play button is focused on load; `Enter`/`Space` work on native controls; the photobomber is focusable with `role="button"`; the frame handle is a `role="slider"` with arrow-key and `Enter` support.
- Receipts are `role="dialog"` with a live headline and focus moved to **Next**.
- `prefers-reduced-motion: reduce` collapses every animation to 1 ms / one iteration; the full game still completes.
- Audio is unlocked on the first interaction and stays silent if the browser blocks it. Muted is the default.
- Focus-visible rings on every custom control; status changes are shown with text and shape, not colour alone.
- The 1280×800 stage scales to fit the viewport and letterboxes on near-black. Nothing scrolls.

---

## QA results — 2026-11-25

All runs on Windows, headless Microsoft Edge, from `file://`.

| Check | Result |
| --- | --- |
| `node --test` (machine, poster, match) | **9/9 pass** |
| Full run at 1280×800 | pass — 3 receipts, `THE STUDENT`, `3 receipts · none uploaded · Wi-Fi off`, stage fits |
| Full run at 1024×768 | pass — stage fits, no scrollbars |
| Full run at 1920×1080 | pass — stage fits, no scrollbars |
| Touch start + drag/tap | pass — synthetic touch pointers start the game, drag the frame to 90 px, tap to 160 px |
| Keyboard path | pass — play focus, native buttons, bomber `Enter`, slider arrows/`Enter`, receipt focus |
| Reduced motion | pass — full run completes, animations 0.001 s / 1 iteration |
| Muted by default + persistence | pass — `aria-pressed`, `gg.muted` round-trip |
| Deep links, all 7 scenes | 7/7 pass |
| Rapid taps | triple-tap play/vibe/next lands correctly; invalid jump blocked |
| Double taps | ch1 submit records one receipt; verdict flip cannot be skipped |
| Scene cleanup stress | 10 × `ch1 → attract → ch1`, one `.lp` / 12 files each time, zero console errors |

Screenshots live in `shots/` (attract, intro, each challenge, verdict, match, plus 1024/1920 checks).

---

## Tests and tools

```powershell
# logic tests
node --test

# full playthrough, ends on the match card
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html" --script scripts/tests/full.js --shot-after shots/match-live.png

# accessibility / input paths
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html" --script scripts/tests/a11y.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=ch2&phase=extend" --script scripts/tests/touch.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html" --script scripts/tests/stress.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html" --script scripts/tests/rapid.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=ch1&phase=doc" --script scripts/tests/double-submit.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=verdict" --script scripts/tests/double-cta.js

# reduced motion
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html" --script scripts/tests/full.js --reduce

# headless smoke / screenshot helpers
powershell -ExecutionPolicy Bypass -File scripts/smoke.ps1 -Scene ch1
powershell -ExecutionPolicy Bypass -File scripts/shot.ps1 -Scene "verdict&phase=run" -Out shots/verdict.png
```

`scripts/e2e.mjs` is a small Chrome DevTools Protocol driver: it boots Edge headlessly, waits for `data-ready="1"`, runs a script from `--script`, and optionally saves `--shot-after`. Flags: `--w`, `--h`, `--reduce`.

---

## Structure

```
index.html                 shell + script order
css/main.css               tokens, stage, buttons, receipt
css/scenes.css             per-scene layout
js/core.js                 router, GG.nav retry, timers, audio, receipt
js/lib/machine.js          pure transition table (enforced by the router)
js/lib/poster.js           deterministic poster composition (27 combos)
js/lib/match.js            match copy + receipt tally
js/art.js                  inline SVG avatars, icons, group photo
js/scenes/*.js             attract, intro, ch1, ch2, ch3, verdict, match
js/app.js                  boot, mute, idle watcher
test/*.test.js             node:test logic suites
scripts/                   CDP e2e driver, smoke, screenshots, test scripts
docs/                      design doc + implementation plan
```

---

## Known limits

- The stage is a fixed 1280×800 design scaled with `transform`; portrait phones show a rotate hint. iPad is layout-only, not the deployment target.
- No score is persisted; **Play Again** or a reload resets everything.
- `localStorage` can be blocked on some `file://` configurations; mute then falls back to the in-session default.
- The match card is screenshot-optimised; there is intentionally no PNG download and no QR code.
- Audio is generated with WebAudio and is deliberately sparse; it is not required to complete any step.
