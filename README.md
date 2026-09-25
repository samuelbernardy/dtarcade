# Dynatrace Arcade

An interactive Dynatrace App that introduces platform capabilities through short, engaging mini-games. Players pick a game, watch a cinematic theatre reveal, play through an escalating challenge, and land on a curated panel of Dynatrace links directly relevant to what they just experienced.

The goal is not just to entertain — each game is designed to viscerally demonstrate a real problem that Dynatrace solves, so the marketing moment that follows feels earned rather than forced.

---

## How it works

1. **Lobby** — players choose from the available arcade games, each themed around a Dynatrace capability area.
2. **Theatre reveal** — selecting a game triggers a cinematic scale-in animation that brings the game into focus without leaving the page.
3. **Game** — a short, self-contained mini-game plays out. Games are designed around a specific narrative arc that mirrors a real-world observability or security challenge.
4. **Discovery panel** — once the game ends, the theatre transitions to a marketing panel with an outcome message and a row of animated tiles linking to relevant Dynatrace documentation, demos, or product pages.

---

## Games

### Problem Pong
**Theme:** Application Observability · Full-Stack Tracing

A classic Pong match between a Database Administrator and an Application Developer. The two sides are pitted against each other — a familiar metaphor for the blame game that plays out during incidents when teams lack a shared source of truth.

*After the game, the discovery panel highlights how Dynatrace gives every team a unified view, eliminating the finger-pointing.*

---

### Zero-Day Frenzy
**Theme:** Application Security · Vulnerability Management

A Whac-A-Mole style game where CVEs pop up across a 12×6 grid. The spawn rate escalates through four phases — from manageable to completely overwhelming — until the player is buried. The game is **intentionally unwinnable**: no human can click fast enough at scale.

*The point is to make the problem tangible. The discovery panel then introduces how Dynatrace prioritises, contextualises, and automates vulnerability remediation so teams don't have to play whac-a-mole manually.*

---

## Running locally

```bash
npm install
npm run start      # starts the dev server and opens the app in your browser
```

## Building and deploying

```bash
npm run build      # compiles and bundles into dist/
npm run deploy     # build + deploy to the environment in app.config.json
```

The target environment is configured in `app.config.json` under `environmentUrl`.

---

## Adding a new game

1. Create `ui/app/games/MyGame.tsx` implementing the `GameProps` interface (`onComplete(result: GameResult) => void`).
2. Add a `GameConfig` entry to the `GAMES` array in `ui/app/pages/Home.tsx`, including:
   - `title`, `tagline`, `emoji`
   - `component` — your game component
   - `resultMessage` — a function that receives the game result and returns the outcome copy shown in the discovery panel
   - `marketingTiles` — 2–3 tiles linking to relevant Dynatrace content (240×160px GIFs in `ui/assets/tiles/`)
3. Run `npm run lint` and `npm run build` to verify everything compiles cleanly.

---

## Project structure

```
app.config.json              # app metadata, environment URL, required scopes
ui/
  app/
    App.tsx                  # router and page layout
    components/
      Header.tsx             # top nav
      TheatreOverlay.tsx     # animated backdrop + panel reveal
      ArcadeCard.tsx         # lobby game selection card
      MarketingBlurb.tsx     # post-game discovery panel
      MarketingTile.tsx      # animated GIF tile (hover to play)
    games/
      Pong.tsx               # Problem Pong — canvas-based game
      VulnerabilitySurge.tsx # Zero-Day Frenzy — DOM-based whac-a-mole
    pages/
      Home.tsx               # arcade lobby + game state machine
    styles/
      arcadeStyles.ts        # global CSS injected once on mount
    types/
      arcade.ts              # shared TypeScript interfaces
  assets/
    tiles/                   # 240×160px poster + GIF pairs for marketing tiles
```
