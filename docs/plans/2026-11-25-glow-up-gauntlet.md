# Glow-Up Gauntlet — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-contained, offline, touch-first browser game that makes a Gen-Z shopper feel the difference an Intel AI PC makes, in ~2:30, and hands them a personalized match card.

**Architecture:** Vanilla HTML/CSS/JS, classic `<script>` tags (no ES modules — `file://` blocks them), no build step, no dependencies, no network calls. A single state machine routes between full-screen scenes; each scene is a self-registering object with `mount(root)` / `unmount()`. Pure logic (routing, poster composition, match copy) lives in UMD-style modules so `node --test` can exercise it without a DOM. All art is inline SVG generated in JS.

**Tech Stack:** HTML, CSS, vanilla ES2020, WebAudio, `node:test` for logic tests, headless Edge for smoke checks.

**Spec:** `docs/2026-11-25-glow-up-gauntlet-design.md`

## Global Constraints

- **No network at runtime.** No CDN, no external fonts, no `fetch()`, no external images. Every asset is inline.
- **No build step.** Opening `index.html` from `file://` in Chrome/Edge must work. Classic scripts only; no `type="module"`.
- **Deployment target:** Windows Chrome/Edge, 1280×800–1920×1080 landscape, touch or mouse. iPad is layout-only.
- **Copy rules:** no jargon before a receipt card; no typing required; no fake benchmark decimals; footer reads `Concept demo · illustrative. Not a product claim.`
- **Interaction rules:** ≥64px touch targets; no hover-only affordances; nothing auto-advances; no shopper is ever timed out.
- **Colour tokens:** `--ink:#08090C`, `--blue:#0068B5`, `--blue-hi:#4DA3FF`, `--acid:#D6FF3F`, `--paper:#F4F1EA`, `--dim:#8A8F98`.
- **Stage:** fixed 1280×800 design stage, scaled with `transform: scale()` to fit the viewport and letterboxed on `--ink`.

## Review Focus

1. **Repeated or rapid taps** — a shopper hammering the screen during the lag gag must not double-mount a scene, stack timers, or skip a challenge. `nextScene` must return `null` for invalid transitions and the router must ignore a transition while one is in flight.
2. **The lag gag must always be escapable** — if the player taps the "Use the AI PC" button, input must recover instantly and permanently; the 400ms delay must never outlive the gag.
3. **Leaving a scene** — returning to attract or restarting mid-challenge must clear that scene's timers, animation frames and audio nodes, or the next run inherits ghosts.
4. **Narrow/short viewports (1024×768)** — the 1280×800 stage is scaled, so no content may overflow the stage box; every CTA must be reachable without scrolling.
5. **Silent and reduced-motion paths** — the game must be fully playable with audio blocked (autoplay policy) and with `prefers-reduced-motion: reduce`, with no missing state and no stuck animation.

## Shipped deviations (2026-11-25)

The build follows this plan except where noted. These are deliberate, reviewed deviations, not unfinished plan items.

- **Linear 7-scene graph.** Receipts are overlays inside each challenge, so the scene list is `attract → intro → ch1 → ch2 → ch3 → verdict → match`. There are no `r1–r3` scenes; `ch1|next` etc. advance directly. Deep links and the pure `machine.js` table match the shipped graph.
- **No `GG.cleanup` registry.** Every scene's async work goes through `GG.timers` / `GG.raf`, which the router drains centrally on transition. An unused parallel registry would be dead code.
- **12 file cards, not 30.** Enough decoys to read as a messy desktop at 1280×800 while keeping every card a ≥64 px target and the search reveal legible.
- **4 friends, not 5.** Composition balances at the narrowest supported stage; the photobomber joke still reads.
- **40 pages, not 22.** The document and footer copy now agree (`40 pages`, `page 12 of 40`) with the verdict ability line.
- **120 px handle hit zone, 30 px visual.** The hit area meets touch guidance; the focus ring is painted on the 30 px visual via `::before`.
- **Challenge 3 starts neutral and gates POST.** No chip is pre-pressed; the poster shows a `PICK …` placeholder; POST stays disabled until Vibe, Type and Finish are all chosen.
- **Verdict sequences the flip.** Pretty abilities grey one at a time, then the Intel card lights and flashes, then the tally appears; the CTA stays disabled until the sequence ends. Reduced motion fast-paths to the final state.
- **Skip and hint on every challenge.** A visible 64 px **Skip this one** advances without a receipt; after ~12 s idle the next valid target pulses. Skipping all three still seeds the verdict's three demo receipts so the match card remains coherent.
- **Receipt/crash modals.** Receipts make the scene and mute `inert`, trap Tab, and restore focus; the crash card is a focused `role="alertdialog"`.

