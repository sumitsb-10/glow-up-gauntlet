const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const scene = () => document.documentElement.dataset.scene;

await wait(2200);
const out = {
  seeded: window.GG.state.results.length,
  tallyText: q('.vd-tally') && q('.vd-tally').textContent.replace(/\s+/g, ' ').trim()
};
q('.vd-cta').click();
await wait(900);
out.matchScene = scene();
out.matchStats = Array.from(document.querySelectorAll('.mstat')).map((s) => s.textContent.trim()).join(' | ');
out.ok = out.seeded === 3 && /3 receipts/.test(out.tallyText || '') &&
  out.matchScene === 'match' && /3\s+receipts/.test(out.matchStats);
return out;
