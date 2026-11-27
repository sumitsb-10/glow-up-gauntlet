const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const scene = () => document.documentElement.dataset.scene;
const out = {};

await wait(500);
out.homeHiddenOnAttract = q('#home').hidden;

// accessible restart from a challenge
q('.attract-play').click();
await wait(700);
q('.vibe-card[data-vibe="student"]').click();
await wait(800);
out.homeVisibleOnChallenge = !q('#home').hidden;
q('#home').click();
await wait(700);
out.afterHome = scene();
out.homeHiddenAfterHome = q('#home').hidden;
out.stateAfterHome = {
  results: window.GG.state.results.length,
  skipped: window.GG.state.skipped.length,
  vibe: window.GG.state.vibe,
  choices: Object.keys(window.GG.state.choices).length
};

// idle reset from inside a challenge
q('.attract-play').click();
await wait(700);
q('.vibe-card[data-vibe="student"]').click();
await wait(800);
window.GG.idleLimits.ch1 = 1;
await wait(1400);
out.afterIdle = scene();
out.homeHiddenAfterIdle = q('#home').hidden;

out.ok = out.homeHiddenOnAttract && out.homeVisibleOnChallenge &&
  out.afterHome === 'attract' && out.homeHiddenAfterHome &&
  out.stateAfterHome.results === 0 && out.stateAfterHome.skipped === 0 &&
  out.stateAfterHome.vibe === null && out.stateAfterHome.choices === 0 &&
  out.afterIdle === 'attract' && out.homeHiddenAfterIdle;
return out;
