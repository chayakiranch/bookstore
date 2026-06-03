import { Award, TrendingUp, Sparkles, Star, Tag, Zap, Flame } from 'lucide-react'

// ─── Ribbon config ────────────────────────────────────────────────────────────
const RIBBON_CONFIG = {
  'Best Sellers': {
    icon:  TrendingUp,
    label: 'Best Seller',
    bg:    '#e67e22',
    glow:  'rgba(230,126,34,.4)',
  },
  'Award Winners': {
    icon:  Award,
    label: 'Award Winner',
    bg:    '#8e44ad',
    glow:  'rgba(142,68,173,.4)',
  },
  'New Arrivals': {
    icon:  Sparkles,
    label: 'New Arrival',
    bg:    '#27ae60',
    glow:  'rgba(39,174,96,.4)',
  },
  'Deals & Discounts': {
    icon:  Tag,
    label: 'On Sale',
    bg:    '#c0392b',
    glow:  'rgba(192,57,43,.4)',
  },
  'E-Books': {
    icon:  Zap,
    label: 'E-Book',
    bg:    '#2980b9',
    glow:  'rgba(41,128,185,.4)',
  },
  featured: {
    icon:  Star,
    label: 'Featured',
    bg:    '#c9a96e',
    glow:  'rgba(201,169,110,.4)',
  },
  hot: {
    icon:  Flame,
    label: 'Hot',
    bg:    '#e74c3c',
    glow:  'rgba(231,76,60,.4)',
  },
}

// ─── BookRibbon ───────────────────────────────────────────────────────────────
// Props:
//   tag     — key from RIBBON_CONFIG or a book.tags value
//   variant — 'corner' (default) | 'banner' | 'badge' | 'strip'
//   position— 'top-left' (default) | 'top-right'  (corner only)
//   custom  — { label, bg, icon } override

export default function BookRibbon({
  tag,
  variant  = 'corner',
  position = 'top-left',
  custom,
}) {
  const cfg = custom || RIBBON_CONFIG[tag]
  if (!cfg) return null

  const Icon  = cfg.icon
  const color = cfg.bg
  const glow  = cfg.glow || `${cfg.bg}55`
  const label = cfg.label || tag

  // ── corner ribbon (diagonal fold) ─────────────────────────────────────────
  if (variant === 'corner') {
    const isRight = position === 'top-right'
    return (
      <>
        <div
          className={`br-corner ${isRight ? 'br-corner--right' : 'br-corner--left'}`}
          style={{ '--rc': color, '--rg': glow }}
          aria-label={label}
          title={label}
        >
          <span className="br-corner-text">
            <Icon size={10} />
            {label}
          </span>
        </div>

        <style>{`
          .br-corner {
            position: absolute;
            width: 80px; height: 80px;
            overflow: hidden;
            pointer-events: none;
            z-index: 3;
          }
          .br-corner--left  { top: 0; left: 0; }
          .br-corner--right { top: 0; right: 0; }

          .br-corner::before {
            content: '';
            position: absolute;
            top: 0;
            width: 0; height: 0;
            border-style: solid;
          }
          .br-corner--left::before {
            left: 0;
            border-width: 80px 80px 0 0;
            border-color: var(--rc) transparent transparent transparent;
            filter: drop-shadow(2px 2px 4px var(--rg));
          }
          .br-corner--right::before {
            right: 0;
            border-width: 80px 0 0 80px;
            border-color: var(--rc) transparent transparent transparent;
            filter: drop-shadow(-2px 2px 4px var(--rg));
          }

          .br-corner-text {
            position: absolute;
            display: flex;
            align-items: center;
            gap: 3px;
            color: #fff;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: .03em;
            text-transform: uppercase;
            white-space: nowrap;
            text-shadow: 0 1px 2px rgba(0,0,0,.3);
          }
          .br-corner--left  .br-corner-text { top: 14px; left: 4px;  transform: rotate(-45deg); }
          .br-corner--right .br-corner-text { top: 14px; right: 4px; transform: rotate(45deg);  }
        `}</style>
      </>
    )
  }

  // ── banner (horizontal across the cover) ──────────────────────────────────
  if (variant === 'banner') {
    return (
      <>
        <div
          className="br-banner"
          style={{ '--rc': color, '--rg': glow }}
          aria-label={label}
        >
          <Icon size={12} className="br-banner-icon" />
          <span className="br-banner-text">{label}</span>
        </div>

        <style>{`
          .br-banner {
            position: absolute;
            left: 0; right: 0;
            bottom: 0;
            background: var(--rc);
            padding: 6px 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            z-index: 3;
            pointer-events: none;
            box-shadow: 0 -3px 12px var(--rg);
          }
          .br-banner-icon  { color: rgba(255,255,255,.85); flex-shrink: 0; }
          .br-banner-text  {
            font-size: 11px; font-weight: 700;
            letter-spacing: .06em; text-transform: uppercase;
            color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.2);
          }
        `}</style>
      </>
    )
  }

  // ── badge (pill label, not positioned — inline) ───────────────────────────
  if (variant === 'badge') {
    return (
      <>
        <span
          className="br-badge"
          style={{ '--rc': color, '--rg': glow }}
        >
          <Icon size={11} />
          {label}
        </span>

        <style>{`
          .br-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 10px;
            border-radius: 99px;
            background: var(--rc);
            color: #fff;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: .03em;
            box-shadow: 0 2px 8px var(--rg);
            white-space: nowrap;
          }
        `}</style>
      </>
    )
  }

  // ── strip (left-side vertical strip) ─────────────────────────────────────
  if (variant === 'strip') {
    return (
      <>
        <div
          className="br-strip"
          style={{ '--rc': color }}
          aria-label={label}
          title={label}
        >
          <span className="br-strip-text">
            <Icon size={10} />
            {label}
          </span>
        </div>

        <style>{`
          .br-strip {
            position: absolute;
            top: 0; left: 0;
            width: 22px;
            height: 100%;
            background: var(--rc);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3;
            pointer-events: none;
          }
          .br-strip::after {
            content: '';
            position: absolute;
            right: -6px; top: 0;
            width: 0; height: 0;
            border-style: solid;
            border-width: 0 0 100% 6px;
            border-color: transparent transparent transparent var(--rc);
          }
          .br-strip-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            color: #fff;
            font-size: 8px;
            font-weight: 700;
            letter-spacing: .08em;
            text-transform: uppercase;
            writing-mode: vertical-lr;
            text-orientation: mixed;
            transform: rotate(180deg);
            text-shadow: 0 1px 2px rgba(0,0,0,.25);
          }
        `}</style>
      </>
    )
  }

  return null
}