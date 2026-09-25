import React, { useEffect, useRef, useCallback } from 'react';
import type { GameProps } from '../types/arcade';

const W = 1200;
const H = 720;
const PAD_W = 18;
const PAD_H = 120;
const BALL_R = 21;
const WIN_SCORE = 3;
const AI_SPEED = 5.5;
const INIT_SPEED = 8;

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x,     y,     x + r, y,         r);
  ctx.closePath();
}

interface State {
  bx: number; by: number;
  vx: number; vy: number;
  lY: number; rY: number;
  lScore: number; rScore: number;
  phase: 'playing' | 'won';
  winner: 'left' | 'right' | null;
}

function initState(): State {
  return {
    bx: W / 2, by: H / 2,
    vx: (Math.random() > 0.5 ? 1 : -1) * INIT_SPEED,
    vy: (Math.random() > 0.5 ? 1 : -1) * INIT_SPEED * 0.6,
    lY: H / 2 - PAD_H / 2,
    rY: H / 2 - PAD_H / 2,
    lScore: 0, rScore: 0,
    phase: 'playing', winner: null,
  };
}

export const Pong = ({ onComplete }: GameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<State>(initState());
  const rafRef = useRef<number>(0);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedRef = useRef(false);
  const keysRef = useRef({ up: false, down: false });
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const resetBall = useCallback((serveDir: 'left' | 'right') => {
    const s = stateRef.current;
    s.bx = W / 2; s.by = H / 2;
    s.vx = (serveDir === 'right' ? 1 : -1) * INIT_SPEED;
    s.vy = (Math.random() > 0.5 ? 1 : -1) * INIT_SPEED * 0.6;
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, s: State) => {
    // Background
    ctx.fillStyle = '#1a1b30';
    ctx.fillRect(0, 0, W, H);

    // Dashed centre line
    ctx.save();
    ctx.setLineDash([8, 12]);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.restore();

    // Side labels
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(160,161,190,0.8)';
    ctx.fillText('Database', W * 0.25, 36);
    ctx.fillText('Administrator', W * 0.25, 60);
    ctx.fillStyle = 'rgba(20,150,255,0.95)';
    ctx.fillText('Application', W * 0.75, 36);
    ctx.fillText('Developer', W * 0.75, 60);

    // Score (large, faint, centred on each half)
    ctx.font = 'bold 78px "Courier New", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.textAlign = 'center';
    ctx.fillText(String(s.lScore), W * 0.25, H / 2 + 20);
    ctx.fillText(String(s.rScore), W * 0.75, H / 2 + 20);

    // Left paddle — AI / DBA (red gradient)
    ctx.save();
    ctx.shadowBlur = 12; ctx.shadowColor = '#ef3e42';
    const lg = ctx.createLinearGradient(10, s.lY, 10 + PAD_W, s.lY + PAD_H);
    lg.addColorStop(0, '#ef3e42'); lg.addColorStop(1, '#ff6b6b');
    ctx.fillStyle = lg;
    drawRoundRect(ctx, 10, s.lY, PAD_W, PAD_H, 4);
    ctx.fill();
    ctx.restore();

    // Right paddle — Player / AppDev (blue gradient)
    ctx.save();
    ctx.shadowBlur = 12; ctx.shadowColor = '#1496ff';
    const rg = ctx.createLinearGradient(W - 10 - PAD_W, s.rY, W - 10, s.rY + PAD_H);
    rg.addColorStop(0, '#1496ff'); rg.addColorStop(1, '#00c4ff');
    ctx.fillStyle = rg;
    drawRoundRect(ctx, W - 10 - PAD_W, s.rY, PAD_W, PAD_H, 4);
    ctx.fill();
    ctx.restore();

    // Ball — red circle
    ctx.save();
    ctx.shadowBlur = 20; ctx.shadowColor = '#ef3e42';
    ctx.fillStyle = '#ef3e42';
    ctx.beginPath();
    ctx.arc(s.bx, s.by, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Ball — lightning bolt emoji centred on it
    ctx.font = `${Math.floor(BALL_R * 1.4)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡', s.bx, s.by);
    ctx.textBaseline = 'alphabetic';

    // Win overlay
    if (s.phase === 'won') {
      ctx.fillStyle = 'rgba(0,0,0,0.72)';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.font = 'bold 66px "Courier New", monospace';
      ctx.fillStyle = s.winner === 'right' ? '#00a141' : '#ef3e42';
      ctx.fillText(
        s.winner === 'right' ? '🎉  APP DEV WINS!' : '💀  DB ADMIN WINS!',
        W / 2, H / 2 - 24,
      );
      ctx.font = '27px "Courier New", monospace';
      ctx.fillStyle = '#a0a1be';
      ctx.fillText(
        s.winner === 'right'
          ? 'Victory for the developer!'
          : 'The database strikes back…',
        W / 2, H / 2 + 39,
      );
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleY = H / rect.height;
      const y = (e.clientY - rect.top) * scaleY;
      stateRef.current.rY = Math.max(0, Math.min(H - PAD_H, y - PAD_H / 2));
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp')   { e.preventDefault(); keysRef.current.up   = true; }
      if (e.key === 'ArrowDown') { e.preventDefault(); keysRef.current.down = true; }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp')   keysRef.current.up   = false;
      if (e.key === 'ArrowDown') keysRef.current.down = false;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const PADDLE_SPEED = 10;

    const loop = () => {
      const s = stateRef.current;

      if (s.phase === 'won') {
        draw(ctx, s);
        // Stop loop — component will be unmounted after onComplete fires
        return;
      }

      // Player keyboard input
      if (keysRef.current.up)   s.rY = Math.max(0, s.rY - PADDLE_SPEED);
      if (keysRef.current.down) s.rY = Math.min(H - PAD_H, s.rY + PADDLE_SPEED);

      // AI tracks ball Y with lag
      const aiCenter = s.lY + PAD_H / 2;
      if (aiCenter < s.by - 5) s.lY = Math.min(H - PAD_H, s.lY + AI_SPEED);
      else if (aiCenter > s.by + 5) s.lY = Math.max(0, s.lY - AI_SPEED);

      // Move ball
      s.bx += s.vx;
      s.by += s.vy;

      // Top / bottom wall bounce
      if (s.by - BALL_R <= 0)  { s.by = BALL_R;     s.vy =  Math.abs(s.vy); }
      if (s.by + BALL_R >= H)  { s.by = H - BALL_R; s.vy = -Math.abs(s.vy); }

      // Left paddle (AI) collision
      const lEdge = 10 + PAD_W;
      if (
        s.bx - BALL_R <= lEdge && s.bx - BALL_R >= 8 &&
        s.by >= s.lY && s.by <= s.lY + PAD_H
      ) {
        s.vx = Math.abs(s.vx) * 1.04;
        s.bx = lEdge + BALL_R + 1;
        s.vy = ((s.by - (s.lY + PAD_H / 2)) / (PAD_H / 2)) * 6;
      }

      // Right paddle (Player) collision
      const rEdge = W - 10 - PAD_W;
      if (
        s.bx + BALL_R >= rEdge && s.bx + BALL_R <= W - 8 &&
        s.by >= s.rY && s.by <= s.rY + PAD_H
      ) {
        s.vx = -Math.abs(s.vx) * 1.04;
        s.bx = rEdge - BALL_R - 1;
        s.vy = ((s.by - (s.rY + PAD_H / 2)) / (PAD_H / 2)) * 6;
      }

      // Speed cap (prevents tunnelling at high velocities)
      const spd = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      if (spd > 22) { s.vx = (s.vx / spd) * 22; s.vy = (s.vy / spd) * 22; }

      // Scoring
      if (s.bx - BALL_R < 0) {
        // App Dev (right/player) scores
        s.rScore += 1;
        if (s.rScore >= WIN_SCORE) {
          s.phase = 'won'; s.winner = 'right';
          if (!completedRef.current) {
            completedRef.current = true;
            completeTimerRef.current = setTimeout(() => {
              onCompleteRef.current({ won: true, playerScore: s.rScore, aiScore: s.lScore });
            }, 1800);
          }
        } else {
          resetBall('right');
        }
      } else if (s.bx + BALL_R > W) {
        // DBA (left/AI) scores
        s.lScore += 1;
        if (s.lScore >= WIN_SCORE) {
          s.phase = 'won'; s.winner = 'left';
          if (!completedRef.current) {
            completedRef.current = true;
            completeTimerRef.current = setTimeout(() => {
              onCompleteRef.current({ won: false, playerScore: s.rScore, aiScore: s.lScore });
            }, 1800);
          }
        } else {
          resetBall('left');
        }
      }

      draw(ctx, s);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [draw, resetBall]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: '16px 20px 24px',
      }}
    >
      <p
        style={{
          color: '#a0a1be',
          fontSize: 13,
          margin: 0,
          fontFamily: '"Courier New", monospace',
        }}
      >
        Move mouse or use{' '}
        <span style={{ color: '#1496ff' }}>↑↓ arrow keys</span> to control
        the{' '}
        <span style={{ color: '#1496ff' }}>blue Application Developer</span>{' '}
        paddle &nbsp;·&nbsp; First to {WIN_SCORE} wins!
      </p>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          width: '100%',
          borderRadius: 8,
          cursor: 'none',
          border: '1px solid rgba(20,150,255,0.2)',
          display: 'block',
        }}
      />
    </div>
  );
};