---

### Task 1: Core shell, stage, router, receipt component

**Files:**
- Create: `index.html`
- Create: `css/main.css`
- Create: `js/lib/machine.js`
- Create: `js/core.js`
- Create: `js/app.js`
- Create: `test/machine.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `machine.nextScene(current: string, action: string) -> string | null` — `null` means "invalid, ignore".
  - `machine.SCENES: string[]` — `['attract','intro','ch1','r1','ch2','r2','ch3','r3','verdict','match']`.
  - `GG.go(name: string, opts?: object): void`, `GG.register(name: string, scene: {mount, unmount}): void`
  - `GG.state: { vibe: string|null, results: Array<{id, line, claim}> }`
  - `GG.receipt(root: Element, data: {lines: string[], headline: string, next: () => void}): void`
  - `GG.on(el, event, handler)`, `GG.timers.after(ms, fn)`, `GG.timers.clear()`
  - `document.documentElement.dataset.scene` reflects the mounted scene; `data-ready="1"` after boot.

- [ ] **Step 1: Write the failing test for the state machine**

```js
// test/machine.test.js
const test = require('node:test');
const assert = require('node:assert');
const machine = require('../js/lib/machine.js');

test('happy path walks every scene in order', () => {
  let s = 'attract';
  const walk = [['start','intro'],['vibe','ch1'],['ch1done','r1'],['next','ch2'],
    ['ch2done','r2'],['next','ch3'],['ch3done','r3'],['next','verdict'],['next','match']];
  for (const [action, expected] of walk) {
    s = machine.nextScene(s, action);
    assert.strictEqual(s, expected);
  }
});

test('invalid actions are ignored, never throw', () => {
  assert.strictEqual(machine.nextScene('ch1', 'vibe'), null);
  assert.strictEqual(machine.nextScene('match', 'ch1done'), null);
  assert.strictEqual(machine.nextScene('nope', 'start'), null);
});

test('restart returns to attract from anywhere', () => {
  for (const s of machine.SCENES) assert.strictEqual(machine.nextScene(s, 'restart'), 'attract');
});

