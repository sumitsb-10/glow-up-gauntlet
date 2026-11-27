/* Challenge 3 — 2AM Idea: offline template composition with an output tradeoff */
(function () {
  'use strict';
  var GG = window.GG;

  var OUTPUTS = {
    quality: { label: 'MAX QUALITY', short: 'QUALITY' },
    fast: { label: 'FAST', short: 'FAST' },
    eco: { label: 'LOW POWER', short: 'LOW POWER' }
  };

  var GROUPS = [
    { key: 'vibe', label: 'VIBE', table: GG.poster.VIBES },
    { key: 'type', label: 'TYPE', table: GG.poster.TYPES },
    { key: 'finish', label: 'FINISH', table: GG.poster.FINISHES },
    { key: 'output', label: 'OUTPUT', table: OUTPUTS }
  ];

  var SPOTS = [
    [-30, -40, 240], [250, 290, 280], [300, -60, 190], [-70, 360, 230]
  ];
  var STICKERS = [
    [26, 96, -12], [352, 52, 9], [356, 340, -6], [344, 448, 14]
  ];

  GG.register('ch3', {
    mount: function (root) {
      var state = { vibe: null, type: null, finish: null, output: null };
      var chipEls = {};
      var posted = false;

      var screen = GG.el('section', { class: 'screen ch3' });
      var posterEl = GG.el('div', { class: 'poster', role: 'img', 'aria-label': 'Your locally composed poster preview' });

      screen.append(
        GG.el('header', { class: 'ch3-head' },
          GG.el('div', { class: 'eyebrow', text: 'THE LAST CHALLENGE · NO NETWORK NEEDED' }),
          GG.el('h2', { html: 'MAKE SOMETHING <br>AT 2AM.' }),
          GG.el('p', { class: 'ch3-sub', text: 'Pick a look and an output priority. This is a local template composer, not an AI model.' })
        ),
        GG.el('div', { class: 'wifi-badge', html: '<span class="wifi-dot"></span> NO NETWORK CALLS' })
      );

      var body = GG.el('div', { class: 'ch3-body' });
      var posterWrap = GG.el('div', { class: 'poster-wrap' }, posterEl);

      var controls = GG.el('div', { class: 'ch3-controls' });
      var progress = GG.el('p', { class: 'ch3-progress', role: 'status', 'aria-live': 'polite', text: '0 / 4 choices · build your poster' });
      function allChosen() {
        return GROUPS.every(function (g) { return !!state[g.key]; });
      }

      function syncChips() {
        GROUPS.forEach(function (g) {
          Object.keys(chipEls[g.key] || {}).forEach(function (key) {
            chipEls[g.key][key].setAttribute('aria-pressed', String(state[g.key] === key));
          });
        });
        var count = GROUPS.filter(function (g) { return !!state[g.key]; }).length;
        progress.textContent = count === GROUPS.length
          ? '4 / 4 choices · your poster is ready'
          : count + ' / 4 choices · choose the next style';
        postBtn.disabled = !allChosen();
      }

      GROUPS.forEach(function (g) {
        var row = GG.el('div', { class: 'ctl-group' }, GG.el('span', { class: 'ctl-label', text: g.label }));
        var chips = GG.el('div', { class: 'ctl-chips' });
        chipEls[g.key] = {};
        Object.keys(g.table).forEach(function (key) {
          var item = g.table[key];
          var chip = GG.el('button', {
            class: 'chip vibe-chip',
            type: 'button',
            'aria-pressed': 'false'
          });
          var dot = GG.el('span', { class: 'swatch' });
          dot.style.background = item.swatch || (item.italic ? '#E8DCC8' : '#8A8F98');
          chip.append(dot, item.label);
          chip.addEventListener('click', function () {
            if (posted) return;
            state[g.key] = key;
            syncChips();
            GG.audio.pop();
            renderPoster(true);
          });
          chips.append(chip);
          chipEls[g.key][key] = chip;
        });
        row.append(chips);
        controls.append(row);
      });

      var postBtn = GG.el('button', { class: 'btn post-btn', type: 'button', text: 'POST IT', disabled: 'disabled' });
      postBtn.addEventListener('click', post);
      controls.append(
        progress,
        postBtn,
        GG.el('p', { class: 'ch3-hint', text: 'Each choice updates your preview. Style labels do not measure speed or power.' })
      );

      body.append(posterWrap, controls);
      screen.append(body);
      root.append(screen);

      GG.skip(screen, 'poster', function () { GG.nav('verdict', { action: 'next' }); });
      GG.hint(screen, function () {
        if (posted || document.querySelector('.receipt-card')) return null;
        for (var i = 0; i < GROUPS.length; i++) {
          if (!state[GROUPS[i].key]) {
            return controls.querySelectorAll('.ctl-group')[i].querySelector('.vibe-chip');
          }
        }
        return postBtn;
      });

      /* local-mode banner, then it clears */
      var banner = GG.el('div', { class: 'cloud-banner local', html: '<b>NO NETWORK:</b> LOCAL COMPOSER READY' });
      screen.append(banner);
      GG.timers.after(1500, function () { banner.classList.add('out'); });
      GG.timers.after(2100, function () { banner.remove(); });

      function renderPoster(animate) {
        if (!allChosen()) {
          var missing = GROUPS.filter(function (g) { return !state[g.key]; })
            .map(function (g) { return g.label; });
          posterEl.classList.add('placeholder');
          posterEl.classList.remove('snap');
          posterEl.style.background = '#12151c';
          posterEl.style.color = '#8a8f98';
          posterEl.replaceChildren(GG.el('div', {
            class: 'p-placeholder',
            text: 'PICK ' + missing.join(' + ')
          }));
          posterEl.setAttribute('aria-label', 'Poster preview: choose ' + missing.join(', ').toLowerCase());
          return;
        }

        var p = GG.poster.composePoster(state);
        posterEl.classList.remove('placeholder');
        posterEl.classList.toggle('mode-quality', state.output === 'quality');
        posterEl.classList.toggle('mode-fast', state.output === 'fast');
        posterEl.classList.toggle('mode-eco', state.output === 'eco');
        posterEl.setAttribute('data-output', state.output);
        posterEl.setAttribute('aria-label',
          'Poster preview: ' + GG.poster.VIBES[p.vibe].label + ', ' +
          GG.poster.TYPES[p.type].label + ', ' + GG.poster.FINISHES[p.finish].label + ', ' +
          OUTPUTS[state.output].label + ' output');
        posterEl.style.background = p.bg;
        posterEl.style.color = p.ink;
        posterEl.replaceChildren();

        var blobs = GG.el('div', { class: 'p-blobs' });
        blobs.style.opacity = String(state.output === 'quality' ? p.blobOpacity
          : state.output === 'fast' ? p.blobOpacity * 0.8 : p.blobOpacity * 0.55);
        p.blobs.forEach(function (c, i) {
          var b = GG.el('span', { class: 'p-blob' });
          var s = SPOTS[i % SPOTS.length];
          b.style.background = c;
          b.style.left = s[0] + 'px';
          b.style.top = s[1] + 'px';
          b.style.width = s[2] + 'px';
          b.style.height = s[2] + 'px';
          blobs.append(b);
        });
        var grain = state.output === 'quality' ? p.grain * 1.35
          : state.output === 'fast' ? p.grain * 0.2 : p.grain * 0.12;
        posterEl.append(blobs, GG.el('div', { class: 'p-grain', style: 'opacity:' + grain }));

        var head = GG.el('div', { class: 'p-headline', html: 'SIDE<br>HUSTLE' });
        head.style.fontFamily = p.fontFamily;
        head.style.fontWeight = String(p.fontWeight);
        head.style.fontStyle = p.fontStyle;
        head.style.letterSpacing = p.letterSpacing;
        head.style.fontSize = p.fontSize + 'px';
        head.style.textTransform = p.textTransform;

        var foot = GG.el('div', { class: 'p-foot' },
          GG.el('div', { class: 'p-sub', text: p.sub }),
          GG.el('div', { class: 'p-handle', text: p.handle })
        );

        posterEl.append(
          GG.el('div', { class: 'p-kicker', text: p.kicker }),
          head,
          foot,
          GG.el('div', { class: 'p-mode', text: OUTPUTS[state.output].short })
        );

        p.stickers.forEach(function (sym, i) {
          var s = GG.el('span', { class: 'p-sticker', text: sym });
          var pos = STICKERS[i % STICKERS.length];
          s.style.left = pos[0] + 'px';
          s.style.top = pos[1] + 'px';
          s.style.color = i % 2 ? p.accent : p.ink;
          s.style.transform = 'rotate(' + pos[2] + 'deg)';
          posterEl.append(s);
        });

        if (animate) {
          posterEl.classList.remove('snap');
          void posterEl.offsetWidth;
          posterEl.classList.add('snap');
        }
      }

      function post() {
        if (posted || !allChosen()) return;
        posted = true;
        GG.audio.chime();
        postBtn.disabled = true;

        posterEl.classList.add('fly');
        confetti();

        GG.state.choices.poster = state.output;
        GG.state.results.push({
          id: 'poster',
          line: 'LOCAL TEMPLATE COMPOSER · NO NETWORK CALLS',
          claim: 'Composed on this laptop. No AI model.'
        });

        GG.timers.after(760, function () {
          GG.receipt(root, {
            stamp: 'LOCAL TEMPLATE ENGINE · NO CLOUD',
            lines: ['NO NETWORK CALLS MADE', 'OUTPUT PRIORITY: ' + OUTPUTS[state.output].label, 'NOTHING UPLOADED'],
            headline: 'Made on this laptop.',
            body: 'This is a deterministic template composer, not AI inference. The demo made no network calls; it does not change your device Wi-Fi setting.',
            nextLabel: 'SEE YOUR RECEIPTS',
            next: function () { GG.nav('verdict', { action: 'next' }); }
          });
        });
      }

      function confetti() {
        var colors = ['#D6FF3F', '#4DA3FF', '#FF6FD8', '#FFD166', '#F4F1EA'];
        for (var i = 0; i < 26; i++) {
          (function (n) {
            var bit = GG.el('span', { class: 'confetti' });
            bit.style.left = (50 + (Math.random() * 40 - 20)) + '%';
            bit.style.top = (46 + (Math.random() * 20 - 10)) + '%';
            bit.style.background = colors[n % colors.length];
            bit.style.setProperty('--dx', (Math.random() * 420 - 210) + 'px');
            bit.style.setProperty('--dy', (Math.random() * -320 - 60) + 'px');
            bit.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
            bit.style.animationDelay = (Math.random() * 120) + 'ms';
            screen.append(bit);
            GG.timers.after(1600, function () { bit.remove(); });
          })(i);
        }
      }

      syncChips();
      renderPoster(false);

      var want = null;
      try { want = new URLSearchParams(window.location.search).get('phase'); } catch (e) {}
      if (want === 'receipt') {
        state.vibe = 'neon';
        state.type = 'blocky';
        state.finish = 'maximal';
        state.output = 'quality';
        syncChips();
        renderPoster(false);
        GG.timers.after(300, post);
      }
    },
    unmount: function () {}
  });
})();
