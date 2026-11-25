(function (root) {
  'use strict';

  /* Receipts are overlays inside each challenge, so the scene graph is linear. */
  var SCENES = ['attract', 'intro', 'ch1', 'ch2', 'ch3', 'verdict', 'match'];

  var TABLE = {
    'attract|start': 'intro',
    'intro|vibe': 'ch1',
    'ch1|next': 'ch2',
    'ch2|next': 'ch3',
    'ch3|next': 'verdict',
    'verdict|next': 'match',
    'attract|idle': 'attract',
    'match|idle': 'attract'
  };

  function nextScene(current, action) {
    if (action === 'restart') return 'attract';
    if (SCENES.indexOf(current) === -1) return null;
    var to = TABLE[current + '|' + action];
    return to === undefined ? null : to;
  }

  var api = { SCENES: SCENES, nextScene: nextScene };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') {
    window.GG = window.GG || {};
    window.GG.machine = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
