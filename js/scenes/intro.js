/* Intro — pick your vibe */
(function () {
  'use strict';
  var GG = window.GG;

  GG.register('intro', {
    mount: function (root) {
      var screen = GG.el('section', { class: 'screen intro' });

      screen.append(
        GG.el('header', { class: 'intro-head' },
          GG.el('div', { class: 'eyebrow', text: 'STEP 1 OF 4 · NO TYPING REQUIRED' }),
          GG.el('h2', { html: "FIRST — WHO'S USING<br>THIS LAPTOP?" }),
          GG.el('p', { class: 'intro-sub', text: 'Pick one. It decides your match at the end.' })
        )
      );

      var grid = GG.el('div', { class: 'intro-grid' });
      var keys = Object.keys(GG.VIBES);
      var chosen = false;

      keys.forEach(function (key, i) {
        var v = GG.VIBES[key];
        var card = GG.el('button', {
          class: 'vibe-card',
          type: 'button',
          'data-vibe': key,
          'aria-label': 'Play as ' + v.label.toLowerCase(),
          style: 'animation-delay:' + (i * 70) + 'ms'
        });
        card.append(
          GG.svg(GG.art.avatar(key), 'vibe-art'),
          GG.el('div', { class: 'vibe-label', text: v.label }),
          GG.el('p', { class: 'vibe-line', text: v.line }),
          GG.el('span', { class: 'vibe-go', text: 'PICK THIS ONE' }),
          GG.el('div', { class: 'vibe-traits', 'aria-hidden': 'true' },
            v.traits.map(function (t) { return GG.el('span', { class: 'vibe-trait', text: t }); }))
        );
        card.addEventListener('click', function () {
          if (chosen) return;
          chosen = true;
          GG.state.vibe = key;
          GG.audio.pop();
          card.classList.add('picked');
          GG.timers.after(180, function () { GG.nav('ch1'); });
        });
        grid.append(card);
      });

      screen.append(grid);
      root.append(screen);
    },
    unmount: function () {}
  });
})();
