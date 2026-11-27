const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const scale = () => document.getElementById('stage').getBoundingClientRect().width / 1280;

await wait(2600);
const s = scale();
const scr = q('.verdict');
const sr = scr.getBoundingClientRect();
const cta = q('.vd-cta').getBoundingClientRect();
const head = q('.vd-head').getBoundingClientRect();
const out = {
  scale: +s.toFixed(3),
  scrollH: scr.scrollHeight,
  clientH: scr.clientHeight,
  fits: scr.scrollHeight <= scr.clientHeight,
  ctaOver: +((cta.bottom - sr.bottom) / s).toFixed(1),
  ctaInside: cta.bottom <= sr.bottom + 0.5,
  headTop: +((head.top - sr.top) / s).toFixed(1),
  headInside: head.top >= sr.top - 0.5,
};
out.ok = out.fits && out.ctaInside && out.headInside;
return out;
