const test = require('node:test');
const assert = require('node:assert');
const retrieval = require('../js/lib/retrieval.js');

const PARA = [
  'This report examines the shift in advertising spend toward short-form video between 2023 and 2026, with a focus on audiences aged 18 to 24.',
  'The main argument is that short-form video outperforms static advertising for Gen-Z audiences — roughly 3.4× higher recall at half the media spend.',
  'A mixed-method approach was used: 41 campaign datasets, 12 interviews with media buyers, and a survey of 2,400 respondents across four metros.',
  'The analysis draws on 41 sources, all cited in the appendix beginning on page 38, including platform transparency reports and agency benchmark studies.',
  'The discussion considers why static creative still dominates retail media budgets despite weaker recall, and what that gap costs brands per acquisition.',
  'Excluding references and appendices, the report runs to 6,412 words. The full submission, including figures, is 40 pages.',
  'The conclusion recommends reallocating at least 30% of static display budget to short-form video for this cohort, with quarterly creative refresh.'
];

test('finds the main argument paragraph from a natural question', () => {
  const hit = retrieval.search(PARA, "What's the main argument?");
  assert.strictEqual(hit.index, 1);
  assert.ok(hit.score > 0);
  assert.ok(hit.terms.includes('argument'));
  assert.ok(hit.snippet.includes('short-form video outperforms'));
});

test('finds the sources paragraph through stemming', () => {
  const hit = retrieval.search(PARA, 'How many sources?');
  assert.strictEqual(hit.index, 3);
  assert.ok(hit.terms.includes('source'));
});

test('finds the word-count paragraph without inventing an answer', () => {
  const hit = retrieval.search(PARA, 'Word count?');
  assert.strictEqual(hit.index, 5);
  assert.ok(hit.snippet.includes('6,412 words'));
});

test('returns no match for content that is not in the document', () => {
  const hit = retrieval.search(PARA, 'quantum blockchain');
  assert.strictEqual(hit.index, -1);
  assert.strictEqual(hit.score, 0);
  assert.strictEqual(hit.snippet, '');
});

test('empty query is a safe no-match', () => {
  const hit = retrieval.search(PARA, '   ');
  assert.strictEqual(hit.index, -1);
  assert.strictEqual(hit.score, 0);
});
