/* Verdict — receipt wall, the trap flip, then the match */
(function () {
  'use strict';
  var GG = window.GG;

  var DEFAULTS = [
    { id: 'deadline', line: 'READ ON THIS LAPTOP · WI-FI OFF', claim: 'This is the NPU.' },
    { id: 'photo', line: 'GENERATIVE FILL · ON-DEVICE', claim: 'Your photos never left this laptop.' },
    { id: 'poster', line: 'WI-FI OFF · GENERATED ON-DEVICE', claim: 'The AI is inside the laptop.' }
  ];

  var ABILITIES = [
    'Read a 40-page PDF in a blink',
    'Delete a person from a photo',
    'Make a poster with the Wi-Fi off'
  ];

  function pcCard(kind) {
    var isIntel = kind === 'intel';
    var card = GG.el('div', { class: 'pc ' + kind });
    card.append(
      GG.el('div', { class: 'pc-top' },
        GG.el('div', { class: 'pc-name', text: isIntel ? 'YOUR INTEL AI PC' : 'THE PRETTY ONE' }),
        GG.el('div', { class: 'pc-tag', text: isIntel ? 'AI PC' : '₹ cheaper' })
      ),
      GG.el('div', { class: 'pc-spec', text: isIntel
        ? 'Core Ultra · 16GB+ · 1TB · NPU'
        : '3 colours · RGB keys · 8GB · no NPU' })
    );

    var list = GG.el('ul', { class: 'abilities' });
    ABILITIES.forEach(function (label, i) {
      list.append(GG.el('li', { class: 'ability' },
        GG.el('span', { class: 'ab-n', text: String(i + 1).padStart(2, '0') }),
        GG.el('span', { class: 'ab-t', text: label }),
        GG.el('span', { class: 'ab-s ab-no', text: '✕' }),
        GG.el('span', { class: 'ab-s ab-yes', text: '✓' })
      ));
    });
    card.append(list);

    /* the core argument, drawn as a tiny pipeline */
    var flow = GG.el('div', { class: 'pc-flow' });
    flow.append(GG.el('div', { class: 'pf-label', text: 'WHERE THE AI RUNS' }));
    var row = GG.el('div', { class: 'pf-row' });
    var steps = isIntel
      ? [{ t: 'YOU', cls: '' }, { t: 'NPU', cls: 'npu' }, { t: 'ANSWER', cls: '' }]
      : [{ t: 'YOU', cls: '' }, { t: 'UPLOAD', cls: 'cloud' }, { t: 'A SERVER', cls: 'cloud' }];
    steps.forEach(function (s, i) {
      if (i) row.append(GG.el('span', { class: 'pf-arrow', text: '→', 'aria-hidden': 'true' }));
      row.append(GG.el('span', { class: 'pf-step ' + s.cls, text: s.t }));
    });
    flow.append(row,
      GG.el('div', { class: 'pf-note', text: isIntel ? 'Runs here. No signal needed.' : 'Runs in the cloud. Needs Wi-Fi.' })
    );
    card.append(flow);

    if (!isIntel) card.append(GG.el('div', { class: 'pc-note', text: "Can't run on-device AI. That's the whole thing." }));

    card.append(GG.el('div', { class: 'pc-foot' },
      GG.el('span', { class: 'pc-stamp', text: isIntel ? 'NPU INSIDE' : 'NO NPU' }),
      GG.el('span', { class: 'pc-foot-note', text: isIntel ? 'runs on this laptop' : 'needs the cloud' })
    ));

    return card;
  }

  GG.register('verdict', {
    mount: function (root) {
      var results = GG.state.results.length ? GG.state.results : DEFAULTS;
      var phase = 'idle';

      var screen = GG.el('section', { class: 'screen verdict' });
      screen.append(GG.el('header', { class: 'vd-head' },
        GG.el('div', { class: 'eyebrow', text: 'THE VERDICT' }),
        GG.el('h2', { html: "THREE THINGS THE<br>PRETTY ONE CAN'T DO." })
      ));

      var strip = GG.el('div', { class: 'vd-strip' });
      results.slice(0, 3).forEach(function (r, i) {
        strip.append(GG.el('div', { class: 'vd-rec', style: 'animation-delay:' + (i * 110) + 'ms' },
          GG.el('div', { class: 'vd-rec-line', text: r.line }),
          GG.el('div', { class: 'vd-rec-claim', text: r.claim })
        ));
      });
      screen.append(strip);

      var pretty = pcCard('pretty');
      var intel = pcCard('intel');
      screen.append(GG.el('div', { class: 'showdown' }, pretty, GG.el('div', { class: 'vs', text: 'VS' }), intel));

      var cta = GG.el('button', { class: 'btn vd-cta', type: 'button', text: 'RUN THE AI STUFF' });
      screen.append(cta);

      cta.addEventListener('click', function () {
        if (phase === 'idle') {
          phase = 'running';
          GG.audio.thud();
          pretty.classList.add('run');
          intel.classList.add('run');
          pretty.querySelectorAll('.ability').forEach(function (el, i) {
            GG.timers.after(120 + i * 220, function () { GG.audio.thud(); });
          });
          GG.timers.after(420, function () { GG.audio.chime(); });
          cta.textContent = 'SEE YOUR MATCH';
          phase = 'done';
          return;
        }
        if (phase === 'done') {
          GG.audio.pop();
          GG.nav('match');
        }
      });

      root.append(screen);

      var want = null;
      try { want = new URLSearchParams(window.location.search).get('phase'); } catch (e) {}
      if (want === 'run') GG.timers.after(400, function () { cta.click(); });
    },
    unmount: function () {}
  });
})();
