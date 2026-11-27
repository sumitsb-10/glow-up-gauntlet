const test = require('node:test');
const assert = require('node:assert');
const machine = require('../js/lib/machine.js');

test('happy path walks every scene in order', () => {
  let s = 'attract';
  const walk = [['start', 'intro'], ['vibe', 'ch1'], ['next', 'ch2'],
    ['next', 'ch3'], ['next', 'verdict'], ['next', 'match']];
  for (const [action, expected] of walk) {
    s = machine.nextScene(s, action);
    assert.strictEqual(s, expected);
  }
});

test('invalid actions are ignored, never throw', () => {
  assert.strictEqual(machine.nextScene('ch1', 'vibe'), null);
  assert.strictEqual(machine.nextScene('match', 'next'), null);
  assert.strictEqual(machine.nextScene('nope', 'start'), null);
});

test('restart returns to attract from anywhere', () => {
  for (const s of machine.SCENES) assert.strictEqual(machine.nextScene(s, 'restart'), 'attract');
});

test('idle resets every scene to attract', () => {
  for (const s of machine.SCENES) assert.strictEqual(machine.nextScene(s, 'idle'), 'attract');
});