test('idle only resets from attract and match', () => {
  assert.strictEqual(machine.nextScene('attract', 'idle'), 'attract');
  assert.strictEqual(machine.nextScene('match', 'idle'), 'attract');
  assert.strictEqual(machine.nextScene('ch2', 'idle'), null);
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `node --test test/machine.test.js`
Expected: FAIL — `Cannot find module '../js/lib/machine.js'`.

- [ ] **Step 3: Implement `js/lib/machine.js`**

UMD wrapper (`if (typeof module !== 'undefined') module.exports = api; if (typeof window !== 'undefined') (window.GG ||= {}).machine = api;`). Transition table as a `Map` of `"from|action" -> to`; `nextScene` returns `table.get(key) ?? null`; `restart` handled by a single rule for every scene.

- [ ] **Step 4: Run the tests**

Run: `node --test test/machine.test.js`
Expected: PASS, 4 tests.

- [ ] **Step 5: Build `index.html`, `css/main.css`, `js/core.js`, `js/app.js`**

`index.html`: `<div id="stage"><div id="scene"></div></div>` plus `<div id="toast">`, footer disclaimer, script tags in order: `lib/machine.js`, `core.js`, `art.js`, `lib/poster.js`, `lib/match.js`, `scenes/*.js`, `app.js`.

`css/main.css`: tokens in `:root`, `#stage{width:1280px;height:800px;position:absolute;left:50%;top:50%;transform-origin:center}` with `--scale` set by JS, `.screen` base layout, `.btn` (min 64px, acid fill), `.btn-ghost`, `.card`, `.chip`, `.receipt` (monospace, paper background, dashed border), `.grain` overlay, `.pulse` keyframes, `@media (prefers-reduced-motion: reduce)` disabling `.pulse` and transitions.

`core.js`: `GG.stage.fit()` on resize (`scale = Math.min(w/1280, h/800)`); `GG.go` with a `busy` flag, 220ms fade, calls `unmount()` on the outgoing scene and `mount()` on the incoming one, sets `document.documentElement.dataset.scene`; `GG.timers` collects ids and clears on transition; `GG.on` returns an unsubscribe; `GG.receipt` renders lines + headline + a single **Next** button; `GG.audio` is a no-op until `unlock()` is called on the first pointerdown, then WebAudio beeps (`tap`, `whoosh`, `thud`, `chime`).

`app.js`: registers scenes present in `GG.SCENES`, boots to `?scene=` param or `attract`, sets `data-ready="1"`, installs a 25s idle watcher that only acts when the current scene is `attract` or `match`.

- [ ] **Step 6: Smoke-test the shell headlessly**

Run:
```
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --dump-dom "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html" | Select-String 'data-ready="1"'
```
Expected: one matching line. Also load `index.html?scene=attract` and confirm `data-scene="attract"`.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: stage shell, router, receipt component"
```

---

### Task 2: Attract loop and vibe picker

**Files:**
- Create: `js/scenes/attract.js`
- Create: `js/scenes/intro.js`
- Modify: `css/main.css` (attract/intro styles)
- Modify: `js/art.js` (avatar SVGs)

**Interfaces:**
- Consumes: `GG.go`, `GG.state`, `machine.SCENES`.
- Produces: `GG.SCENES.attract`, `GG.SCENES.intro`; `GG.state.vibe ∈ {'student','creator','hustler'|null}`; `GG.art.avatar(vibe) -> string` (SVG markup); `GG.VIBES` copy table `{student:{label,line,verb},creator:{...},hustler:{...}}`.

- [ ] **Step 1: Build the attract screen**

Full-bleed near-black, slow-drifting debris (8 absolutely-positioned spans: tab chips, `notes(3).pdf`, a 3% battery pill, a buffering ring) animated with CSS `translate3d` loops. Headline `WOULD YOUR LAPTOP SURVIVE YOUR LIFE?` at 96px/900 weight, a pulsing acid pill `TAP TO PLAY`, and a subline `90 seconds. No typing. Go.` Any pointerdown on the stage calls `GG.go('intro')`.

- [ ] **Step 2: Build the intro screen**

`FIRST — WHO'S USING THIS LAPTOP?` plus three 340×420 cards in a row. Each card: inline SVG avatar (`GG.art.avatar`), label, one line (`47 tabs. One deadline.` / `Posts daily. Edits at 2am.` / `Side gigs. Zero patience.`). Tap sets `GG.state.vibe` and calls `GG.go('ch1')`. No auto-selection, no timer.

- [ ] **Step 3: Smoke-test both scenes**

Run the headless dump for `?scene=attract` and `?scene=intro`; confirm `data-scene` matches and the headline text appears in the DOM.

- [ ] **Step 4: Visual check at 1024×768 and 1920×1080**

Resize the browser to both sizes with `?scene=attract` and `?scene=intro`; confirm no clipping, all three cards visible, and the stage letterboxes without scrollbars.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: attract loop and vibe picker"
```

---

### Task 3: Challenge 1 — The Deadline

**Files:**
- Create: `js/scenes/ch1.js`
- Create: `js/art.js` (file-card icons, laptop chrome)
- Modify: `css/main.css`

**Interfaces:**
- Consumes: `GG.go`, `GG.state`, `GG.receipt`, `GG.audio`.
- Produces: `GG.SCENES.ch1`; on completion pushes `{id:'deadline', line:'READ ON THIS LAPTOP · WI-FI OFF · NOTHING UPLOADED', claim:'This is the NPU.'}` to `GG.state.results` and goes to `r1` via `GG.receipt`.

- [ ] **Step 1: Build the lag gag**

Render a fake desktop: window chrome, 12 tab chips, a `Find the assignment. Submit it.` banner. `lagUntil` timestamp ~4s. Every tap during the lag: schedule its visual response with `setTimeout(..., 400)`, show a tap ring at the tap point after the delay, raise the fan meter, and after the second tap open a spinner and flip the title to `(Not Responding)`. A persistent acid button `OKAY. USE THE AI PC` is **never** lagged and immediately clears all lag timers and enters phase 2. Guard with `if (phase !== 'lag') return`.

- [ ] **Step 2: Build the AI search phase**

30 file cards in a loose grid (funny decoys: `notes(3).pdf`, `IMG_2041.PNG`, `screenshot 2026-11-24.png`). Search bar with three chips: `assignment`, `receipt`, `screenshot`. Tapping `assignment` fades the 28 non-matching cards out in a 300ms stagger, leaving `Assignment_FINAL_v7.pdf` and `Assignment_FINAL_v6.pdf`. Tapping the v7 card opens a document view with three question chips; tapping any highlights the answer paragraph (pre-authored) and reveals **SUBMIT**. Submit → `GG.audio.chime()` → receipt.

- [ ] **Step 3: Wire the receipt**

`GG.receipt` with the two lines above, headline `This is the NPU.`, body `AI that runs on the machine, not on a server.`, and `Next` → `GG.go('ch2')`.

- [ ] **Step 4: Smoke-test and play through**

Headless check `?scene=ch1` mounts. Then play: confirm taps in the lag phase respond ~400ms late, the AI PC button responds instantly, the chip filter works, and Submit reaches the receipt. Confirm the challenge is completable in under 40s.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: deadline challenge with felt input lag"
```

---

### Task 4: Challenge 2 — The Photobomber

**Files:**
- Create: `js/scenes/ch2.js`
- Modify: `js/art.js` (group-photo SVG, background plate, photobomber layer)
- Modify: `css/main.css`

**Interfaces:**
- Consumes: `GG.go`, `GG.state`, `GG.receipt`, `GG.audio`.
- Produces: `GG.SCENES.ch2`; result `{id:'photo', line:'GENERATIVE FILL · ON-DEVICE · NOTHING UPLOADED', claim:'Your photos never left this laptop.'}`; `GG.art.groupPhoto() -> {svg: string, removeMaskId: string, expandId: string}`.

- [ ] **Step 1: Build the gag**

Photo editor chrome, an edit already applied, `EXPORT` pressed → progress bar to 99% over 1.5s → freeze → `APP CRASHED` stamp → small line `Cool RGB though.` → `USE THE AI PC` button.

- [ ] **Step 2: Build the removal interaction**

Inline SVG group photo, 5 friends + 1 photobomber (flat vector, no real likeness). Prompt `He was not invited.` Tapping the photobomber shows a selection box and three chips `Remove / Erase / Fix`; all three do the same thing (they are flavour, not a quiz). Removal animates a `<mask>` over his shape so the pre-drawn background plate is revealed, with a 500ms brush wipe and a soft `whoosh`. Tapping elsewhere does nothing and must not deselect into a broken state.

- [ ] **Step 3: Build the frame extend**

A right-edge handle (120px wide hit zone, `touch-action:none`) drags the viewBox outward up to 220px, revealing an extended background plate. Pointer events only; also accept arrow-key nudges of 20px when the handle is focused. Then `POST` becomes enabled.

- [ ] **Step 4: Wire the receipt and smoke-test**

Receipt: `GENERATIVE FILL · ON-DEVICE · NOTHING UPLOADED` / `Your photos never left this laptop.` / `No upload, no sign-in, no "processing…"`. Verify `?scene=ch2` mounts, removal works with mouse and touch emulation, extend is clamped, and POST reaches the receipt.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: photobomber challenge with on-device removal"
```

---

### Task 5: Challenge 3 — 2AM Idea

**Files:**
- Create: `js/lib/poster.js`
- Create: `js/scenes/ch3.js`
- Modify: `js/art.js` (poster layer builders)
- Modify: `css/main.css`
- Create: `test/poster.test.js`

**Interfaces:**
- Consumes: `GG.go`, `GG.state`, `GG.receipt`, `GG.audio`.
- Produces:
  - `poster.composePoster({vibe, type, finish}) -> {bg, ink, accent, fontFamily, grain: number, headline: string, sub: string, stickers: string[]}`
  - `poster.VIBES/TYPES/FINISHES` — keyed copy tables with `label` and `swatch`.
  - `poster.allCombos() -> Array<{vibe,type,finish}>` (27).
  - `GG.SCENES.ch3`; result `{id:'poster', line:'WI-FI: OFF · GENERATED ON-DEVICE · NOTHING UPLOADED', claim:'The AI is inside the laptop.'}`

- [ ] **Step 1: Write the failing poster test**

```js
// test/poster.test.js
const test = require('node:test');
const assert = require('node:assert');
const poster = require('../js/lib/poster.js');

test('every combination composes a complete poster', () => {
  const combos = poster.allCombos();
  assert.strictEqual(combos.length, 27);
  const seen = new Set();
  for (const c of combos) {
    const p = poster.composePoster(c);
    for (const k of ['bg','ink','accent','fontFamily','headline','sub']) {
      assert.ok(p[k] && String(p[k]).length, `${k} missing for ${JSON.stringify(c)}`);
    }
    assert.ok(Array.isArray(p.stickers));
    seen.add(p.bg + p.accent + p.fontFamily);
  }
  assert.ok(seen.size >= 9, 'combinations must not collapse to one look');
});

test('unknown keys fall back instead of throwing', () => {
  const p = poster.composePoster({ vibe: 'nope', type: 'nope', finish: 'nope' });
  assert.ok(p.bg && p.headline);
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `node --test test/poster.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `js/lib/poster.js`**

Three copy tables (Vibe: Neon/Y2K/Desi Core; Type: Blocky/Serif Chaos/Handwritten; Finish: Maximal/Clean/Grainy), each entry carrying palette/font/grain values. `composePoster` merges them, uses `??` defaults for unknown keys, and builds `stickers` deterministically from the keys (no `Math.random` — repeated renders must match). Headline is fixed: `YOUR SIDE HUSTLE`; sub is the chosen vibe's tagline.

- [ ] **Step 4: Run the tests**

Run: `node --test test/poster.test.js`
Expected: PASS, 2 tests.

- [ ] **Step 5: Build the scene**

Wi-Fi-off badge pinned top-right for the whole scene. Cloud banner `CLOUD AI: UNAVAILABLE` on entry. Three columns of chips (VIBE / TYPE / FINISH), each chip showing its swatch; one selection per column. Poster canvas re-renders on every selection with a 180ms snap per layer. `POST` target is disabled until all three are chosen, then a drag (pointer) or tap posts it: poster shrinks into the target, confetti, `chime`, receipt.

- [ ] **Step 6: Smoke-test and play through**

Headless check `?scene=ch3`. Play all 27 combos by keyboard-cycling keys in a scratch loop in the console (or spot-check 6); confirm no overlap/clipping in the poster canvas and that every combo is readable.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: 2AM poster challenge with composable art"
```

---

### Task 6: Verdict and match card

**Files:**
- Create: `js/lib/match.js`
- Create: `js/scenes/verdict.js`
- Create: `js/scenes/match.js`
- Create: `test/match.test.js`
- Modify: `css/main.css`

**Interfaces:**
- Consumes: `GG.state.results`, `GG.state.vibe`, `GG.go`.
- Produces:
  - `match.matchFor(vibe: string) -> {title: string, line: string, spec: string}`
  - `match.tally(results: Array<{id,line,claim}>) -> {count: number, uploads: string, wifi: string, fan: string}`
  - `GG.SCENES.verdict`, `GG.SCENES.match`.

- [ ] **Step 1: Write the failing match test**

```js
const test = require('node:test');
const assert = require('node:assert');
const match = require('../js/lib/match.js');

test('each vibe gets a distinct match with a spec line', () => {
  const out = ['student','creator','hustler'].map(v => match.matchFor(v));
  for (const m of out) {
    assert.ok(m.title && m.line && m.spec);
    assert.ok(m.spec.includes('Intel Core Ultra'));
  }
  assert.strictEqual(new Set(out.map(m => m.title)).size, 3);
});

test('unknown vibe falls back, never throws', () => {
  assert.ok(match.matchFor('nope').title);
});

test('tally summarises the three receipts', () => {
  const t = match.tally([
    {id:'deadline',line:'x',claim:'y'},
    {id:'photo',line:'x',claim:'y'},
    {id:'poster',line:'x',claim:'y'},
  ]);
  assert.strictEqual(t.count, 3);
  assert.strictEqual(t.uploads, 'none');
  assert.strictEqual(t.wifi, 'off');
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `node --test test/match.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `js/lib/match.js`**

Copy: Student → `THE STUDENT` / `You don't miss deadlines. Your laptop shouldn't either.`; Creator → `THE CREATOR` / `You don't wait for renders.`; Hustler → `THE HUSTLER` / `Three tabs open on three income streams.` All specs: `Intel Core Ultra · 16GB+ · 1TB SSD · NPU`. Fallback to Student.

- [ ] **Step 4: Run the tests**

Run: `node --test test/match.test.js`
Expected: PASS, 3 tests.

- [ ] **Step 5: Build the verdict scene**

Three stacked receipt rows animate in (120ms apart) with their `line` text, then the tally row. Then the trap flip: two laptop cards side by side. `THE PRETTY ONE` (3 colours, RGB, 8GB RAM, `no NPU`) and `YOUR INTEL AI PC` (Core Ultra, 16GB+, 1TB, NPU). One button `RUN THE AI STUFF`; on tap the pretty one greys its three abilities in sequence with a `thud` each and shows `Can't run on-device AI`, while the Intel card flashes the three challenge icons with a `chime`. Then `SEE YOUR MATCH` → `GG.go('match')`.

- [ ] **Step 6: Build the match card**

Full-screen card, screenshot-optimised: `YOUR MATCH`, the vibe title, the line, the spec, `Ask for the AI PC demo at the counter.`, `Screenshot this.` A small `Play again` button (resets `GG.state` and goes to attract). No download, no QR. Idle 45s → attract.

- [ ] **Step 7: Smoke-test the full run**

Headless check `?scene=verdict` and `?scene=match`. Then play start-to-finish twice (once as Student, once as Hustler) and confirm the correct card appears and `Play again` fully resets.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: verdict, trap flip, and match card"
```

---

### Task 7: Polish, accessibility, QA

**Files:**
- Modify: `js/core.js` (audio unlock, idle, cleanup)
- Modify: `css/main.css` (focus rings, reduced motion)
- Create: `README.md`
- Modify: `docs/2026-11-25-glow-up-gauntlet-design.md` (status → built)

**Interfaces:**
- Consumes: everything.
- Produces: no new API; behaviour hardening only.

- [ ] **Step 1: Harden scene cleanup**

Every scene's `unmount()` must clear its own timers via `GG.timers.clear()` and cancel any `requestAnimationFrame`. Add a global `GG.cleanup` registry that `GG.go` drains. Verify by jumping `ch1 → attract → ch1` ten times and confirming no console errors and no duplicate DOM.

- [ ] **Step 2: Audio unlock and mute**

Create the `AudioContext` only on the first `pointerdown`; if it fails or is suspended, `GG.audio.*` stays silent without throwing. Add a mute toggle pinned bottom-right that persists in `localStorage` under `gg.muted`, and default it to **muted** for store use.

- [ ] **Step 3: Accessibility pass**

Visible `:focus-visible` ring on every interactive element; `role="button"` + `tabindex="0"` + Enter/Space activation on custom tappables; `aria-live="polite"` on the receipt headline; `prefers-reduced-motion` kills all looping animation; contrast check on `--dim` text.

- [ ] **Step 4: Full QA matrix**

Play through at 1280×800, 1024×768 and 1920×1080; touch emulation on; keyboard-only; reduced motion; muted; and `?scene=` deep links for all ten scenes. Record pass/fail in `README.md`.

- [ ] **Step 5: Write `README.md`**

What it is, how to run (double-click `index.html`), scene deep links, how to reset, the honesty note (authored output, illustrative), and the demo script for a judge (what to say in 30 seconds).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: accessibility, cleanup, docs, QA"
```

---

## Self-Review

**Spec coverage:** attract (§5.0 → Task 2), intro (§5.1 → Task 2), ch1 (§5.2 → Task 3), ch2 (§5.3 → Task 4), ch3 (§5.4 → Task 5), verdict (§5.5 → Task 6), timing/idle (§5.6, §11.1, §11.5 → Tasks 1, 6, 7), visual/verbal (§6 → Tasks 1–2, copy in each scene), accessibility (§6 → Task 7), build layout (§7 → Tasks 1–6), risks (§8 → covered by review focus and QA), calls (§10 → receipts qualitative, no QR, no typing, three challenges, deterministic).

**Gap found and fixed:** the design says the idle reset also applies to the match card at 45s; Task 6 Step 6 and Task 1 Step 5 both implement it — Task 1 owns the watcher, Task 6 sets the timeout.

**Type consistency:** `GG.state.results` items are `{id, line, claim}` in Tasks 3–5 and read the same way in Task 6's `match.tally`. `composePoster` keys match the test in Task 5. `nextScene` actions match the scenes that fire them (`vibe`, `ch1done`, `next`, `restart`, `idle`).
