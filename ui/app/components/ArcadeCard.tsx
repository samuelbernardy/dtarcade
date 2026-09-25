import React from 'react';
import { Button } from '@dynatrace/strato-components/buttons';
import type { GameConfig } from '../types/arcade';

interface ArcadeCardProps {
  game: GameConfig;
  onLaunch: (game: GameConfig) => void;
}

export const ArcadeCard = ({ game, onLaunch }: ArcadeCardProps) => {
  return (
    <div className="dt-arcade-card">
      <span style={{ fontSize: 56, lineHeight: 1 }}>{game.emoji}</span>
      <div style={{ color: '#ffffff', fontWeight: 700, fontSize: 20, margin: '4px 0 0', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.01em' }}>
        {game.title}
      </div>
      <p style={{ color: '#a0a1be', margin: 0, fontSize: 14, lineHeight: 1.5, flexGrow: 1 }}>
        {game.tagline}
      </p>
      <Button variant="emphasized" onClick={() => onLaunch(game)}>
        Play
      </Button>
    </div>
  );
};
