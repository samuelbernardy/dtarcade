# Dynatrace Arcade — Design System

## Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `--dt-brand-navy` | `#1a1b30` | Deep background |
| `--dt-brand-navy-surface` | `#2d2e4e` | Panel / card surfaces |
| `--dt-brand-navy-raised` | `#3d3f64` | Raised card, hover surface |
| `--dt-brand-blue` | `#1496ff` | Primary accent, glow, CTA |
| `--dt-brand-purple` | `#474fcf` | Secondary accent (Strato Primary-70) |
| `--dt-brand-white` | `#ffffff` | Foreground text on dark |
| `--dt-brand-gray` | `#a0a1be` | Muted text, secondary labels |
| `--dt-problem-red` | `#ef3e42` | DT Problem ball, error states |
| `--dt-success-green` | `#00a141` | Win states, success |
| `--dt-arcade-glow` | `rgba(20,150,255,0.6)` | Hover pulse ring |

## Typography

Arcade-specific:
- **Monospace / scoreboard**: `font-family: "Courier New", monospace` — game UI, score displays, lobby title
- **Body text**: system-ui or Strato's inherited font
- Headings on dark: `color: #ffffff` always (do not rely on Strato theme tokens in custom dark sections)

## Animation Tokens (from `@dynatrace/strato-design-tokens/animations`)

| Purpose | Duration | Easing |
|---|---|---|
| Panel open (theatre reveal) | `400ms` | `cubic-bezier(0,0,0.2,1)` |
| Panel close | `250ms` | `cubic-bezier(0.5,0,1,1)` |
| Backdrop fade in | `300ms` | ease |
| Backdrop fade out | `200ms` | ease |
| Hover transition | `150ms` | `cubic-bezier(0,0,0.2,1)` |

## Theatre Overlay

Full-viewport `position: fixed` backdrop + centered panel.

```
Backdrop:  rgba(12,22,79,0.92)
Panel:     background #2d2e4e
           border: 1px solid rgba(20,150,255,0.3)
           border-radius: 16px
           box-shadow: 0 0 60px rgba(20,150,255,0.15)
           width: 90vw, max-width: 960px
```

**Open sequence:**
1. Backdrop: `opacity 0→1`, 300ms
2. Panel: `scale(0.15) translateY(20px) → scale(1) translateY(0)` + `opacity 0→1`, 400ms, 100ms delay

**Close sequence (reverse):**
1. Panel: `scale(1) → scale(0.15)`, 250ms
2. Backdrop: `opacity 1→0`, 200ms after panel

## Arcade Lobby Cards

```css
background:     #3d3f64
border:         1px solid rgba(20,150,255,0.2)
border-radius:  12px
padding:        24px
transition:     box-shadow 150ms, transform 150ms, border-color 150ms

:hover
  box-shadow:   0 0 0 2px #1496ff, 0 0 24px rgba(20,150,255,0.35)
  transform:    translateY(-3px)
  border-color: rgba(20,150,255,0.6)
```

## Marketing Tiles (GIF Hover Tiles)

Post-game capability tiles. User-provided GIF assets go in `ui/assets/tiles/`.

```
Width:         240px
Border-radius: 12px
Overflow:      hidden
Border:        1px solid rgba(255,255,255,0.12)
Image area:    160px tall

Default:   img filter: grayscale(30%) brightness(0.85)
Hover:     img filter: none, scale(1.03)
           animation: arcade-pulse 1.5s ease-out infinite
```

**Pulse keyframe:**
```css
@keyframes arcade-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(20,150,255,0.7), 0 0 16px rgba(20,150,255,0.3); }
  70%  { box-shadow: 0 0 0 10px rgba(20,150,255,0), 0 0 28px rgba(20,150,255,0.15); }
  100% { box-shadow: 0 0 0 0 rgba(20,150,255,0), 0 0 16px rgba(20,150,255,0.3); }
}
```

**GIF play-on-hover technique:**
- Default `src`: static poster PNG
- On hover: swap to GIF via React `key` re-mount → restarts from frame 1 each hover
- Drop assets in `ui/assets/tiles/`: `<id>-poster.png` and `<id>.gif`

## Spacing Scale (multiples of 8)

`8 · 12 · 16 · 24 · 32 · 48 · 64`
