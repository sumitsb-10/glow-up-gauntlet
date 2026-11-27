const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const out = {};

await wait(1000);
const stage = q('#stage').getBoundingClientRect();
out.primary = q('.rec-primary').textContent;
out.secondary = q('.rec-again').textContent;
out.promise = q('.match-promise').textContent;
out.spec = q('.match-spec').textContent;
out.category = q('.rec-cat').textContent;
const resultRect = q('.result-card').getBoundingClientRect();
out.resultCardFits = resultRect.top >= stage.top - 1 && resultRect.bottom <= stage.bottom + 1;

// price objection opens a compact value sheet that fits the stage
q('.objection-btn').click();
await wait(700);
const sheet = q('.receipt-card.value');
out.valueReceipt = !!sheet;
out.valueStamp = q('.receipt-stamp').textContent;
out.valueLines = document.querySelectorAll('.receipt-line').length;
out.valueFits = !!sheet && sheet.getBoundingClientRect().bottom <= stage.bottom + 1;
const sheetRect = sheet && sheet.getBoundingClientRect();
const topHit = sheetRect && document.elementFromPoint(
  sheetRect.left + sheetRect.width / 2,
  sheetRect.top + sheetRect.height / 2
);
out.valueOnTop = !!sheet && sheet.contains(topHit);
q('.receipt-actions .btn').click();
await wait(500);
out.backToResult = !!q('.rec-primary') && !q('.receipt-card');

// explore again resets the consultation
q('.rec-again').click();
await wait(500);
out.againQuestion = q('.consult-head h2').textContent.replace(/\s+/g, ' ').trim();
out.againHasNoResult = !q('.rec-primary');

// a different need profile gets a different configuration
q('.consult-card[data-key="create"]').click();
await wait(450);
q('.consult-card[data-key="performance"]').click();
await wait(700);
out.personalSpec = q('.match-spec').textContent;
out.personalCategory = q('.rec-cat').textContent;

// counter pass opens and closes cleanly
q('.rec-primary').click();
await wait(700);
out.counterPass = !!q('.receipt-card') && /COUNTER PASS/.test(q('.receipt-stamp').textContent);
out.counterLines = Array.from(document.querySelectorAll('.receipt-line')).map((line) => line.textContent).join(' ');
q('.receipt-actions .btn').click();
await wait(500);
out.counterClosed = !q('.receipt-card') && !!q('.rec-primary');

out.ok = out.primary === 'TRY YOUR INTEL AI PC AT THE COUNTER' &&
  out.secondary === 'EXPLORE YOUR RECOMMENDATION AGAIN' &&
  out.promise === 'Your next laptop should work as hard as you do.' &&
  /Core Ultra mobile laptop/.test(out.spec) && /verify the exact model and NPU/i.test(out.spec) &&
  out.resultCardFits && out.valueReceipt && out.valueLines >= 5 && out.valueFits && out.valueOnTop &&
  out.backToResult && /WHAT WILL YOU/.test(out.againQuestion) && out.againHasNoResult &&
  /Match CPU\/GPU to editing software/.test(out.personalSpec) && /32GB/.test(out.personalSpec) &&
  /Creator/.test(out.personalCategory) && out.counterPass &&
  /verify NPU availability/i.test(out.counterLines) && /Compare battery tests/i.test(out.counterLines) &&
  out.counterClosed;
return out;
