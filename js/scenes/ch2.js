/* Challenge 2 — The Photobomber: on-device generative fill */
(function () {
  'use strict';
  var GG = window.GG;

  GG.register('ch2', {
    mount: function (root) {
      var step = 'gag';
      var reveal = 0;
      var dragging = false;
      var startX = 0;
      var startReveal = 0;
      var moved = false;

      var screen = GG.el('section', { class: 'screen ch2' });
      var ed = GG.el('div', { class: 'ed' });
      var stage = GG.el('div', { class: 'ed-stage' });
      var photoWrap = GG.el('div', { class: 'photo-wrap' });
      var photo = GG.el('div', { class: 'photo' });
      var handle = GG.el('div', { class: 'handle hidden', role: 'slider', tabindex: '0', 'aria-label': 'Extend the photo frame', 'aria-valuemin': '0', 'aria-valuemax': '200', 'aria-valuenow': '0' });
      var bottom = GG.el('div', { class: 'ed-bottom' });
      var stamp = GG.el('div', { class: 'stamp', text: 'APP CRASHED' });

      photo.innerHTML = GG.art.groupPhoto();
      photoWrap.append(photo, handle);
      stage.append(photoWrap, stamp);
      ed.append(
        GG.el('div', { class: 'ed-bar' },
          GG.el('span', { class: 'lp-dots', 'aria-hidden': 'true' }, [GG.el('i'), GG.el('i'), GG.el('i')]),
          GG.el('span', { class: 'ed-name', text: 'squad_goa_2026.jpg — Photo Editor' }),
          GG.el('span', { class: 'lp-batt', text: '3%' })
        ),
        stage,
        bottom
      );
      screen.append(ed);
      root.append(screen);

      /* ---------- bottom bar ---------- */
      function setBottom(title, sub, actions) {
        bottom.replaceChildren(
          GG.el('div', { class: 'ed-prompt' },
            GG.el('b', { text: title }),
            GG.el('span', { text: sub })
          ),
          GG.el('div', { class: 'ed-actions' }, actions || [])
        );
      }

      /* ---------- gag ---------- */
      function renderGag() {
        step = 'gag';
        var exportBtn = GG.el('button', { class: 'btn', type: 'button', text: 'EXPORT' });
        exportBtn.addEventListener('click', startExport);
        setBottom('Export the edit.', 'Your current laptop. One photo. One export.', [exportBtn]);
      }

      function startExport() {
        if (step !== 'gag') return;
        step = 'exporting';
        var exBtn = bottom.querySelector('.ed-actions .btn');
        if (exBtn) exBtn.disabled = true;
        var exp = GG.el('div', { class: 'exp' },
          GG.el('div', { class: 'exp-l' }, GG.el('span', { text: 'EXPORTING…' }), GG.el('span', { class: 'exp-pct', text: '0%' })),
          GG.el('div', { class: 'exp-bar' }, GG.el('i'))
        );
        stage.append(exp);
        requestAnimationFrame(function () { exp.classList.add('go'); });

        var pct = exp.querySelector('.exp-pct');
        var n = 0;
        var tick = GG.timers.every(70, function () {
          n = Math.min(99, n + Math.ceil(Math.random() * 9));
          pct.textContent = n + '%';
        });

        GG.timers.after(1450, function () {
          GG.timers.cancel(tick);
          exp.classList.add('stuck');
          exp.querySelector('.exp-l span').textContent = 'EXPORT FAILED';
          stamp.classList.add('show');
          screen.classList.add('crashed');
          GG.audio.fan();
          GG.timers.after(900, function () {
            exp.remove();
            stamp.classList.remove('show');
            screen.classList.remove('crashed');
            step = 'rescue';
            var rescue = GG.el('button', { class: 'btn rescue', type: 'button', text: 'OKAY. USE THE AI PC' });
            rescue.addEventListener('click', goAI);
            screen.append(rescue);
            requestAnimationFrame(function () { rescue.classList.add('show'); });
            setBottom('Cool RGB though.', 'It crashed at 99%. On one photo.', []);
          });
        });
      }

      /* ---------- AI edit ---------- */
      function goAI() {
        if (step !== 'rescue') return;
        step = 'remove';
        GG.audio.whoosh();
        screen.classList.remove('crashed');
        var rescue = screen.querySelector('.rescue');
        if (rescue) rescue.remove();
        photo.classList.add('ready');
        setBottom('He was not invited.', 'Tap the guy who showed up anyway.', []);
      }

      function selectBomber() {
        if (step !== 'remove') return;
        photo.classList.add('selected');
        GG.audio.pop();
        var chips = ['Remove', 'Erase', 'Fix'].map(function (label) {
          var c = GG.el('button', { class: 'chip', type: 'button', text: label });
          c.addEventListener('click', removeBomber);
          return c;
        });
        setBottom('He was not invited.', 'Pick any. They all do the same thing.', chips);
      }

      function removeBomber() {
        if (step !== 'remove') return;
        step = 'removing';
        photo.classList.remove('selected');
        photo.classList.add('removed');
        GG.audio.whoosh();

        var brush = GG.el('div', { class: 'brush', style: 'left:302px;top:136px' });
        photoWrap.append(brush);
        GG.timers.after(620, function () { brush.remove(); });

        GG.timers.after(700, function () {
          step = 'extend';
          handle.classList.remove('hidden');
          setBottom('Now make it fit the feed.', 'Drag the right edge. Or just tap it.', [
            postButton()
          ]);
          GG.timers.after(400, function () { handle.focus({ preventScroll: true }); });
        });
      }

      function postButton() {
        var b = GG.el('button', { class: 'btn', type: 'button', text: 'POST' });
        b.addEventListener('click', function () {
          if (reveal < 150) {
            extendTo(200);
            GG.timers.after(760, post);
          } else post();
        });
        return b;
      }

      function post() {
        if (step === 'done') return;
        step = 'done';
        GG.audio.chime();
        GG.state.results.push({
          id: 'photo',
          line: 'GENERATIVE FILL · ON-DEVICE · NOTHING UPLOADED',
          claim: 'Your photos never left this laptop.'
        });
        GG.timers.after(320, function () {
          GG.receipt(root, {
            lines: ['GENERATIVE FILL · ON-DEVICE', 'NO UPLOAD · NO ACCOUNT · NOTHING LEFT THE MACHINE'],
            headline: 'Your photos never left this laptop.',
            body: 'No upload, no sign-in, no "processing…".',
            next: function () { GG.nav('ch3'); }
          });
        });
      }

      /* ---------- frame extend ---------- */
      function setReveal(px) {
        reveal = Math.max(0, Math.min(200, Math.round(px)));
        photo.style.clipPath = 'inset(0 ' + (200 - reveal) + 'px 0 0)';
        handle.style.left = (700 + reveal) + 'px';
        handle.setAttribute('aria-valuenow', String(reveal));
      }

      function extendTo(px) {
        handle.style.transition = 'left .55s cubic-bezier(.2,.9,.25,1)';
        photo.style.transition = 'clip-path .55s cubic-bezier(.2,.9,.25,1)';
        setReveal(px);
        GG.timers.after(600, function () {
          handle.style.transition = '';
          photo.style.transition = '';
        });
      }

      function stageScale() {
        var st = document.getElementById('stage');
        var r = st.getBoundingClientRect();
        return r.width / 1280 || 1;
      }

      handle.addEventListener('pointerdown', function (e) {
        if (step !== 'extend') return;
        dragging = true;
        moved = false;
        startX = e.clientX;
        startReveal = reveal;
        handle.style.transition = 'none';
        photo.style.transition = 'none';
        try { handle.setPointerCapture(e.pointerId); } catch (err) {}
        e.preventDefault();
      });

      handle.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var dx = (e.clientX - startX) / stageScale();
        if (Math.abs(dx) > 5) moved = true;
        setReveal(startReveal + dx);
      });

      function endDrag() {
        if (!dragging) return;
        dragging = false;
        handle.style.transition = '';
        photo.style.transition = '';
      }
      handle.addEventListener('pointerup', endDrag);
      handle.addEventListener('pointercancel', endDrag);

      handle.addEventListener('click', function () {
        if (step !== 'extend') return;
        if (moved) { moved = false; return; }
        extendTo(reveal + 70);
      });

      handle.addEventListener('keydown', function (e) {
        if (step !== 'extend') return;
        if (e.key === 'ArrowRight') { e.preventDefault(); extendTo(reveal + 40); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); extendTo(reveal - 40); }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); extendTo(reveal >= 150 ? 200 : reveal + 70); }
      });

      photo.addEventListener('click', function (e) {
        if (step !== 'remove') return;
        var t = e.target;
        if (t && (t.classList.contains('bomber-hit') || t.closest('.bomber'))) selectBomber();
      });

      /* ---------- debug states ---------- */
      var want = null;
      try { want = new URLSearchParams(window.location.search).get('phase'); } catch (e) {}
      if (want === 'remove') {
        step = 'rescue';
        goAI();
      } else if (want === 'extend' || want === 'done') {
        step = 'rescue';
        goAI();
        selectBomber();
        removeBomber();
        if (want === 'done') {
          GG.timers.after(900, function () { extendTo(200); });
        }
      } else {
        renderGag();
      }
    },
    unmount: function () {}
  });
})();
