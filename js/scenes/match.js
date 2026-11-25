/* Match — the screenshot moment */
(function () {
  'use strict';
  var GG = window.GG;

  GG.register('match', {
    mount: function (root) {
      var vibe = GG.state.vibe && GG.VIBES[GG.state.vibe] ? GG.state.vibe : 'student';
      var m = GG.match.matchFor(vibe);
      var t = GG.match.tally(GG.state.results);

      var screen = GG.el('section', { class: 'screen match' });
      var card = GG.el('div', { class: 'match-card' });

      card.append(
        GG.el('div', { class: 'match-left' },
          GG.svg(GG.art.avatar(vibe), 'match-avatar'),
          GG.el('div', { class: 'match-badge', text: 'AI PC' })
        ),
        GG.el('div', { class: 'match-right' },
          GG.el('div', { class: 'eyebrow', text: 'YOUR MATCH' }),
          GG.el('h2', { class: 'match-title', text: m.title }),
          GG.el('p', { class: 'match-line', text: m.line }),
          GG.el('div', { class: 'match-spec', text: m.spec }),
          GG.el('div', { class: 'match-stats' },
            GG.el('span', { class: 'mstat' }, GG.el('b', { text: String(t.count) }), ' receipts'),
            GG.el('span', { class: 'mstat' }, GG.el('b', { text: t.uploads }), ' uploaded'),
            GG.el('span', { class: 'mstat' }, GG.el('b', { text: 'Wi-Fi ' + t.wifi }), '')
          ),
          GG.el('div', { class: 'match-cta', text: 'Ask for the AI PC demo at the counter.' }),
          GG.el('div', { class: 'match-shot', text: 'Screenshot this.' })
        )
      );

      var again = GG.el('button', { class: 'btn ghost sm', type: 'button', text: 'PLAY AGAIN' });
      again.addEventListener('click', function () {
        GG.audio.pop();
        GG.reset();
        GG.nav('attract', { action: 'restart' });
      });

      screen.append(
        GG.el('div', { class: 'match-glow', 'aria-hidden': 'true' }),
        card,
        again
      );
      root.append(screen);
      GG.audio.chime();
    },
    unmount: function () {}
  });
})();
