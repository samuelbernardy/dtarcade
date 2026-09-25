const ARCADE_CSS = `
  /* ── Theatre Overlay ── */
  @keyframes dt-backdrop-in  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes dt-backdrop-out { from { opacity: 1; } to { opacity: 0; } }
  @keyframes dt-panel-in {
    from { opacity: 0; transform: scale(0.15) translateY(20px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
  }
  @keyframes dt-panel-out {
    from { opacity: 1; transform: scale(1)    translateY(0);    }
    to   { opacity: 0; transform: scale(0.15) translateY(20px); }
  }

  /* ── Arcade pulse (marketing tiles on hover) ── */
  @keyframes arcade-pulse {
    0%   { box-shadow: 0 0 0 0   rgba(20,150,255,0.7), 0 0 16px rgba(20,150,255,0.3);  }
    70%  { box-shadow: 0 0 0 10px rgba(20,150,255,0),  0 0 28px rgba(20,150,255,0.15); }
    100% { box-shadow: 0 0 0 0   rgba(20,150,255,0),   0 0 16px rgba(20,150,255,0.3);  }
  }

  /* ── Theatre close button ── */
  .dt-close-btn {
    position: absolute; top: 12px; right: 16px;
    background: none; border: none;
    color: rgba(160,161,190,0.7); cursor: pointer;
    font-size: 22px; line-height: 1; padding: 4px 8px;
    border-radius: 4px;
    transition: color 150ms ease, background 150ms ease;
    z-index: 1;
  }
  .dt-close-btn:hover { color: #fff; background: rgba(255,255,255,0.1); }

  /* ── Arcade lobby cards ── */
  .dt-arcade-card {
    background: #3d3f64;
    border: 1px solid rgba(20,150,255,0.2);
    border-radius: 12px;
    padding: 24px;
    display: flex; flex-direction: column; align-items: center;
    gap: 12px; width: 280px; min-height: 220px;
    text-align: center;
    transition: box-shadow 150ms ease, transform 150ms ease, border-color 150ms ease;
  }
  .dt-arcade-card:hover {
    box-shadow: 0 0 0 2px #1496ff, 0 0 24px rgba(20,150,255,0.35);
    transform: translateY(-3px);
    border-color: rgba(20,150,255,0.6);
  }

  /* ── Marketing tiles ── */
  .dt-mkt-tile {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.12);
    cursor: pointer;
    text-decoration: none;
    display: flex; flex-direction: column;
    background: #2d2e4e;
    width: 240px;
    transition: transform 150ms ease;
  }
  .dt-mkt-tile:hover {
    animation: arcade-pulse 1.5s ease-out infinite;
    transform: scale(1.03);
  }
  .dt-mkt-tile-img-wrap {
    width: 100%; height: 160px; overflow: hidden;
    background: linear-gradient(135deg, #3d3f64, #474fcf);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .dt-mkt-tile-img {
    width: 100%; height: 160px; object-fit: cover;
    transition: filter 150ms ease;
    filter: grayscale(30%) brightness(0.85);
    display: block;
  }
  .dt-mkt-tile:hover .dt-mkt-tile-img { filter: none; }
  .dt-mkt-tile-body { padding: 12px 14px; }
`;

let injected = false;

export function ensureArcadeStyles(): void {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const el = document.createElement('style');
  el.textContent = ARCADE_CSS;
  document.head.appendChild(el);
}
