const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const scene = () => document.documentElement.dataset.scene;

await wait(900);
q('.chip.q').click();
await wait(250);
q('.submit').click();
await wait(900);
const out = {
  receiptOpen: !!q('.receipt-card'),
  homeInert: q('#home').inert === true
};

window.GG.idleLimits.ch1 = 1;
await wait(1500);
out.afterIdle = scene();
out.receiptGone = !q('.receipt-card');
out.homeHidden = q('#home').hidden;
out.results = window.GG.state.results.length;
out.ok = out.receiptOpen && out.homeInert && out.afterIdle === 'attract' &&
  out.receiptGone && out.homeHidden && out.results === 0;
return out;
