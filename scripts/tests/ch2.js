const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const out = {};

await wait(400);
out.start = document.documentElement.dataset.scene;

q('.ed-actions .btn').click();          // EXPORT
await wait(600);
out.progress = !!q('.exp');
await wait(1600);
out.stampShown = !!q('.stamp.show') || !!q('.rescue');

await wait(600);
const rescue = q('.rescue');
out.rescue = !!rescue;
if (rescue) rescue.click();
await wait(500);
out.afterRescue = q('.ed-prompt b') && q('.ed-prompt b').textContent;

// tap the photobomber
const hit = q('.bomber-hit');
out.hitExists = !!hit;
if (hit) hit.dispatchEvent(new MouseEvent('click', { bubbles: true }));
await wait(300);
out.chips = document.querySelectorAll('.ed-actions .chip').length;

q('.ed-actions .chip').click();          // Remove
await wait(1200);
out.removed = q('.photo').classList.contains('removed');
out.handle = !!q('.handle') && !q('.handle').classList.contains('hidden');
out.prompt = q('.ed-prompt b') && q('.ed-prompt b').textContent;

q('.handle').click();                    // tap to extend
await wait(900);
out.reveal = q('.handle') && q('.handle').getAttribute('aria-valuenow');

q('.ed-actions .btn').click();           // POST
await wait(1400);
out.receipt = !!q('.receipt-card');
out.results = window.GG.state.results.length;

return out;
