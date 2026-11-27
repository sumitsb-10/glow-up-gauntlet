const test = require('node:test');
const assert = require('node:assert');
const consult = require('../js/lib/consult.js');

test('study + battery gives a qualified starting point', () => {
  const rec = consult.recommend({ use: 'study', priority: 'battery' });
  assert.match(rec.processor, /Core Ultra mobile laptop/i);
  assert.match(rec.processor, /verify the exact model and NPU/i);
  assert.match(rec.ram, /16GB/);
  assert.match(rec.storage, /512GB/);
  assert.match(rec.category, /Study/i);
  assert.match(rec.disclaimer, /starting point/i);
});

test('coding + performance produces more memory and storage', () => {
  const rec = consult.recommend({ use: 'code', priority: 'performance' });
  assert.match(rec.processor, /Match CPU\/OS to developer tools/i);
  assert.match(rec.ram, /32GB/);
  assert.match(rec.storage, /1TB/);
  assert.match(rec.category, /Developer/i);
});

test('creator + value still meets creator workload needs', () => {
  const rec = consult.recommend({ use: 'create', priority: 'value' });
  assert.match(rec.ram, /32GB/);
  assert.match(rec.storage, /1TB/);
  assert.match(rec.category, /Creator/i);
});

test('every combination returns a complete recommendation with needs-based variation', () => {
  const specs = new Set();
  for (const use of consult.USES) {
    for (const priority of consult.PRIORITIES) {
      const rec = consult.recommend({ use: use.key, priority: priority.key });
      assert.ok(rec.category && rec.processor && rec.ram && rec.storage);
      assert.ok(rec.why && rec.capabilities.length >= 3);
      assert.match(rec.disclaimer, /not an available SKU/i);
      specs.add([rec.processor, rec.ram, rec.storage].join('|'));
    }
  }
  assert.ok(specs.size >= 3, 'memory and storage starting points should vary by needs');
});

test('price objection is fair, specific and free of invented prices', () => {
  assert.ok(consult.OBJECTIONS.length >= 5);
  const text = consult.OBJECTIONS.map((o) => o.title + ' ' + o.body).join(' ');
  assert.match(text, /NPU/i);
  assert.match(text, /local processing/i);
  assert.match(text, /CPU and GPU|CPU or GPU/i);
  assert.doesNotMatch(text, /[₹$]\s?\d/);
  assert.doesNotMatch(text, /\d+%|percent/i);
});

test('competitor note names other NPU platforms without claiming universal inferiority', () => {
  assert.match(consult.COMPETITOR_NOTE, /AMD Ryzen AI/);
  assert.match(consult.COMPETITOR_NOTE, /Qualcomm Snapdragon X/);
  assert.match(consult.COMPETITOR_NOTE, /also/i);
  assert.doesNotMatch(consult.COMPETITOR_NOTE, /can't|cannot|never/i);
});

test('unknown answers fall back safely', () => {
  const rec = consult.recommend({ use: 'nope', priority: 'nope' });
  assert.ok(rec.category && rec.processor);
});

test('recommendations avoid unsupported processor tiers and qualify app-dependent features', () => {
  const rec = consult.recommend({ use: 'create', priority: 'performance' });
  assert.match(rec.processor, /Match CPU\/GPU to editing software/);
  assert.doesNotMatch(rec.processor, /Ultra [579]/);
  assert.match(rec.capabilities.join(' '), /where supported|app-dependent|depends on the system/i);
  assert.match(rec.disclaimer, /verify exact processor, NPU, app support/i);
});

test('gaming recommendations require a game-specific GPU check', () => {
  const rec = consult.recommend({ use: 'game', priority: 'performance' });
  assert.match(rec.processor, /Check GPU against game requirements/);
  assert.match(rec.disclaimer, /verify exact processor/i);
});
