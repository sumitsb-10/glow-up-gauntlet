/* Challenge 1 — The Deadline: felt input lag, then on-device search */
(function () {
  'use strict';
  var GG = window.GG;

  var FILES = [
    { n: 'Assignment_FINAL_v7.pdf', ext: 'PDF', kind: 'pdf', target: true },
    { n: 'notes(3).pdf', ext: 'PDF', kind: 'pdf' },
    { n: 'IMG_2041.PNG', ext: 'PNG', kind: 'img' },
    { n: 'resume_final_FINAL.docx', ext: 'DOC', kind: 'doc' },
    { n: 'chemistry_notes.pdf', ext: 'PDF', kind: 'pdf' },
    { n: 'screenshot 2026-11-24.png', ext: 'PNG', kind: 'img' },
    { n: 'Untitled-1.psd', ext: 'PSD', kind: 'img' },
    { n: 'invoice_march.pdf', ext: 'PDF', kind: 'pdf' },
    { n: 'playlist.txt', ext: 'TXT', kind: 'txt' },
    { n: 'syllabus.pdf', ext: 'PDF', kind: 'pdf' },
    { n: 'meme.mp4', ext: 'MP4', kind: 'vid' },
    { n: 'Assignment_FINAL_v6.pdf', ext: 'PDF', kind: 'pdf', decoy: true }
  ];

  var PARA = [
    'This report examines the shift in advertising spend toward short-form video between 2023 and 2026, with a focus on audiences aged 18 to 24.',
    'The main argument is that short-form video outperforms static advertising for Gen-Z audiences — roughly 3.4× higher recall at half the media spend.',
    'A mixed-method approach was used: 41 campaign datasets, 12 interviews with media buyers, and a survey of 2,400 respondents across four metros.',
    'The analysis draws on 41 sources, all cited in the appendix beginning on page 38, including platform transparency reports and agency benchmark studies.',
    'The discussion considers why static creative still dominates retail media budgets despite weaker recall, and what that gap costs brands per acquisition.',
    'Excluding references and appendices, the report runs to 6,412 words. The full submission, including figures, is 22 pages.',
    'The conclusion recommends reallocating at least 30% of static display budget to short-form video for this cohort, with quarterly creative refresh.'
  ];

  var QA = [
    { q: "What's the main argument?", i: 1 },
    { q: 'How many sources?', i: 3 },
    { q: 'Word count?', i: 5 }
  ];

  GG.register('ch1', {
    mount: function (root) {
      var screen = GG.el('section', { class: 'screen ch1' });
      var lp = GG.el('div', { class: 'lp' });
      var barTitle = GG.el('span', { class: 'lp-title', text: 'Assignment_FINAL_v7.pdf — My Laptop' });
      var bar = GG.el('div', { class: 'lp-bar' },
        GG.el('span', { class: 'lp-dots', 'aria-hidden': 'true' }, ['', '', ''].map(function () { return GG.el('i'); })),
        barTitle,
        GG.el('span', { class: 'lp-batt', text: '3%' })
      );
      var body = GG.el('div', { class: 'lp-body' });
      lp.append(bar, body);
      screen.append(lp);
      root.append(screen);

      var phase = 'lag';
      var taps = 0;
      var lagIds = [];
      var rescue = null;
      var fan = null;

      function after(ms, fn) {
        var id = GG.timers.after(ms, fn);
        lagIds.push(id);
        return id;
      }

      function banner() {
        return GG.el('div', { class: 'lp-task' },
          GG.el('div', { class: 'eyebrow', text: 'YOUR TASK' }),
          GG.el('h3', { text: 'Find the assignment. Submit it.' }),
          GG.el('p', { class: 'lp-note', text: 'You have 30 seconds. Good luck.' })
        );
      }

      function fileGrid() {
        var grid = GG.el('div', { class: 'file-grid' });
        FILES.forEach(function (f) {
          var el = GG.el('button', { class: 'file', type: 'button', 'data-name': f.n });
          el.append(
            GG.el('div', { class: 'file-ico ' + f.kind, text: f.ext }),
            GG.el('div', { class: 'file-name', text: f.n })
          );
          el.addEventListener('click', function (ev) {
            ev.stopPropagation();
            if (phase === 'lag') lagTap(el, ev);
            else if (phase === 'ai') pickFile(f, el);
          });
          grid.append(el);
        });
        return grid;
      }

      function fanMeter() {
        fan = GG.el('div', { class: 'fan' },
          GG.el('span', { class: 'fan-l', text: 'FAN' }),
          GG.el('div', { class: 'fan-bar' }, GG.el('i')),
          GG.el('span', { class: 'fan-v', text: 'quiet' })
        );
        return fan;
      }

      function tapRing(x, y, delay) {
        after(delay, function () {
          var ring = GG.el('span', { class: 'tap-ring', style: 'left:' + x + 'px;top:' + y + 'px' });
          body.append(ring);
          after(620, function () { ring.remove(); });
        });
      }

      function lagTap(el, ev) {
        taps += 1;
        var b = body.getBoundingClientRect();
        var r = el.getBoundingClientRect();
        var x = (ev.clientX || r.left + r.width / 2) - b.left;
        var y = (ev.clientY || r.top + r.height / 2) - b.top;

        tapRing(x, y, 430);

        after(430, function () {
          el.classList.add('nudge');
          after(380, function () { el.classList.remove('nudge'); });
        });

        if (taps === 2) after(980, breakdown);
      }

      function breakdown() {
        if (phase !== 'lag' || screen.classList.contains('crashed')) return;
        screen.classList.add('crashed');
        barTitle.textContent = 'Assignment_FINAL_v7.pdf — (Not responding)';
        if (fan) { fan.classList.add('loud'); fan.querySelector('.fan-v').textContent = 'LOUD'; }
        body.append(GG.el('div', { class: 'crash' },
          GG.el('div', { class: 'crash-card' },
            GG.el('div', { class: 'spinner' }),
            GG.el('div', { class: 'crash-t', text: 'NOT RESPONDING' }),
            GG.el('div', { class: 'crash-s', text: 'Cool laptop though.' })
          )
        ));
        GG.audio.fan();
        showRescue();
      }

      function showRescue() {
        if (rescue) { rescue.classList.add('show'); return; }
        rescue = GG.el('button', { class: 'btn rescue', type: 'button', text: 'OKAY. USE THE AI PC' });
        rescue.addEventListener('click', goAI);
        screen.append(rescue);
        requestAnimationFrame(function () { rescue.classList.add('show'); });
      }

      function goAI() {
        if (phase !== 'lag') return;
        phase = 'ai';
        lagIds.forEach(function (id) { GG.timers.cancel(id); });
        lagIds = [];
        GG.audio.whoosh();
        screen.classList.remove('crashed');
        screen.classList.add('ai');
        barTitle.textContent = 'Assignment_FINAL_v7.pdf — Intel AI PC';
        if (rescue) { rescue.remove(); rescue = null; }
        renderSearch();
      }

      function renderSearch() {
        var search = GG.el('div', { class: 'ai-search' });
        var chips = GG.el('div', { class: 'ai-chips' });
        ['assignment', 'receipt', 'screenshot'].forEach(function (word) {
          var c = GG.el('button', { class: 'chip sm', type: 'button', text: word });
          c.addEventListener('click', function (ev) {
            ev.stopPropagation();
            if (word === 'assignment') runSearch(search);
            else {
              GG.audio.thud();
              search.classList.add('shake');
              GG.timers.after(420, function () { search.classList.remove('shake'); });
            }
          });
          chips.append(c);
        });
        search.append(
          GG.el('span', { class: 'ai-badge', text: 'AI' }),
          GG.el('span', { class: 'ai-q', text: 'Ask this laptop:' }),
          chips
        );

        body.replaceChildren(banner(), search, fileGrid(), fanMeter());
        if (fan) { fan.querySelector('.fan-v').textContent = 'quiet'; }
        GG.audio.pop();
      }

      function runSearch(search) {
        if (search.classList.contains('done')) return;
        search.classList.add('done');
        GG.audio.whoosh();
        var grid = body.querySelector('.file-grid');
        Array.prototype.slice.call(grid.children).forEach(function (el) {
          var name = el.getAttribute('data-name');
          if (name.indexOf('Assignment') === -1) {
            el.classList.add('gone');
            GG.timers.after(320, function () { if (el.parentNode) el.parentNode.removeChild(el); });
          }
        });
        GG.timers.after(360, function () {
          var target = grid.querySelector('[data-name="Assignment_FINAL_v7.pdf"]');
          if (target) target.classList.add('hot');
        });
      }

      function pickFile(f, el) {
        if (!f.target) {
          GG.audio.thud();
          el.classList.add('nudge');
          GG.timers.after(400, function () { el.classList.remove('nudge'); });
          return;
        }
        renderDoc();
      }

      function renderDoc() {
        phase = 'doc';
        GG.audio.pop();
        var page = GG.el('div', { class: 'doc-page' });
        page.append(GG.el('h4', { text: 'MKTG 201 — FINAL REPORT' }));
        page.append(GG.el('div', { class: 'doc-meta', text: 'Submitted by you · 22 pages · draft 7' }));
        PARA.forEach(function (text, i) {
          var p = GG.el('p', { class: 'para', 'data-i': String(i), text: text });
          page.append(p);
        });
        page.append(GG.el('div', { class: 'doc-foot', text: 'page 12 of 40' }));

        var ask = GG.el('div', { class: 'doc-ask' });
        ask.append(GG.el('div', { class: 'ai-badge', text: 'ASK THIS LAPTOP' }));
        var submit = GG.el('button', { class: 'btn submit', type: 'button', text: 'SUBMIT', disabled: 'disabled' });
        var hint = GG.el('p', { class: 'doc-hint', text: 'Tap a question. It reads all 40 pages locally.' });

        QA.forEach(function (item) {
          var c = GG.el('button', { class: 'chip q', type: 'button', text: item.q });
          c.addEventListener('click', function () {
            GG.audio.pop();
            page.querySelectorAll('.para').forEach(function (p) { p.classList.remove('found'); });
            var target = page.querySelector('[data-i="' + item.i + '"]');
            if (target) {
              target.classList.add('found');
              try { target.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {}
            }
            submit.disabled = false;
            hint.textContent = 'Found instantly · on this laptop · nothing uploaded';
            ask.querySelectorAll('.chip').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
            c.setAttribute('aria-pressed', 'true');
          });
          ask.append(c);
        });

        ask.append(hint, submit);

        submit.addEventListener('click', function () {
          GG.audio.chime();
          GG.state.results.push({
            id: 'deadline',
            line: 'READ ON THIS LAPTOP · WI-FI OFF · NOTHING UPLOADED',
            claim: 'This is the NPU.'
          });
          var flash = GG.el('div', { class: 'flash' });
          screen.append(flash);
          GG.timers.after(260, function () {
            GG.receipt(root, {
              lines: ['40-PAGE PDF · READ ON THIS LAPTOP', 'WI-FI OFF · NOTHING UPLOADED'],
              headline: 'This is the NPU.',
              body: 'AI that runs on the machine, not on a server.',
              next: function () { GG.go('ch2'); }
            });
          });
        });

        body.replaceChildren(GG.el('div', { class: 'doc' }, page, ask));
      }

      /* deep-linkable debug states: ?scene=ch1&phase=ai|doc|crash */
      var want = null;
      try { want = new URLSearchParams(window.location.search).get('phase'); } catch (e) {}

      if (want === 'ai' || want === 'doc') {
        phase = 'ai';
        screen.classList.add('ai');
        barTitle.textContent = 'Assignment_FINAL_v7.pdf — Intel AI PC';
        renderSearch();
        if (want === 'doc') {
          GG.timers.after(400, function () { renderDoc(); });
        }
      } else if (want === 'crash') {
        body.replaceChildren(banner(), fileGrid(), fanMeter());
        GG.timers.after(300, function () { breakdown(); });
      } else {
        /* start on the old PC: same files, no AI bar */
        body.replaceChildren(banner(), fileGrid(), fanMeter());
        after(2300, showRescue);
      }
    },
    unmount: function () {}
  });
})();
