import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tag, Clock, ArrowRight, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { useBooks } from '../../context/BooksContext'
import { useCart }  from '../../context/CartContext'
import { formatPrice, discountPct } from '../../utils/helpers'

// ─── Countdown timer (purely decorative demo) ─────────────────────────────────
function Countdown() {
  const [time] = useState({ h: 11, m: 47, s: 23 })
  return (
    <div className="ds-countdown">
      <Clock size={14} className="ds-countdown-icon" />
      <span className="ds-countdown-label">Ends in</span>
      {['h', 'm', 's'].map((unit, i) => (
        <span key={unit} className="ds-time-block">
          <span className="ds-time-num">{String(time[unit]).padStart(2,'0')}</span>
          <span className="ds-time-unit">{unit}</span>
          {i < 2 && <span className="ds-time-sep">:</span>}
        </span>
      ))}
    </div>
  )
}

// ─── Deal card ────────────────────────────────────────────────────────────────
function DealCard({ book }) {
  const { addItem, items, openCart } = useCart()
  const inCart  = items.some(i => i.id === book.id)
  const pct     = discountPct(book.originalPrice, book.price)
  const savings = (book.originalPrice - book.price).toFixed(2)

  const handleAdd = e => {
    e.preventDefault(); e.stopPropagation()
    addItem(book); openCart()
  }

  return (
    <Link to={`/books/${book.id}`} className="ds-deal-card">
      {/* discount badge */}
      <div className="ds-badge-wrap">
        <span className="ds-pct-badge">-{pct}%</span>
        {book.isEbook && <span className="ds-ebook-badge"><Zap size={9} />E-Book</span>}
      </div>

      {/* cover */}
      <div className="ds-cover-wrap">
        <img src={book.cover} alt={book.title} className="ds-cover" />
        <div className="ds-cover-overlay">
          <button className="ds-add-btn" onClick={handleAdd}>
            {inCart ? '✓ In Cart' : '+ Add to Cart'}
          </button>
        </div>
      </div>

      {/* info */}
      <div className="ds-card-body">
        <p className="ds-cat">{book.category || book.genre}</p>
        <p className="ds-title">{book.title}</p>
        <p className="ds-author">by {book.author}</p>

        <div className="ds-price-row">
          <span className="ds-price">{formatPrice(book.price)}</span>
          <span className="ds-orig">{formatPrice(book.originalPrice)}</span>
        </div>

        <div className="ds-savings">
          <Tag size={11} /> You save {formatPrice(+savings)}
        </div>
      </div>

      <style>{`
        .ds-deal-card { display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;text-decoration:none;color:inherit;transition:transform .2s,box-shadow .2s;position:relative; }
        .ds-deal-card:hover { transform:translateY(-3px);box-shadow:var(--shadow-md); }
        .ds-badge-wrap { position:absolute;top:10px;left:10px;z-index:2;display:flex;flex-direction:column;gap:4px; }
        .ds-pct-badge { display:inline-block;background:var(--danger);color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:4px;letter-spacing:.03em; }
        .ds-ebook-badge { display:inline-flex;align-items:center;gap:3px;background:rgba(41,128,185,.9);color:#fff;font-size:9px;font-weight:600;padding:2px 6px;border-radius:4px; }
        .ds-cover-wrap { position:relative;aspect-ratio:2/3;overflow:hidden;background:var(--bg-alt); }
        .ds-cover { width:100%;height:100%;object-fit:cover;transition:transform .35s; }
        .ds-deal-card:hover .ds-cover { transform:scale(1.04); }
        .ds-cover-overlay { position:absolute;inset:0;background:rgba(26,26,46,.5);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;backdrop-filter:blur(2px); }
        .ds-deal-card:hover .ds-cover-overlay { opacity:1; }
        .ds-add-btn { padding:9px 18px;border-radius:var(--radius-md);background:var(--accent);color:var(--brand);font-size:13px;font-weight:500;border:none;cursor:pointer;font-family:var(--font-body);transition:background .15s,transform .15s;transform:translateY(6px); }
        .ds-deal-card:hover .ds-add-btn { transform:translateY(0); }
        .ds-add-btn:hover { background:var(--accent-dark);color:#fff; }
        .ds-card-body { padding:12px;display:flex;flex-direction:column;gap:3px; }
        .ds-cat { font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--accent-dark); }
        .ds-title { font-size:13px;font-weight:600;color:var(--text-primary);line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
        .ds-author { font-size:11px;color:var(--text-muted); }
        .ds-price-row { display:flex;align-items:baseline;gap:6px;margin-top:4px; }
        .ds-price { font-size:16px;font-weight:700;color:var(--text-primary); }
        .ds-orig { font-size:12px;color:var(--text-muted);text-decoration:line-through; }
        .ds-savings { display:flex;align-items:center;gap:4px;font-size:11px;font-weight:500;color:var(--success);background:#d5f5e3;padding:3px 8px;border-radius:4px;align-self:flex-start;margin-top:4px; }
      `}</style>
    </Link>
  )
}

