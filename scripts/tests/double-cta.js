const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const scene = () => document.documentElement.dataset.scene;

await wait(500);
const cta = q('.vd-cta');
cta.click();
cta.click();
await wait(400);
const mid = { scene: scene(), cta: cta.textContent };

await wait(1500);
cta.click();
await wait(900);
return { mid, after: scene() };
