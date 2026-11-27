const test = require('node:test');
const assert = require('node:assert');
const match = require('../js/lib/match.js');

test('each vibe gets distinct persona copy', () => {
  const out = ['student', 'creator', 'hustler'].map((v) => match.matchFor(v));
  for (const m of out) assert.ok(m.title && m.line);
  assert.strictEqual(new Set(out.map((m) => m.title)).size, 3);
  assert.strictEqual(new Set(out.map((m) => m.line)).size, 3);
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
  assert.strictEqual(t.skipped, 0);
  assert.strictEqual(t.uploads, 'none');
  assert.strictEqual(t.networkCalls, 'none');
});

test('tally carries skipped challenges and choices', () => {
  const t = match.tally([{ id: 'deadline' }], ['photo', 'poster'], { photo: 'keep' });
  assert.strictEqual(t.count, 1);
  assert.strictEqual(t.skipped, 2);
  assert.deepStrictEqual(t.skippedIds, ['photo', 'poster']);
  assert.strictEqual(t.choices.photo, 'keep');
});
