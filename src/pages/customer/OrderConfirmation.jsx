import { useEffect } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import {
  CheckCircle, Package, Mail, ArrowRight,
  BookOpen, Home, ShoppingBag, Printer
} from 'lucide-react'
import { useBooks } from '../../context/BooksContext'
import { formatPrice, formatDate } from '../../utils/helpers'

export default function OrderConfirmation() {
  const { orderId }  = useParams()
  const { state }    = useLocation()
  const { orders }   = useBooks()
  const navigate     = useNavigate()

  // get order from location state or from context
  const order = state?.order || orders.find(o => o.id === orderId)

  useEffect(() => {
    if (!order) navigate('/')
  }, [order, navigate])

  if (!order) return null

  return (
    <div className="oc-page">
      {/* ── hero ── */}
      <div className="oc-hero">
        <div className="oc-hero-bg" />
        <div className="oc-hero-inner">
          <div className="oc-success-icon">
            <CheckCircle size={48} />
          </div>
          <h1 className="oc-hero-title">Order Confirmed!</h1>
          <p className="oc-hero-sub">
            Thank you for your purchase. Your books are on their way!
          </p>
          <div className="oc-order-id-badge">
            Order ID: <strong>{order.id}</strong>
          </div>
        </div>
      </div>

      <div className="container oc-body">
        <div className="oc-layout">

          {/* ── order details ── */}
          <div className="oc-main-col">

            {/* timeline */}
            <div className="card oc-card">
              <h2 className="oc-card-title"><Package size={18} />What happens next?</h2>
              <div className="oc-timeline">
                {[
                  { icon: CheckCircle, label: 'Order confirmed',       sub: 'Your order has been received',       done: true  },
                  { icon: Package,     label: 'Processing',            sub: 'We\'re preparing your books',        done: false },
                  { icon: Mail,        label: 'Confirmation email',    sub: 'Sent to ' + order.address?.email,    done: true  },
                  { icon: ShoppingBag, label: 'Out for delivery',      sub: '5–7 business days',                  done: false },
                ].map((s, i) => {
                  const Icon = s.icon
                  return (
                    <div key={i} className={`oc-tl-item ${s.done ? 'oc-tl-item--done' : ''}`}>
                      <div className="oc-tl-dot">
                        <Icon size={14} />
                      </div>
                      {i < 3 && <div className="oc-tl-line" />}
                      <div className="oc-tl-body">
                        <p className="oc-tl-label">{s.label}</p>
                        <p className="oc-tl-sub">{s.sub}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* shipping address */}
            {order.address && (
              <div className="card oc-card">
                <h2 className="oc-card-title"><Home size={18} />Shipping to</h2>
                <div className="oc-address">
                  <p className="oc-address-name">{order.address.firstName} {order.address.lastName}</p>
                  <p>{order.address.address}</p>
                  <p>{order.address.city}, {order.address.zip}</p>
                  <p>{order.address.email}</p>
                </div>
              </div>
            )}

            {/* ordered items */}
            <div className="card oc-card">
              <h2 className="oc-card-title"><BookOpen size={18} />Items ordered</h2>
              <div className="oc-items">
                {order.items?.map(item => (
                  <div key={item.id} className="oc-item">
                    <Link to={`/books/${item.id}`}>
                      <img src={item.cover} alt={item.title} className="oc-item-cover" />
                    </Link>
                    <div className="oc-item-body">
                      <Link to={`/books/${item.id}`} className="oc-item-title">{item.title}</Link>
                      <p className="oc-item-author">by {item.author}</p>
                      <p className="oc-item-qty">Qty: {item.qty}</p>
                    </div>
                    <span className="oc-item-price">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── receipt sidebar ── */}
          <div className="oc-side-col">
            <div className="card oc-receipt">
              <h3 className="oc-receipt-title">Receipt</h3>

              <div className="oc-receipt-meta">
                <div className="oc-receipt-row">
                  <span>Order date</span>
                  <span>{formatDate(order.date)}</span>
                </div>
                <div className="oc-receipt-row">
                  <span>Order ID</span>
                  <span className="oc-receipt-id">{order.id.slice(0, 12)}…</span>
                </div>
                <div className="oc-receipt-row">
                  <span>Status</span>
                  <span className="badge badge-success">Confirmed</span>
                </div>
              </div>

              <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'8px 0' }} />

              <div className="oc-receipt-rows">
                <div className="oc-receipt-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="oc-receipt-row">
                  <span>Shipping</span>
                  <span className={order.shipping === 0 ? 'oc-free' : ''}>
                    {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
                  </span>
                </div>
                <div className="oc-receipt-row">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
              </div>

              <div className="oc-receipt-total">
                <span>Total paid</span>
                <span>{formatPrice(order.total)}</span>
              </div>

              <div className="oc-receipt-actions">
                <button
                  className="btn btn-outline btn-full"
                  onClick={() => window.print()}
                >
                  <Printer size={15} /> Print receipt
                </button>
              </div>
            </div>

            <div className="oc-cta-links">
              <Link to="/orders" className="btn btn-primary btn-full">
                <Package size={16} /> View all orders
              </Link>
              <Link to="/books" className="btn btn-outline btn-full">
                <ArrowRight size={16} /> Continue shopping
              </Link>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .oc-page { min-height: 80vh; }

        /* hero */
        .oc-hero { background:linear-gradient(135deg,var(--brand) 0%,#0f3460 100%);padding:48px 24px;text-align:center;position:relative;overflow:hidden; }
        .oc-hero-bg { position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 50% 100%,rgba(201,169,110,.15) 0%,transparent 70%);pointer-events:none; }
        .oc-hero-inner { position:relative;z-index:1;max-width:600px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:14px; }
        .oc-success-icon { width:80px;height:80px;border-radius:50%;background:rgba(39,174,96,.15);border:2px solid rgba(39,174,96,.4);display:flex;align-items:center;justify-content:center;color:#2ecc71;animation:oc-pop .4s cubic-bezier(.34,1.56,.64,1); }
        @keyframes oc-pop { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        .oc-hero-title { font-family:var(--font-display);font-size:clamp(28px,5vw,42px);font-weight:600;color:#fff;line-height:1.2; }
        .oc-hero-sub { font-size:16px;color:rgba(255,255,255,.65);max-width:440px; }
        .oc-order-id-badge { background:rgba(201,169,110,.15);border:1px solid rgba(201,169,110,.25);color:var(--accent);font-size:12px;padding:6px 16px;border-radius:99px; }

        /* body */
        .oc-body { padding:36px 0 60px; }
        .oc-layout { display:grid;grid-template-columns:1fr 320px;gap:28px;align-items:flex-start; }
        .oc-main-col { display:flex;flex-direction:column;gap:20px; }
        .oc-card { display:flex;flex-direction:column;gap:16px; }
        .oc-card-title { display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-size:18px;font-weight:600; }

        /* timeline */
        .oc-timeline { display:flex;flex-direction:column;gap:0; }
        .oc-tl-item { display:grid;grid-template-columns:32px 2px 1fr;gap:0 12px;align-items:flex-start;padding-bottom:20px; }
        .oc-tl-item:last-child { padding-bottom:0; }
        .oc-tl-dot { width:32px;height:32px;border-radius:50%;border:2px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:center;color:var(--text-muted);grid-row:1; }
        .oc-tl-item--done .oc-tl-dot { background:var(--success);border-color:var(--success);color:#fff; }
        .oc-tl-line { width:2px;background:var(--border);grid-column:2;grid-row:1/3;margin:0 auto;min-height:28px;border-radius:99px; }
        .oc-tl-item--done .oc-tl-line { background:var(--success); }
        .oc-tl-body { grid-column:3;grid-row:1; }
        .oc-tl-label { font-size:14px;font-weight:500;color:var(--text-primary); }
        .oc-tl-sub { font-size:12px;color:var(--text-muted);margin-top:2px; }

        /* address */
        .oc-address { background:var(--bg-alt);border-radius:var(--radius-md);padding:14px 16px;display:flex;flex-direction:column;gap:3px;font-size:14px;color:var(--text-secondary); }
        .oc-address-name { font-weight:600;color:var(--text-primary); }

        /* items */
        .oc-items { display:flex;flex-direction:column;gap:0; }
        .oc-item { display:flex;gap:14px;align-items:center;padding:14px 0;border-bottom:1px solid var(--border); }
        .oc-item:last-child { border-bottom:none; }
        .oc-item-cover { width:52px;height:72px;object-fit:cover;border-radius:6px;flex-shrink:0; }
        .oc-item-body { flex:1;min-width:0; }
        .oc-item-title { font-size:14px;font-weight:500;color:var(--text-primary);text-decoration:none;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .oc-item-title:hover { color:var(--accent); }
        .oc-item-author { font-size:12px;color:var(--text-muted);margin-top:2px; }
        .oc-item-qty { font-size:12px;color:var(--text-muted);margin-top:2px; }
        .oc-item-price { font-size:15px;font-weight:700;color:var(--text-primary);flex-shrink:0; }

        /* receipt */
        .oc-side-col { position:sticky;top:calc(var(--header-h) + 20px);display:flex;flex-direction:column;gap:16px; }
        .oc-receipt { display:flex;flex-direction:column;gap:14px; }
        .oc-receipt-title { font-family:var(--font-display);font-size:18px;font-weight:600; }
        .oc-receipt-meta { display:flex;flex-direction:column;gap:10px; }
        .oc-receipt-row { display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--text-secondary); }
        .oc-receipt-id { font-family:monospace;font-size:11px;color:var(--text-muted); }
        .oc-receipt-rows { display:flex;flex-direction:column;gap:8px; }
        .oc-free { color:var(--success);font-weight:600; }
        .oc-receipt-total { display:flex;justify-content:space-between;font-size:17px;font-weight:700;color:var(--text-primary);padding-top:12px;border-top:1px solid var(--border); }
        .oc-receipt-actions { margin-top:4px; }
        .oc-cta-links { display:flex;flex-direction:column;gap:8px; }

        @media(max-width:1024px) { .oc-layout{grid-template-columns:1fr;} .oc-side-col{position:static;} }
      `}</style>
    </div>
  )
}