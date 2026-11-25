const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const box = (el) => {
  const r = el.getBoundingClientRect();
  const scale = document.getElementById('stage').getBoundingClientRect().width / 1280;
  return { w: Math.round(r.width / scale), h: Math.round(r.height / scale) };
};

await wait(1000);
const out = {
  questionChip: box(q('.chip.q')),
  submit: box(q('.submit'))
};
out.failures = Object.keys(out).filter((k) => out[k].w < 64 || out[k].h < 64);
out.ok = out.failures.length === 0;
return out;
