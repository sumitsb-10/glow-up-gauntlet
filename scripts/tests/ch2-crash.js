const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
await wait(300);
q('.ed-actions .btn').click();
await wait(1250);
return { exp: !!q('.exp'), pct: q('.exp-pct') && q('.exp-pct').textContent };
