const test = require('node:test');
const assert = require('node:assert');
const match = require('../js/lib/match.js');

test('each vibe gets a distinct match with a spec line', () => {
  const out = ['student', 'creator', 'hustler'].map((v) => match.matchFor(v));
  for (const m of out) {
    assert.ok(m.title && m.line && m.spec);
    assert.ok(m.spec.includes('Intel Core Ultra'));
  }
  assert.strictEqual(new Set(out.map((m) => m.title)).size, 3);
});

test('unknown vibe falls back, never throws', () => {
  assert.ok(match.matchFor('nope').title);
});

test('tally summarises the three receipts', () => {
  const t = match.tally([
    { id: 'deadline', line: 'x', claim: 'y' },
    { id: 'photo', line: 'x', claim: 'y' },
    { id: 'poster', line: 'x', claim: 'y' }
  ]);
  assert.strictEqual(t.count, 3);
  assert.strictEqual(t.uploads, 'none');
  assert.strictEqual(t.wifi, 'off');
});
