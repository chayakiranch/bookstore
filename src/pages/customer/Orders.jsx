import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, ChevronDown, ChevronRight,
  BookOpen, ShoppingBag, ArrowRight
} from 'lucide-react'
import { useBooks } from '../../context/BooksContext'
import { useAuth }  from '../../context/AuthContext'
import { formatPrice, formatDate } from '../../utils/helpers'

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    confirmed:  { cls: 'badge-success', label: 'Confirmed' },
    processing: { cls: 'badge-warning', label: 'Processing' },
    shipped:    { cls: 'badge-info',    label: 'Shipped' },
    delivered:  { cls: 'badge-success', label: 'Delivered' },
    cancelled:  { cls: 'badge-danger',  label: 'Cancelled' },
  }
  const cfg = map[status] || { cls: 'badge-muted', label: status }
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
}

// ─── Single order card ────────────────────────────────────────────────────────
function OrderCard({ order }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="or-card card">
      {/* header row */}
      <div className="or-card-head" onClick={() => setOpen(o => !o)}>
        <div className="or-card-meta">
          <div className="or-card-icon"><Package size={18} /></div>
          <div>
            <p className="or-card-id">Order #{order.id.slice(0, 12)}…</p>
            <p className="or-card-date">{formatDate(order.date)}</p>
          </div>
        </div>
        <div className="or-card-right">
          <StatusBadge status={order.status} />
          <span className="or-card-total">{formatPrice(order.total)}</span>
          <span className="or-card-items">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
          {open
            ? <ChevronDown size={16} className="or-chevron or-chevron--open" />
            : <ChevronRight size={16} className="or-chevron" />
          }
        </div>
      </div>

      {/* expanded details */}
      {open && (
        <div className="or-card-body">
          <div className="or-items">
            {order.items?.map(item => (
              <div key={item.id} className="or-item">
                <Link to={`/books/${item.id}`}>
                  <img src={item.cover} alt={item.title} className="or-item-cover" />
                </Link>
                <div className="or-item-info">
                  <Link to={`/books/${item.id}`} className="or-item-title">{item.title}</Link>
                  <p className="or-item-author">by {item.author}</p>
                  <p className="or-item-qty">Qty: {item.qty} · {formatPrice(item.price)} each</p>
                </div>
                <span className="or-item-price">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <div className="or-breakdown">
            <div className="or-breakdown-row">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="or-breakdown-row">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
            </div>
            {order.tax > 0 && (
              <div className="or-breakdown-row">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
            )}
            <div className="or-breakdown-row or-breakdown-total">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {order.address && (
            <div className="or-address">
              <p className="or-address-label">Shipped to</p>
              <p>{order.address.firstName} {order.address.lastName}</p>
              <p>{order.address.address}, {order.address.city} {order.address.zip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Orders page ──────────────────────────────────────────────────────────────
export default function Orders() {
  const { orders }        = useBooks()
  const { user }          = useAuth()
  const [filter, setFilter] = useState('all')

  // filter by current user
  const myOrders = orders.filter(o => o.userId === user?.id)

  const STATUS_FILTERS = ['all', 'confirmed', 'processing', 'shipped', 'delivered']

  const filtered = filter === 'all'
    ? myOrders
    : myOrders.filter(o => o.status === filter)

  return (
    <div className="or-page">
      <div className="or-page-head">
        <div className="container or-head-inner">
          <div>
            <h1 className="or-title"><Package size={26} />My Orders</h1>
            <p className="or-subtitle">{myOrders.length} order{myOrders.length !== 1 ? 's' : ''} placed</p>
          </div>
        </div>
      </div>

      <div className="container or-body">
        {myOrders.length === 0 ? (
          <div className="or-empty">
            <div className="or-empty-icon"><ShoppingBag size={52} /></div>
            <h2 className="or-empty-title">No orders yet</h2>
            <p className="or-empty-desc">When you place an order it will appear here.</p>
            <Link to="/books" className="btn btn-accent btn-lg">
              Browse books <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            {/* status filter tabs */}
            <div className="or-filters">
              {STATUS_FILTERS.map(f => (
                <button
                  key={f}
                  className={`or-filter-btn ${filter === f ? 'or-filter-btn--active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="or-empty or-empty--small">
                <BookOpen size={36} style={{ color:'var(--text-muted)' }} />
                <p style={{ color:'var(--text-muted)',fontSize:14 }}>No {filter} orders found.</p>
              </div>
            ) : (
              <div className="or-list">
                {filtered.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .or-page { min-height: 70vh; }
        .or-page-head { background:var(--brand);padding:28px 0; }
        .or-head-inner { display:flex;align-items:flex-end;justify-content:space-between;gap:16px; }
        .or-title { display:flex;align-items:center;gap:12px;font-family:var(--font-display);font-size:28px;font-weight:600;color:#fff; }
        .or-subtitle { font-size:13px;color:rgba(255,255,255,.5);margin-top:4px; }
        .or-body { padding:32px 0 60px;display:flex;flex-direction:column;gap:24px; }

        /* empty */
        .or-empty { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:80px 24px;text-align:center; }
        .or-empty--small { padding:40px 24px; }
        .or-empty-icon { width:96px;height:96px;border-radius:50%;background:var(--bg-alt);display:flex;align-items:center;justify-content:center;color:var(--text-muted); }
        .or-empty-title { font-family:var(--font-display);font-size:24px;font-weight:600; }
        .or-empty-desc { font-size:14px;color:var(--text-muted); }

        /* filter tabs */
        .or-filters { display:flex;gap:8px;flex-wrap:wrap; }
        .or-filter-btn { padding:6px 16px;border-radius:99px;font-size:13px;font-weight:500;border:1.5px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;transition:all .15s;font-family:var(--font-body); }
        .or-filter-btn:hover { border-color:var(--accent);color:var(--accent); }
        .or-filter-btn--active { background:var(--brand);border-color:var(--brand);color:#fff; }

        /* order list */
        .or-list { display:flex;flex-direction:column;gap:16px; }

        /* order card */
        .or-card { display:flex;flex-direction:column;gap:0;overflow:hidden;padding:0; }
        .or-card-head { display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;cursor:pointer;transition:background .15s;flex-wrap:wrap; }
        .or-card-head:hover { background:var(--bg-alt); }
        .or-card-meta { display:flex;align-items:center;gap:14px; }
        .or-card-icon { width:40px;height:40px;border-radius:var(--radius-md);background:var(--brand);color:var(--accent);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .or-card-id { font-size:14px;font-weight:600;color:var(--text-primary);font-family:monospace; }
        .or-card-date { font-size:12px;color:var(--text-muted);margin-top:2px; }
        .or-card-right { display:flex;align-items:center;gap:12px;flex-wrap:wrap; }
        .or-card-total { font-size:15px;font-weight:700;color:var(--text-primary); }
        .or-card-items { font-size:12px;color:var(--text-muted); }
        .or-chevron { color:var(--text-muted);transition:transform .2s; }
        .or-chevron--open { transform:rotate(90deg); }

        /* expanded body */
        .or-card-body { border-top:1px solid var(--border);padding:20px 24px;display:flex;flex-direction:column;gap:16px; }
        .or-items { display:flex;flex-direction:column;gap:0; }
        .or-item { display:flex;gap:14px;align-items:center;padding:12px 0;border-bottom:1px solid var(--border); }
        .or-item:last-child { border-bottom:none; }
        .or-item-cover { width:52px;height:72px;object-fit:cover;border-radius:6px;flex-shrink:0; }
        .or-item-info { flex:1;min-width:0; }
        .or-item-title { font-size:14px;font-weight:500;color:var(--text-primary);text-decoration:none;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .or-item-title:hover { color:var(--accent); }
        .or-item-author { font-size:12px;color:var(--text-muted);margin-top:2px; }
        .or-item-qty { font-size:12px;color:var(--text-muted);margin-top:2px; }
        .or-item-price { font-size:14px;font-weight:600;color:var(--text-primary);flex-shrink:0; }
        .or-breakdown { background:var(--bg-alt);border-radius:var(--radius-md);padding:14px 16px;display:flex;flex-direction:column;gap:8px; }
        .or-breakdown-row { display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary); }
        .or-breakdown-total { font-size:15px;font-weight:700;color:var(--text-primary);padding-top:8px;border-top:1px solid var(--border); }
        .or-address { background:var(--bg-alt);border-radius:var(--radius-md);padding:12px 16px;font-size:13px;color:var(--text-secondary);display:flex;flex-direction:column;gap:3px; }
        .or-address-label { font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);margin-bottom:4px; }

        @media(max-width:640px) {
          .or-card-head { gap:12px; }
          .or-card-right { gap:8px; }
          .or-card-body { padding:16px; }
        }
      `}</style>
    </div>
  )
}