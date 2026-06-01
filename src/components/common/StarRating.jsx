import { Star } from 'lucide-react'

// ─── StarRating ───────────────────────────────────────────────────────────────
// Props:
//   rating   — number 0–5 (supports decimals)
//   reviews  — number of reviews (optional)
//   size     — icon size in px (default 16)
//   showNum  — show numeric rating beside stars (default true)
//   showCount— show review count (default true)
//   interactive — allow clicking to set rating (default false)
//   onChange  — callback(newRating) when interactive

export default function StarRating({
  rating = 0,
  reviews,
  size = 16,
  showNum = true,
  showCount = true,
  interactive = false,
  onChange,
}) {
  const stars = [1, 2, 3, 4, 5]

  const getFill = (index) => {
    if (rating >= index)       return 'full'
    if (rating >= index - 0.5) return 'half'
    return 'empty'
  }

  const handleClick = (index) => {
    if (interactive && onChange) onChange(index)
  }

  return (
    <div className={`sr-wrap ${interactive ? 'sr-wrap--interactive' : ''}`}>
      <div className="sr-stars">
        {stars.map(i => {
          const fill = getFill(i)
          return (
            <span
              key={i}
              className={`sr-star sr-star--${fill}`}
              onClick={() => handleClick(i)}
              aria-label={`${i} star${i > 1 ? 's' : ''}`}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : undefined}
              onKeyDown={e => e.key === 'Enter' && handleClick(i)}
            >
              {fill === 'half' ? (
                // half star using clip-path
                <span className="sr-half-wrap">
                  <Star size={size} className="sr-icon sr-icon--empty" />
                  <span className="sr-half-filled">
                    <Star size={size} className="sr-icon sr-icon--filled" />
                  </span>
                </span>
              ) : (
                <Star size={size} className="sr-icon" />
              )}
            </span>
          )
        })}
      </div>

      {showNum && (
        <span className="sr-num">{Number(rating).toFixed(1)}</span>
      )}

      {showCount && reviews !== undefined && (
        <span className="sr-count">
          ({reviews >= 1000
            ? `${(reviews / 1000).toFixed(1)}k`
            : reviews.toLocaleString()})
        </span>
      )}

      <style>{`
        .sr-wrap {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .sr-stars {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .sr-star {
          display: inline-flex;
          align-items: center;
          position: relative;
          line-height: 1;
        }
        .sr-wrap--interactive .sr-star {
          cursor: pointer;
          transition: transform .1s;
        }
        .sr-wrap--interactive .sr-star:hover {
          transform: scale(1.2);
        }

        /* full */
        .sr-star--full .sr-icon { color: #f59e0b; fill: #f59e0b; }

        /* empty */
        .sr-star--empty .sr-icon { color: #d1d5db; fill: none; }

        /* half */
        .sr-half-wrap { position: relative; display: inline-flex; }
        .sr-half-wrap .sr-icon--empty { color: #d1d5db; fill: none; }
        .sr-half-filled {
          position: absolute;
          top: 0; left: 0;
          width: 50%;
          overflow: hidden;
        }
        .sr-half-filled .sr-icon--filled { color: #f59e0b; fill: #f59e0b; }

        /* labels */
        .sr-num {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .sr-count {
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}