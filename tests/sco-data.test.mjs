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
test('home ratings retain all 347 opponent scores plus 7 practice ratings without filling blanks', () => {
  const home = read('king-crimson-team.json');
  assert.equal(home.players.reduce((n, p) => n + Object.keys(p.scores).length, 0), 354);
  assert.equal(home.players[1].scores['对伐'], 1.5);
  assert.equal(home.players[3].scores['Itsu Gyō  Chō'], 4);
  assert.equal(home.players[4].scores['My boss is King'], undefined);
});
