import test from 'node:test';
import assert from 'node:assert/strict';
import { loadState, saveState } from '../src/engine.ts';

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

test('new dataset state can be resumed after saving', () => {
  const state = { hkTeam: { key: 'king-crimson' }, oppTeam: null, currentRound: 0, rounds: {}, allMatches: [] };
  saveState(state);
  assert.equal(loadState()?.hkTeam.key, 'king-crimson');
  assert.equal(JSON.parse(storage.get('six-pairing-state')).datasetVersion, 'sco-2026-v1');
});
