/* Poster composition — pure, deterministic, UMD */
(function (root) {
  'use strict';

  var VIBES = {
    neon: {
      label: 'NEON', swatch: '#D6FF3F', bg: '#0A0B12', ink: '#F4F1EA',
      accent: '#D6FF3F', sub: 'AFTER HOURS ONLY', blobs: ['#D6FF3F', '#4DA3FF']
    },
    y2k: {
      label: 'Y2K', swatch: '#7BE0FF', bg: '#0E1A33', ink: '#EAF6FF',
      accent: '#FF6FD8', sub: 'ONLINE SINCE 2001', blobs: ['#FF6FD8', '#7BE0FF']
    },
    desi: {
      label: 'DESI CORE', swatch: '#FF9A3D', bg: '#2A0F0A', ink: '#FFE8C7',
      accent: '#FFD166', sub: 'LOUD AND PROUD', blobs: ['#FF9A3D', '#FFD166']
    }
  };

  var TYPES = {
    blocky: { label: 'BLOCKY', fontFamily: '"Segoe UI Variable Display","Segoe UI",Inter,sans-serif', weight: 900, italic: false, spacing: '-0.045em', size: 78, transform: 'uppercase' },
    serif: { label: 'SERIF CHAOS', fontFamily: 'Georgia,"Times New Roman",serif', weight: 800, italic: true, spacing: '-0.03em', size: 74, transform: 'none' },
    hand: { label: 'HANDWRITTEN', fontFamily: '"Segoe Print","Bradley Hand",cursive', weight: 700, italic: false, spacing: '0', size: 66, transform: 'none' }
  };

  var FINISHES = {
    maximal: { label: 'MAXIMAL', grain: 0.55, blobOpacity: 0.62, stickers: ['★', '✦', '●', '✳'], rotate: true },
    clean: { label: 'CLEAN', grain: 0.08, blobOpacity: 0.34, stickers: ['●'], rotate: false },
    grainy: { label: 'GRAINY', grain: 0.95, blobOpacity: 0.45, stickers: ['✳', '✦'], rotate: true }
  };

  function composePoster(choice) {
    var v = VIBES[choice && choice.vibe] || VIBES.neon;
    var t = TYPES[choice && choice.type] || TYPES.blocky;
    var f = FINISHES[choice && choice.finish] || FINISHES.clean;

    return {
      vibe: choice && VIBES[choice.vibe] ? choice.vibe : 'neon',
      type: choice && TYPES[choice.type] ? choice.type : 'blocky',
      finish: choice && FINISHES[choice.finish] ? choice.finish : 'clean',
      bg: v.bg,
      ink: v.ink,
      accent: v.accent,
      fontFamily: t.fontFamily,
      fontWeight: t.weight,
      fontStyle: t.italic ? 'italic' : 'normal',
      letterSpacing: t.spacing,
      fontSize: t.size,
      textTransform: t.transform,
      headline: 'SIDE HUSTLE',
      sub: v.sub,
      kicker: 'EST. 2026 · 2AM',
      handle: '@yourname',
      blobs: v.blobs,
      blobOpacity: f.blobOpacity,
      grain: f.grain,
      stickers: f.stickers,
      rotateStickers: f.rotate
    };
  }

  function allCombos() {
    var out = [];
    Object.keys(VIBES).forEach(function (vibe) {
      Object.keys(TYPES).forEach(function (type) {
        Object.keys(FINISHES).forEach(function (finish) {
          out.push({ vibe: vibe, type: type, finish: finish });
        });
      });
    });
    return out;
  }

  var api = {
    VIBES: VIBES,
    TYPES: TYPES,
    FINISHES: FINISHES,
    composePoster: composePoster,
    allCombos: allCombos
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') {
    window.GG = window.GG || {};
    window.GG.poster = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
