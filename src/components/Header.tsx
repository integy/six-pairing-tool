export function Header({ onSettings }: { onSettings: () => void }) {
  return (
    <header className="header">
      <h1>🏆 Six Team Pairing Tool</h1>
      <p className="subtitle">Hong Kong Team · 6v6 Official Helper</p>
      <button className="settings-btn" onClick={onSettings} title="Settings">⚙️</button>
    </header>
  );
}
