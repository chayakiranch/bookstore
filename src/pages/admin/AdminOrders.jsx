import { useState, useMemo } from 'react'
import {
  Package, Search, X, ChevronDown, ChevronRight,
  ShoppingBag, Filter, Calendar, DollarSign
} from 'lucide-react'
import { useBooks } from '../../context/BooksContext'
import { formatPrice, formatDate } from '../../utils/helpers'

const STATUS_OPTIONS = ['all','confirmed','processing','shipped','delivered','cancelled']

const STATUS_COLORS = {
  confirmed:  { cls: 'badge-success', label: 'Confirmed'  },
  processing: { cls: 'badge-warning', label: 'Processing' },
  shipped:    { cls: 'badge-info',    label: 'Shipped'    },
  delivered:  { cls: 'badge-success', label: 'Delivered'  },
  cancelled:  { cls: 'badge-danger',  label: 'Cancelled'  },
}

function StatusBadge({ status }) {
  const cfg = STATUS_COLORS[status] || { cls:'badge-muted', label: status }
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
}

function OrderRow({ order }) {
  const [open, setOpen] = useState(false)
  const itemCount = order.items?.reduce((s,i) => s + i.qty, 0) || 0

  return (
    <>
      <tr className="ao-row" onClick={() => setOpen(o => !o)}>
        <td className="ao-td">
          <div className="ao-order-id">
            <div className="ao-order-icon"><Package size={14} /></div>
            <span>#{order.id.slice(0,12)}…</span>
          </div>
        </td>
        <td className="ao-td ao-td-date hide-mobile">{formatDate(order.date)}</td>
        <td className="ao-td hide-mobile">
          <div className="ao-customer">
            <div className="ao-avatar">
              {order.address?.firstName?.[0] || 'C'}
            </div>
            <div>
              <p className="ao-customer-name">
                {order.address ? `${order.address.firstName} ${order.address.lastName}` : 'Guest'}
              </p>
              <p className="ao-customer-email">{order.address?.email || '—'}</p>
            </div>
          </div>
        </td>
        <td className="ao-td">
          <span className="ao-items-count">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
        </td>
        <td className="ao-td">
          <StatusBadge status={order.status} />
        </td>
        <td className="ao-td">
          <span className="ao-total">{formatPrice(order.total)}</span>
        </td>
        <td className="ao-td ao-td-expand">
          {open ? <ChevronDown size={15} className="ao-chevron" /> : <ChevronRight size={15} className="ao-chevron" />}
        </td>
      </tr>

      {open && (
        <tr className="ao-detail-row">
          <td colSpan={7} className="ao-detail-td">
            <div className="ao-detail">
              {/* items */}
              <div className="ao-detail-section">
                <p className="ao-detail-label">Items ordered</p>
                <div className="ao-detail-items">
                  {order.items?.map(item => (
                    <div key={item.id} className="ao-detail-item">
                      <img src={item.cover} alt={item.title} className="ao-item-cover" />
                      <div className="ao-item-info">
                        <p className="ao-item-title">{item.title}</p>
                        <p className="ao-item-author">by {item.author}</p>
                        <p className="ao-item-qty">Qty: {item.qty}</p>
                      </div>
                      <span className="ao-item-price">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* shipping + summary */}
              <div className="ao-detail-cols">
                {order.address && (
                  <div className="ao-detail-section">
                    <p className="ao-detail-label">Ship to</p>
                    <p className="ao-detail-val">{order.address.firstName} {order.address.lastName}</p>
                    <p className="ao-detail-val">{order.address.address}</p>
                    <p className="ao-detail-val">{order.address.city}, {order.address.zip}</p>
                    <p className="ao-detail-val">{order.address.email}</p>
                  </div>
                )}
                <div className="ao-detail-section">
                  <p className="ao-detail-label">Summary</p>
                  <div className="ao-detail-summary">
                    <div className="ao-sum-row"><span>Subtotal</span><span>{formatPrice(order.subtotal || order.total)}</span></div>
                    <div className="ao-sum-row"><span>Shipping</span><span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping || 0)}</span></div>
                    <div className="ao-sum-row"><span>Tax</span><span>{formatPrice(order.tax || 0)}</span></div>
                    <div className="ao-sum-row ao-sum-total"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function AdminOrders() {
  const { orders } = useBooks()
  const [search,  setSearch]  = useState('')
  const [status,  setStatus]  = useState('all')
  const [sort,    setSort]    = useState('newest')
  const [page,    setPage]    = useState(1)
  const PER_PAGE = 10

  const filtered = useMemo(() => {
    let list = [...orders]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.address?.email?.toLowerCase().includes(q) ||
        `${o.address?.firstName} ${o.address?.lastName}`.toLowerCase().includes(q)
      )
    }
    if (status !== 'all') list = list.filter(o => o.status === status)
    if (sort === 'newest')    list.sort((a,b) => new Date(b.date) - new Date(a.date))
    if (sort === 'oldest')    list.sort((a,b) => new Date(a.date) - new Date(b.date))
    if (sort === 'total-desc')list.sort((a,b) => b.total - a.total)
    if (sort === 'total-asc') list.sort((a,b) => a.total - b.total)
    return list
  }, [orders, search, status, sort])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)

  const totalRevenue = orders.reduce((s,o) => s + o.total, 0)
  const avgOrder     = orders.length ? totalRevenue / orders.length : 0

  return (
    <div className="ao-page">
      {/* header */}
      <div className="ao-page-head">
        <div>
          <h1 className="ao-page-title"><Package size={22} />Orders</h1>
          <p className="ao-page-sub">{orders.length} total orders</p>
        </div>
      </div>

      {/* stat strip */}
      <div className="ao-stat-strip">
        {[
          { icon: ShoppingBag, label: 'Total Orders',   value: orders.length },
          { icon: DollarSign,  label: 'Total Revenue',  value: formatPrice(totalRevenue) },
          { icon: DollarSign,  label: 'Avg Order',      value: formatPrice(avgOrder) },
          { icon: Package,     label: 'Confirmed',
            value: orders.filter(o => o.status==='confirmed').length },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="ao-stat">
              <Icon size={16} className="ao-stat-icon" />
              <div>
                <p className="ao-stat-value">{s.value}</p>
                <p className="ao-stat-label">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* toolbar */}
      <div className="card ao-toolbar">
        <div className="ao-search-wrap">
          <Search size={14} className="ao-search-icon" />
          <input className="ao-search-input" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by order ID, name or email…" />
          {search && (
            <button className="ao-search-clear" onClick={() => setSearch('')}><X size={13} /></button>
          )}
        </div>

        <div className="ao-filters">
          <div className="ao-filter-wrap">
            <Filter size={13} />
            <select className="ao-filter-select" value={status}
              onChange={e => { setStatus(e.target.value); setPage(1) }}>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase()+s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="ao-filter-wrap">
            <Calendar size={13} />
            <select className="ao-filter-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="total-desc">Highest total</option>
              <option value="total-asc">Lowest total</option>
            </select>
          </div>
        </div>

        <span className="ao-result-count">{filtered.length} order{filtered.length!==1?'s':''}</span>
      </div>

      {/* status filter tabs */}
      <div className="ao-status-tabs">
        {STATUS_OPTIONS.map(s => (
          <button key={s}
            className={`ao-status-tab ${status===s?'ao-status-tab--active':''}`}
            onClick={() => { setStatus(s); setPage(1) }}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase()+s.slice(1)}
            <span className="ao-tab-count">
              {s === 'all' ? orders.length : orders.filter(o=>o.status===s).length}
            </span>
          </button>
        ))}
      </div>

      {/* table */}
      <div className="card ao-table-card">
        {filtered.length === 0 ? (
          <div className="ao-empty">
            <Package size={40} style={{color:'var(--text-muted)'}} />
            <p className="ao-empty-title">No orders found</p>
            <p className="ao-empty-sub">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="ao-table-wrap">
            <table className="ao-table">
              <thead>
                <tr>
                  <th className="ao-th">Order ID</th>
                  <th className="ao-th hide-mobile">Date</th>
                  <th className="ao-th hide-mobile">Customer</th>
                  <th className="ao-th">Items</th>
                  <th className="ao-th">Status</th>
                  <th className="ao-th">Total</th>
                  <th className="ao-th ao-th-expand"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(order => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="ao-pagination">
            <button className="btn btn-outline btn-sm"
              onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}>← Prev</button>
            <div className="ao-page-nums">
              {Array.from({length:totalPages},(_,i)=>i+1).map(p => (
                <button key={p} className={`ao-page-num ${p===page?'ao-page-num--active':''}`}
                  onClick={() => setPage(p)}>{p}</button>
              ))}
            </div>
            <button className="btn btn-outline btn-sm"
              onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}>Next →</button>
          </div>
        )}
      </div>

      <style>{`
        .ao-page { padding:24px;display:flex;flex-direction:column;gap:20px; }
        .ao-page-head { display:flex;align-items:center;justify-content:space-between;gap:16px; }
        .ao-page-title { display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-size:24px;font-weight:600;color:var(--text-primary); }
        .ao-page-sub { font-size:13px;color:var(--text-muted);margin-top:4px; }
        .ao-stat-strip { display:grid;grid-template-columns:repeat(4,1fr);gap:16px; }
        .ao-stat { background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px 20px;display:flex;align-items:center;gap:14px; }
        .ao-stat-icon { color:var(--accent);flex-shrink:0; }
        .ao-stat-value { font-size:20px;font-weight:700;color:var(--text-primary);line-height:1; }
        .ao-stat-label { font-size:11px;color:var(--text-muted);margin-top:3px;text-transform:uppercase;letter-spacing:.04em; }
        .ao-toolbar { display:flex;align-items:center;gap:12px;padding:12px 16px;flex-wrap:wrap; }
        .ao-search-wrap { position:relative;display:flex;align-items:center;flex:1;min-width:180px; }
        .ao-search-icon { position:absolute;left:10px;color:var(--text-muted); }
        .ao-search-input { width:100%;padding:8px 32px 8px 32px;border:1.5px solid var(--border);border-radius:var(--radius-md);font-size:13px;background:var(--bg);color:var(--text-primary);outline:none;font-family:var(--font-body);transition:border-color .2s; }
        .ao-search-input:focus { border-color:var(--accent); }
        .ao-search-input::placeholder { color:var(--text-muted); }
        .ao-search-clear { position:absolute;right:8px;color:var(--text-muted);display:flex;align-items:center;background:none;border:none;cursor:pointer; }
        .ao-filters { display:flex;gap:8px;flex-wrap:wrap; }
        .ao-filter-wrap { display:flex;align-items:center;gap:6px;color:var(--text-muted); }
        .ao-filter-select { padding:7px 12px;border:1.5px solid var(--border);border-radius:var(--radius-md);font-size:13px;background:var(--surface);color:var(--text-primary);outline:none;font-family:var(--font-body);cursor:pointer; }
        .ao-filter-select:focus { border-color:var(--accent); }
        .ao-result-count { font-size:12px;color:var(--text-muted);margin-left:auto;white-space:nowrap; }
        .ao-status-tabs { display:flex;gap:6px;flex-wrap:wrap; }
        .ao-status-tab { display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:99px;font-size:12px;font-weight:500;border:1.5px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;transition:all .15s;font-family:var(--font-body); }
        .ao-status-tab:hover { border-color:var(--accent);color:var(--accent); }
        .ao-status-tab--active { background:var(--brand);border-color:var(--brand);color:#fff; }
        .ao-tab-count { display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;border-radius:99px;background:rgba(0,0,0,.1);font-size:10px;padding:0 4px; }
        .ao-status-tab--active .ao-tab-count { background:rgba(255,255,255,.2); }
        .ao-table-card { padding:0;overflow:hidden; }
        .ao-table-wrap { overflow-x:auto; }
        .ao-table { width:100%;border-collapse:collapse;font-size:13px; }
        .ao-th { padding:11px 14px;text-align:left;font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--text-muted);background:var(--bg-alt);border-bottom:1px solid var(--border);white-space:nowrap; }
        .ao-th-expand { width:32px; }
        .ao-row { border-bottom:1px solid var(--border);cursor:pointer;transition:background .15s; }
        .ao-row:hover { background:var(--bg-alt); }
        .ao-td { padding:12px 14px;vertical-align:middle; }
        .ao-order-id { display:flex;align-items:center;gap:8px; }
        .ao-order-icon { width:28px;height:28px;border-radius:var(--radius-sm);background:var(--bg-alt);display:flex;align-items:center;justify-content:center;color:var(--text-muted);flex-shrink:0; }
        .ao-order-id span { font-family:monospace;font-size:12px;font-weight:500;color:var(--text-primary); }
        .ao-td-date { font-size:12px;color:var(--text-secondary); }
        .ao-customer { display:flex;align-items:center;gap:8px; }
        .ao-avatar { width:28px;height:28px;border-radius:50%;background:var(--brand);color:var(--accent);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .ao-customer-name { font-size:13px;font-weight:500;color:var(--text-primary); }
        .ao-customer-email { font-size:11px;color:var(--text-muted);margin-top:1px; }
        .ao-items-count { font-size:12px;color:var(--text-secondary); }
        .ao-total { font-size:14px;font-weight:700;color:var(--text-primary); }
        .ao-chevron { color:var(--text-muted); }
        .ao-td-expand { width:32px;text-align:center; }
        /* expanded detail */
        .ao-detail-row { background:var(--bg-alt); }
        .ao-detail-td { padding:0; }
        .ao-detail { padding:20px;display:flex;flex-direction:column;gap:16px;border-bottom:1px solid var(--border); }
        .ao-detail-cols { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
        .ao-detail-section { display:flex;flex-direction:column;gap:6px; }
        .ao-detail-label { font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted); }
        .ao-detail-val { font-size:13px;color:var(--text-secondary); }
        .ao-detail-items { display:flex;flex-direction:column;gap:10px; }
        .ao-detail-item { display:flex;align-items:center;gap:10px; }
        .ao-item-cover { width:40px;height:56px;object-fit:cover;border-radius:4px;flex-shrink:0; }
        .ao-item-info { flex:1;min-width:0; }
        .ao-item-title { font-size:13px;font-weight:500;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .ao-item-author { font-size:11px;color:var(--text-muted); }
        .ao-item-qty { font-size:11px;color:var(--text-muted);margin-top:1px; }
        .ao-item-price { font-size:13px;font-weight:600;color:var(--text-primary);flex-shrink:0; }
        .ao-detail-summary { display:flex;flex-direction:column;gap:6px; }
        .ao-sum-row { display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary); }
        .ao-sum-total { font-size:14px;font-weight:700;color:var(--text-primary);padding-top:6px;border-top:1px solid var(--border); }
        /* empty */
        .ao-empty { display:flex;flex-direction:column;align-items:center;gap:10px;padding:60px 24px;text-align:center; }
        .ao-empty-title { font-size:16px;font-weight:600;color:var(--text-primary); }
        .ao-empty-sub { font-size:13px;color:var(--text-muted); }
        /* pagination */
        .ao-pagination { display:flex;align-items:center;justify-content:center;gap:8px;padding:16px;border-top:1px solid var(--border); }
        .ao-page-nums { display:flex;gap:4px; }
        .ao-page-num { width:32px;height:32px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:13px;border:1.5px solid var(--border);color:var(--text-secondary);background:var(--surface);cursor:pointer;transition:all .15s; }
        .ao-page-num:hover { border-color:var(--accent);color:var(--accent); }
        .ao-page-num--active { background:var(--brand);border-color:var(--brand);color:#fff; }
        @media(max-width:1024px) { .ao-stat-strip{grid-template-columns:repeat(2,1fr);} }
        @media(max-width:768px) { .ao-page{padding:16px;} .hide-mobile{display:none!important;} .ao-stat-strip{grid-template-columns:repeat(2,1fr);} .ao-detail-cols{grid-template-columns:1fr;} }
        @media(max-width:480px) { .ao-stat-strip{grid-template-columns:1fr 1fr;} }
      `}</style>
    </div>
  )
}