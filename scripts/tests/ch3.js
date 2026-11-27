const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const out = {};

await wait(400);
out.start = document.documentElement.dataset.scene;
out.poster = !!q('.poster');
out.groups = document.querySelectorAll('.ctl-group').length;

// switch vibe to Y2K
const y2k = Array.from(document.querySelectorAll('.vibe-chip')).find((c) => c.textContent.includes('Y2K'));
y2k.click();
await wait(300);
out.pressed = y2k.getAttribute('aria-pressed');

// switch type to serif, then finish and output so the preview renders
Array.from(document.querySelectorAll('.vibe-chip')).find((c) => c.textContent.includes('SERIF')).click();
await wait(200);
Array.from(document.querySelectorAll('.vibe-chip')).find((c) => c.textContent.includes('GRAINY')).click();
await wait(200);
Array.from(document.querySelectorAll('.vibe-chip')).find((c) => c.textContent.includes('LOW POWER')).click();
await wait(300);
out.headlineFont = q('.p-headline').style.fontFamily;
out.output = q('.poster').getAttribute('data-output');
out.postEnabled = !q('.post-btn').disabled;

q('.post-btn').click();
await wait(1000);
out.receipt = !!q('.receipt-card');
out.results = window.GG.state.results.length;
return out;
