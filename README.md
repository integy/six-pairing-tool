# 🏆 Six Team Pairing Tool

A React-powered pairing assistant for **Warhammer 40K 6v6 team matches**.

This is a 6-player-per-team fork of the WTC pairing tool: **2 rounds instead of 3**, with the same attack/defend pairing engine and score matrix.

## Features

- ⚛️ **React + TypeScript** — modular component architecture
- 💾 **localStorage persistence** — never lose tournament state on refresh
- 🤖 **Auto-Optimal Pairing** — one-click best defender + attacker selection using maximin algorithm
- 📂 **JSON team format** — easier to edit, import/export support
- ↩️ **Undo support** — go back at any step
- 📥 **Export results** — CSV download + clipboard copy
- ⚙️ **Configurable settings** — change password, enable/disable protection
- 📱 **Mobile responsive** — works on phone and desktop

## How It Works (6v6, 2 rounds)

Each team fields **6 players**. The match runs over **2 rounds**:

1. **Round 1** — Each team nominates 1 defender + 2 attackers. Pair the defenders against the picked attackers.
2. **Round 2** — Final round with the remaining players, including auto-pairing for leftovers.

## Quick Start

```bash
npm install
npm run dev      # Development server
npm run build    # Production build to dist/
```

## How to Use

Open the app, enter password (`1031` by default).

1. **Setup** — Select your home team (6 players) + opponent (6 players), view score matrix
2. **Round 1** — Select defenders → pick attackers → Pair → Confirm
3. **Round 2** — Final round + auto-pairing for leftovers
4. **Results** — Edit scores, export CSV, copy to clipboard

Both teams must have exactly 6 players to start a 6v6 match.

## Adding Teams

Teams are JSON files in `public/teams/`. Format:

```json
{
  "key": "myteam",
  "name": "My Team",
  "players": [
    {
      "name": "Player Name",
      "army": "Army Name",
      "forceDisposition": "reconnaissance",
      "scores": { "Opponent Name": 4.5 }
    }
  ]
}
```

Add the team to `public/teams/manifest.json` or use the **Import JSON** button in the Setup page.

## Score Sync

`sync_scores.py` syncs score matrices from a Google Sheet (or local `.xlsx`) into team JSON files:

```bash
python3 sync_scores.py              # from Google Sheets
python3 sync_scores.py -f matrix.xlsx
python3 sync_scores.py -n           # dry-run
```

## Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- localStorage for persistence
- No backend required — fully static
