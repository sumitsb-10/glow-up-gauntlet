const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);

await wait(400);
q('.attract-play').click();
await wait(700);
q('.vibe-card[data-vibe="hustler"]').click();
await wait(800);

const files = document.querySelectorAll('.file');
files[0].click();
await wait(250);
files[0].click();
await wait(1800);
q('.rescue').click();
await wait(500);
Array.from(document.querySelectorAll('.ai-chips .chip')).find((c) => c.textContent === 'assignment').click();
await wait(700);
q('.file[data-name="Assignment_FINAL_v7.pdf"]').click();
await wait(500);
q('.chip.q').click();
await wait(400);
q('.submit').click();
await wait(1000);
return { scene: document.documentElement.dataset.scene, receipt: !!q('.receipt-card') };
