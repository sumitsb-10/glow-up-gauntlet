/* Match — a two-question buying consultation, then a needs-based recommendation */
(function () {
  'use strict';
  var GG = window.GG;

  GG.register('match', {
    mount: function (root) {
      var vibe = GG.state.vibe && GG.VIBES[GG.state.vibe] ? GG.state.vibe : 'student';
      var persona = GG.match.matchFor(vibe);
      var answers = { use: null, priority: null };
      var phase = 'use';
      var choosing = false;

      function restartButton() {
        var again = GG.el('button', { class: 'btn ghost sm match-restart', type: 'button', text: 'PLAY AGAIN' });
        again.addEventListener('click', function () {
          GG.audio.pop();
          GG.reset();
          GG.nav('attract', { action: 'restart' });
        });
        return again;
      }

      function shell(inner, cls) {
        var screen = GG.el('section', { class: 'screen match ' + (cls || '') });
        screen.append(GG.el('div', { class: 'match-glow', 'aria-hidden': 'true' }), inner, restartButton());
        root.replaceChildren(screen);
        return screen;
      }

      function questionScreen(step) {
        var isUse = step === 'use';
        var options = isUse ? GG.consult.USES : GG.consult.PRIORITIES;
        var screen = GG.el('section', { class: 'screen match consult' });
        var head = GG.el('div', { class: 'consult-head' },
          GG.el('div', { class: 'eyebrow', text: 'YOUR AI PC MATCH · ' + (isUse ? '01' : '02') + ' / 02' }),
          GG.el('h2', { html: isUse ? 'WHAT WILL YOU <br>USE IT FOR?' : 'WHAT MATTERS <br>MOST?' }),
          GG.el('p', { class: 'consult-sub', text: isUse
            ? 'Two quick questions. No spec-sheet reading.'
            : 'Pick the tradeoff that fits your real life.' })
        );

        var grid = GG.el('div', { class: 'consult-grid' });
        options.forEach(function (option, i) {
          var card = GG.el('button', {
            class: 'consult-card',
            type: 'button',
            'data-key': option.key,
            'aria-label': option.label
          },
            GG.el('span', { class: 'consult-n', text: String(i + 1).padStart(2, '0') }),
            GG.el('span', { class: 'consult-label', text: option.label }),
            GG.el('span', { class: 'consult-go', text: 'CHOOSE' })
          );
          card.addEventListener('click', function () {
            if (choosing || phase !== step) return;
            choosing = true;
            card.classList.add('picked');
            GG.audio.pop();
            if (isUse) answers.use = option.key;
            else answers.priority = option.key;
            GG.timers.after(160, function () {
              choosing = false;
              if (isUse) { phase = 'priority'; questionScreen('priority'); }
              else { phase = 'result'; resultScreen(); }
            });
          });
          grid.append(card);
        });

        var foot = GG.el('div', { class: 'consult-foot' });
        if (!isUse) {
          var back = GG.el('button', { class: 'btn secondary sm', type: 'button', text: 'BACK' });
          back.addEventListener('click', function () {
            if (choosing) return;
            phase = 'use';
            answers.use = null;
            questionScreen('use');
          });
          foot.append(back);
        }
        foot.append(GG.el('span', { class: 'consult-note', text: 'No email. No account. No typing.' }));

        screen.append(GG.el('div', { class: 'match-glow', 'aria-hidden': 'true' }), head, grid, foot, restartButton());
        root.replaceChildren(screen);

        GG.timers.after(80, function () {
          var first = grid.querySelector('.consult-card');
          if (first) { try { first.focus({ preventScroll: true }); } catch (e) {} }
        });
      }

      function resultScreen() {
        var rec = GG.consult.recommend(answers);
        var t = GG.match.tally(GG.state.results, GG.state.skipped, GG.state.choices);
        var screen = GG.el('section', { class: 'screen match result' });

        var badges = [];
        if (GG.hasResult('deadline')) badges.push('LOCAL SEARCH');
        if (GG.state.choices.photo === 'remove') badges.push('PHOTO MASKED');
        else if (GG.state.choices.photo === 'keep') badges.push('PHOTO KEPT');
        if (GG.state.choices.poster) badges.push('POSTER: ' + GG.state.choices.poster.toUpperCase());
        if (t.skipped) badges.push(t.skipped + ' SKIPPED');

        var card = GG.el('div', { class: 'match-card result-card' },
          GG.el('div', { class: 'match-left' },
            GG.svg(GG.art.avatar(vibe), 'match-avatar'),
            GG.el('div', { class: 'match-badge', text: 'AI PC' }),
            GG.el('div', { class: 'eyebrow', text: 'YOUR MATCH' }),
            GG.el('h2', { class: 'match-title', text: persona.title }),
            GG.el('p', { class: 'match-line', text: persona.line }),
            GG.el('p', { class: 'match-promise', text: rec.promise })
          ),
          GG.el('div', { class: 'match-right' },
            GG.el('div', { class: 'rec-top' },
              GG.el('span', { class: 'eyebrow', text: 'SUGGESTED STARTING POINT' }),
              GG.el('span', { class: 'rec-cat', text: rec.category })
            ),
            GG.el('div', { class: 'match-spec', text: rec.processor + ' · ' + rec.ram + ' memory suggested · ' + rec.storage + ' suggested' }),
            GG.el('p', { class: 'rec-why', text: rec.why }),
            GG.el('div', { class: 'rec-caps', 'aria-label': 'Relevant AI PC capabilities' },
              rec.capabilities.map(function (c) { return GG.el('span', { class: 'rec-cap', text: c }); })
            ),
            GG.el('div', { class: 'match-stats' },
              GG.el('span', { class: 'mstat' }, GG.el('b', { text: String(t.count) }), ' receipts'),
              t.skipped ? GG.el('span', { class: 'mstat warn' }, GG.el('b', { text: String(t.skipped) }), ' skipped') : null,
              GG.el('span', { class: 'mstat' }, GG.el('b', { text: 'none' }), ' uploaded'),
              GG.el('span', { class: 'mstat' }, GG.el('b', { text: 'No network calls' }), '')
            ),
            badges.length ? GG.el('div', { class: 'run-badges' },
              badges.map(function (b) { return GG.el('span', { class: 'run-badge', text: b }); })
            ) : null,
            GG.el('div', { class: 'rec-actions' },
              objectionButton(rec),
              primaryButton(rec)
            ),
            GG.el('button', { class: 'btn secondary rec-again', type: 'button', text: 'EXPLORE YOUR RECOMMENDATION AGAIN' }),
            GG.el('p', { class: 'rec-compare', text: rec.competitorNote }),
            GG.el('div', { class: 'rec-foot' },
              GG.el('span', { class: 'rec-disclaimer', text: rec.disclaimer }),
              GG.el('span', { class: 'match-shot', text: 'Screenshot this.' })
            )
          )
        );

        var again = card.querySelector('.rec-again');
        again.addEventListener('click', function () {
          if (choosing) return;
          choosing = true;
          answers = { use: null, priority: null };
          phase = 'use';
          GG.timers.after(120, function () { choosing = false; questionScreen('use'); });
        });

        screen.append(GG.el('div', { class: 'match-glow', 'aria-hidden': 'true' }), card, restartButton());
        root.replaceChildren(screen);
        GG.audio.chime();

        var primary = card.querySelector('.rec-primary');
        GG.timers.after(120, function () {
          if (primary) { try { primary.focus({ preventScroll: true }); } catch (e) {} }
        });
      }

      function objectionButton(rec) {
        var b = GG.el('button', { class: 'btn secondary objection-btn', type: 'button', text: 'WHY PAY MORE?' });
        b.addEventListener('click', function () {
          GG.receipt(root, {
            variant: 'value',
            stamp: 'THE VALUE CASE · NO BENCHMARK CLAIMS',
            lines: rec.objections.map(function (o) { return o.title + ' — ' + o.body; }),
            headline: 'Why pay more?',
            body: 'Check whether this actual laptop’s memory, storage, battery and supported local features fit your work and justify its price. These starting points do not guarantee faster performance.',
            nextLabel: 'BACK TO MY MATCH',
            next: function () {}
          });
        });
        return b;
      }

      function primaryButton(rec) {
        var b = GG.el('button', { class: 'btn rec-primary', type: 'button', text: 'TRY YOUR INTEL AI PC AT THE COUNTER' });
        b.addEventListener('click', function () {
          GG.receipt(root, {
            stamp: 'YOUR COUNTER PASS',
            lines: [
              rec.category,
              rec.processor,
              rec.ram + ' memory suggested · ' + rec.storage + ' suggested',
              'Ask the retailer to verify NPU availability and support for your apps',
              'Compare battery tests, display, graphics, warranty and price'
            ],
            headline: 'Show this at the counter.',
            body: 'A specialist can match this suggested configuration to current stock, software and your budget.',
            nextLabel: 'BACK TO MY MATCH',
            next: function () {}
          });
        });
        return b;
      }

      var want = null;
      try { want = new URLSearchParams(window.location.search).get('phase'); } catch (e) {}
      if (want === 'result') {
        answers = { use: 'study', priority: 'battery' };
        phase = 'result';
        resultScreen();
      } else {
        questionScreen('use');
      }
    },
    unmount: function () {}
  });
})();
