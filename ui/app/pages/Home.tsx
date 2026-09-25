import React, { useEffect, useState } from 'react';
import { ensureArcadeStyles } from '../styles/arcadeStyles';
import { TheatreOverlay } from '../components/TheatreOverlay';
import { ArcadeCard } from '../components/ArcadeCard';
import { MarketingBlurb } from '../components/MarketingBlurb';
import { Pong } from '../games/Pong';
import type { GameConfig, GameResult } from '../types/arcade';

const GAMES: GameConfig[] = [
  {
    id: 'pong',
    title: 'Problem Pong',
    tagline: 'DB Admin vs App Dev. First to 3 wins — and harmony begins.',
    emoji: '🏓',
    component: Pong,
    marketingTiles: [
      {
        id: 'fso',
        title: 'Full-Stack Observability',
        description: 'See everything from code to cloud — one unified view for every team.',
        href: 'https://www.dynatrace.com/platform/',
        posterSrc: './assets/tiles/fso-poster.png',
        gifSrc: './assets/tiles/fso.gif',
      },
      {
        id: 'davis',
        title: 'Davis AI',
        description: 'Automatic root cause analysis. No ticket wars. No blame.',
        href: 'https://www.dynatrace.com/platform/artificial-intelligence/',
        posterSrc: './assets/tiles/davis-poster.png',
        gifSrc: './assets/tiles/davis.gif',
      },
      {
        id: 'unified',
        title: 'One Platform for All Teams',
        description: 'Dev, Ops, and DBA working from the same source of truth.',
        href: 'https://www.dynatrace.com/platform/application-observability/',
        posterSrc: './assets/tiles/unified-poster.png',
        gifSrc: './assets/tiles/unified.gif',
      },
    ],
  },
];

type OverlayContent = 'game' | 'marketing';

export const Home = () => {
  const [selectedGame, setSelectedGame] = useState<GameConfig | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayContent, setOverlayContent] = useState<OverlayContent>('game');
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [contentFading, setContentFading] = useState(false);

  useEffect(() => { ensureArcadeStyles(); }, []);

  const launchGame = (game: GameConfig) => {
    setSelectedGame(game);
    setOverlayContent('game');
    setGameResult(null);
    setShowOverlay(true);
  };

  const handleGameComplete = (result: GameResult) => {
    setGameResult(result);
    setContentFading(true);
    setTimeout(() => {
      setOverlayContent('marketing');
      setContentFading(false);
    }, 300);
  };

  const handleClose = () => setShowOverlay(false);

  const handlePlayAgain = () => setShowOverlay(false);

  return (
    <div
      style={{
        minHeight: '100%',
        background: 'linear-gradient(180deg, #1a1b30 0%, #2d2e4e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}
    >
      {/* Lobby header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🕹️</div>
        <h1
          style={{
            color: '#fff',
            margin: '0 0 10px',
            fontSize: 42,
            fontFamily: '"Courier New", monospace',
            textShadow: '0 0 30px rgba(20,150,255,0.6)',
            letterSpacing: '0.05em',
          }}
        >
          Dynatrace Arcade
        </h1>
        <p style={{ color: '#a0a1be', margin: 0, fontSize: 16 }}>
          Play a game. Discover a superpower.
        </p>
      </div>

      {/* Game grid */}
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        {GAMES.map((game) => (
          <ArcadeCard key={game.id} game={game} onLaunch={launchGame} />
        ))}
      </div>

      {/* Theatre overlay — conditionally rendered */}
      {selectedGame && (
        <TheatreOverlay show={showOverlay} onClose={handleClose}>
          <div
            style={{
              opacity: contentFading ? 0 : 1,
              transition: 'opacity 300ms ease',
            }}
          >
            {overlayContent === 'game' ? (
              <>
                {/* Game header strip */}
                <div
                  style={{
                    padding: '20px 24px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <h2
                    style={{
                      color: '#fff',
                      margin: '0 0 4px',
                      fontSize: 20,
                      fontFamily: '"Courier New", monospace',
                    }}
                  >
                    {selectedGame.emoji}&nbsp; {selectedGame.title}
                  </h2>
                  <p style={{ color: '#a0a1be', margin: 0, fontSize: 14 }}>
                    {selectedGame.tagline}
                  </p>
                </div>
                <selectedGame.component onComplete={handleGameComplete} />
              </>
            ) : (
              gameResult && (
                <MarketingBlurb
                  game={selectedGame}
                  result={gameResult}
                  onPlayAgain={handlePlayAgain}
                />
              )
            )}
          </div>
        </TheatreOverlay>
      )}
    </div>
  );
};
