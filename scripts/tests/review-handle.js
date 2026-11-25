const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);

await wait(1500);
const handle = q('.handle');
const r = handle.getBoundingClientRect();
const cx = r.left + r.width / 2;
const cy = r.top + r.height / 2;
const hit = (x) => {
  const el = document.elementFromPoint(x, cy);
  return !!el && (el === handle || handle.contains(el));
};

const scale = document.getElementById('stage').getBoundingClientRect().width / 1280;
const out = {
  width: Math.round(r.width / scale),
  height: Math.round(r.height / scale),
  left45: hit(cx - 45),
  right45: hit(cx + 45)
};
out.ok = out.width >= 120 && out.left45 && out.right45;
return out;
