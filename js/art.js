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

  /* group photo for challenge 2 — flat vector, no real likeness */
  GG.art.groupPhoto = function () {
    function head(p) {
      return '<g transform="translate(' + p.x + ',' + p.y + ') scale(' + p.s + ')">' +
        '<circle r="46" fill="' + p.skin + '"/>' +
        '<path d="M-46 0c0-27 20-47 46-47s46 20 46 47c-6-14-22-22-46-22s-40 8-46 22z" fill="' + p.hair + '"/>' +
        '<circle cx="-16" cy="6" r="3.6" fill="#14171d"/>' +
        '<circle cx="16" cy="6" r="3.6" fill="#14171d"/>' +
        '<path d="M-8 22q8 7 16 0" stroke="#14171d" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '</g>';
    }
    function body(p) {
      var w = 70 * p.s, top = p.y + 44 * p.s;
      return '<path d="M' + (p.x - w) + ' 520 C' + (p.x - w) + ' ' + (top + 52) + ' ' +
        (p.x - w * 0.55) + ' ' + (top + 10) + ' ' + p.x + ' ' + (top + 10) +
        ' C' + (p.x + w * 0.55) + ' ' + (top + 10) + ' ' + (p.x + w) + ' ' + (top + 52) + ' ' +
        (p.x + w) + ' 520 Z" fill="' + p.shirt + '"/>';
    }

    var friends = [
      { x: 108, y: 262, s: 1.00, skin: '#E7B48C', hair: '#2A1D18', shirt: '#2E6B8A' },
      { x: 240, y: 248, s: 0.96, skin: '#C98A63', hair: '#1A1410', shirt: '#8A4A5E' },
      { x: 488, y: 252, s: 0.99, skin: '#F0C7A6', hair: '#3A2A1E', shirt: '#3F7A55' },
      { x: 620, y: 264, s: 1.02, skin: '#D9A077', hair: '#221A16', shirt: '#4B4E8A' }
    ];

    var bomber = { x: 362, y: 196, s: 1.14, skin: '#E7B48C', hair: '#2A1D18', shirt: '#FF7A59' };

    var friendSvg = friends.map(function (p) { return body(p) + head(p); }).join('');

    var bomberSvg =
      '<g class="bomber">' +
        '<rect class="bomber-hit" x="' + (bomber.x - 80) + '" y="' + (bomber.y - 110) + '" width="160" height="330" fill="#fff" opacity="0" pointer-events="all"/>' +
        body(bomber) +
        head(bomber) +
        '<g transform="translate(' + bomber.x + ',' + bomber.y + ') scale(' + bomber.s + ')">' +
          '<path d="M0 -104 L32 -32 L-32 -32 Z" fill="#FFD166"/>' +
          '<path d="M0 -104 L12 -74 L-12 -74 Z" fill="#FF7A59"/>' +
          '<circle cy="-108" r="8" fill="#FF7A59"/>' +
          '<path d="M-30 26q30 30 60 0" stroke="#14171d" stroke-width="4" fill="none" stroke-linecap="round"/>' +
          '<circle cx="-18" cy="-2" r="2.4" fill="#14171d"/><circle cx="18" cy="-2" r="2.4" fill="#14171d"/>' +
          '<path d="M-24 -14l10 5M24 -14l-10 5" stroke="#14171d" stroke-width="3" stroke-linecap="round"/>' +
        '</g>' +
        '<rect class="sel" x="' + (bomber.x - 86) + '" y="' + (bomber.y - 116) + '" width="172" height="336" rx="12" fill="none" stroke="#D6FF3F" stroke-width="3" stroke-dasharray="10 8"/>' +
      '</g>';

    return '<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Group photo with an uninvited photobomber">' +
      '<defs>' +
        '<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#243248"/><stop offset="1" stop-color="#3d4b63"/>' +
        '</linearGradient>' +
        '<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#1a2130"/><stop offset="1" stop-color="#111722"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="900" height="520" fill="url(#wall)"/>' +
      '<circle cx="620" cy="104" r="92" fill="#ffe6a8" opacity=".14"/>' +
      '<circle cx="620" cy="104" r="52" fill="#ffe6a8" opacity=".22"/>' +
      /* extension content, hidden until the frame is dragged */
      '<g class="ext">' +
        '<rect x="726" y="96" width="150" height="216" rx="10" fill="#0e1520" stroke="#8fa3bf" stroke-width="6"/>' +
        '<path d="M726 206h150M801 96v216" stroke="#8fa3bf" stroke-width="6"/>' +
        '<path d="M742 520c0-58 14-96 34-118 6 44 4 82-2 118z" fill="#4f9a6e"/>' +
        '<path d="M796 520c2-52 14-84 34-104 2 40-2 76-10 104z" fill="#62b585"/>' +
        '<rect x="754" y="404" width="56" height="54" rx="8" fill="#b06a4a"/>' +
      '</g>' +
      '<rect y="404" width="900" height="116" fill="url(#floor)"/>' +
      bomberSvg +
      friendSvg +
      '<rect width="900" height="520" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="2"/>' +
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
