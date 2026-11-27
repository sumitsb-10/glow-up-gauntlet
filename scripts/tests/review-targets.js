const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const scale = () => document.getElementById('stage').getBoundingClientRect().width / 1280;
const box = (el) => {
  if (!el) return { w: 0, h: 0 };
  const r = el.getBoundingClientRect();
  return { w: Math.round(r.width / scale()), h: Math.round(r.height / scale()) };
};
const go = async (scene) => {
  window.GG.go(scene);
  await wait(650);
};

await wait(600);
const out = {};
out.searchChip = box(q('.ai-chips .chip'));
out.skip = box(q('.skip'));

await go('ch3');
out.vibeChip = box(q('.vibe-chip'));

await go('verdict');
out.verdictCta = box(q('.vd-cta'));

await go('match');
out.mute = box(q('#mute'));
out.playAgain = box(q('.match .btn.ghost'));
q('.consult-card[data-key="study"]').click();
await wait(450);
q('.consult-card[data-key="battery"]').click();
await wait(700);
out.primaryCta = box(q('.rec-primary'));
out.objection = box(q('.objection-btn'));
out.again = box(q('.rec-again'));

out.failures = Object.keys(out).filter((k) => out[k].w < 64 || out[k].h < 64);
out.ok = out.failures.length === 0;
return out;
