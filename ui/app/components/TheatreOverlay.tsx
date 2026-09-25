import React, { useEffect, useRef, useState } from 'react';
import { ensureArcadeStyles } from '../styles/arcadeStyles';

interface TheatreOverlayProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

type AnimPhase = 'hidden' | 'entering' | 'visible' | 'exiting';

export const TheatreOverlay = ({ show, onClose, children }: TheatreOverlayProps) => {
  const [phase, setPhase] = useState<AnimPhase>('hidden');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasShowingRef = useRef(false);

  useEffect(() => { ensureArcadeStyles(); }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (show) {
      wasShowingRef.current = true;
      setPhase('entering');
      timerRef.current = setTimeout(() => setPhase('visible'), 550);
    } else if (wasShowingRef.current) {
      wasShowingRef.current = false;
      setPhase('exiting');
      timerRef.current = setTimeout(() => setPhase('hidden'), 350);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [show]);

  if (phase === 'hidden') return null;

  const isEntering = phase === 'entering';
  const isExiting = phase === 'exiting';

  const backdropAnim = isEntering
    ? 'dt-backdrop-in 300ms ease forwards'
    : isExiting
    ? 'dt-backdrop-out 200ms ease forwards'
    : 'none';

  const panelAnim = isEntering
    ? 'dt-panel-in 400ms cubic-bezier(0,0,0.2,1) 100ms both'
    : isExiting
    ? 'dt-panel-out 250ms cubic-bezier(0.5,0,1,1) forwards'
    : 'none';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(12,22,79,0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: backdropAnim,
        pointerEvents: isExiting ? 'none' : 'auto',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#2d2e4e',
          border: '1px solid rgba(20,150,255,0.3)',
          borderRadius: 16,
          boxShadow: '0 0 60px rgba(20,150,255,0.15)',
          width: '96vw',
          maxWidth: 1400,
          maxHeight: '94vh',
          overflowY: 'auto',
          position: 'relative',
          animation: panelAnim,
        }}
      >
        <button className="dt-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};
