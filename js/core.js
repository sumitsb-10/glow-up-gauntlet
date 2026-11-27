/* Glow-Up Gauntlet — core: DOM helper, router, timers, audio, receipt */
(function () {
  'use strict';

  var GG = (window.GG = window.GG || {});

  GG.state = { vibe: null, results: [], skipped: [], choices: {} };
  GG.SCENES = {};
  GG.current = null;

  var timers = new Set();
  var rafs = new Set();
  var busy = false;
  var modalRelease = null;

  /* ---------- DOM ---------- */
  GG.el = function (tag, attrs) {
    var e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null) return;
        if (k === 'class') e.className = v;
        else if (k === 'text') e.textContent = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') {
          e.addEventListener(k.slice(2).toLowerCase(), v);
        } else e.setAttribute(k, v);
      });
    }
    for (var i = 2; i < arguments.length; i++) {
      var kid = arguments[i];
      if (kid == null) continue;
      if (Array.isArray(kid)) {
        kid.forEach(function (k) {
          if (k != null) e.append(k.nodeType ? k : document.createTextNode(String(k)));
        });
      } else e.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return e;
  };

  GG.svg = function (markup, cls) {
    var d = document.createElement('div');
    d.className = cls || 'art';
    d.innerHTML = markup;
    return d;
  };

  /* ---------- timers + frames ---------- */
  GG.timers = {
    after: function (ms, fn) {
      var id = setTimeout(function () { timers.delete(id); fn(); }, ms);
      timers.add(id);
      return id;
    },
    every: function (ms, fn) {
      var id = setInterval(fn, ms);
      timers.add(id);
      return id;
    },
    cancel: function (id) { clearTimeout(id); clearInterval(id); timers.delete(id); },
    clear: function () {
      timers.forEach(function (id) { clearTimeout(id); clearInterval(id); });
      timers.clear();
    }
  };

  GG.raf = function (fn) {
    var id = requestAnimationFrame(function (t) { rafs.delete(id); fn(t); });
    rafs.add(id);
    return id;
  };
  GG.rafClear = function () {
    rafs.forEach(function (id) { cancelAnimationFrame(id); });
    rafs.clear();
  };

  GG.on = function (el, ev, fn) {
    el.addEventListener(ev, fn);
    return function () { el.removeEventListener(ev, fn); };
  };

  GG.focusables = function (root) {
    return Array.prototype.slice.call(root.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(function (el) {
      return !el.disabled && el.getClientRects().length > 0;
    });
  };

  /* a persistent, low-emphasis escape from any challenge */
  GG.skip = function (screen, id, onSkip) {
    if (typeof id === 'function') { onSkip = id; id = null; }
    var btn = GG.el('button', {
      class: 'skip', type: 'button', text: 'SKIP THIS ONE',
      'aria-label': 'Skip this challenge'
    });
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      GG.audio.tap();
      if (id) GG.markSkipped(id);
      onSkip();
    });
    screen.append(btn);
    return btn;
  };

  /* pulse the next valid target after 12s without input */
  GG.hint = function (screen, getTarget, delay) {
    var timer = null;
    var hinted = null;

    function clearHint() {
      if (hinted) { hinted.classList.remove('hint'); hinted = null; }
    }
    function arm() {
      if (timer) { GG.timers.cancel(timer); timer = null; }
      clearHint();
      timer = GG.timers.after(delay || 12000, function () {
        timer = null;
        hinted = getTarget && getTarget();
        if (hinted) hinted.classList.add('hint');
      });
    }

    screen.addEventListener('pointerdown', arm, true);
    screen.addEventListener('keydown', arm, true);
    arm();
    return {
      reset: arm,
      stop: function () {
        if (timer) { GG.timers.cancel(timer); timer = null; }
        clearHint();
      }
    };
  };

  /* ---------- stage ---------- */
  GG.stage = {
    fit: function () {
      var s = Math.min(window.innerWidth / 1280, window.innerHeight / 800);
      s = Math.max(0.4, Math.min(2.2, s));
      document.documentElement.style.setProperty('--s', String(s));
    }
  };

  /* ---------- router ---------- */
  GG.register = function (name, scene) { GG.SCENES[name] = scene; };
  GG.reset = function () {
    GG.state.vibe = null;
    GG.state.results.length = 0;
    GG.state.skipped.length = 0;
    GG.state.choices = {};
  };
  GG.hasResult = function (id) {
    return GG.state.results.some(function (r) { return r.id === id; });
  };
  GG.markSkipped = function (id) {
    if (!id || GG.hasResult(id) || GG.state.skipped.indexOf(id) !== -1) return;
    GG.state.skipped.push(id);
  };

  GG.go = function (name, opts) {
    if (busy) return false;
    var scene = GG.SCENES[name];
    if (!scene) { console.warn('[GG] no scene registered:', name); return false; }

    var action = opts && opts.action;
    if (action) {
      var expected = GG.machine && GG.machine.nextScene ? GG.machine.nextScene(GG.current, action) : null;
      if (expected !== name) {
        console.warn('[GG] blocked transition:', GG.current, action, '->', name);
        return false;
      }
    }

    busy = true;

    var root = document.getElementById('scene');
    var outgoing = GG.current;

    function swap() {
      if (modalRelease) {
        try { modalRelease(); } catch (e) {}
        modalRelease = null;
      }
      if (outgoing && GG.SCENES[outgoing] && GG.SCENES[outgoing].unmount) {
        try { GG.SCENES[outgoing].unmount(); } catch (e) { console.error('[GG] unmount', outgoing, e); }
      }
      GG.timers.clear();
      GG.rafClear();
      root.innerHTML = '';
      root.classList.remove('in');
      GG.current = name;
      document.documentElement.dataset.scene = name;
      try { scene.mount(root, opts || {}); } catch (e) { console.error('[GG] mount', name, e); }
      GG.raf(function () { root.classList.add('in'); });
      try {
        document.dispatchEvent(new CustomEvent('gg:scene', { detail: { scene: name } }));
      } catch (e) {}
      setTimeout(function () { busy = false; }, 240);
    }

    if (!outgoing) { swap(); return true; }
    root.classList.remove('in');
    setTimeout(swap, 170);
    return true;
  };

  /* navigate with retry: a tap during the router's fade window must not be lost */
  GG.nav = function (name, opts, tries) {
    if (typeof opts === 'number') { tries = opts; opts = null; }
    var n = tries == null ? 15 : tries;
    if (GG.go(name, opts)) return true;
    if (n > 0) setTimeout(function () { GG.nav(name, opts, n - 1); }, 100);
    return false;
  };

  /* ---------- audio (silent until unlocked; muted by default) ---------- */
  GG.audio = (function () {
    var ctx = null;
    var muted = true;
    try { if (localStorage.getItem('gg.muted') === '0') muted = false; } catch (e) {}

    function ensure() {
      if (!ctx) {
        try {
          var AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return null;
          ctx = new AC();
        } catch (e) { ctx = null; }
      }
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(function () {});
      return ctx;
    }

    function tone(freq, dur, type, vol, slideTo) {
      if (muted) return;
      var c = ensure();
      if (!c) return;
      try {
        var o = c.createOscillator();
        var g = c.createGain();
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, c.currentTime);
        if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + dur);
        g.gain.setValueAtTime(0.0001, c.currentTime);
        g.gain.exponentialRampToValueAtTime(vol || 0.07, c.currentTime + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
        o.connect(g);
        g.connect(c.destination);
        o.start();
        o.stop(c.currentTime + dur + 0.03);
      } catch (e) { /* silent */ }
    }

    function noise(dur, vol, from, to) {
      if (muted) return;
      var c = ensure();
      if (!c) return;
      try {
        var len = Math.max(1, Math.floor(c.sampleRate * dur));
        var buf = c.createBuffer(1, len, c.sampleRate);
        var data = buf.getChannelData(0);
        for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
        var src = c.createBufferSource();
        src.buffer = buf;
        var f = c.createBiquadFilter();
        f.type = 'bandpass';
        f.frequency.setValueAtTime(from || 400, c.currentTime);
        f.frequency.exponentialRampToValueAtTime(to || 1800, c.currentTime + dur);
        var g = c.createGain();
        g.gain.setValueAtTime(vol || 0.06, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
        src.connect(f); f.connect(g); g.connect(c.destination);
        src.start();
      } catch (e) { /* silent */ }
    }

    return {
      unlock: function () { ensure(); },
      isMuted: function () { return muted; },
      toggle: function () {
        muted = !muted;
        try { localStorage.setItem('gg.muted', muted ? '1' : '0'); } catch (e) {}
        if (!muted) { ensure(); tone(660, 0.09, 'sine', 0.05); }
        return muted;
      },
      tap: function () { tone(540, 0.05, 'sine', 0.04); },
      pop: function () { tone(880, 0.08, 'triangle', 0.05); },
      whoosh: function () { noise(0.28, 0.05, 500, 2400); },
      thud: function () { tone(120, 0.16, 'sine', 0.09, 62); },
      chime: function () {
        tone(660, 0.14, 'sine', 0.05);
        setTimeout(function () { tone(990, 0.22, 'sine', 0.045); }, 90);
      },
      fan: function () { noise(0.5, 0.045, 220, 320); }
    };
  })();

  /* ---------- receipt ---------- */
  GG.receipt = function (root, data) {
    var opener = document.activeElement;
    var card = GG.el('div', {
      class: 'receipt-card' + (data.variant ? ' ' + data.variant : ''),
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'AI PC receipt'
    });
    var overlay = GG.el('section', { class: 'receipt-scene' }, card);
    var siblings = Array.prototype.slice.call(root.children);
    var mute = document.getElementById('mute');
    var home = document.getElementById('home');

    function release() {
      siblings.forEach(function (el) { el.inert = false; });
      if (mute) mute.inert = false;
      if (home) home.inert = false;
      card.removeEventListener('keydown', trap);
      try { if (opener && opener.focus) opener.focus({ preventScroll: true }); } catch (e) {}
    }

    function trap(e) {
      if (e.key !== 'Tab') return;
      var f = GG.focusables(card);
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];
      var inside = card.contains(document.activeElement);
      if (e.shiftKey && (!inside || document.activeElement === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!inside || document.activeElement === last)) {
        e.preventDefault();
        first.focus();
      }
    }

    card.append(GG.el('div', { class: 'receipt-stamp', text: data.stamp || 'AI PC RECEIPT · NO CLOUD INVOLVED' }));

    var lines = GG.el('div', { class: 'receipt-lines' });
    (data.lines || []).forEach(function (line) {
      lines.append(GG.el('div', { class: 'receipt-line' },
        GG.el('span', { class: 'tick', text: '✓' }), line));
    });
    card.append(lines);
    card.append(GG.el('h2', { class: 'receipt-headline', role: 'status', 'aria-live': 'polite', text: data.headline }));
    if (data.body) card.append(GG.el('p', { class: 'receipt-body', text: data.body }));

    var btn = GG.el('button', { class: 'btn', type: 'button', text: data.nextLabel || 'Next' });
    btn.addEventListener('click', function () {
      GG.audio.pop();
      if (modalRelease === release) modalRelease = null;
      release();
      if (typeof data.next === 'function') data.next();
      /* navigations clear the scene root; standalone sheets remove themselves */
      setTimeout(function () {
        if (overlay.isConnected) overlay.remove();
      }, 260);
    });
    card.append(GG.el('div', { class: 'receipt-actions' }, btn));

    card.addEventListener('keydown', trap);
    siblings.forEach(function (el) { el.inert = true; });
    if (mute) mute.inert = true;
    if (home) home.inert = true;
    modalRelease = release;
    root.append(overlay);
    GG.audio.chime();
    try { btn.focus({ preventScroll: true }); } catch (e) {}
  };
})();
