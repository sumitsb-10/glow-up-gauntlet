const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);

await wait(800);
q('.chip.q').click();
await wait(300);
const submit = q('.submit');
submit.click();
submit.click();
await wait(1100);
return {
  results: window.GG.state.results.length,
  ids: window.GG.state.results.map((r) => r.id),
  receipt: !!q('.receipt-card'),
  submitDisabled: submit.disabled
};
