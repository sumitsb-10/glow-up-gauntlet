const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const out = {};

await wait(1500);
const handle = q('.handle');
const scale = document.getElementById('stage').getBoundingClientRect().width / 1280;
const start = handle.getBoundingClientRect().left + handle.getBoundingClientRect().width / 2;

handle.dispatchEvent(new PointerEvent('pointerdown', {
  bubbles: true, pointerType: 'touch', pointerId: 7, clientX: start, clientY: 400
}));
handle.dispatchEvent(new PointerEvent('pointermove', {
  bubbles: true, pointerType: 'touch', pointerId: 7, clientX: start + 90 * scale, clientY: 400
}));
handle.dispatchEvent(new PointerEvent('pointerup', {
  bubbles: true, pointerType: 'touch', pointerId: 7, clientX: start + 90 * scale, clientY: 400
}));
await wait(300);
out.afterDrag = handle.getAttribute('aria-valuenow');
out.clip = q('.photo').style.clipPath;

// browsers usually fire a click after the drag; then a fresh tap
handle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const tapX = handle.getBoundingClientRect().left + handle.getBoundingClientRect().width / 2;
handle.dispatchEvent(new PointerEvent('pointerdown', {
  bubbles: true, pointerType: 'touch', pointerId: 8, clientX: tapX, clientY: 400
}));
handle.dispatchEvent(new PointerEvent('pointerup', {
  bubbles: true, pointerType: 'touch', pointerId: 8, clientX: tapX, clientY: 400
}));
handle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
await wait(800);
out.afterTap = handle.getAttribute('aria-valuenow');

const post = q('.ed-actions .btn');
post.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }));
post.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'touch' }));
post.click();
await wait(1500);
out.receipt = !!q('.receipt-card');
return out;
