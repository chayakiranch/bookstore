import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Trash2, Minus, Plus, ArrowRight,
  ArrowLeft, Tag, ShoppingBag, Zap
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { formatPrice, discountPct } from '../../utils/helpers'
import BookCard from '../../components/customer/BookCard'
import { useBooks } from '../../context/BooksContext'

function CartRow({ item }) {
  const { updateQty, removeItem } = useCart()
  const hasDiscount = item.originalPrice > item.price
  const pct = hasDiscount ? discountPct(item.originalPrice, item.price) : 0

  return (
    <div className="ct-row">
      <Link to={`/books/${item.id}`} className="ct-cover-wrap">
        <img src={item.cover} alt={item.title} className="ct-cover" />
        {item.isEbook && <span className="ct-ebook-pill"><Zap size={10} />E-Book</span>}
      </Link>

      <div className="ct-row-body">
        <div className="ct-row-top">
          <div>
            <p className="ct-row-cat">{item.category || item.genre}</p>
            <Link to={`/books/${item.id}`} className="ct-row-title">{item.title}</Link>
            <p className="ct-row-author">by {item.author}</p>
            {hasDiscount && (
              <span className="ct-row-discount">-{pct}% off</span>
            )}
          </div>
          <button className="ct-remove-btn" onClick={() => removeItem(item.id)} aria-label="Remove">
            <Trash2 size={16} />
          </button>
        </div>

        <div className="ct-row-bottom">
          <div className="ct-qty-ctrl">
            <button className="ct-qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>
              <Minus size={13} />
            </button>
            <span className="ct-qty-val">{item.qty}</span>
            <button className="ct-qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>
              <Plus size={13} />
            </button>
          </div>
          <div className="ct-price-col">
            {hasDiscount && (
              <span className="ct-original">{formatPrice(item.originalPrice * item.qty)}</span>
            )}
            <span className="ct-price">{formatPrice(item.price * item.qty)}</span>
          </div>
        </div>
      </div>

      <style>{`
        .ct-row { display:flex;gap:20px;padding:20px 0;border-bottom:1px solid var(--border);align-items:flex-start; }
        .ct-cover-wrap { position:relative;flex-shrink:0;width:100px;height:140px;border-radius:var(--radius-md);overflow:hidden; }
        .ct-cover { width:100%;height:100%;object-fit:cover; }
        .ct-ebook-pill { position:absolute;bottom:6px;left:6px;display:flex;align-items:center;gap:3px;background:rgba(41,128,185,.85);color:#fff;font-size:9px;font-weight:600;padding:2px 6px;border-radius:4px; }
        .ct-row-body { flex:1;min-width:0;display:flex;flex-direction:column;justify-content:space-between;gap:16px; }
        .ct-row-top { display:flex;justify-content:space-between;gap:12px; }
        .ct-row-cat { font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--accent-dark);margin-bottom:4px; }
        .ct-row-title { font-size:16px;font-weight:600;color:var(--text-primary);text-decoration:none;line-height:1.3;display:block; }
        .ct-row-title:hover { color:var(--accent); }
        .ct-row-author { font-size:13px;color:var(--text-muted);margin-top:4px; }
        .ct-row-discount { display:inline-block;margin-top:6px;font-size:11px;font-weight:600;color:var(--danger);background:#fadbd8;padding:2px 7px;border-radius:4px; }
        .ct-remove-btn { flex-shrink:0;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:var(--radius-md);color:var(--text-muted);background:none;border:none;cursor:pointer;transition:background .15s,color .15s; }
        .ct-remove-btn:hover { background:#fadbd8;color:var(--danger); }
        .ct-row-bottom { display:flex;align-items:center;justify-content:space-between; }
        .ct-qty-ctrl { display:flex;align-items:center;border:1.5px solid var(--border);border-radius:var(--radius-md);overflow:hidden; }
        .ct-qty-btn { width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:var(--bg-alt);border:none;cursor:pointer;color:var(--text-secondary);transition:background .15s; }
        .ct-qty-btn:hover { background:var(--border); }
        .ct-qty-val { min-width:40px;text-align:center;font-size:15px;font-weight:600;color:var(--text-primary); }
        .ct-price-col { display:flex;align-items:baseline;gap:8px; }
        .ct-original { font-size:13px;color:var(--text-muted);text-decoration:line-through; }
        .ct-price { font-size:18px;font-weight:700;color:var(--text-primary); }
      `}</style>
    </div>
  )
}

