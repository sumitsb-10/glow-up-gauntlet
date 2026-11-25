const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);

await wait(700);
const file = q('.file');
const r = file.getBoundingClientRect();
const tapX = r.left + r.width / 2;
const tapY = r.top + r.height / 2;
file.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: tapX, clientY: tapY }));
await wait(520);

const ring = q('.tap-ring');
const rr = ring && ring.getBoundingClientRect();
const ringX = rr ? rr.left + rr.width / 2 : NaN;
const ringY = rr ? rr.top + rr.height / 2 : NaN;
const scale = document.getElementById('stage').getBoundingClientRect().width / 1280;
const error = Math.hypot(ringX - tapX, ringY - tapY);

return {
  scale: Math.round(scale * 100) / 100,
  error: Math.round(error * 10) / 10,
  ok: !!ring && error < 3
};
