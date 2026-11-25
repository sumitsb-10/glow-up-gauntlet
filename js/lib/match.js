/* Match + tally — pure, UMD */
(function (root) {
  'use strict';

  var SPEC = 'Intel Core Ultra · 16GB+ · 1TB SSD · NPU';

  var MATCHES = {
    student: {
      title: 'THE STUDENT',
      line: "You don't miss deadlines. Your laptop shouldn't either.",
      spec: SPEC
    },
    creator: {
      title: 'THE CREATOR',
      line: "You don't wait for renders.",
      spec: SPEC
    },
    hustler: {
      title: 'THE HUSTLER',
      line: 'Three tabs open on three income streams.',
      spec: SPEC
    }
  };

  function matchFor(vibe) {
    return MATCHES[vibe] || MATCHES.student;
  }

  function tally(results) {
    var list = Array.isArray(results) ? results : [];
    return {
      count: list.length,
      uploads: 'none',
      wifi: 'off',
      fan: 'quiet'
    };
  }

  var api = { SPEC: SPEC, MATCHES: MATCHES, matchFor: matchFor, tally: tally };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') {
    window.GG = window.GG || {};
    window.GG.match = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
