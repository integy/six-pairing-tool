import test from 'node:test';
import assert from 'node:assert/strict';
import { loadState, saveState, loadSettings, saveSettings } from '../src/engine.ts';

const storage = new Map();
globalThis.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.delete(key),
};

test('old team state is discarded without touching other tools or settings', () => {
  storage.clear();
  storage.set('six-pairing-state', JSON.stringify({ hkTeam: { key: 'fa' } }));
  storage.set('wtc-pairing-state', 'untouched');
  storage.set('six-pairing-settings', 'untouched');
  assert.equal(loadState(), null);
  assert.equal(storage.get('wtc-pairing-state'), 'untouched');
  assert.equal(storage.get('six-pairing-settings'), 'untouched');
});

test('settings saved by an older build fall back to the new default password', () => {
  storage.clear();
  storage.set('six-pairing-settings', JSON.stringify({ password: '1031', passwordEnabled: true }));
  assert.equal(loadSettings().password, '1128');
  assert.equal(storage.get('six-pairing-settings'), JSON.stringify({ password: '1031', passwordEnabled: true }));
});

test('settings survive a round trip within the same version', () => {
  storage.clear();
  saveSettings({ password: '4321', passwordEnabled: false });
  assert.deepEqual(
    { password: loadSettings().password, passwordEnabled: loadSettings().passwordEnabled },
    { password: '4321', passwordEnabled: false },
  );
});

test('new dataset state can be resumed after saving', () => {
  const state = { hkTeam: { key: 'morning' }, oppTeam: null, currentRound: 0, rounds: {}, allMatches: [] };
  saveState(state);
  assert.equal(loadState()?.hkTeam.key, 'morning');
  assert.equal(JSON.parse(storage.get('six-pairing-state')).datasetVersion, 'morning-2026-11-v1');
});
