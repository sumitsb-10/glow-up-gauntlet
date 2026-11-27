# Glow-Up Gauntlet

An offline-capable, touch-first in-store concept demo for the **Intel AI PC**, built for the Intel 1 Million Minds Round 1 brief. When opened from `file://` as recommended, app features make no network requests; the app does not switch off or inspect the device's Wi-Fi connection.

A shopper walks up, taps once, and in about two to three minutes plays through staged laptop scenarios and three local workflow demos. The lag, crash and comparison are authored simulations; the search is real local keyword retrieval, while photo editing and poster composition are illustrative non-AI interactions. The flow ends with a needs-based starting point and a retailer verification checklist.

**No install. No server. No app network calls. No accounts. No API keys.** Open `index.html` and play.

**Live demo:** https://sumitsb-10.github.io/glow-up-gauntlet/ — the same build runs offline from `file://`.

---

## Run it

1. Use Windows Chrome or Edge.
2. Double-click `index.html` (or drag it into a browser window).
3. Press **F11** for fullscreen on a store demo machine.

Sound is **off by default** for store use. The toggle is bottom-right; the choice persists in `localStorage` under `gg.muted`.

The game works from `file://` because every script is a classic `<script>` tag, all media assets are bundled locally, and there is no build step.

---

## The 2–3 minute experience

| Beat | Scene | What happens |
| --- | --- | --- |
| 0:00 | Attract | `WOULD YOUR LAPTOP SURVIVE YOUR LIFE?` + `TAP TO PLAY`. Any tap starts. |
| 0:10 | Intro | Pick a vibe: Student, Creator or Hustler. It sets the avatar and tone; the two consultation questions shape the recommendation. |
| 0:25 | Challenge 1 — The Deadline | A staged lag/crash scenario leads to local keyword matching in bundled sample passages. It does not read a real 40-page document or access your files. |
| 1:10 | Challenge 2 — The Photobomber | Choose a local illustrative blur-mask preview or keep the original. It is not AI object removal; no photo is uploaded. |
| 1:50 | Challenge 3 — 2AM Idea | Choose Vibe / Type / Finish and an output priority. A local deterministic template composer updates the poster; this is not AI inference. |
| 2:15 | Verdict | Receipts reflect completed steps. The 8GB entry laptop and Intel AI PC are illustrative profiles; the comparison is staged, not a hardware benchmark. CPU, GPU and NPU roles are explained. |
| 2:35 | Match | Two quick questions produce a needs-based starting point, retailer verification checklist, price-objection sheet, and `TRY YOUR INTEL AI PC AT THE COUNTER`. |

Every scene returns to attract when idle (challenges 90 s, verdict 60 s, match 45 s, intro 60 s), and a visible **Restart** button returns from any non-attract screen. Every challenge shows a **Skip this one** button, and after ~12 s without input the next valid target pulses gently. Skipped challenges earn no receipt.

---

## Deep links (testing and judging)

`index.html?scene=<name>` boots straight into a scene:

`attract` · `intro` · `ch1` · `ch2` · `ch3` · `verdict` · `match`

Phase links for demos and screenshots:

- `?scene=ch1&phase=ai` — local keyword search already open
- `?scene=ch1&phase=doc` — document search prompt open
- `?scene=ch1&phase=crash` — the old PC has stopped responding
- `?scene=ch2&phase=remove` — the photobomber is ready to tap
- `?scene=ch2&phase=extend` — the frame handle is live
- `?scene=ch2&phase=done` — frame extended, ready to post
- `?scene=ch3&phase=receipt` — posts automatically, shows the receipt
- `?scene=verdict&phase=run` — runs the comparison automatically
- `?scene=match&phase=result` — shows the demo recommendation (Study + Battery)

Deep links are debug/demo shortcuts. A real run always starts at the attract screen. Nothing is seeded: a direct `?scene=verdict` starts with **0 receipts and 0 skipped**, and skipped challenges show `SKIPPED · NO RECEIPT`. A direct `?scene=match` has no run behind it and correctly shows `0 receipts`.

