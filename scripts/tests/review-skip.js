const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const scene = () => document.documentElement.dataset.scene;

await wait(500);
const out = {};
out.skipVisible = !!q('.skip');

await wait(12600);
out.hintVisible = !!q('.hint');
out.hintTarget = q('.hint') && (q('.hint').getAttribute('data-name') || q('.hint').className);

if (!out.skipVisible) {
  out.ok = false;
  return out;
}

q('.skip').click();
await wait(700);
out.afterSkip1 = scene();
q('.skip').click();
await wait(700);
out.afterSkip2 = scene();
out.resultsBeforeVerdict = window.GG.state.results.length;
q('.skip').click();
await wait(700);
out.afterSkip3 = scene();

out.seededByVerdict = window.GG.state.results.length;
out.verdictReceipts = document.querySelectorAll('.vd-strip .vd-rec').length;

q('.vd-cta').click();
await wait(1600);
q('.vd-cta').click();
await wait(900);
out.matchScene = scene();
out.matchStats = Array.from(document.querySelectorAll('.mstat')).map((s) => s.textContent.trim()).join(' | ');

out.ok = out.skipVisible && out.hintVisible &&
  out.afterSkip1 === 'ch2' && out.afterSkip2 === 'ch3' && out.afterSkip3 === 'verdict' &&
  out.resultsBeforeVerdict === 0 &&
  out.seededByVerdict === 3 && out.verdictReceipts === 3 &&
  out.matchScene === 'match' && /3\s+receipts/.test(out.matchStats);
return out;
