const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const q = (selector) => document.querySelector(selector);
const out = {};

await wait(750);
const base = q('.group-base');
const edited = q('.group-edited');
out.photoLoaded = !!base && base.complete && base.naturalWidth > 0;
out.previewLoaded = !!edited && edited.complete && edited.naturalWidth > 0;
out.realPhotoAlt = base && base.alt === 'Five friends posing together on a beach';

q('.bomber-hit').click();
await wait(120);
const maskButton = Array.from(document.querySelectorAll('.chip')).find((el) => el.textContent === 'MASK THE PERSON');
out.maskChoiceAvailable = !!maskButton;
if (maskButton) maskButton.click();
await wait(900);
out.previewShown = !!edited && getComputedStyle(edited).opacity === '1';
out.maskMarkedIllustrative = !!q('.photo-mask-label') && getComputedStyle(q('.photo-mask-label')).display !== 'none';
out.copyIsHonest = /illustrative/i.test(q('.ed-bottom').textContent) && /not AI photo removal/i.test(q('.ed-bottom').textContent);
out.ok = out.photoLoaded && out.previewLoaded && out.realPhotoAlt && out.maskChoiceAvailable &&
  out.previewShown && out.maskMarkedIllustrative && out.copyIsHonest;
return out;
