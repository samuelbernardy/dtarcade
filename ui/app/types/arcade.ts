import type { ComponentType } from 'react';

export interface MarketingTileData {
  id: string;
  title: string;
  description: string;
  href: string;
  posterSrc?: string;
  gifSrc?: string;
}

export interface GameResult {
  won: boolean;
  playerScore: number;
  aiScore: number;
}

export interface GameProps {
  onComplete: (result: GameResult) => void;
}

export interface ResultMessage {
  emoji: string;
  headline: string;
  scoreText: string;
  blurb: string;
  tilesLabel: string;
}

export interface GameConfig {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  component: ComponentType<GameProps>;
  marketingTiles: MarketingTileData[];
  resultMessage: (result: GameResult) => ResultMessage;
}
