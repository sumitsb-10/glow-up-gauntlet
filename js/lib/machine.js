(function (root) {
  'use strict';

  var SCENES = ['attract', 'intro', 'ch1', 'r1', 'ch2', 'r2', 'ch3', 'r3', 'verdict', 'match'];

  var TABLE = {
    'attract|start': 'intro',
    'intro|vibe': 'ch1',
    'ch1|ch1done': 'r1',
    'r1|next': 'ch2',
    'ch2|ch2done': 'r2',
    'r2|next': 'ch3',
    'ch3|ch3done': 'r3',
    'r3|next': 'verdict',
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
