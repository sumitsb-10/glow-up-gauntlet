const wait = (ms) => new Promise((r) => setTimeout(r, ms));
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
step('ch3');

const chip = (t) => Array.from(document.querySelectorAll('.vibe-chip')).find((c) => c.textContent.includes(t));
chip('Y2K').click();
await wait(200);
chip('SERIF').click();
await wait(200);
chip('GRAINY').click();
await wait(400);
q('.post-btn').click();
await wait(1100);
step('ch3-receipt', { receipt: !!q('.receipt-card'), results: window.GG.state.results.length });

q('.receipt-actions .btn').click();
await wait(900);
step('verdict');

q('.vd-cta').click();
await wait(1100);
step('verdict-run', { cta: q('.vd-cta').textContent });

q('.vd-cta').click();
await wait(1000);
step('match');

out.results = window.GG.state.results.map((r) => r.id);
out.matchTitle = q('.match-title') && q('.match-title').textContent;
out.stats = Array.from(document.querySelectorAll('.mstat')).map((s) => s.textContent.trim());
out.spec = q('.match-spec') && q('.match-spec').textContent;
out.wifiBadge = true;
return out;