---

## Counter demo script

> "Don't read the spec sheet. Try this."

1. **Hand it over at the attract screen.** Let them tap.
2. **Let them pick their vibe.** "That decides your match at the end."
3. **Challenge 1:** let them tap the file twice. Point at the staged fan meter and `NOT RESPONDING` card. Tap `OKAY. USE THE AI PC`. "Search this sample report. It matches keywords in the visible passages; it doesn't read all 40 pages or access your files."
4. **Challenge 2:** "He was not invited." Let them tap the person and choose **Mask the person** or **Keep original**. The bundled preview uses a real group photo and a pre-authored blur mask; it is not AI object removal.
5. **Challenge 3:** "Make a poster." They pick a vibe, type, finish and output priority; a local template composer updates it. No model is used.
6. **Verdict:** "This is an illustrative comparison, not a benchmark." The 8GB profile shows less memory than the suggested AI PC profile; it does not establish comparative performance. The note names AMD Ryzen AI and Qualcomm Snapdragon X platforms that also combine CPU, GPU and NPU resources.
7. **Match:** "Two questions, then a starting point to discuss with the retailer. Ask them to confirm the exact processor, NPU and app support, and compare battery tests, display, graphics, warranty and price."

If they only have a minute, start at `?scene=ch1&phase=ai`, do the document question and the photo decision, then jump to `?scene=verdict&phase=run`.

---

## What is real, what is authored

- The document interaction is **local keyword matching** against bundled sample passages. It does not read the full mock 40-page report or access shopper files. No model runs; a no-match query is reported honestly.
- The photo editor uses a real, locally bundled group photo and a **pre-authored illustrative blur-mask preview**. It does not remove a person with AI. The poster is a **deterministic template composer**; neither interaction runs generative AI inference.
- Receipts are **qualitative on purpose** — no invented benchmark decimals, no fake percentages, no telemetry.
- Every screen carries `Concept demo · illustrative simulations, not product claims.`
- The app makes no network calls, but it does not detect or disable Wi-Fi. A local workflow in this demo does not prove that a third-party AI feature runs offline or keeps data private; check each app's behavior and settings.
- The entry laptop and Intel AI PC are composite profiles, not real products. Their animated comparison is staged and is not measured performance evidence.
- Recommendation RAM and storage values are starting points, not universal requirements. The demo has no retailer inventory, prices, exact processor SKU, battery results or app-compatibility lookup. Confirm those before purchase.
- Intel Core Ultra names span processor generations and laptop designs. Verify the exact processor model includes the NPU and supports the intended software feature; do not infer that from the family name alone.

### Claim references

The CPU/GPU/NPU explanation follows manufacturers' descriptions of complementary compute engines and workload-dependent capabilities. These references do not establish a benchmark between the demo's composite profiles:

