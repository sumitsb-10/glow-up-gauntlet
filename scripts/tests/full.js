const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const started = Date.now();
const q = (s) => document.querySelector(s);
const scene = () => document.documentElement.dataset.scene;
const out = { steps: [] };
const step = (name, extra) => { out.steps.push(Object.assign({ at: scene(), name }, extra || {})); };

await wait(500);
step('boot');

q('.attract-play').click();
await wait(700);
step('intro');

q('.vibe-card[data-vibe="student"]').click();
await wait(800);
step('ch1-lag');

// old PC: two taps, then the crash
let files = document.querySelectorAll('.file');
files[0].click();
await wait(250);
files[0].click();
await wait(2000);
step('ch1-crashed', { crashed: !!q('.crash') });

q('.rescue').click();
await wait(600);
step('ch1-ai', { aiBar: !!q('.ai-search') });

Array.from(document.querySelectorAll('.ai-chips .chip')).find((c) => c.textContent === 'assignment').click();
await wait(700);
q('.file[data-name="Assignment_FINAL_v7.pdf"]').click();
await wait(500);
q('.chip.q').click();
await wait(400);
q('.submit').click();
await wait(1000);
step('ch1-receipt', { receipt: !!q('.receipt-card'), results: window.GG.state.results.length });

q('.receipt-actions .btn').click();
await wait(900);
step('ch2');

q('.ed-actions .btn').click();
await wait(2600);
step('ch2-crashed', { rescue: !!q('.rescue'), stamp: !!q('.stamp') });
q('.rescue').click();
await wait(600);

q('.bomber-hit').dispatchEvent(new MouseEvent('click', { bubbles: true }));
await wait(300);
q('.ed-actions .chip').click();
await wait(1200);
step('ch2-removed', { removed: q('.photo').classList.contains('removed'), handle: !q('.handle').classList.contains('hidden') });

q('.handle').click();
await wait(900);
step('ch2-extended', { reveal: q('.handle').getAttribute('aria-valuenow') });

q('.ed-actions .btn').click();
await wait(1500);
step('ch2-receipt', { receipt: !!q('.receipt-card'), results: window.GG.state.results.length });

q('.receipt-actions .btn').click();
await wait(900);
step('ch3', { networkLabel: q('.wifi-badge').textContent.replace(/\s+/g, ' ').trim() });

const chip = (t) => Array.from(document.querySelectorAll('.vibe-chip')).find((c) => c.textContent.includes(t));
chip('Y2K').click();
await wait(200);
chip('SERIF').click();
await wait(200);
chip('GRAINY').click();
await wait(200);
chip('LOW POWER').click();
await wait(400);
q('.post-btn').click();
await wait(1100);
step('ch3-receipt', { receipt: !!q('.receipt-card'), results: window.GG.state.results.length });

q('.receipt-actions .btn').click();
await wait(900);
step('verdict');

q('.vd-cta').click();
await wait(1700);
step('verdict-run', { cta: q('.vd-cta').textContent });

q('.vd-cta').click();
await wait(900);
step('match-use');

q('.consult-card[data-key="study"]').click();
await wait(450);
step('match-priority');
q('.consult-card[data-key="battery"]').click();
await wait(700);
step('match-result');

out.results = window.GG.state.results.map((r) => r.id);
out.skipped = window.GG.state.skipped.slice();
out.choices = Object.assign({}, window.GG.state.choices);
out.matchTitle = q('.match-title') && q('.match-title').textContent;
out.matchCategory = q('.rec-cat') && q('.rec-cat').textContent;
out.matchPromise = q('.match-promise') && q('.match-promise').textContent;
out.primaryCta = q('.rec-primary') && q('.rec-primary').textContent;
out.stats = Array.from(document.querySelectorAll('.mstat')).map((s) => s.textContent.trim());
out.spec = q('.match-spec') && q('.match-spec').textContent;
out.compareNote = q('.rec-compare') && q('.rec-compare').textContent;
out.runBadges = Array.from(document.querySelectorAll('.run-badge')).map((b) => b.textContent.trim());
out.elapsedMs = Date.now() - started;
out.networkCallsLabel = out.stats.some((s) => /no network calls/i.test(s));

const stageRect = q('#stage').getBoundingClientRect();
out.viewport = [window.innerWidth, window.innerHeight];
out.stage = [Math.round(stageRect.left), Math.round(stageRect.top), Math.round(stageRect.width), Math.round(stageRect.height)];
out.scroll = [document.documentElement.scrollWidth, document.documentElement.scrollHeight];
out.stageFits = stageRect.left >= -1 && stageRect.top >= -1 &&
  stageRect.right <= window.innerWidth + 1 && stageRect.bottom <= window.innerHeight + 1;
out.ok = out.results.length === 3 && out.skipped.length === 0 &&
  out.matchTitle === 'THE STUDENT' && out.matchCategory === 'Study & research AI PC' &&
  out.primaryCta === 'TRY YOUR INTEL AI PC AT THE COUNTER' &&
  /verify the exact model and NPU/i.test(out.spec) && out.networkCallsLabel && out.stageFits &&
  document.documentElement.scrollWidth <= window.innerWidth &&
  document.documentElement.scrollHeight <= window.innerHeight;
return out;
