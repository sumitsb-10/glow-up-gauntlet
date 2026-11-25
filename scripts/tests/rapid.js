const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const scene = () => document.documentElement.dataset.scene;
const out = {};

await wait(400);
const play = q('.attract-play');
play.click(); play.click(); play.click();
await wait(800);
out.afterTriplePlay = scene();

const card = q('.vibe-card[data-vibe="creator"]');
card.click(); card.click(); card.click();
await wait(900);
out.afterTripleVibe = scene();
out.blockedJump = window.GG.go('verdict', { action: 'next' }) === false && scene() === 'ch1';

// fast double-tap on the receipt's Next must not skip a scene
q('.file[data-name="Assignment_FINAL_v7.pdf"]');
const files = document.querySelectorAll('.file');
files[0].click();
await wait(250);
files[0].click();
await wait(2000);
q('.rescue').click();
await wait(600);
Array.from(document.querySelectorAll('.ai-chips .chip')).find((c) => c.textContent === 'assignment').click();
await wait(700);
q('.file[data-name="Assignment_FINAL_v7.pdf"]').click();
await wait(500);
q('.chip.q').click();
await wait(400);
q('.submit').click();
await wait(900);
const next = q('.receipt-actions .btn');
next.click(); next.click(); next.click();
await wait(1000);
out.afterTripleNext = scene();
out.results = window.GG.state.results.length;

return out;
