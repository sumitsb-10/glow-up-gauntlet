const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);

await wait(900);
q('.chip.q').click();
await wait(250);
q('.submit').click();
await wait(900);

const card = q('.receipt-card');
const next = q('.receipt-actions .btn');
const tabbables = Array.from(document.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])'))
  .filter((el) => !el.disabled && el.getClientRects().length && !card.contains(el) && !el.closest('[inert]'));
const ev = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
next.dispatchEvent(ev);

const out = {
  screenInert: q('.ch1').inert === true,
  muteInert: q('#mute').inert === true,
  outsideTabbables: tabbables.length,
  tabTrapped: ev.defaultPrevented,
  nextFocused: document.activeElement === next
};
out.ok = out.screenInert && out.muteInert && out.outsideTabbables === 0 && out.tabTrapped && out.nextFocused;
return out;
