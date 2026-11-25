/* Challenge 3 — 2AM Idea: offline, on-device generation */
(function () {
  'use strict';
  var GG = window.GG;

  var GROUPS = [
    { key: 'vibe', label: 'VIBE', table: GG.poster.VIBES },
    { key: 'type', label: 'TYPE', table: GG.poster.TYPES },
    { key: 'finish', label: 'FINISH', table: GG.poster.FINISHES }
  ];

  var SPOTS = [
    [-30, -40, 240], [250, 290, 280], [300, -60, 190], [-70, 360, 230]
  ];
  var STICKERS = [
    [26, 96, -12], [352, 52, 9], [356, 340, -6], [344, 448, 14]
  ];

  GG.register('ch3', {
    mount: function (root) {
      var state = { vibe: 'neon', type: 'blocky', finish: 'maximal' };
      var posted = false;

      var screen = GG.el('section', { class: 'screen ch3' });
      var posterEl = GG.el('div', { class: 'poster', role: 'img', 'aria-label': 'Your generated poster' });

      screen.append(
        GG.el('header', { class: 'ch3-head' },
          GG.el('div', { class: 'eyebrow', text: 'STEP 4 OF 4 · THE WI-FI IS OFF' }),
          GG.el('h2', { html: 'MAKE SOMETHING<br>AT 2AM.' }),
          GG.el('p', { class: 'ch3-sub', text: 'Pick a vibe. The AI is inside this laptop — no signal needed.' })
        ),
        GG.el('div', { class: 'wifi-badge', html: '<span class="wifi-dot"></span> WI-FI: OFF' })
      );

      var body = GG.el('div', { class: 'ch3-body' });
      var posterWrap = GG.el('div', { class: 'poster-wrap' }, posterEl);

      var controls = GG.el('div', { class: 'ch3-controls' });
      GROUPS.forEach(function (g) {
        var row = GG.el('div', { class: 'ctl-group' }, GG.el('span', { class: 'ctl-label', text: g.label }));
        var chips = GG.el('div', { class: 'ctl-chips' });
        Object.keys(g.table).forEach(function (key) {
          var item = g.table[key];
          var chip = GG.el('button', {
            class: 'chip vibe-chip',
            type: 'button',
            'aria-pressed': String(state[g.key] === key)
          });
          var dot = GG.el('span', { class: 'swatch' });
          dot.style.background = item.swatch || (item.italic ? '#E8DCC8' : '#8A8F98');
          chip.append(dot, item.label);
          chip.addEventListener('click', function () {
            if (posted) return;
            state[g.key] = key;
            row.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
            chip.setAttribute('aria-pressed', 'true');
            GG.audio.pop();
            renderPoster(true);
          });
          chips.append(chip);
        });
        row.append(chips);
        controls.append(row);
      });

      var postBtn = GG.el('button', { class: 'btn post-btn', type: 'button', text: 'POST IT' });
      postBtn.addEventListener('click', post);
      controls.append(
        postBtn,
        GG.el('p', { class: 'ch3-hint', text: 'Nothing leaves this laptop. That is the whole point.' })
      );

      body.append(posterWrap, controls);
      screen.append(body);
      root.append(screen);

      /* cloud banner, then it dies */
      var banner = GG.el('div', { class: 'cloud-banner', html: '<b>CLOUD AI:</b> UNAVAILABLE' });
      screen.append(banner);
      GG.timers.after(1500, function () { banner.classList.add('out'); });
      GG.timers.after(2100, function () { banner.remove(); });

      function renderPoster(animate) {
        var p = GG.poster.composePoster(state);
        posterEl.setAttribute('aria-label',
          'Poster preview: ' + GG.poster.VIBES[p.vibe].label + ', ' +
          GG.poster.TYPES[p.type].label + ', ' + GG.poster.FINISHES[p.finish].label);
        posterEl.style.background = p.bg;
        posterEl.style.color = p.ink;
        posterEl.replaceChildren();

        var blobs = GG.el('div', { class: 'p-blobs' });
        blobs.style.opacity = String(p.blobOpacity);
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
        posterEl.append(blobs, GG.el('div', { class: 'p-grain', style: 'opacity:' + p.grain }));

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
          foot
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
        if (posted) return;
        posted = true;
        GG.audio.chime();
        postBtn.disabled = true;

        posterEl.classList.add('fly');
        confetti();

        GG.state.results.push({
          id: 'poster',
          line: 'WI-FI: OFF · GENERATED ON-DEVICE · NOTHING UPLOADED',
          claim: 'The AI is inside the laptop.'
        });

        GG.timers.after(760, function () {
          GG.receipt(root, {
            lines: ['WI-FI: OFF THE WHOLE TIME', 'GENERATED ON THIS LAPTOP · NOTHING UPLOADED'],
            headline: 'The AI is inside the laptop.',
            body: 'Not in a data centre. Not on a subscription.',
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

      renderPoster(false);

      var want = null;
      try { want = new URLSearchParams(window.location.search).get('phase'); } catch (e) {}
      if (want === 'receipt') {
        GG.timers.after(300, post);
      }
    },
    unmount: function () {}
  });
})();
