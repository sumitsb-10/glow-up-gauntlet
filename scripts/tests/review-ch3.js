const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const chip = (t) => Array.from(document.querySelectorAll('.vibe-chip')).find((c) => c.textContent.includes(t));

await wait(500);
const out = {};
out.initialPressed = document.querySelectorAll('.ctl-group [aria-pressed="true"]').length;
out.postDisabled = q('.post-btn').disabled;
out.placeholder = q('.poster').classList.contains('placeholder');

chip('Y2K').click();
await wait(160);
out.afterOnePressed = document.querySelectorAll('.ctl-group [aria-pressed="true"]').length;
out.postDisabledAfterOne = q('.post-btn').disabled;

chip('SERIF').click();
await wait(160);
chip('GRAINY').click();
await wait(300);
out.postEnabledAfterAll = !q('.post-btn').disabled;
out.placeholderAfterAll = q('.poster').classList.contains('placeholder');
out.ok = out.initialPressed === 0 && out.postDisabled && out.placeholder &&
  out.afterOnePressed === 1 && out.postDisabledAfterOne &&
  out.postEnabledAfterAll && !out.placeholderAfterAll;
return out;
