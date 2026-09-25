import React, { useEffect, useRef, useState } from 'react';
import { ensureArcadeStyles } from '../styles/arcadeStyles';
import { TheatreOverlay } from '../components/TheatreOverlay';
import { ArcadeCard } from '../components/ArcadeCard';
import { MarketingBlurb } from '../components/MarketingBlurb';
import { DoomEmbed } from '../components/DoomEmbed';
import { Pong } from '../games/Pong';
import { VulnerabilitySurge } from '../games/VulnerabilitySurge';
import type { GameConfig, GameResult } from '../types/arcade';

const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'KeyB','KeyA',
];

const GAMES: GameConfig[] = [
  {
    id: 'pong',
    title: 'Problem Pong',
    tagline: 'DB Admin vs App Dev. First to 3 wins!',
    emoji: '🏓',
    component: Pong,
    resultMessage: (r: GameResult) => ({
      emoji: r.won ? '🎉' : '💀',
      headline: r.won ? 'App Dev Wins!' : 'DB Admin Wins!',
      scoreText: `Final score: ${r.playerScore} – ${r.aiScore}`,
      blurb: "In the real world, DB Admins and App Developers shouldn't have to play against each other. With Dynatrace, everyone shares one platform, one source of truth, and no blame games.",
      tilesLabel: 'Discover how Dynatrace brings teams together',
    }),
    marketingTiles: [
      {
        id: 'fso',
        title: 'End to End Observability',
        description: 'From a Button Click to Database, from Mobile to Mainframe. Everything in Context.',
        // eslint-disable-next-line noSecrets/no-secrets
        href: 'https://wkf10640.apps.dynatrace.com/ui/apps/dynatrace.distributedtracing/explorer?locationAppIds=http%3A%2F%2Flocalhost%3A3000%2Fui%2Clocal-dev-server&filter=request.is_failed+%3D+Failure+AND+dt.smartscape.service+%3D+SERVICE-531CE26849E95EC1+AND+%22span.events%5B%5D%5Bexception.type%5D%22+%3D+Error&tf=2026-09-24T20%3A54%3A00.000Z%3B2026-09-24T21%3A58%3A00.000Z&tab=exceptions&v=requests',
        posterSrc: './assets/tiles/fso-poster.png',
        gifSrc: './assets/tiles/fso.gif',
      },
      {
        id: 'davis',
        title: 'Dynatrace Intelligence',
        description: 'Automatic root cause analysis. No guesses. Just Answers. See Dynatrace Intelligence in action, simplifying incident investigation.',
        // eslint-disable-next-line noSecrets/no-secrets
        href: 'https://wkf10640.apps.dynatrace.com/ui/apps/dynatrace.davis.problems/?locationAppIds=http%3A%2F%2Flocalhost%3A3000%2Fui%2Clocal-dev-server&from=now%28%29-24h&to=now%28%29&filters=Category+in+%28Error%2C+Slowdown%29',
        posterSrc: './assets/tiles/davis-poster.png',
        gifSrc: './assets/tiles/davis.gif',
      },
      {
        id: 'unified',
        title: 'One Platform for All Teams',
        description: 'Dev, Ops, and DBA working from the same source of truth. See the breadth of capabilities in the Dynatrace platform.',
        href: 'https://wkf10640.apps.dynatrace.com/ui/apps/dynatrace.hub/browse/all',
        posterSrc: './assets/tiles/unified-poster.png',
        gifSrc: './assets/tiles/unified.gif',
      },
    ],
  },
  {
    id: 'vulnerability-surge',
    title: 'Zero-Day Frenzy',
    tagline: 'CVEs keep coming. Can you keep up?',
    emoji: '🐛',
    component: VulnerabilitySurge,
    resultMessage: (r: GameResult) => ({
      emoji: '🚨',
      headline: 'Overwhelmed',
      scoreText: `${r.playerScore} suppressed · ${r.aiScore} escaped`,
      blurb: `You suppressed ${r.playerScore} CVEs before being overwhelmed. At this scale, no team can keep up manually. Dynatrace doesn't just detect vulnerabilities — it prioritizes, contextualizes, and automates remediation.`,
      tilesLabel: 'See how Dynatrace handles what humans can\'t',
    }),
    marketingTiles: [
      {
        id: 'appsec',
        title: 'Runtime Vulnerability Analytics',
        description: 'Know which CVEs are actually exploitable in your running code.',
        href: 'https://www.dynatrace.com/platform/application-security/',
        posterSrc: './assets/tiles/appsec-poster.png',
        gifSrc: './assets/tiles/appsec.gif',
      },
      {
        id: 'priority',
        title: 'AI-Powered Prioritization',
        description: 'Stop chasing every CVE. Dynatrace Intelligence surfaces the ones that matter.',
        href: 'https://www.dynatrace.com/platform/artificial-intelligence/',
        posterSrc: './assets/tiles/priority-poster.png',
        gifSrc: './assets/tiles/priority.gif',
      },
      {
        id: 'automate',
        title: 'Security Automation',
        description: 'Trigger remediation workflows the moment a threat is confirmed.',
        href: 'https://www.dynatrace.com/platform/workflows/',
        posterSrc: './assets/tiles/automate-poster.png',
        gifSrc: './assets/tiles/automate.gif',
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
  const [showDoom, setShowDoom] = useState(false);
  const konamiProgress = useRef<number>(0);

  useEffect(() => { ensureArcadeStyles(); }, []);

  // Konami code listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === KONAMI[konamiProgress.current]) {
        konamiProgress.current += 1;
        if (konamiProgress.current === KONAMI.length) {
          konamiProgress.current = 0;
          setShowDoom(true);
        }
      } else {
        konamiProgress.current = e.code === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 800,
            textShadow: '0 0 30px rgba(20,150,255,0.6)',
            letterSpacing: '-0.02em',
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

      {/* Doom easter egg overlay — triggered by Konami code */}
      {showDoom && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'dt-backdrop-in 300ms ease both',
          }}
        >
          <div
            style={{
              position: 'relative',
              background: '#000',
              borderRadius: 8,
              overflow: 'hidden',
              animation: 'dt-panel-in 400ms cubic-bezier(0,0,0.2,1) 100ms both',
              boxShadow: '0 0 80px rgba(200,0,0,0.5)',
            }}
          >
            <button
              className="dt-close-btn"
              onClick={() => setShowDoom(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div
              style={{
                padding: '8px 16px',
                background: '#1a0000',
                borderBottom: '2px solid #c00',
                fontFamily: '"Courier New", monospace',
                color: '#c00',
                fontSize: 13,
                letterSpacing: '0.1em',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span>💀</span>
              <span>Well, aren't you fancy...</span>
            </div>
            <DoomEmbed width={1024} height={640} />
          </div>
        </div>
      )}

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
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 700,
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
