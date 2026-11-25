const test = require('node:test');
const assert = require('node:assert');
const machine = require('../js/lib/machine.js');

test('happy path walks every scene in order', () => {
  let s = 'attract';
  const walk = [['start','intro'],['vibe','ch1'],['ch1done','r1'],['next','ch2'],
    ['ch2done','r2'],['next','ch3'],['ch3done','r3'],['next','verdict'],['next','match']];
  for (const [action, expected] of walk) {
    s = machine.nextScene(s, action);
    assert.strictEqual(s, expected);
  }
});

test('invalid actions are ignored, never throw', () => {
  assert.strictEqual(machine.nextScene('ch1', 'vibe'), null);
  assert.strictEqual(machine.nextScene('match', 'ch1done'), null);
  assert.strictEqual(machine.nextScene('nope', 'start'), null);
});

test('restart returns to attract from anywhere', () => {
  for (const s of machine.SCENES) assert.strictEqual(machine.nextScene(s, 'restart'), 'attract');
});

test('idle only resets from attract and match', () => {
  assert.strictEqual(machine.nextScene('attract', 'idle'), 'attract');
  assert.strictEqual(machine.nextScene('match', 'idle'), 'attract');
  assert.strictEqual(machine.nextScene('ch2', 'idle'), null);
});
