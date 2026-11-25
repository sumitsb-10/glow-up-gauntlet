const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const scene = () => document.documentElement.dataset.scene;
const errors = [];
window.addEventListener('error', (e) => errors.push(String(e.message)));
window.addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));

const out = { checks: {} };
const check = (name, value) => { out.checks[name] = value; };

await wait(400);
check('bootReady', document.documentElement.dataset.ready === '1');
check('focusLandsOnPlay', document.activeElement && document.activeElement.classList.contains('attract-play'));

// mute toggle persists, defaults to muted
const mute = q('#mute');
check('mutedByDefault', mute.getAttribute('aria-pressed') === 'true');
mute.click();
check('unmuteUpdates', mute.getAttribute('aria-pressed') === 'false' && localStorage.getItem('gg.muted') === '0');
mute.click();
check('mutePersists', mute.getAttribute('aria-pressed') === 'true' && localStorage.getItem('gg.muted') === '1');

// touch-style start
const play = q('.attract-play');
play.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }));
play.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'touch' }));
await wait(700);
check('touchStarts', scene() === 'intro');

const cards = Array.from(document.querySelectorAll('.vibe-card'));
check('vibeCardsAreButtons', cards.length === 3 && cards.every((c) => c.tagName === 'BUTTON' && c.tabIndex === 0 && c.getAttribute('aria-label')));
cards[0].click();
await wait(800);
check('vibeToCh1', scene() === 'ch1');

// ch1 keyboard-reachable controls
check('filesAreButtons', Array.from(document.querySelectorAll('.file')).every((f) => f.tagName === 'BUTTON'));
await wait(1900);
const rescue = q('.rescue');
check('rescueIsButton', !!rescue && rescue.tagName === 'BUTTON' && rescue.classList.contains('show'));
rescue.click();
await wait(600);
Array.from(document.querySelectorAll('.ai-chips .chip')).find((c) => c.textContent === 'assignment').click();
await wait(700);
q('.file[data-name="Assignment_FINAL_v7.pdf"]').click();
await wait(500);
q('.chip.q').click();
await wait(400);
check('answerAnnounced', q('.doc-hint').getAttribute('role') === 'status' && q('.doc-hint').getAttribute('aria-live') === 'polite');
q('.submit').click();
await wait(1000);
check('receiptDialog', q('.receipt-card').getAttribute('role') === 'dialog');
check('receiptLiveHeadline', q('.receipt-headline').getAttribute('aria-live') === 'polite');
check('receiptFocusesNext', document.activeElement === q('.receipt-actions .btn'));
q('.receipt-actions .btn').click();
await wait(900);

// ch2 keyboard path
q('.ed-actions .btn').click();
await wait(2600);
q('.rescue').click();
await wait(600);
const hit = q('.bomber-hit');
check('bomberKeyboardable', hit.getAttribute('tabindex') === '0' && hit.getAttribute('role') === 'button' && !!hit.getAttribute('aria-label'));
hit.focus();
hit.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
await wait(250);
check('keyboardSelectShowsChips', document.querySelectorAll('.ed-actions .chip').length === 3);
check('focusMovesToChips', document.activeElement === q('.ed-actions .chip'));
q('.ed-actions .chip').click();
await wait(1200);
const handle = q('.handle');
check('handleIsSlider', handle.getAttribute('role') === 'slider' && handle.getAttribute('aria-valuemin') === '0');
handle.focus();
handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
await wait(700);
check('arrowExtends', handle.getAttribute('aria-valuenow') === '40');
handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
await wait(700);
check('enterExtends', Number(handle.getAttribute('aria-valuenow')) >= 100);
q('.ed-actions .btn').click();
await wait(1500);
check('ch2Receipt', !!q('.receipt-card'));
q('.receipt-actions .btn').click();
await wait(900);

// ch3: starts neutral, one pressed chip per group after picking, POST gated until all three
const groups = Array.from(document.querySelectorAll('.ctl-group'));
check('startsUnpicked', groups.length === 3 && groups.every((g) => g.querySelectorAll('[aria-pressed="true"]').length === 0));
check('postGated', q('.post-btn').disabled);
const before = q('.poster').getAttribute('aria-label');
const chipFor = (t) => Array.from(document.querySelectorAll('.vibe-chip')).find((c) => c.textContent.includes(t));
chipFor('Y2K').click();
await wait(250);
check('oneChoicePerGroup', groups[0].querySelectorAll('[aria-pressed="true"]').length === 1 &&
  groups[1].querySelectorAll('[aria-pressed="true"]').length === 0 &&
  groups[2].querySelectorAll('[aria-pressed="true"]').length === 0);
check('posterLabelUpdates', q('.poster').getAttribute('aria-label') !== before);
check('postStillGated', q('.post-btn').disabled);
chipFor('SERIF').click();
await wait(200);
chipFor('GRAINY').click();
await wait(300);
check('postEnabled', !q('.post-btn').disabled);
q('.post-btn').click();
await wait(1100);
q('.receipt-actions .btn').click();
await wait(900);

// verdict: state change is visible, not colour-only
q('.vd-cta').click();
await wait(1600);
check('verdictStrikethrough', getComputedStyle(q('.pc.pretty .ab-t')).textDecorationLine === 'line-through');
check('verdictCrossShown', getComputedStyle(q('.pc.pretty .ab-no')).display !== 'none');
check('verdictTickShown', getComputedStyle(q('.pc.intel .ab-yes')).display !== 'none');
q('.vd-cta').click();
await wait(900);
check('matchReached', scene() === 'match');
check('matchStats', Array.from(document.querySelectorAll('.mstat')).map((s) => s.textContent.trim()).join(' | '));

const again = q('.match .btn.ghost');
check('playAgainIsButton', again.tagName === 'BUTTON');
again.click();
await wait(800);
check('resetToAttract', scene() === 'attract');
check('stateReset', window.GG.state.results.length === 0 && window.GG.state.vibe === null);

out.errors = errors;
return out;
