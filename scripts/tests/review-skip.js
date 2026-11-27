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
out.skipped = window.GG.state.skipped.slice();
out.verdictReceipts = document.querySelectorAll('.vd-strip .vd-rec').length;
out.missingReceipts = document.querySelectorAll('.vd-strip .vd-rec.missing').length;
out.missingText = Array.from(document.querySelectorAll('.vd-rec-line')).map((el) => el.textContent).join(' | ');

q('.vd-cta').click();
await wait(1700);
q('.vd-cta').click();
await wait(900);
out.matchScene = scene();
q('.consult-card[data-key="study"]').click();
await wait(450);
q('.consult-card[data-key="battery"]').click();
await wait(700);
out.matchStats = Array.from(document.querySelectorAll('.mstat')).map((s) => s.textContent.trim()).join(' | ');
out.runBadges = Array.from(document.querySelectorAll('.run-badge')).map((b) => b.textContent.trim());

out.ok = out.skipVisible && out.hintVisible &&
  out.afterSkip1 === 'ch2' && out.afterSkip2 === 'ch3' && out.afterSkip3 === 'verdict' &&
  out.resultsBeforeVerdict === 0 &&
  out.seededByVerdict === 0 &&
  out.skipped.length === 3 &&
  out.verdictReceipts === 3 && out.missingReceipts === 3 &&
  !/READ ON THIS LAPTOP|GENERATIVE FILL|GENERATED ON-DEVICE/.test(out.missingText) &&
  out.matchScene === 'match' && /0\s+receipts/.test(out.matchStats) && /3\s+skipped/.test(out.matchStats) &&
  out.runBadges.includes('3 SKIPPED');
return out;
