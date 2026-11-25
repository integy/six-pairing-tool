import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
const dir = new URL('../public/teams/', import.meta.url);
const read = name => JSON.parse(readFileSync(new URL(name, dir), 'utf8'));

test('manifest holds exactly the Morning 娘 main team and the Ivan opponent team', () => {
  const manifest = read('manifest.json');
  assert.deepEqual(manifest.map(m => m.key), ['morning', 'ivan']);
  assert.deepEqual(manifest.map(m => m.name), ['Morning 娘', 'Ivan 隊']);
  const files = readdirSync(dir).filter(x => x.endsWith('-team.json')).sort();
  assert.deepEqual(files, ['ivan-team.json', 'morning-team.json']);
});

test('both teams have six players with a name and an army', () => {
  for (const key of ['morning', 'ivan']) {
    const team = read(`${key}-team.json`);
    assert.equal(team.key, key);
    assert.equal(team.players.length, 6, `${key} must be 6v6`);
    for (const p of team.players) {
      assert.ok(p.name && p.army, `${key} player missing name/army`);
      assert.equal(typeof p.scores, 'object');
    }
  }
});

test('Morning 娘 keeps the sheet ratings on Eric only, blanks stay blank', () => {
  const home = read('morning-team.json');
  const opp = read('ivan-team.json');
  assert.deepEqual(home.players.map(p => p.name), ['Eric', 'Sum', 'Him', 'Cray', 'Tim', 'Natsuki']);
  const eric = home.players[0];
  assert.equal(eric.scores.Ivan, 3);
  assert.equal(eric.scores.Gabriel, 2);
  assert.equal(eric.scores.Norman, 4);
  // the sheet only rates the sixth (reserved) opponent for the other five players
  for (const p of home.players.slice(1)) assert.deepEqual(p.scores, { Quintin: 3 }, `${p.name} ratings`);
  for (const p of opp.players) assert.deepEqual(p.scores, {});
  for (const v of Object.values(eric.scores)) assert.ok(v >= 1 && v <= 5 && (v * 2) % 1 === 0);
  // score keys must be opponent player names, otherwise the matrix cannot line up
  const oppNames = new Set(opp.players.map(p => p.name));
  for (const k of Object.keys(eric.scores)) assert.ok(oppNames.has(k), `unknown opponent ${k}`);
  assert.ok(!existsSync(new URL('king-crimson-team.json', dir)));
});

test('force dispositions use canonical keys', () => {
  const valid = new Set(['reconnaissance', 'priority-assets', 'disruption', 'take-and-hold', 'purge-the-foe']);
  for (const key of ['morning', 'ivan']) {
    for (const p of read(`${key}-team.json`).players) {
      if (p.forceDisposition) assert.ok(valid.has(p.forceDisposition), `${p.name}: ${p.forceDisposition}`);
    }
  }
});
