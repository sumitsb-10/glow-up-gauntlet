const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const scale = () => document.getElementById('stage').getBoundingClientRect().width / 1280;

await wait(1600);
const s = scale();
const out = { scale: +s.toFixed(3), fonts: {} };
const targets = {
  lpTitle: '.lp-title',
  lpNote: '.lp-note',
  file: '.file',
  fileName: '.file-name',
  fileIco: '.file-ico',
};
for (const [k, sel] of Object.entries(targets)) {
  const el = q(sel);
  if (!el) {
    out.fonts[k] = null;
    continue;
  }
  const css = parseFloat(getComputedStyle(el).fontSize);
  out.fonts[k] = { css, eff: +(css * s).toFixed(2) };
}
out.tooSmall = Object.entries(out.fonts)
  .filter(([k, v]) => !v || v.eff < 12.5)
  .map(([k]) => k);
out.ok = out.tooSmall.length === 0;
return out;