export default function Cart() {
  const { items, itemCount, total, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { books } = useBooks()
  const navigate = useNavigate()

  const shipping = total >= 35 ? 0 : 4.99
  const savings  = items.reduce((s, i) => s + Math.max(0, (i.originalPrice - i.price) * i.qty), 0)
  const grandTotal = total + shipping

  const suggested = books
    .filter(b => !items.find(i => i.id === b.id))
    .sort(() => Math.random() - .5)
    .slice(0, 4)

  return (
    <div className="ct-page">
      <div className="ct-page-head">
        <div className="container ct-head-inner">
          <h1 className="ct-page-title">
            <ShoppingCart size={28} />
            Shopping Cart
          </h1>
          {itemCount > 0 && (
            <button className="ct-clear-all" onClick={clearCart}>
              <Trash2 size={14} /> Clear all
            </button>
          )}
        </div>
      </div>

      <div className="container ct-body">
        {items.length === 0 ? (
          <div className="ct-empty">
            <div className="ct-empty-icon"><ShoppingBag size={52} /></div>
            <h2 className="ct-empty-title">Your cart is empty</h2>
            <p className="ct-empty-desc">Start adding some books to your cart!</p>
            <Link to="/books" className="btn btn-accent btn-lg">
              <ArrowLeft size={18} /> Browse books
            </Link>
          </div>
        ) : (
          <div className="ct-layout">
            {/* ── items ── */}
            <div className="ct-items-col">
              <div className="ct-items-header">
                <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                <Link to="/books" className="ct-continue-link">
                  <ArrowLeft size={13} /> Continue shopping
                </Link>
              </div>

              {/* free shipping bar */}
              {shipping > 0 ? (
                <div className="ct-ship-bar">
                  <div className="ct-ship-bar-text">
                    <Tag size={13} />
                    <span>Add <strong>{formatPrice(35 - total)}</strong> more for free shipping</span>
                  </div>
                  <div className="ct-ship-track">
                    <div className="ct-ship-fill" style={{ width: `${Math.min((total / 35) * 100, 100)}%` }} />
                  </div>
                </div>
              ) : (
                <div className="ct-ship-unlocked">🎉 You've unlocked <strong>free shipping!</strong></div>
              )}

              {/* cart rows */}
              <div className="ct-rows">
                {items.map(item => <CartRow key={item.id} item={item} />)}
              </div>
            </div>

            {/* ── summary ── */}
            <div className="ct-summary-col">
              <div className="ct-summary-card card">
                <h3 className="ct-summary-heading">Order Summary</h3>

                <div className="ct-summary-rows">
                  <div className="ct-sum-row">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="ct-sum-row ct-sum-row--savings">
                      <span>Savings</span>
                      <span>-{formatPrice(savings)}</span>
                    </div>
                  )}
                  <div className="ct-sum-row">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'ct-free' : ''}>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="ct-sum-row">
                    <span>Tax (est.)</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="ct-sum-total">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>

                <button
                  className="btn btn-accent btn-full btn-lg ct-checkout-btn"
                  onClick={() => isAuthenticated ? navigate('/checkout') : navigate('/auth/login')}
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                  <ArrowRight size={18} />
                </button>

                <div className="ct-secure-badges">
                  <span>🔒 SSL Secure</span>
                  <span>📦 Free returns</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── suggested books ── */}
        {suggested.length > 0 && (
          <div className="ct-suggested">
            <h2 className="ct-suggested-title">You might also like</h2>
            <div className="ct-suggested-grid">
              {suggested.map(b => <BookCard key={b.id} book={b} variant="grid" />)}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .ct-page { min-height: 70vh; }
        .ct-page-head { background:var(--brand);padding:28px 0;border-bottom:1px solid rgba(255,255,255,.08); }
        .ct-head-inner { display:flex;align-items:center;justify-content:space-between;gap:16px; }
        .ct-page-title { display:flex;align-items:center;gap:12px;font-family:var(--font-display);font-size:28px;font-weight:600;color:#fff; }
        .ct-clear-all { display:flex;align-items:center;gap:6px;font-size:13px;color:rgba(255,255,255,.5);background:none;border:1px solid rgba(255,255,255,.15);padding:6px 12px;border-radius:var(--radius-md);cursor:pointer;transition:all .15s;font-family:var(--font-body); }
        .ct-clear-all:hover { color:var(--danger);border-color:var(--danger);background:rgba(192,57,43,.1); }
        .ct-body { padding-top:32px;padding-bottom:60px; }
        .ct-empty { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:80px 24px;text-align:center; }
        .ct-empty-icon { width:96px;height:96px;border-radius:50%;background:var(--bg-alt);display:flex;align-items:center;justify-content:center;color:var(--text-muted); }
        .ct-empty-title { font-family:var(--font-display);font-size:26px;font-weight:600; }
        .ct-empty-desc { font-size:15px;color:var(--text-muted); }
        .ct-layout { display:grid;grid-template-columns:1fr 340px;gap:32px;align-items:flex-start; }
        .ct-items-col { display:flex;flex-direction:column;gap:16px; }
        .ct-items-header { display:flex;align-items:center;justify-content:space-between;font-size:14px;color:var(--text-secondary); }
        .ct-continue-link { display:flex;align-items:center;gap:5px;font-size:13px;color:var(--accent);text-decoration:none;transition:gap .15s; }
        .ct-continue-link:hover { gap:8px; }
        .ct-ship-bar { background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:14px 16px; }
        .ct-ship-bar-text { display:flex;align-items:center;gap:7px;font-size:13px;color:var(--text-secondary);margin-bottom:10px; }
        .ct-ship-bar-text strong { color:var(--text-primary); }
        .ct-ship-track { height:5px;background:var(--border);border-radius:99px;overflow:hidden; }
        .ct-ship-fill { height:100%;background:var(--success);border-radius:99px;transition:width .4s ease; }
        .ct-ship-unlocked { background:#d5f5e3;border:1px solid #a9dfbf;border-radius:var(--radius-md);padding:12px 16px;font-size:13px;color:#1e8449; }
        .ct-rows { background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:0 20px; }
        .ct-summary-col { position:sticky;top:calc(var(--header-h) + 20px); }
        .ct-summary-card { display:flex;flex-direction:column;gap:20px; }
        .ct-summary-heading { font-family:var(--font-display);font-size:20px;font-weight:600;color:var(--text-primary); }
        .ct-summary-rows { display:flex;flex-direction:column;gap:12px; }
        .ct-sum-row { display:flex;justify-content:space-between;font-size:14px;color:var(--text-secondary); }
        .ct-sum-row--savings { color:var(--success);font-weight:500; }
        .ct-free { color:var(--success);font-weight:600; }
        .ct-sum-total { display:flex;justify-content:space-between;font-size:18px;font-weight:700;color:var(--text-primary);padding-top:16px;border-top:1px solid var(--border); }
        .ct-checkout-btn { justify-content:center;font-size:15px; }
        .ct-secure-badges { display:flex;justify-content:center;gap:16px;font-size:11px;color:var(--text-muted); }
        .ct-suggested { margin-top:56px; }
        .ct-suggested-title { font-family:var(--font-display);font-size:22px;font-weight:600;margin-bottom:20px; }
        .ct-suggested-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:20px; }
        @media(max-width:1024px) { .ct-layout{grid-template-columns:1fr;} .ct-summary-col{position:static;} .ct-suggested-grid{grid-template-columns:repeat(2,1fr);} }
        @media(max-width:640px) { .ct-suggested-grid{grid-template-columns:repeat(2,1fr);} }
      `}</style>
    </div>
  )
}