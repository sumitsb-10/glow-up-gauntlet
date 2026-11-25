const test = require('node:test');
const assert = require('node:assert');
const poster = require('../js/lib/poster.js');

test('every combination composes a complete poster', () => {
  const combos = poster.allCombos();
  assert.strictEqual(combos.length, 27);
  const seen = new Set();
  for (const c of combos) {
    const p = poster.composePoster(c);
    for (const k of ['bg', 'ink', 'accent', 'fontFamily', 'headline', 'sub']) {
      assert.ok(p[k] && String(p[k]).length, `${k} missing for ${JSON.stringify(c)}`);
    }
    assert.ok(Array.isArray(p.stickers));
    seen.add(p.bg + p.accent + p.fontFamily);
  }
  assert.ok(seen.size >= 9, 'combinations must not collapse to one look');
});

test('unknown keys fall back instead of throwing', () => {
  const p = poster.composePoster({ vibe: 'nope', type: 'nope', finish: 'nope' });
  assert.ok(p.bg && p.headline);
});
