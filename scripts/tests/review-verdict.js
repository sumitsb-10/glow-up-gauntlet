const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

await wait(500);
const cta = q('.vd-cta');
const copy = {
  compare: q('.compare-note') && q('.compare-note').textContent,
  silicon: q('.silicon') && q('.silicon').textContent.replace(/\s+/g, ' ').trim(),
  pfNote: q('.pc.pretty .pf-note') && q('.pc.pretty .pf-note').textContent
};
cta.click();

if (reduce) {
  await wait(250);
  const out = {
    reduce: true,
    tallyShown: !!q('.vd-tally.show'),
    ctaEnabled: !cta.disabled,
    ctaText: cta.textContent,
    copy
  };
  out.ok = out.tallyShown && out.ctaEnabled && out.ctaText === 'BUILD MY MATCH' &&
    /AMD Ryzen AI/.test(out.copy.compare) && /Qualcomm Snapdragon X/.test(out.copy.compare) &&
    /CPU/.test(out.copy.silicon) && /GPU/.test(out.copy.silicon) && /NPU/.test(out.copy.silicon) &&
    /not required/i.test(out.copy.silicon) && /illustrative/i.test(out.copy.pfNote);
  return out;
}

await wait(300);
const early = {
  firstFlipAt300: document.querySelectorAll('.pc.pretty .ability.flip').length,
  ctaDisabledDuring: cta.disabled,
  tallyShownDuring: !!q('.vd-tally.show')
};

await wait(1400);
const out = {
  reduce: false,
  early,
  prettyFlipped: document.querySelectorAll('.pc.pretty .ability.flip').length,
  intelFlashed: document.querySelectorAll('.pc.intel .ability.live').length,
  intelVisible: Array.from(document.querySelectorAll('.pc.intel .ability')).every((el) => {
    const c = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return c.position !== 'absolute' && c.opacity !== '0' && r.height > 20 && r.width < 700;
  }),
  tallyShown: !!q('.vd-tally.show'),
  tallyText: q('.vd-tally') && q('.vd-tally').textContent.replace(/\s+/g, ' ').trim(),
  ctaEnabled: !cta.disabled,
  ctaText: cta.textContent,
  copy
};
out.ok = out.early.firstFlipAt300 >= 1 && out.early.firstFlipAt300 < 3 &&
  out.early.ctaDisabledDuring && !out.early.tallyShownDuring &&
  out.prettyFlipped === 3 && out.intelFlashed === 3 && out.intelVisible &&
  out.tallyShown && /0 receipts/.test(out.tallyText) && /0 skipped/.test(out.tallyText) &&
  out.ctaEnabled && out.ctaText === 'BUILD MY MATCH' &&
  /AMD Ryzen AI/.test(out.copy.compare) && /Qualcomm Snapdragon X/.test(out.copy.compare) &&
  /CPU/.test(out.copy.silicon) && /GPU/.test(out.copy.silicon) && /NPU/.test(out.copy.silicon) &&
  /not required/i.test(out.copy.silicon) && /illustrative/i.test(out.copy.pfNote);
return out;
