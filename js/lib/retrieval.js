/* Local document retrieval — real keyword search, no model, UMD */
(function (root) {
  'use strict';

  var STOP = {};
  ('a an and are as at be but by can could do does for from how i if in into is it its me my no not of on or should '
    + 'that the their them then there these they this to was we were what whats when where which who why will with you your')
    .split(' ').forEach(function (w) { STOP[w] = true; });

  function normalize(text) {
    return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function stem(word) {
    if (word.length > 4) {
      if (/ies$/.test(word)) return word.slice(0, -3) + 'y';
      if (/(ches|shes|xes|zes)$/.test(word)) return word.slice(0, -2);
      if (/s$/.test(word) && !/ss$/.test(word)) return word.slice(0, -1);
    }
    return word;
  }

  function tokens(text) {
    var words = normalize(text).split(' ').filter(function (w) {
      return w.length > 1 && !STOP[w];
    });
    return words.map(stem);
  }

  function search(paragraphs, query) {
    var list = Array.isArray(paragraphs) ? paragraphs : [];
    var q = tokens(query).filter(function (term, i, all) { return all.indexOf(term) === i; });
    var best = { index: -1, score: 0, terms: [], snippet: '' };
    if (!q.length) return best;

    list.forEach(function (text, index) {
      var words = tokens(text);
      var score = 0;
      var matched = [];
      q.forEach(function (term) {
        var count = 0;
        words.forEach(function (word) { if (word === term) count += 1; });
        if (count) { score += count; matched.push(term); }
      });
      if (score > best.score) {
        best = { index: index, score: score, terms: matched, snippet: text };
      }
    });
    return best;
  }

  var api = { search: search, tokens: tokens, normalize: normalize, stem: stem };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') {
    window.GG = window.GG || {};
    window.GG.retrieval = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
