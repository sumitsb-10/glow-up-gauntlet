const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await wait(300);
const play = document.querySelector('.attract-play');
const cs = getComputedStyle(play);
return {
  reduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  animationDuration: cs.animationDuration,
  animationIterationCount: cs.animationIterationCount,
  driftDuration: getComputedStyle(document.querySelector('.debris')).animationDuration,
  playVisible: play.getBoundingClientRect().height >= 64
};
