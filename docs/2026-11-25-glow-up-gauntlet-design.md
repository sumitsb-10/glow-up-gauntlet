# Glow-Up Gauntlet — Design

**Intel 1 Million Minds · Round 1**
An in-store, touch-first game that turns "why an AI PC?" into "I want that one."

Date: 2026-11-25
Status: historical design document. The 2026-11-26 credibility pass superseded its generative-AI framing, Wi-Fi-off assertions, seeded receipts, generic match spec and “cannot run AI” comparison. Do not use the original claims below as product facts. Current behavior, claim limits, run instructions and QA results are in `README.md`.

---

## 1. Intent

Gen-Z shoppers in Croma / Reliance Digital / Vijay Sales walk in with a budget and a vibe. They leave with the prettiest machine on the shelf — usually one that will feel slow in eighteen months. The Intel AI PC's actual advantage is invisible: it does AI **on the device**, so it's instant, private, and works offline. You cannot see that in a spec sheet, and no shopper is going to read one.

**Glow-Up Gauntlet** makes the difference physical. The shopper doesn't get told the cheap PC is slow — they *feel* it lag under their own finger, for four seconds, then feel the Intel machine snap to life. Then they use three real AI superpowers. Then they get a verdict about themselves.

The whole thing is 2 minutes 30 seconds, no instructions, no typing, one thumb.

### Why this works on the brief

- **The brief's real complaint** is that shoppers buy on price and looks. Arguing against that doesn't work. Letting them experience the cost of it does. The game opens by making the "pretty but cheap" PC fail in their hands.
- **Zero prior knowledge** — every challenge is a tap, a drag, or a choice between three picture chips. No jargon until a "receipt" card *after* the player has already felt the benefit.
- **2–3 minutes** — three challenges at ~40s each plus a 25s verdict.
- **Play, discover, choose** — play the challenges, discover what on-device AI means, choose a personalized match at the end.

### Success looks like

A shopper finishes and can say, unprompted, three things:

1. "It did that *on the laptop*, not on the internet."
2. "It was instant."
3. "The cheap one couldn't do any of it."

…and then walks to the counter with the match card on screen.

---

## 2. Goals / Non-goals / Anti-goals

**Goals**
- Hook a passer-by in under 5 seconds, from a standing start, with no staff involvement.
- Deliver a felt lag-vs-instant contrast in the first 20 seconds.
- Teach three true, checkable AI PC capabilities: on-device document intelligence, on-device generative photo editing, offline generative creation.
- End with a personalized recommendation and a reason to talk to the Intel rep.
- Run offline, on any laptop or tablet, from a folder. No install, no server, no accounts, no API keys.

**Non-goals**
- Real model inference. All "AI" output is pre-authored and deterministic — it must be, to be reliable in a store with no Wi-Fi.
- Real pricing or SKU data. The recommendation names a *class* of machine (Core Ultra, 16GB+, 1TB, NPU), not a live price.
- Multiplayer, leaderboards, logins, analytics, cloud sync.
- A faithful reproduction of any retail partner's branding.

**Anti-goals** — any of these means we failed even if it technically runs:
- Reads like a spec sheet or a slide deck.
- Requires reading more than ~12 words at a time.
- Requires typing on a kiosk touchscreen.
- Feels like an ad for Intel rather than a game that happens to be right about Intel.
- Takes longer than 3 minutes, or can get stuck with no way forward.
- Uses fake benchmarks or numbers we can't stand behind.

---

## 3. Constraints

