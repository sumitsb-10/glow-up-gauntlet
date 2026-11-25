/* Glow-Up Gauntlet — inline SVG art (no external assets) */
(function () {
  'use strict';
  var GG = window.GG;
  GG.art = GG.art || {};

  GG.VIBES = {
    student: { label: 'THE STUDENT', line: '47 tabs. One deadline.', verb: 'studying', traits: ['47 TABS', '1% BATTERY', '0 SLEEP'] },
    creator: { label: 'THE CREATOR', line: 'Posts daily. Edits at 2am.', verb: 'creating', traits: ['4 EDITS', '2AM', 'NO PLAN B'] },
    hustler: { label: 'THE HUSTLER', line: 'Side gigs. Zero patience.', verb: 'hustling', traits: ['3 GIGS', '1 INBOX', '0 CHILL'] }
  };

  var LOOKS = {
    student: { skin: '#E7B48C', hair: '#221A16', top: '#26324A', accent: '#4DA3FF', head: 'bun', glasses: true },
    creator: { skin: '#C98A63', hair: '#171310', top: '#33381F', accent: '#D6FF3F', head: 'hat' },
    hustler: { skin: '#F0C7A6', hair: '#242424', top: '#3B2730', accent: '#FF7A59', head: 'cap', chain: true }
  };

  GG.art.avatar = function (vibe) {
    var c = LOOKS[vibe] || LOOKS.student;
    var id = 'av-' + vibe;
    var head = '';
    if (c.head === 'bun') head += '<circle cx="100" cy="50" r="16" fill="' + c.hair + '"/>';
    head += '<circle cx="54" cy="106" r="9" fill="' + c.skin + '"/><circle cx="146" cy="106" r="9" fill="' + c.skin + '"/>';
    head += '<path d="M54 102c0-27 20-47 46-47s46 20 46 47c-6-14-22-22-46-22s-40 8-46 22z" fill="' + c.hair + '"/>';
    if (c.head === 'hat') {
      head += '<ellipse cx="100" cy="68" rx="61" ry="13" fill="' + c.accent + '"/>';
      head += '<path d="M62 68c0-20 17-33 38-33s38 13 38 33z" fill="' + c.accent + '"/>';
    }
    if (c.head === 'cap') {
      head += '<path d="M56 70c0-24 20-40 44-40s44 16 44 40z" fill="' + c.accent + '"/>';
      head += '<rect x="98" y="58" width="60" height="13" rx="6.5" fill="' + c.accent + '"/>';
    }
    head += '<circle cx="84" cy="108" r="3.6" fill="#14171d"/><circle cx="116" cy="108" r="3.6" fill="#14171d"/>';
    head += '<path d="M92 124q8 7 16 0" stroke="#14171d" stroke-width="3" stroke-linecap="round" fill="none"/>';
    if (c.glasses) {
      head += '<g stroke="#0B0D12" stroke-width="3.2" fill="none">' +
        '<rect x="69" y="97" width="27" height="21" rx="8"/>' +
        '<rect x="104" y="97" width="27" height="21" rx="8"/>' +
        '<path d="M96 106h8"/></g>';
    }
    if (c.chain) {
      head += '<path d="M72 190q28 26 56 0" stroke="#E7C36A" stroke-width="4" fill="none"/>' +
        '<circle cx="100" cy="206" r="6" fill="#E7C36A"/>';
    }
    if (vibe === 'creator') head += '<circle cx="150" cy="120" r="5" fill="' + c.accent + '"/>';

    return '<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' +
      GG.VIBES[vibe].label.toLowerCase() + ' avatar">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + c.accent + '" stop-opacity=".26"/>' +
      '<stop offset="1" stop-color="' + c.accent + '" stop-opacity="0"/>' +
      '</linearGradient></defs>' +
      '<rect width="200" height="240" rx="30" fill="#12151c"/>' +
      '<rect width="200" height="240" rx="30" fill="url(#' + id + ')"/>' +
      '<rect x="86" y="138" width="28" height="30" rx="12" fill="' + c.skin + '" opacity=".92"/>' +
      '<path d="M26 240c0-44 30-72 74-72s74 28 74 72z" fill="' + c.top + '"/>' +
      '<circle cx="100" cy="102" r="46" fill="' + c.skin + '"/>' +
      head +
      '</svg>';
  };

  /* small utility icon set */
  GG.art.icon = function (name, size) {
    var s = size || 28;
    var paths = {
      check: '<path d="M4 12l5 5L20 6" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
      bolt: '<path d="M13 2L4 14h6l-1 8 9-12h-6z" fill="currentColor"/>',
      wifiOff: '<path d="M3 3l18 18M8.5 15.5a4 4 0 017 0M5 12a11 11 0 014-2.5M15 9.5A11 11 0 0119 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
      lock: '<rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" stroke-width="2" fill="none"/>'
    };
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" aria-hidden="true">' + (paths[name] || '') + '</svg>';
  };
})();
