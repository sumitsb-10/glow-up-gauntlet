/* Verdict — real receipts, a fair comparison, and the CPU/GPU/NPU explanation */
(function () {
  'use strict';
  var GG = window.GG;

  var SLOTS = [
    { id: 'deadline', fallback: 'LOCAL DOCUMENT SEARCH', claim: 'Run the deadline challenge to earn this receipt.' },
    { id: 'photo', fallback: 'LOCAL PHOTO DECISION', claim: 'Run the photobomber challenge to earn this receipt.' },
    { id: 'poster', fallback: 'LOCAL POSTER COMPOSER', claim: 'Run the 2AM poster challenge to earn this receipt.' }
  ];

  var ABILITIES = [
    { label: 'AI compute paths', entry: 'CPU/GPU · NPU varies', intel: 'CPU/GPU + NPU*' },
    { label: 'NPU availability', entry: 'Check processor', intel: 'Verify exact model' },
    { label: 'App + feature support', entry: 'Check exact app', intel: 'Check exact app' }
  ];

  function pcCard(kind) {
    var isIntel = kind === 'intel';
    var card = GG.el('div', { class: 'pc ' + kind });
    card.append(
      GG.el('div', { class: 'pc-top' },
        GG.el('div', { class: 'pc-name', text: isIntel ? 'INTEL AI PC PROFILE' : 'ENTRY LAPTOP PROFILE' }),
        GG.el('div', { class: 'pc-tag', text: isIntel ? 'SUGGESTED' : 'ILLUSTRATIVE' })
      ),
      GG.el('div', { class: 'pc-spec', text: isIntel
        ? 'Suggested profile: Core Ultra laptop · 16GB+ · 1TB · verify exact NPU model'
        : 'Illustrative example: 8GB memory · integrated graphics; processor unspecified' })
    );

    var list = GG.el('ul', { class: 'abilities' });
    ABILITIES.forEach(function (ability, i) {
      list.append(GG.el('li', { class: 'ability' },
        GG.el('span', { class: 'ab-n', text: String(i + 1).padStart(2, '0') }),
        GG.el('span', { class: 'ab-t', text: ability.label }),
        GG.el('span', { class: 'ab-s ab-lim', text: isIntel ? ability.intel : ability.entry })
      ));
    });
    card.append(list);

    var flow = GG.el('div', { class: 'pc-flow' });
    flow.append(GG.el('div', { class: 'pf-label', text: 'POSSIBLE COMPUTE PATH' }));
    var row = GG.el('div', { class: 'pf-row' });
    var steps = isIntel
      ? [{ t: 'APP', cls: '' }, { t: 'CPU/GPU/NPU*', cls: 'npu' }, { t: 'OUTPUT', cls: '' }]
      : [{ t: 'APP', cls: '' }, { t: 'CPU/GPU · NPU varies', cls: '' }, { t: 'OUTPUT', cls: '' }];
    steps.forEach(function (s, i) {
      if (i) row.append(GG.el('span', { class: 'pf-arrow', text: '→', 'aria-hidden': 'true' }));
      row.append(GG.el('span', { class: 'pf-step ' + s.cls, text: s.t }));
    });
    flow.append(row,
      GG.el('div', { class: 'pf-note', text: '*Illustrative path only; the exact processor, app and feature determine where work runs.' })
    );
    card.append(flow);

    card.append(GG.el('div', { class: 'pc-foot' },
      GG.el('span', { class: 'pc-stamp', text: isIntel ? 'VERIFY EXACT MODEL' : 'COMPOSITE PROFILE' }),
      GG.el('span', { class: 'pc-foot-note', text: isIntel ? '*verify NPU + app support' : 'exact processor unknown' })
    ));

    return card;
  }

  GG.register('verdict', {
    mount: function (root) {
      var results = GG.state.results;
      var skipped = GG.state.skipped;
      var phase = 'idle';
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      var screen = GG.el('section', { class: 'screen verdict' });
      screen.append(GG.el('header', { class: 'vd-head' },
        GG.el('div', { class: 'eyebrow', text: 'THE VERDICT' }),
        GG.el('h2', { html: results.length
          ? 'WHAT YOUR RECEIPTS <br>ACTUALLY PROVE.'
          : 'NO RECEIPTS YET. <br>THAT IS OKAY.' })
      ));

      var strip = GG.el('div', { class: 'vd-strip' });
      SLOTS.forEach(function (slot, i) {
        var result = results.filter(function (r) { return r.id === slot.id; })[0];
        var wasSkipped = skipped.indexOf(slot.id) !== -1;
        var rec = GG.el('div', {
          class: 'vd-rec' + (result ? '' : ' missing'),
          style: 'animation-delay:' + (i * 110) + 'ms'
        },
          GG.el('div', { class: 'vd-rec-line', text: result ? result.line : wasSkipped ? 'SKIPPED · NO RECEIPT' : 'NOT COMPLETED' }),
          GG.el('div', { class: 'vd-rec-claim', text: result ? result.claim : wasSkipped ? 'Skipped challenges do not earn receipts.' : slot.claim })
        );
        strip.append(rec);
      });
      screen.append(strip);

      var pretty = pcCard('pretty');
      var intel = pcCard('intel');
      screen.append(GG.el('div', { class: 'showdown' }, pretty, GG.el('div', { class: 'vs', text: 'VS' }), intel));
      screen.append(GG.el('p', { class: 'compare-note', text: 'Illustrative profiles, not a product or benchmark. AI can run on CPU/GPU too. AMD Ryzen AI and Qualcomm Snapdragon X PCs also offer NPUs. Compare equivalent devices, apps, battery, memory and price.' }));
      screen.append(GG.el('div', { class: 'silicon', 'aria-label': 'CPU, GPU and NPU roles' },
        GG.el('span', { class: 'si' }, GG.el('b', { text: 'CPU' }), ' apps, OS, system control'),
        GG.el('span', { class: 'si' }, GG.el('b', { text: 'GPU' }), ' graphics + parallel compute'),
        GG.el('span', { class: 'si' }, GG.el('b', { text: 'NPU' }), ' efficient supported AI'),
        GG.el('span', { class: 'si-note', text: 'An NPU is not required for on-device AI. They can work together; CPU/GPU can also run AI, and the app decides the path.' })
      ));

      var tally = GG.el('div', { class: 'vd-tally', role: 'status', 'aria-live': 'polite' },
        GG.el('span', { class: 'mstat' }, GG.el('b', { text: String(results.length) }), ' receipts'),
        GG.el('span', { class: 'mstat' }, GG.el('b', { text: String(skipped.length) }), ' skipped'),
        GG.el('span', { class: 'mstat' }, GG.el('b', { text: 'No network calls' }), '')
      );
      screen.append(tally);

      var cta = GG.el('button', { class: 'btn vd-cta', type: 'button', text: 'FIND YOUR AI PC' });
      screen.append(cta);

      cta.addEventListener('click', function () {
        if (phase === 'idle') {
          phase = 'running';
          cta.disabled = true;
          GG.audio.thud();

          var gap = reduce ? 0 : 220;
          var hold = reduce ? 40 : 260;
          var prettyAbilities = pretty.querySelectorAll('.ability');
          var intelAbilities = intel.querySelectorAll('.ability');

          prettyAbilities.forEach(function (el, i) {
            GG.timers.after(i * gap, function () {
              el.classList.add('flip');
              if (!reduce) GG.audio.thud();
            });
          });

          var prettyEnd = (prettyAbilities.length - 1) * gap + hold;
          GG.timers.after(prettyEnd, function () {
            pretty.classList.add('done');
            intel.classList.add('lit');
            GG.audio.chime();
            intelAbilities.forEach(function (el, i) {
              GG.timers.after(i * gap, function () { el.classList.add('live'); });
            });

            var intelEnd = (intelAbilities.length - 1) * gap + hold;
            GG.timers.after(intelEnd, function () {
              tally.classList.add('show');
              cta.disabled = false;
              cta.textContent = 'BUILD MY MATCH';
              phase = 'done';
            });
          });
          return;
        }
        if (phase === 'done') {
          GG.audio.pop();
          GG.nav('match', { action: 'next' });
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
