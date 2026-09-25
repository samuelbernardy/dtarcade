import React from 'react';
import { Button } from '@dynatrace/strato-components/buttons';
import { MarketingTile } from './MarketingTile';
import type { GameConfig, GameResult } from '../types/arcade';

interface MarketingBlurbProps {
  game: GameConfig;
  result: GameResult;
  onPlayAgain: () => void;
}

export const MarketingBlurb = ({ game, result, onPlayAgain }: MarketingBlurbProps) => {
  const { won, playerScore, aiScore } = result;

  return (
    <div
      style={{
        padding: '40px 40px 36px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 36,
      }}
    >
      {/* Result header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 60, marginBottom: 12 }}>{won ? '🎉' : '💀'}</div>
        <h2
          style={{
            color: won ? '#00a141' : '#ef3e42',
            margin: '0 0 10px',
            fontSize: 30,
            fontFamily: '"Courier New", monospace',
            letterSpacing: '0.03em',
          }}
        >
          {won ? 'App Dev Wins!' : 'DB Admin Wins!'}
        </h2>
        <p style={{ color: '#a0a1be', margin: '0 0 6px', fontSize: 15 }}>
          Final score:{' '}
          <span style={{ color: '#fff', fontWeight: 600 }}>
            {playerScore} – {aiScore}
          </span>
        </p>
        <p
          style={{
            color: '#a0a1be',
            margin: 0,
            fontSize: 14,
            lineHeight: 1.6,
            maxWidth: 500,
          }}
        >
          In real life, DB Admins and App Developers don&apos;t have to play against each
          other. With Dynatrace, both teams share one platform, one source of truth, and
          zero blame games.
        </p>
      </div>

      {/* GIF tiles */}
      <div>
        <p
          style={{
            color: '#a0a1be',
            fontSize: 12,
            textAlign: 'center',
            margin: '0 0 20px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}
        >
          Discover how Dynatrace brings teams together
        </p>
        <div
          style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {game.marketingTiles.map((tile) => (
            <MarketingTile key={tile.id} tile={tile} />
          ))}
        </div>
      </div>

      {/* Back to lobby */}
      <Button onClick={onPlayAgain}>← Back to Arcade</Button>
    </div>
  );
};
