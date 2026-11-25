/* Attract loop — the 3-second hook */
(function () {
  'use strict';
  var GG = window.GG;

  var DEBRIS = [
    { t: 'notes(3).pdf', x: 64, y: 108, r: -7, d: 7.5, c: '' },
    { t: 'Assignment_FINAL_v7.pdf', x: 792, y: 128, r: 5, d: 9, c: 'blue' },
    { t: 'IMG_2041.PNG', x: 116, y: 566, r: 4, d: 8, c: '' },
    { t: 'screenshot 2026-11-24.png', x: 946, y: 686, r: -5, d: 10, c: '' },
    { t: 'battery 3%', x: 392, y: 56, r: 3, d: 6.5, c: 'acid' },
    { t: 'buffering…', x: 1040, y: 236, r: -4, d: 8.5, c: '' },
    { t: 'fan: loud', x: 62, y: 330, r: 6, d: 7, c: '' },
    { t: 'tab 47 of 47', x: 486, y: 722, r: -3, d: 9.5, c: '' }
  ];

  GG.register('attract', {
    mount: function (root) {
      var screen = GG.el('section', { class: 'screen attract', tabindex: '-1' });

      var debris = GG.el('div', { class: 'attract-debris', 'aria-hidden': 'true' });
      DEBRIS.forEach(function (d) {
        debris.append(GG.el('span', {
          class: 'debris ' + d.c,
          text: d.t,
          style: '--x:' + d.x + 'px;--y:' + d.y + 'px;--r:' + d.r + 'deg;--d:' + d.d + 's'
        }));
      });

      var play = GG.el('button', {
        class: 'btn attract-play',
        type: 'button',
        text: 'TAP TO PLAY',
        'aria-label': 'Start the Glow-Up Gauntlet'
      });

      screen.append(
        GG.el('div', { class: 'attract-glow', 'aria-hidden': 'true' }),
        debris,
        GG.el('div', { class: 'attract-mid' },
          GG.el('div', { class: 'eyebrow', text: 'INTEL AI PC · IN-STORE DEMO' }),
          GG.el('h1', { class: 'attract-h1', html: 'WOULD YOUR<br>LAPTOP SURVIVE<br>YOUR LIFE?' }),
          play,
          GG.el('p', { class: 'attract-sub', text: '90 seconds · no typing · go' })
        )
      );

      root.append(screen);

      var started = false;
      function start() {
        if (started) return;
        started = true;
        GG.audio.pop();
        GG.nav('intro');
      }

      GG.on(screen, 'pointerdown', start);
      GG.on(screen, 'click', start);
      GG.on(play, 'keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start(); }
      });

      /* let a keyboard user land on the play button immediately */
      setTimeout(function () { try { play.focus({ preventScroll: true }); } catch (e) {} }, 60);
    },
    unmount: function () {}
  });
})();
