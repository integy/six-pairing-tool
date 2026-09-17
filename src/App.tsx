import { AppProvider, useApp } from './store';
import { PasswordOverlay } from './components/PasswordOverlay';
import { Header } from './components/Header';
import { SetupPage } from './components/SetupPage';
import { RoundPage } from './components/RoundPage';
import { ResultsPage } from './components/ResultsPage';
import { SettingsPanel } from './components/SettingsPanel';
import { useState } from 'react';
import './styles.css';

function AppContent() {
  const { state, settings, setCurrentRound } = useApp();
  const [showSettings, setShowSettings] = useState(false);

  if (settings.passwordEnabled && !sessionStorage.getItem('six-authed')) {
    return <PasswordOverlay />;
  }

  const phases = [
    ['setup', '1. Setup', 0],
    ['round1', '2. Round 1', 1],
    ['round2', '3. Round 2', 2],
    ['results', '4. Results', 3],
  ];

  return (
    <div className="app">
      <Header onSettings={() => setShowSettings(true)} />
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      <div className="phase-bar">
        {phases.map(([id, label, round]) => {
          const r = round as number;
          const isActive = state.currentRound === r;
          const isDone = state.currentRound > r;

          return (
            <button
              key={id as string}
              className={`phase-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => setCurrentRound(r)}
            >
              {label as string}
            </button>
          );
        })}
      </div>

      <div className="container">
        {state.currentRound === 0 && <SetupPage />}
        {state.currentRound === 1 && <RoundPage round={1} />}
        {state.currentRound === 2 && <RoundPage round={2} />}
        {state.currentRound === 3 && <ResultsPage />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
