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
  const { emoji, headline, scoreText, blurb, tilesLabel } = game.resultMessage(result);

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
        <div style={{ fontSize: 60, marginBottom: 12 }}>{emoji}</div>
        <h2
          style={{
            color: result.won ? '#00a141' : '#ef3e42',
            margin: '0 0 10px',
            fontSize: 30,
            fontFamily: '"Courier New", monospace',
            letterSpacing: '0.03em',
          }}
        >
          {headline}
        </h2>
        <p style={{ color: '#a0a1be', margin: '0 0 12px', fontSize: 15 }}>
          {scoreText}
        </p>
        <p
          style={{
            color: '#a0a1be',
            margin: 0,
            fontSize: 14,
            lineHeight: 1.6,
            maxWidth: 520,
          }}
        >
          {blurb}
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
          {tilesLabel}
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
