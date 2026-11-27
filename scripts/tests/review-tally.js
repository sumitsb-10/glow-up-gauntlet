const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const scene = () => document.documentElement.dataset.scene;

await wait(2200);
const out = {
  seeded: window.GG.state.results.length,
  skipped: window.GG.state.skipped.length,
  tallyText: q('.vd-tally') && q('.vd-tally').textContent.replace(/\s+/g, ' ').trim()
};
q('.vd-cta').click();
await wait(900);
out.matchScene = scene();
q('.consult-card[data-key="study"]').click();
await wait(450);
q('.consult-card[data-key="battery"]').click();
await wait(700);
out.matchStats = Array.from(document.querySelectorAll('.mstat')).map((s) => s.textContent.trim()).join(' | ');
out.ok = out.seeded === 0 && out.skipped === 0 &&
  /0 receipts/.test(out.tallyText || '') && /0 skipped/.test(out.tallyText || '') &&
  out.matchScene === 'match' && /0\s+receipts/.test(out.matchStats);
return out;
