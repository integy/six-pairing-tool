import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
const dir = new URL('../public/teams/', import.meta.url);
const read = name => JSON.parse(readFileSync(new URL(name, dir), 'utf8'));
test('SCO roster replaces old teams with 14 six-player teams and complete army lists', () => {
  const manifest = read('manifest.json');
  assert.equal(manifest.length, 14);
  assert.equal(manifest[0].key, 'king-crimson');
  assert.equal(readdirSync(dir).filter(x => x.endsWith('-team.json')).length, 14);
  assert.ok(!readdirSync(dir).includes('fa-team.json'));
  assert.ok(!readdirSync(dir).includes('norman-team.json'));
  for (const entry of manifest) {
    const team = read(`${entry.key}-team.json`);
    assert.equal(team.players.length, 6);
    for (const player of team.players) {
      assert.ok(player.armyList.length > 100);
      assert.ok(player.forceDisposition);
      if (team.key !== 'king-crimson') assert.deepEqual(player.scores, {});
    }
  }
});
// The sheet is re-synced by cron, so totals and individual values drift. Assert the invariants
// (ratings are retained, blanks stay blank, only known names appear) instead of a fixed count.
test('home ratings are retained, blanks stay blank, and keys are known names', () => {
  const home = read('king-crimson-team.json');
  const manifest = read('manifest.json');
  const known = new Set(home.players.map(p => p.name));
  for (const entry of manifest) {
    if (entry.key === 'king-crimson') continue;
    for (const player of read(`${entry.key}-team.json`).players) known.add(player.name);
  }
  let total = 0;
  for (const player of home.players) {
    assert.ok(Object.keys(player.scores).length > 50, `${player.name} lost its ratings`);
    total += Object.keys(player.scores).length;
    for (const key of Object.keys(player.scores)) assert.ok(known.has(key), `unknown score key ${key}`);
    for (const v of Object.values(player.scores)) assert.ok(v >= 1 && v <= 5 && (v * 2) % 1 === 0, `bad rating ${v}`);
  }
  assert.ok(total > 300);
});