// ─── DealsSection ─────────────────────────────────────────────────────────────
// Can be used standalone on /section/Deals & Discounts or embedded in Home
// Props:
//   limit   — number of books to show (default all)
//   compact — smaller header for embedding

export default function DealsSection({ limit, compact = false }) {
  const { books } = useBooks()
  const [page, setPage] = useState(0)

  const deals = books.filter(b =>
    b.tags?.includes('Deals & Discounts') &&
    b.originalPrice > b.price
  )

  const COLS     = 5
  const display  = limit ? deals.slice(0, limit) : deals
  const pages    = Math.ceil(display.length / COLS)
  const visible  = display.slice(page * COLS, page * COLS + COLS)

  if (deals.length === 0) return null

  return (
    <div className="ds-section">
      {/* header */}
      <div className="ds-header">
        <div className="ds-header-left">
          {!compact && (
            <div className="ds-header-icon">
              <Tag size={20} />
            </div>
          )}
          <div>
            <h2 className={compact ? 'ds-title-sm' : 'ds-title-lg'}>
              Deals &amp; Discounts
            </h2>
            <p className="ds-subtitle">
              {deals.length} books on sale — save up to{' '}
              {Math.max(...deals.map(b => discountPct(b.originalPrice, b.price)))}%
            </p>
          </div>
        </div>

        <div className="ds-header-right">
          <Countdown />
          <Link to="/section/Deals & Discounts" className="ds-view-all">
            View all <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* deal highlight banner */}
      {!compact && (
        <div className="ds-banner">
          <div className="ds-banner-left">
            <span className="ds-banner-pill">🔥 Flash Sale</span>
            <h3 className="ds-banner-title">Up to 40% off on select titles</h3>
            <p className="ds-banner-sub">
              Grab top-rated books at incredible prices. Limited time only.
            </p>
            <Link to="/section/Deals & Discounts" className="btn btn-accent ds-banner-btn">
              Shop all deals <ArrowRight size={16} />
            </Link>
          </div>
          <div className="ds-banner-books">
            {deals.slice(0, 3).map((book, i) => (
              <Link key={book.id} to={`/books/${book.id}`}
                className="ds-banner-book" style={{'--bi': i}}>
                <img src={book.cover} alt={book.title} />
                <span className="ds-banner-book-pct">
                  -{discountPct(book.originalPrice, book.price)}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* book grid with pagination */}
      <div className="ds-grid-wrap">
        {pages > 1 && (
          <button
            className="ds-nav-btn ds-nav-btn--prev"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div className="ds-grid">
          {visible.map(book => (
            <DealCard key={book.id} book={book} />
          ))}
        </div>

        {pages > 1 && (
          <button
            className="ds-nav-btn ds-nav-btn--next"
            onClick={() => setPage(p => Math.min(pages - 1, p + 1))}
            disabled={page === pages - 1}
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* page dots */}
      {pages > 1 && (
        <div className="ds-dots">
          {Array.from({length: pages}).map((_, i) => (
            <button
              key={i}
              className={`ds-dot ${i === page ? 'ds-dot--active' : ''}`}
              onClick={() => setPage(i)}
              aria-label={`Page ${i+1}`}
            />
          ))}
        </div>
      )}

      <style>{`
        .ds-section { display:flex;flex-direction:column;gap:20px; }

        /* header */
        .ds-header { display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap; }
        .ds-header-left { display:flex;align-items:center;gap:12px; }
        .ds-header-icon { width:44px;height:44px;border-radius:var(--radius-md);background:rgba(192,57,43,.1);color:var(--danger);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .ds-title-lg { font-family:var(--font-display);font-size:24px;font-weight:600;color:var(--text-primary); }
        .ds-title-sm { font-family:var(--font-display);font-size:18px;font-weight:600;color:var(--text-primary); }
        .ds-subtitle { font-size:13px;color:var(--text-muted);margin-top:2px; }
        .ds-header-right { display:flex;align-items:center;gap:16px;flex-wrap:wrap; }
        .ds-view-all { display:flex;align-items:center;gap:5px;font-size:13px;font-weight:500;color:var(--accent);text-decoration:none;white-space:nowrap;transition:gap .15s; }
        .ds-view-all:hover { gap:8px; }

        /* countdown */
        .ds-countdown { display:flex;align-items:center;gap:6px;padding:8px 14px;background:var(--brand);border-radius:var(--radius-md); }
        .ds-countdown-icon { color:var(--accent);flex-shrink:0; }
        .ds-countdown-label { font-size:11px;color:rgba(255,255,255,.5);margin-right:2px; }
        .ds-time-block { display:flex;align-items:baseline;gap:2px; }
        .ds-time-num { font-size:16px;font-weight:700;color:#fff;line-height:1; }
        .ds-time-unit { font-size:9px;color:rgba(255,255,255,.5);text-transform:uppercase; }
        .ds-time-sep { font-size:14px;font-weight:700;color:var(--accent);margin:0 1px; }

        /* banner */
        .ds-banner { background:linear-gradient(135deg,var(--brand) 0%,#1a3a6e 100%);border-radius:var(--radius-xl);padding:32px 40px;display:flex;align-items:center;justify-content:space-between;gap:24px;overflow:hidden;position:relative; }
        .ds-banner::before { content:'';position:absolute;inset:0;background:radial-gradient(ellipse 50% 80% at 85% 50%,rgba(201,169,110,.18) 0%,transparent 70%);pointer-events:none; }
        .ds-banner-left { position:relative;z-index:1;max-width:420px; }
        .ds-banner-pill { display:inline-block;background:rgba(201,169,110,.2);color:var(--accent);border:1px solid rgba(201,169,110,.3);padding:4px 12px;border-radius:99px;font-size:12px;font-weight:600;margin-bottom:12px; }
        .ds-banner-title { font-family:var(--font-display);font-size:clamp(22px,3vw,30px);font-weight:600;color:#fff;line-height:1.2;margin-bottom:8px; }
        .ds-banner-sub { font-size:14px;color:rgba(255,255,255,.6);line-height:1.5;margin-bottom:20px; }
        .ds-banner-btn { display:inline-flex; }
        .ds-banner-books { position:relative;z-index:1;display:flex;align-items:flex-end;gap:12px;flex-shrink:0; }
        .ds-banner-book { position:relative;display:block;border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-lg);transition:transform .2s; }
        .ds-banner-book:nth-child(1) { width:80px;height:112px;transform:rotate(-5deg); }
        .ds-banner-book:nth-child(2) { width:90px;height:126px;transform:rotate(0deg); }
        .ds-banner-book:nth-child(3) { width:80px;height:112px;transform:rotate(5deg); }
        .ds-banner-book:hover { transform:rotate(0deg) translateY(-6px) scale(1.06);z-index:10; }
        .ds-banner-book img { width:100%;height:100%;object-fit:cover; }
        .ds-banner-book-pct { position:absolute;top:5px;left:5px;background:var(--danger);color:#fff;font-size:9px;font-weight:700;padding:2px 5px;border-radius:3px; }

        /* grid */
        .ds-grid-wrap { position:relative; }
        .ds-grid { display:grid;grid-template-columns:repeat(5,1fr);gap:16px; }
        .ds-nav-btn { position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:var(--surface);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--text-secondary);cursor:pointer;transition:all .15s;box-shadow:var(--shadow-sm);z-index:2; }
        .ds-nav-btn:hover:not(:disabled) { border-color:var(--accent);color:var(--accent);box-shadow:var(--shadow-md); }
        .ds-nav-btn:disabled { opacity:.3;cursor:not-allowed; }
        .ds-nav-btn--prev { left:-18px; }
        .ds-nav-btn--next { right:-18px; }

        /* dots */
        .ds-dots { display:flex;gap:6px;justify-content:center; }
        .ds-dot { width:7px;height:7px;border-radius:50%;background:var(--border);border:none;cursor:pointer;transition:background .2s,transform .2s; }
        .ds-dot--active { background:var(--accent);transform:scale(1.3); }

        @media(max-width:1024px) { .ds-grid{grid-template-columns:repeat(4,1fr);} }
        @media(max-width:768px)  { .ds-banner{flex-direction:column;padding:24px;} .ds-banner-books{align-self:center;} .ds-grid{grid-template-columns:repeat(2,1fr);} .ds-header-right{flex-wrap:wrap;} }
        @media(max-width:480px)  { .ds-grid{grid-template-columns:repeat(2,1fr);} .ds-countdown{display:none;} }
      `}</style>
    </div>
  )
}