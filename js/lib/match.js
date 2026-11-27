/* Match + tally — pure, UMD */
(function (root) {
  'use strict';

  var MATCHES = {
    student: {
      title: 'THE STUDENT',
      line: "You don't miss deadlines. Your laptop shouldn't either."
    },
    creator: {
      title: 'THE CREATOR',
      line: "You don't wait for renders."
    },
    hustler: {
      title: 'THE HUSTLER',
      line: 'Three tabs open on three income streams.'
    }
  };

  function matchFor(vibe) {
    return MATCHES[vibe] || MATCHES.student;
  }

  function tally(results, skipped, choices) {
    var list = Array.isArray(results) ? results : [];
    var skippedList = Array.isArray(skipped) ? skipped : [];
    return {
      count: list.length,
      skipped: skippedList.length,
      skippedIds: skippedList,
      uploads: 'none',
      networkCalls: 'none',
      fan: 'quiet',
      choices: choices || {}
    };
  }

  var api = { MATCHES: MATCHES, matchFor: matchFor, tally: tally };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') {
    window.GG = window.GG || {};
    window.GG.match = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
