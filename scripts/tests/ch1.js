const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const scene = () => document.documentElement.dataset.scene;
const out = {};

await wait(500);
out.start = scene();

q('.attract-play').click();
await wait(700);
out.afterStart = scene();

q('.vibe-card[data-vibe="student"]').click();
await wait(800);
out.afterVibe = scene();
out.vibe = window.GG.state.vibe;
out.files = document.querySelectorAll('.file').length;

const files = document.querySelectorAll('.file');
files[0].click();
await wait(250);
files[0].click();
await wait(1900);
out.crashed = !!q('.crash');
out.title = q('.lp-title') && q('.lp-title').textContent;

const rescue = q('.rescue');
out.rescueVisible = !!rescue && rescue.classList.contains('show');
if (rescue) rescue.click();
await wait(600);
out.aiBar = !!q('.ai-search');

const chip = Array.from(document.querySelectorAll('.ai-chips .chip')).find((c) => c.textContent === 'assignment');
if (chip) chip.click();
await wait(700);
out.remainingFiles = document.querySelectorAll('.file').length;
out.hot = !!q('.file.hot');

const target = q('.file[data-name="Assignment_FINAL_v7.pdf"]');
if (target) target.click();
await wait(500);
out.doc = !!q('.doc-page');

const qchip = q('.chip.q');
if (qchip) qchip.click();
await wait(400);
out.found = !!q('.para.found');
out.submitEnabled = !!q('.submit') && !q('.submit').disabled;

q('.submit').click();
await wait(900);
out.receipt = !!q('.receipt-card');
out.results = window.GG.state.results.length;

return out;