| Constraint | Consequence |
|---|---|
| Store floor: bright, noisy, distracted, 1 thumb | Huge type, ≥64px targets, high contrast, sound optional, no hover-only affordances |
| No reliable Wi-Fi | Zero network requests. No CDN fonts, no external images, no fetch(). Everything inline. |
| Unknown hardware | Must run in Chrome/Edge on Windows, from `file://`. No ES modules (blocked by file:// CORS), no build step. |
| 2:30 attention budget | Hard scene timers, one "skip" affordance, instant restart |
| Judges may play once | Every scene must be self-explanatory on first sight |
| Brand safety | No real people's faces; illustrated characters only. No fake Intel claims. Concept-demo disclaimer. |

---

## 4. Approaches considered

**A. Glow-Up Gauntlet — three timed challenges on "your" laptop, ending in a verdict.** *(chosen)*
Covers all four use cases in the time budget, gives a physical lag/instant contrast, and lands on a personal recommendation. Cost: three scenes to build, and the "AI" has to be convincingly faked with authored content.

**B. Beat the Cloud — a head-to-head race against a cloud bot.**
Instantly legible and very demo-friendly; the scoreboard sells speed, privacy and battery in one image. Cost: it's a race, so the shopper watches more than they play, and it teaches one idea (on-device) three times instead of teaching three capabilities.

**C. Store After Dark — a narrative escape room in the store after closing.**
Most memorable and most shareable. Cost: the story competes with the product for attention, and the puzzles would need to be about something other than the PC to be fun — which weakens the sell.

**Chosen: A**, borrowing B's receipt scoreboard as the finale, because the brief asks for coverage across use cases *and* a felt contrast, and A is the only one that delivers both inside 2:30.

---

## 5. The experience

### 5.0 Attract loop (idle)
Near-black screen, floating debris of a messy digital life (tabs, a "notes(3).pdf", a low-battery icon, a buffering spinner) drifting slowly. Center: **"Would your laptop survive your life?"** and a single pulsing pill: **TAP TO PLAY**. A tiny line at the bottom: *90 seconds. No typing. Go.*

The idle timer runs **only** on this screen and on the match card. It never fires mid-game — a shopper who pauses to think must not get thrown out of a challenge.

### 5.1 Intro — pick your vibe (8s)
"First — who's using this laptop?" Three big cards, each an illustrated avatar + one line:

- **The Student** — "47 tabs. One deadline."
- **The Creator** — "Posts daily. Edits at 2am."
- **The Hustler** — "Side gigs. Zero patience."

One tap. No name entry. The choice only changes copy and the final match card — it never gates content. This is the personalization hook.

### 5.2 Challenge 1 — "The Deadline" (~40s) · work & study
**The gag (interactive, 6s).** A cluttered desktop on "your current laptop." The player is told: *"Find the assignment. Submit it."* They tap. **Nothing happens.** They tap again — and the whole interface lags: the tap ring appears about 400ms after the finger lands, the button depresses late, a tab takes a full second to open, a fan whirs up, a spinner appears, another tab closes itself, and the window title goes *(Not Responding)*. The lag is applied to the **UI, not a cursor**, so it reads identically under a finger or a mouse. A big pulsing button appears: **"Okay. Use the AI PC."**

**The play (25s).** The same desktop, instantly crisp. An AI bar appears with three chips: *assignment*, *receipt*, *screenshot*. Tap *assignment* — 30 file cards whoosh away, 2 remain. Tap `Assignment_FINAL_v7.pdf` — it opens to a 40-page doc. Three question chips: *"What's the main argument?"*, *"How many sources?"*, *"What's the word count?"* Tap one — the answer paragraph highlights with a citation in under a second. Then **Submit**. Done.

**The receipt (5s).** A card that looks deliberately different from the game (monospace, flat, stamped):

> `40-PAGE PDF · READ ON THIS LAPTOP · WI-FI OFF · NOTHING UPLOADED`
> **This is the NPU.** AI that runs on the machine, not on a server.

**Truth being taught:** on-device document intelligence — instant, private, works with the Wi-Fi off.

### 5.3 Challenge 2 — "The Photobomber" (~40s) · creativity
**The gag (6s).** A photo editor on the cheap PC. The player taps "Export" on an edit. A progress bar crawls to 99%… and the app crashes. The fan is now loud enough to be a joke. *"Cool RGB though."*

**The play (25s).** A flat-illustrated group photo — five friends, one uninvited photobomber pulling a face in the back. Prompt: *"He was not invited."* Player taps him → selection box → chips **Remove · Erase · Fix**. Tap **Remove** → a soft brush wipe reveals the background behind him; he's gone, cleanly. Then a second beat: drag the right edge of the frame outward and the scene **extends** — more sky, more floor, generated. Tap **Post**.

**The receipt.**
> `GENERATIVE FILL · ON-DEVICE · NOTHING UPLOADED · NO ACCOUNT`
> **Your photos never left this laptop.** No upload, no sign-in, no "processing…"

**Truth being taught:** local generative editing — fast, private, no cloud round-trip. (This is the one Gen-Z shoppers actually care about when they hear it.)

### 5.4 Challenge 3 — "2AM Idea" (~40s) · everyday + offline proof
**The gag (6s).** Wi-Fi drops. A red banner: **"Cloud AI: unavailable."** Everything AI-shaped greys out. *"Great. Now what?"*

**The play (25s).** A poster canvas for the shopper's side hustle. Three columns of chips — **VIBE** (Neon · Y2K · Desi Core), **TYPE** (Blocky · Serif Chaos · Handwritten), **FINISH** (Maximal · Clean · Grainy). One tap per column, and the poster assembles live in front of them (layers, type, colour, grain, each element landing with a snap). Picking one from each column is what keeps every combination looking curated — 27 authored combinations, composable from a layer table. Then drag the poster onto a "POST" target. Confetti.

**The receipt.**
> `WI-FI: OFF · GENERATED ON-DEVICE · NOTHING UPLOADED`
> **The AI is inside the laptop.** Not in a data centre. Not on a subscription.

**Truth being taught:** offline, on-device generative AI. This is the least-known and most persuasive fact in the whole experience, so it gets the strongest visual proof — the Wi-Fi-off badge stays pinned on screen for the entire challenge.

### 5.5 The Verdict (~25s) — the sell
**Part 1 — the receipt wall.** All three receipts stack up with a tally: *nothing uploaded · Wi-Fi off · fan quiet · battery still going*. Then the vibe line: *"You're a Creator. You don't wait for renders."*

**Part 2 — the trap flip.** Two laptops side by side:

- **"The Pretty One"** — ₹ cheaper, 3 colours, RGB keyboard, 8GB RAM, *no NPU*.
- **"Your Intel AI PC"** — Core Ultra, 16GB+, 1TB, NPU.

A single button: **"Run the AI stuff."** On the pretty one, all three abilities grey out one by one with a dull thud — *can't run on-device AI*. On the Intel machine they light up and replay a one-second flash of each challenge. No numbers are invented; the failure is framed as a capability gap, not a benchmark.

**Part 3 — the match card.** A personalized card that fills the screen, high-contrast and glare-resistant, built to be **photographed by the shopper's phone**:

> **YOUR MATCH**
> The Creator
> Intel Core Ultra · 16GB+ · 1TB SSD · NPU
> *Ask for the AI PC demo at the counter.*

A small line under it: *"Screenshot this."* Plus **Play again**. No PNG download (on a locked-down kiosk it lands somewhere the shopper can't reach), and no QR — a fake one is dishonest, a real one needs a dependency we've ruled out.

### 5.6 Timing budget

| Scene | Seconds |
|---|---|
| Attract → intro | 5 |
| Vibe pick | 8 |
| Challenge 1 + receipt | 40 |
| Challenge 2 + receipt | 40 |
| Challenge 3 + receipt | 40 |
| Verdict + match | 25 |
| **Total** | **~2:38** |

These are pacing targets, **not fail states**. Nothing auto-advances, no shopper is ever timed out of a challenge, and the intro never picks a vibe for them. If someone lingers, the only response is a gentle pulse on the next valid target after ~12s. A run that takes 3:10 is fine; a shopper who feels rushed or trapped is not.

---

## 6. Visual and verbal direction

**Look.** Near-black canvas (`#08090C`), electric Intel blue (`#0068B5` / `#4DA3FF`) as the "AI is on" colour, one acid accent (`#D6FF3F`) for player action and wins. Big rounded cards (24–32px radius), soft glass blur, a fine grain overlay, chunky type with tight tracking. Think a music-app year-in-review, not a corporate microsite. No stock photography, no 3D laptop renders, no gradients that look like a 2019 SaaS site.

**Type.** System stack only (`Segoe UI Variable`, `Inter`, `system-ui`), 700–900 weight for headlines, 44px+ headlines on a 1280×800 landscape stage, 18px minimum body. Everything scales from a 16:9 stage with letterboxing so the layout is identical on every device.

**Sound.** Synthesized with WebAudio — no files. A soft click, a rising whoosh, a fan whir, a thud for the trap, a bright chime for wins. Muted until the first tap (autoplay policy), with a visible mute toggle. The game is fully playable silent.

**Voice.** Gen-Z, self-aware, a little unhinged, never cringe. Short lines. No "fellow kids" slang, no emoji soup, no exclamation marks stacked. Examples: *"Cool RGB though."* / *"He was not invited."* / *"The AI is in the laptop. Not in a data centre."*

**Accessibility.** Colour is never the only signal (icons + labels + motion). `prefers-reduced-motion` respected. Contrast ≥ 4.5:1 for body text. Full mouse and keyboard fallbacks. A visible **Skip** on every challenge so nobody is trapped.

---

## 7. Build

**Stack.** Vanilla HTML/CSS/JS. Classic `<script>` tags (no ES modules — `file://` blocks them). No build step, no dependencies, no network calls.

**Layout.**
```
intel-ai-pc-arcade/
  index.html          stage shell + scene container + persistent HUD
  css/main.css        tokens, stage scaling, components
  js/core.js          state machine, router, timers, audio, input, idle
  js/scenes/attract.js
  js/scenes/intro.js
  js/scenes/ch1-deadline.js
  js/scenes/ch2-photobomber.js
  js/scenes/ch3-poster.js
  js/scenes/verdict.js
  js/art.js           inline SVG scenes (photo, poster layers, icons)
  docs/…              this document
```

**State machine.** `ATTRACT → INTRO → CH1 → R1 → CH2 → R2 → CH3 → R3 → VERDICT → MATCH → ATTRACT`. Each scene exposes `mount(root)`, `unmount()`. A single router owns transitions and a global idle timer that resets to `ATTRACT` after 25s. A `?scene=` query param jumps to any scene for demo/testing.

**All art is code.** Interactive art (the group photo, the poster, the laptop mockups) is inline SVG built in `art.js`, so it animates, scales, and never 404s. Decorative texture is CSS.

**Determinism.** Every "AI" output is authored, not generated at runtime. The poster assembles from a fixed palette/layout table keyed by the three chosen chips; the photo removal uses a pre-drawn background layer revealed by an animated mask. This is a deliberate honesty choice: the receipts describe real AI PC capabilities, and the game demonstrates the *experience*, not a live model.

**Device target.** Primary: 1280×800 to 1920×1080 landscape, touch, on Windows Chrome/Edge opened from `file://`. Secondary: 1024×768 Windows tablet landscape. iPad is a **layout** target only, not a deployment target — iPadOS Safari can't run a folder of local HTML/JS with full behaviour without an app wrapper or a server, and we're not adding either. Portrait shows a rotate hint rather than a broken layout.

---

## 8. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Feels like an ad | The opening failure is at the shopper's expense, not Intel's. The receipts are flat and factual, visually separate from the playful game. |
| Feels fake / "that's just a video" | Every beat is an interaction under the player's finger: real input lag, real drag, real tap-to-remove. Nothing auto-plays. |
| Runs long | Hard scene timers, Skip always visible, total ~2:38 measured. |
| Touchscreen flakiness | 64px+ targets, no hover-dependent states, mouse fallback, no precision drags (only large edge-drags with generous hit zones). |
| Judge plays once, misses the point | Each receipt restates the capability in one plain sentence. The verdict repeats all three. |
| Brand/legal | Illustrated characters, no real logos beyond Intel's name, concept-demo disclaimer in the footer, no invented benchmarks or prices. |

---

## 9. Left to the builder

- Exact SVG character designs, poster layouts, and palette pairings.
- Copy micro-edit pass for voice (the lines above are the intent, not final).
- Timing tuning per scene after first playtest.
- Whether the attract loop uses drifting cards or a looping animated collage.
- Sound design specifics.
- Local font fallback order.

## 10. Calls I made that you can overrule

- **Receipts are qualitative, not numeric.** No "0.8s", no "0 bytes" — just `READ ON THIS LAPTOP · WI-FI OFF · NOTHING UPLOADED`. We don't run a model, so a decimal would be invented. A small "concept demo · illustrative" footnote sits in the footer.
- **No QR code** on the match card — a fake one is dishonest, a real one adds a dependency. "Show this at the counter" instead.
- **No typing anywhere.** All AI prompts are chips. Store touchscreens and keyboards don't mix.
- **Three challenges, not four.** Gaming is represented inside the Verdict (the "run the AI stuff" moment) rather than as a fourth scene, to protect the 2:30 budget.
- **No live model.** Deterministic authored output, clearly framed as a demo of the experience.

---

## 11. Settled after the builder review

1. **No forced exits.** Scene durations are pacing targets. The only real timer is the idle reset, and it runs only on the attract screen and the match card.
2. **The lag gag is UI lag, not cursor lag.** Tap rings, button presses and tab opens all land ~400ms late, so it reads the same under a finger or a mouse.
3. **Receipts drop invented decimals** (see §10) and the footer carries a "concept demo, illustrative" line.
4. **The match card is screenshot-optimised, not downloadable.** It fills the screen and says "Screenshot this."
5. **Idle reset never fires mid-game.** After 12s of no input in a challenge, the next valid target pulses instead.
6. **Poster picks one chip per column** (Vibe / Type / Finish) so all 27 combinations are coherent by construction.
7. **iPad is a layout target only.** Windows Chrome/Edge from `file://` is the deployment target.
