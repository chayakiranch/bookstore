import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Zap, BookOpen } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatPrice, discountPct } from '../../utils/helpers'

// ─── MiniStars ────────────────────────────────────────────────────────────────
function MiniStars({ rating }) {
  return (
    <div className="bc-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={11}
          className={i <= Math.round(rating) ? 'bc-star--filled' : 'bc-star--empty'}
        />
      ))}
    </div>
  )
}

// ─── BookCard ─────────────────────────────────────────────────────────────────
// variant: 'grid' (default) | 'list' | 'compact'
export default function BookCard({ book, variant = 'grid', showBadge = true }) {
  const { addItem, items, openCart } = useCart()

  if (!book) return null

  const inCart      = items.some(i => i.id === book.id)
  const hasDiscount = book.originalPrice > book.price
  const pct         = hasDiscount ? discountPct(book.originalPrice, book.price) : 0

  const BADGE_CONFIG = {
    'Best Sellers':      { label: 'Best Seller',  color: '#e67e22' },
    'Award Winners':     { label: 'Award Winner', color: '#8e44ad' },
    'New Arrivals':      { label: 'New',           color: '#27ae60' },
    'Deals & Discounts': { label: `${pct}% OFF`,  color: '#c0392b' },
    'E-Books':           { label: 'E-Book',        color: '#2980b9' },
  }
  const primaryTag = book.tags?.find(t => BADGE_CONFIG[t])
  const badgeCfg   = primaryTag ? BADGE_CONFIG[primaryTag] : null

  const handleAddToCart = e => {
    e.preventDefault()
    e.stopPropagation()
    addItem(book)
    openCart()
  }

  // ── LIST variant ──────────────────────────────────────────────────────────
  if (variant === 'list') {
    return (
      <Link to={`/books/${book.id}`} className="bc-list">
        <div className="bc-list-cover-wrap">
          <img src={book.cover} alt={book.title} className="bc-list-cover" />
          {showBadge && badgeCfg && (
            <span className="bc-ribbon" style={{ background: badgeCfg.color }}>{badgeCfg.label}</span>
          )}
        </div>
        <div className="bc-list-body">
          <div>
            <p className="bc-list-category">{book.category || book.genre}</p>
            <h3 className="bc-list-title">{book.title}</h3>
            <p className="bc-list-author">by {book.author}</p>
            <div className="bc-list-meta">
              <MiniStars rating={book.rating} />
              <span className="bc-rating-num">{book.rating}</span>
              <span className="bc-reviews">({book.reviews?.toLocaleString()})</span>
              {book.isEbook && <span className="bc-ebook-tag"><BookOpen size={10} />E-Book</span>}
            </div>
            <p className="bc-list-desc">{book.description}</p>
          </div>
          <div className="bc-list-footer">
            <div className="bc-price-group">
              <span className="bc-price">{formatPrice(book.price)}</span>
              {hasDiscount && (
                <>
                  <span className="bc-original-price">{formatPrice(book.originalPrice)}</span>
                  <span className="bc-discount-badge">-{pct}%</span>
                </>
              )}
            </div>
            <button
              className={`btn btn-sm ${inCart ? 'btn-outline' : 'btn-accent'} bc-list-cta`}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={14} />
              {inCart ? 'In Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
        <style>{STYLES}</style>
      </Link>
    )
  }

  // ── COMPACT variant ───────────────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <Link to={`/books/${book.id}`} className="bc-compact">
        <img src={book.cover} alt={book.title} className="bc-compact-cover" />
        <div className="bc-compact-body">
          <p className="bc-compact-title">{book.title}</p>
          <p className="bc-compact-author">{book.author}</p>
          <span className="bc-price">{formatPrice(book.price)}</span>
        </div>
        <style>{STYLES}</style>
      </Link>
    )
  }

  // ── GRID variant (default) ────────────────────────────────────────────────
  return (
    <Link to={`/books/${book.id}`} className="bc-card card-hover">
      <div className="bc-cover-wrap">
        <img src={book.cover} alt={book.title} className="bc-cover" />
        <div className="bc-cover-overlay">
          <button className="bc-quick-add" onClick={handleAddToCart} aria-label="Add to cart">
            <ShoppingCart size={16} />
            {inCart ? 'In Cart' : 'Add to Cart'}
          </button>
          <button className="bc-wishlist" onClick={e => { e.preventDefault(); e.stopPropagation() }} aria-label="Wishlist">
            <Heart size={15} />
          </button>
        </div>
        <div className="bc-badges">
          {showBadge && badgeCfg && (
            <span className="bc-ribbon" style={{ background: badgeCfg.color }}>{badgeCfg.label}</span>
          )}
          {hasDiscount && primaryTag !== 'Deals & Discounts' && (
            <span className="bc-ribbon bc-ribbon--discount">-{pct}%</span>
          )}
        </div>
        {book.isEbook && <span className="bc-ebook-pill"><Zap size={9} />E-Book</span>}
      </div>

      <div className="bc-body">
        <p className="bc-category">{book.category || book.genre}</p>
        <h3 className="bc-title">{book.title}</h3>
        <p className="bc-author">by {book.author}</p>
        <div className="bc-meta">
          <MiniStars rating={book.rating} />
          <span className="bc-rating-num">{book.rating}</span>
          <span className="bc-reviews">({book.reviews?.toLocaleString()})</span>
        </div>
        <div className="bc-footer">
          <div className="bc-price-group">
            <span className="bc-price">{formatPrice(book.price)}</span>
            {hasDiscount && (
              <span className="bc-original-price">{formatPrice(book.originalPrice)}</span>
            )}
          </div>
          {inCart && (
            <span className="bc-in-cart-indicator"><ShoppingCart size={11} />In cart</span>
          )}
        </div>
      </div>

      <style>{STYLES}</style>
    </Link>
  )
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const STYLES = `
  .bc-card { display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;text-decoration:none;color:inherit;transition:transform .2s,box-shadow .2s;cursor:pointer; }
  .bc-card:hover { transform:translateY(-3px);box-shadow:var(--shadow-md); }
  .bc-cover-wrap { position:relative;aspect-ratio:2/3;background:var(--bg-alt);overflow:hidden;flex-shrink:0; }
  .bc-cover { width:100%;height:100%;object-fit:cover;transition:transform .35s ease; }
  .bc-card:hover .bc-cover { transform:scale(1.04); }
  .bc-cover-overlay { position:absolute;inset:0;background:rgba(26,26,46,.55);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;opacity:0;transition:opacity .2s;backdrop-filter:blur(2px); }
  .bc-card:hover .bc-cover-overlay { opacity:1; }
  .bc-quick-add { display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:var(--radius-md);background:var(--accent);color:var(--brand);font-size:13px;font-weight:500;border:none;cursor:pointer;font-family:var(--font-body);transform:translateY(6px);transition:transform .2s,background .15s; }
  .bc-card:hover .bc-quick-add { transform:translateY(0); }
  .bc-quick-add:hover { background:var(--accent-dark);color:#fff; }
  .bc-wishlist { position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.15);border:none;display:flex;align-items:center;justify-content:center;color:#fff;cursor:pointer;backdrop-filter:blur(4px);transition:background .15s; }
  .bc-wishlist:hover { background:rgba(255,255,255,.3); }
  .bc-badges { position:absolute;top:10px;left:10px;display:flex;flex-direction:column;gap:4px; }
  .bc-ribbon { display:inline-block;padding:3px 8px;border-radius:4px;font-size:10px;font-weight:600;color:#fff;letter-spacing:.04em;text-transform:uppercase; }
  .bc-ribbon--discount { background:var(--danger)!important; }
  .bc-ebook-pill { position:absolute;bottom:8px;left:8px;display:flex;align-items:center;gap:3px;background:rgba(41,128,185,.85);color:#fff;font-size:9px;font-weight:600;padding:2px 6px;border-radius:4px;backdrop-filter:blur(4px);letter-spacing:.04em;text-transform:uppercase; }
  .bc-body { padding:14px;display:flex;flex-direction:column;gap:4px;flex:1; }
  .bc-category { font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--accent-dark); }
  .bc-title { font-size:14px;font-weight:600;color:var(--text-primary);line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
  .bc-author { font-size:12px;color:var(--text-muted); }
  .bc-meta { display:flex;align-items:center;gap:4px;margin-top:4px; }
  .bc-stars { display:flex;gap:1px; }
  .bc-star--filled { color:#f59e0b;fill:#f59e0b; }
  .bc-star--empty { color:#d1d5db; }
  .bc-rating-num { font-size:11px;font-weight:600;color:var(--text-primary); }
  .bc-reviews { font-size:11px;color:var(--text-muted); }
  .bc-footer { display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:10px; }
  .bc-price-group { display:flex;align-items:baseline;gap:6px;flex-wrap:wrap; }
  .bc-price { font-size:15px;font-weight:700;color:var(--text-primary); }
  .bc-original-price { font-size:12px;color:var(--text-muted);text-decoration:line-through; }
  .bc-discount-badge { font-size:11px;font-weight:600;color:var(--danger);background:#fadbd8;padding:1px 5px;border-radius:4px; }
  .bc-in-cart-indicator { display:flex;align-items:center;gap:4px;font-size:11px;font-weight:500;color:var(--success); }
  .bc-ebook-tag { display:inline-flex;align-items:center;gap:3px;font-size:10px;background:#d6eaf8;color:#1a5276;padding:1px 5px;border-radius:4px;font-weight:500; }
  .bc-list { display:flex;gap:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px;text-decoration:none;color:inherit;transition:box-shadow .2s,transform .2s; }
  .bc-list:hover { box-shadow:var(--shadow-md);transform:translateY(-1px); }
  .bc-list-cover-wrap { position:relative;flex-shrink:0;width:90px; }
  .bc-list-cover { width:90px;height:130px;object-fit:cover;border-radius:var(--radius-md); }
  .bc-list-body { flex:1;display:flex;flex-direction:column;justify-content:space-between;gap:8px;min-width:0; }
  .bc-list-category { font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--accent-dark); }
  .bc-list-title { font-size:16px;font-weight:600;color:var(--text-primary);line-height:1.3; }
  .bc-list-author { font-size:13px;color:var(--text-muted); }
  .bc-list-meta { display:flex;align-items:center;gap:6px;flex-wrap:wrap; }
  .bc-list-desc { font-size:13px;color:var(--text-secondary);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
  .bc-list-footer { display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap; }
  .bc-list-cta { flex-shrink:0; }
  .bc-compact { display:flex;gap:10px;align-items:center;padding:8px;border-radius:var(--radius-md);text-decoration:none;color:inherit;transition:background .15s; }
  .bc-compact:hover { background:var(--bg-alt); }
  .bc-compact-cover { width:40px;height:56px;object-fit:cover;border-radius:4px;flex-shrink:0; }
  .bc-compact-body { flex:1;min-width:0; }
  .bc-compact-title { font-size:13px;font-weight:500;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
  .bc-compact-author { font-size:11px;color:var(--text-muted);margin-top:1px; }
`