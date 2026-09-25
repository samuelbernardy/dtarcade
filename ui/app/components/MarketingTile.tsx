import React, { useState } from 'react';
import type { MarketingTileData } from '../types/arcade';

interface MarketingTileProps {
  tile: MarketingTileData;
}

const PLACEHOLDER_EMOJIS: Record<string, string> = {
  fso: '🔭',
  davis: '🤖',
  unified: '🤝',
};

export const MarketingTile = ({ tile }: MarketingTileProps) => {
  const [hovered, setHovered] = useState(false);
  const hasGif = Boolean(tile.gifSrc);
  const hasPoster = Boolean(tile.posterSrc);
  const hasImg = hasGif || hasPoster;

  const imgSrc = hovered && hasGif
    ? tile.gifSrc!
    : hasPoster
    ? tile.posterSrc!
    : tile.gifSrc ?? '';

  const imgKey = hovered && hasGif ? `${tile.id}-gif` : `${tile.id}-poster`;

  return (
    <a
      className="dt-mkt-tile"
      href={tile.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="dt-mkt-tile-img-wrap">
        {hasImg ? (
          <img
            key={imgKey}
            src={imgSrc}
            alt={tile.title}
            className="dt-mkt-tile-img"
          />
        ) : (
          <span style={{ fontSize: 52 }}>
            {PLACEHOLDER_EMOJIS[tile.id] ?? '🎯'}
          </span>
        )}
      </div>
      <div className="dt-mkt-tile-body">
        <div style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
          {tile.title}
        </div>
        <div style={{ color: '#a0a1be', fontSize: 13, lineHeight: 1.5 }}>
          {tile.description}
        </div>
      </div>
    </a>
  );
};