- [Intel Core Ultra overview and specifications](https://www.intel.com/content/www/us/en/products/details/processors/core-ultra.html)
- [Intel processor guide: CPU, GPU and NPU roles](https://www.intel.com/content/www/us/en/newsroom/tech101/client-computing/processor-guidebook-the-basics-from-cpus-to-asics.html)
- [AMD Ryzen AI PCs and NPU overview](https://www.amd.com/en/products/processors/ai-pcs-powered-by-ryzen-ai.html)
- [Qualcomm Snapdragon AI PCs](https://www.qualcomm.com/snapdragon/laptops-and-tablets/consumer/ai)

This is a concept demo built for a hackathon brief, not a shipping product or an Intel statement.

---

## Accessibility and kiosk behaviour

- Touch targets are at least 64 px; every primary action is a real `<button>`.
- Keyboard: the play button is focused on load; `Enter`/`Space` work on native controls; the photobomber is focusable with `role="button"`; the frame handle is a `role="slider"` with arrow-key and `Enter` support.
- Receipts are modal `role="dialog"` overlays: the challenge, Restart and mute controls go `inert`, Tab is trapped inside the card, focus moves to **Next**, and it returns to the opener on close. The crash card is a focused `role="alertdialog"`.
- Every challenge has a visible **Skip this one** (64 px); after ~12 s without input, the next valid target gets a gentle hint pulse that clears on the next tap.
- `prefers-reduced-motion: reduce` collapses every animation to 1 ms / one iteration; the verdict fast-paths to its final state. The full game still completes.
- Audio is unlocked on the first interaction and stays silent if the browser blocks it. Muted is the default.
- Focus-visible rings on every custom control (the frame handle rings on its 30 px visual, not its 120 px hit zone); status changes are shown with text and shape, not colour alone.
- The 1280×800 stage scales to fit the viewport and letterboxes on near-black. Nothing scrolls.

---

## QA results — recorded 2026-11-26, re-verified 2026-11-27

Recorded on Windows, headless Microsoft Edge, from `file://`, plus an HTTP-served smoke pass. Re-verified on 2026-11-27 for the published build: `node --test` 24/24, full run at 1280×800 (`ok`, 3 receipts, stage fits), accessibility 35 checks / 0 errors, photo-editor, verdict-sequencing, copy and consultation/counter reviews all green.

| Check | Result |
| --- | --- |
| `node --test` (machine, poster, match, retrieval, consultation) | **24/24 pass** |
| Full run at 1280×800 | pass — 3 receipts, `THE STUDENT`, `3 receipts · none uploaded · no network calls`, stage fits |
| Full run at 1024×768 | pass — stage fits with no page scroll; recommendation card and value sheet bounds checked |
| Full run at 1920×1080 | pass — stage fits, no scrollbars |
| Reduced motion | pass — full run completes, animations 0.001 s / 1 iteration |
| Touch start + drag/tap | pass — synthetic touch pointers start the game, drag the frame to 90 px, tap to 160 px |
| Keyboard / screen reader path | all checks true — play focus, native buttons, bomber `Enter`, slider arrows/`Enter`, receipt focus, live regions, zero errors |
| Muted by default + persistence | pass — `aria-pressed`, `gg.muted` round-trip |
| Deep links | pass — every scene boots; ch1 `ai`/`doc`/`crash`, ch2 `extend`, ch3, verdict `run`, match `result` |
| Rapid taps | triple-tap play/vibe/next lands correctly; invalid jump blocked |
| Double taps | ch1 submit records one receipt; verdict flip cannot be skipped |
| Scene cleanup stress | 10 × `ch1 → attract → ch1`, one `.lp` / 12 files each time, zero console errors |
| Skip + hint | 3 skips reach verdict; 12 s hint pulses the next target; **0 receipts seeded**, 3 `SKIPPED · NO RECEIPT`, match shows `0 receipts · 3 skipped` |
| Handle hit zone | 120×150 px target, ±45 px taps land, 30 px visual, focus ring on the visual |
| Receipt containment | challenge + Restart + mute `inert`, 0 outside tabbables, Tab trapped, focus restored |
| Crash dialog | `role="alertdialog"`, rescue focused when shown |
| Tap ring alignment | error 0.5 px at 1024×768 (scale .78); < 3 px at 1920×1080 (scale 1.23) |
| Verdict sequencing | limited rows appear one by one, Intel lights, tally then CTA enable; 0-receipt deep link says so; reduced-motion fast path |
| Fair comparison | illustrative profiles, no performance benchmark claim; names AMD Ryzen AI and Qualcomm Snapdragon X; explains CPU/GPU/NPU roles |
| Consultation recommendation | 25 combinations unit-tested; suggestions are starting points and prompt exact processor/NPU/app/configuration verification |
| Value sheet | 6 objections, `NO BENCHMARK CLAIMS`, fits 1024 and 1280; opens and closes cleanly |
| Copy consistency | Sample report is labelled as a mock excerpt; exact CTA and promise strings were checked |
| Touch targets | sampled controls incl. verdict CTA, primary CTA, objection and Explore Again ≥ 64 design px |
| 1024 readability | `readability-1024`: HUD, task hint and file-card text ≥ 12.5 effective px (13.25 measured); `verdict-fit`: verdict screen fits its 800 px box at 1024 and 1280 — heading and CTA not clipped |
| Idle + Restart | Restart returns from a challenge with cleared state; 1 ms test idle and an open receipt both return to attract with the modal gone |
| Complete browser suite | 34/34 cases returned without failures; seven scene smoke checks passed |
| Recommendation audit | arbitrary processor tiers removed; needs-specific CPU/GPU/app checks added; memory and storage values labelled starting points |
| Network-state copy | active UI says no network calls; it no longer claims the device Wi-Fi was turned off |

Historical screenshots in `shots/` predate this pass; see `shots/README.md`.

---

## Tests and tools

```powershell
# logic tests
node --test

# full playthrough, ends on the recommendation
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html" --script scripts/tests/full.js

# consultation, price objection and counter pass
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=match&phase=result" --script scripts/tests/match-flow.js

# real photo + illustrative mask preview
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=ch2&phase=remove" --script scripts/tests/photo-real.js

# kiosk reset behaviour
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html" --script scripts/tests/idle-restart.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=ch1&phase=doc" --script scripts/tests/idle-receipt.js

# accessibility / input paths
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html" --script scripts/tests/a11y.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=ch2&phase=extend" --script scripts/tests/touch.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html" --script scripts/tests/stress.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html" --script scripts/tests/rapid.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=ch1&phase=doc" --script scripts/tests/double-submit.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=verdict" --script scripts/tests/double-cta.js

# reduced motion
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html" --script scripts/tests/full.js --reduce

# review regressions (script, scene)
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=ch3" --script scripts/tests/review-ch3.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=ch2&phase=extend" --script scripts/tests/review-handle.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=ch1&phase=doc" --script scripts/tests/review-receipt.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=ch1&phase=crash" --script scripts/tests/review-crash.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=ch1" --script scripts/tests/review-ring.js --w 1024 --h 768
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=ch1" --script scripts/tests/review-skip.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=verdict" --script scripts/tests/review-verdict.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=ch1&phase=ai" --script scripts/tests/review-targets.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=verdict&phase=run" --script scripts/tests/review-tally.js
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=ch1&phase=doc" --script scripts/tests/review-copy.js

# 1024 fit and readability regressions
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=verdict&phase=run" --script scripts/tests/verdict-fit.js --w 1024 --h 768
node scripts/e2e.mjs "file:///C:/Users/sumit/intel-ai-pc-arcade/index.html?scene=ch1&phase=ai" --script scripts/tests/readability-1024.js --w 1024 --h 768

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
js/lib/retrieval.js        local keyword search over the document
js/lib/consult.js          needs-based configuration + fair objection copy
js/lib/match.js            persona copy + receipt/skip tally
js/art.js                  inline SVG avatars and icons; photo editor markup
assets/                    locally bundled source photo and illustrative mask previews (see assets/README.md)
js/scenes/*.js             attract, intro, ch1, ch2, ch3, verdict, match
js/app.js                  boot, mute, home/restart, idle watcher
test/*.test.js             node:test logic suites
scripts/                   CDP e2e driver, smoke, screenshots, test scripts
docs/                      design doc + implementation plan
```

---

## Known limits

- The stage is a fixed 1280×800 design scaled with `transform`; portrait phones show a rotate hint. iPad is layout-only, not the deployment target.
- No score is persisted; **Play Again** or a reload resets everything.
- `localStorage` can be blocked on some `file://` configurations; mute then falls back to the in-session default.
- The recommendation card is screenshot-optimised; there is intentionally no PNG download and no QR code.
- No model is bundled: the document search is real keyword retrieval, and the photo mask and poster composer are deterministic demonstrations. Nothing claims NPU execution.
- Audio is generated with WebAudio and is deliberately sparse; it is not required to complete any step.
