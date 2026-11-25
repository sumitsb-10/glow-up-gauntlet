/* Glow-Up Gauntlet — boot */
(function () {
  'use strict';
  var GG = window.GG;

  GG.stage.fit();
  window.addEventListener('resize', GG.stage.fit);
  window.addEventListener('orientationchange', function () { setTimeout(GG.stage.fit, 120); });

  /* audio unlock on first interaction (autoplay policy) */
  var unlocked = false;
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    GG.audio.unlock();
  }
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('keydown', unlock);

  /* mute toggle */
  var muteBtn = document.getElementById('mute');
  function paintMute() {
    var muted = GG.audio.isMuted();
    muteBtn.setAttribute('aria-pressed', String(muted));
    muteBtn.setAttribute('aria-label', muted ? 'Sound is off. Turn sound on.' : 'Sound is on. Mute sound.');
    muteBtn.querySelector('.mute-label').textContent = muted ? 'Sound off' : 'Sound on';
  }
  muteBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    GG.audio.toggle();
    paintMute();
  });
  paintMute();

  /* idle: only attract + match */
  var IDLE_MS = 25000;
  var lastInput = Date.now();
  ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(function (ev) {
    window.addEventListener(ev, function () { lastInput = Date.now(); }, { passive: true });
  });
  setInterval(function () {
    if (GG.current !== 'attract' && GG.current !== 'match') return;
    var limit = GG.current === 'match' ? 45000 : IDLE_MS;
    if (Date.now() - lastInput < limit) return;
    lastInput = Date.now();
    if (GG.current === 'attract') return;
    GG.reset();
    GG.nav('attract', { action: 'idle' });
  }, 1000);

  /* boot */
  var params = new URLSearchParams(window.location.search);
  var start = params.get('scene');
  var boot = start && GG.SCENES[start] ? start : 'attract';

  if (!GG.SCENES[boot]) {
    document.getElementById('scene').append(
      GG.el('div', { class: 'screen' },
        GG.el('h1', { text: 'Shell ready.' }),
        GG.el('p', { class: 'dim', text: 'No scenes registered yet.' }))
    );
  } else {
    GG.go(boot);
  }

  document.documentElement.dataset.ready = '1';
  document.documentElement.dataset.boot = boot;
})();
