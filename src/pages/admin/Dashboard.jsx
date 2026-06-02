import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, ShoppingBag, DollarSign, TrendingUp,
  PlusCircle, ArrowRight, Package, Star,
  BarChart2, BookMarked, AlertTriangle
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { useBooks } from '../../context/BooksContext'
import { formatPrice, formatDate } from '../../utils/helpers'

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, to }) {
  const card = (
    <div className="db-stat-card">
      <div className="db-stat-icon" style={{ background: `${color}18`, color }}>
        <Icon size={22} />
      </div>
      <div className="db-stat-body">
        <p className="db-stat-label">{label}</p>
        <p className="db-stat-value">{value}</p>
        {sub && <p className="db-stat-sub">{sub}</p>}
      </div>
    </div>
  )
  return to ? <Link to={to} className="db-stat-link">{card}</Link> : card
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { books, orders } = useBooks()

  // ── derived stats ──
  const totalRevenue  = orders.reduce((s, o) => s + o.total, 0)
  const totalSold     = orders.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.qty, 0), 0)
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0
  const lowStock      = books.filter(b => b.stock > 0 && b.stock <= 10)
  const outOfStock    = books.filter(b => b.stock === 0)

  // sold vs unsold
  const soldIds   = new Set(orders.flatMap(o => o.items.map(i => i.id)))
  const soldBooks = books.filter(b => soldIds.has(b.id))
  const unsoldBooks = books.filter(b => !soldIds.has(b.id))

  // genre breakdown
  const genreCounts = useMemo(() => {
    const map = {}
    books.forEach(b => { map[b.genre] = (map[b.genre] || 0) + 1 })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [books])

  // revenue by day (last 7 days simulated from orders)
  const revenueChart = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return {
        day: d.toLocaleDateString('en', { weekday: 'short' }),
        revenue: 0,
        orders: 0,
      }
    })
    // distribute orders across the 7 days for demo
    orders.forEach((o, idx) => {
      const slot = idx % 7
      days[slot].revenue += o.total
      days[slot].orders  += 1
    })
    return days
  }, [orders])

  // top selling books
  const topBooks = useMemo(() => {
    const map = {}
    orders.forEach(o => {
      o.items.forEach(i => {
        map[i.id] = map[i.id]
          ? { ...map[i.id], qty: map[i.id].qty + i.qty, revenue: map[i.id].revenue + i.price * i.qty }
          : { ...i, qty: i.qty, revenue: i.price * i.qty }
      })
    })
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 5)
  }, [orders])

  // recent orders
  const recentOrders = [...orders].slice(0, 5)

  const PIE_COLORS = ['#c9a96e','#1a1a2e','#27ae60','#8e44ad','#2980b9','#e67e22']

  return (
    <div className="db-page">
      {/* ── header bar ── */}
      <div className="db-top-bar">
        <div>
          <h2 className="db-welcome">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} 👋</h2>
          <p className="db-date">{new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        </div>
        <Link to="/admin/books/add" className="btn btn-accent">
          <PlusCircle size={16} /> Add Book
        </Link>
      </div>

      {/* ── stat cards ── */}
      <div className="db-stats-grid">
        <StatCard icon={DollarSign} label="Total Revenue"   value={formatPrice(totalRevenue)}  sub={`${orders.length} orders`}     color="#27ae60" to="/admin/orders"   />
        <StatCard icon={BookOpen}   label="Total Books"     value={books.length}               sub={`${soldBooks.length} sold`}     color="#2980b9" to="/admin/books"    />
        <StatCard icon={ShoppingBag}label="Books Sold"      value={totalSold}                  sub="total units"                    color="#c9a96e" to="/admin/orders"   />
        <StatCard icon={TrendingUp} label="Avg Order Value" value={formatPrice(avgOrderValue)} sub="per order"                      color="#8e44ad" to="/admin/analytics"/>
      </div>

      {/* ── alerts ── */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="db-alerts">
          {outOfStock.length > 0 && (
            <div className="db-alert db-alert--danger">
              <AlertTriangle size={15} />
              <span><strong>{outOfStock.length} book{outOfStock.length > 1 ? 's' : ''}</strong> out of stock</span>
              <Link to="/admin/books" className="db-alert-link">View →</Link>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="db-alert db-alert--warning">
              <AlertTriangle size={15} />
              <span><strong>{lowStock.length} book{lowStock.length > 1 ? 's' : ''}</strong> low on stock (≤10 units)</span>
              <Link to="/admin/books" className="db-alert-link">View →</Link>
            </div>
          )}
        </div>
      )}

      {/* ── charts row ── */}
      <div className="db-charts-row">
        {/* revenue area chart */}
        <div className="card db-chart-card db-chart-card--wide">
          <div className="db-chart-head">
            <div>
              <h3 className="db-chart-title"><BarChart2 size={16} />Revenue (last 7 days)</h3>
              <p className="db-chart-sub">Daily revenue and order volume</p>
            </div>
          </div>
          {orders.length === 0 ? (
            <div className="db-chart-empty">No orders yet — place an order to see data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueChart} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#c9a96e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c9a96e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3ddd0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9590a8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9590a8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip
                  formatter={(v, name) => [name === 'revenue' ? formatPrice(v) : v, name === 'revenue' ? 'Revenue' : 'Orders']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e3ddd0', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#c9a96e" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* genre pie */}
        <div className="card db-chart-card">
          <div className="db-chart-head">
            <h3 className="db-chart-title"><BookMarked size={16} />Books by genre</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={genreCounts}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {genreCounts.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── bottom row ── */}
      <div className="db-bottom-row">
        {/* top books */}
        <div className="card db-bottom-card">
          <div className="db-section-head">
            <h3 className="db-section-title"><Star size={15} />Top selling books</h3>
            <Link to="/admin/books" className="db-section-link">View all <ArrowRight size={13} /></Link>
          </div>
          {topBooks.length === 0 ? (
            <p className="db-empty-msg">No sales yet</p>
          ) : (
            <div className="db-top-books">
              {topBooks.map((book, i) => (
                <div key={book.id} className="db-top-book">
                  <span className="db-rank">{i + 1}</span>
                  <img src={book.cover} alt={book.title} className="db-book-cover" />
                  <div className="db-book-info">
                    <p className="db-book-title">{book.title}</p>
                    <p className="db-book-author">{book.author}</p>
                  </div>
                  <div className="db-book-stats">
                    <span className="db-book-qty">{book.qty} sold</span>
                    <span className="db-book-rev">{formatPrice(book.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* recent orders */}
        <div className="card db-bottom-card">
          <div className="db-section-head">
            <h3 className="db-section-title"><Package size={15} />Recent orders</h3>
            <Link to="/admin/orders" className="db-section-link">View all <ArrowRight size={13} /></Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="db-empty-msg">No orders yet</p>
          ) : (
            <div className="db-recent-orders">
              {recentOrders.map(order => (
                <div key={order.id} className="db-order-row">
                  <div className="db-order-icon"><Package size={14} /></div>
                  <div className="db-order-info">
                    <p className="db-order-id">#{order.id.slice(0, 10)}…</p>
                    <p className="db-order-date">{formatDate(order.date)}</p>
                  </div>
                  <div className="db-order-right">
                    <span className="badge badge-success db-order-badge">Confirmed</span>
                    <span className="db-order-total">{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── sold vs unsold ── */}
      <div className="card db-sold-card">
        <div className="db-section-head">
          <h3 className="db-section-title"><BookOpen size={15} />Sold vs Unsold Books</h3>
          <Link to="/admin/analytics" className="db-section-link">Full analytics <ArrowRight size={13} /></Link>
        </div>
        <div className="db-sold-stats">
          <div className="db-sold-stat db-sold-stat--sold">
            <span className="db-sold-num">{soldBooks.length}</span>
            <span className="db-sold-label">Sold</span>
            <div className="db-sold-bar" style={{ width: `${books.length ? (soldBooks.length / books.length) * 100 : 0}%`, background: 'var(--success)' }} />
          </div>
          <div className="db-sold-stat db-sold-stat--unsold">
            <span className="db-sold-num">{unsoldBooks.length}</span>
            <span className="db-sold-label">Unsold</span>
            <div className="db-sold-bar" style={{ width: `${books.length ? (unsoldBooks.length / books.length) * 100 : 0}%`, background: 'var(--text-muted)' }} />
          </div>
        </div>
        <div className="db-sold-track">
          <div className="db-sold-fill" style={{ width: `${books.length ? (soldBooks.length / books.length) * 100 : 0}%` }} />
        </div>
        <p className="db-sold-note">
          {soldBooks.length} of {books.length} books have been purchased at least once
        </p>
      </div>

      <style>{`
        .db-page { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
        .db-top-bar { display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap; }
        .db-welcome { font-family:var(--font-display);font-size:22px;font-weight:600;color:var(--text-primary); }
        .db-date { font-size:12px;color:var(--text-muted);margin-top:3px; }
        .db-stats-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:16px; }
        .db-stat-link { text-decoration:none;display:block; }
        .db-stat-card { background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px;display:flex;align-items:center;gap:16px;transition:box-shadow .2s,transform .2s;cursor:pointer; }
        .db-stat-link:hover .db-stat-card { box-shadow:var(--shadow-md);transform:translateY(-2px); }
        .db-stat-icon { width:48px;height:48px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .db-stat-label { font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--text-muted); }
        .db-stat-value { font-size:24px;font-weight:700;color:var(--text-primary);line-height:1.1;margin-top:2px; }
        .db-stat-sub { font-size:11px;color:var(--text-muted);margin-top:3px; }
        .db-alerts { display:flex;flex-direction:column;gap:8px; }
        .db-alert { display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:var(--radius-md);font-size:13px; }
        .db-alert--danger { background:#fadbd8;color:var(--danger);border:1px solid #f1948a; }
        .db-alert--warning { background:#fdebd0;color:#d35400;border:1px solid #f9cba3; }
        .db-alert-link { margin-left:auto;font-weight:600;text-decoration:none;color:inherit;opacity:.8; }
        .db-alert-link:hover { opacity:1; }
        .db-charts-row { display:grid;grid-template-columns:1fr 320px;gap:20px; }
        .db-chart-card { display:flex;flex-direction:column;gap:12px;padding:20px; }
        .db-chart-card--wide {}
        .db-chart-head { display:flex;align-items:flex-start;justify-content:space-between; }
        .db-chart-title { display:flex;align-items:center;gap:7px;font-size:15px;font-weight:600;color:var(--text-primary); }
        .db-chart-sub { font-size:11px;color:var(--text-muted);margin-top:3px; }
        .db-chart-empty { height:220px;display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--text-muted); }
        .db-bottom-row { display:grid;grid-template-columns:1fr 1fr;gap:20px; }
        .db-bottom-card { padding:20px;display:flex;flex-direction:column;gap:16px; }
        .db-section-head { display:flex;align-items:center;justify-content:space-between; }
        .db-section-title { display:flex;align-items:center;gap:7px;font-size:15px;font-weight:600;color:var(--text-primary); }
        .db-section-link { display:flex;align-items:center;gap:4px;font-size:12px;font-weight:500;color:var(--accent);text-decoration:none;transition:gap .15s; }
        .db-section-link:hover { gap:7px; }
        .db-empty-msg { font-size:13px;color:var(--text-muted);text-align:center;padding:24px 0; }
        .db-top-books { display:flex;flex-direction:column;gap:0; }
        .db-top-book { display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border); }
        .db-top-book:last-child { border-bottom:none; }
        .db-rank { width:20px;font-size:12px;font-weight:700;color:var(--text-muted);text-align:center;flex-shrink:0; }
        .db-book-cover { width:36px;height:50px;object-fit:cover;border-radius:4px;flex-shrink:0; }
        .db-book-info { flex:1;min-width:0; }
        .db-book-title { font-size:13px;font-weight:500;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .db-book-author { font-size:11px;color:var(--text-muted);margin-top:1px; }
        .db-book-stats { display:flex;flex-direction:column;align-items:flex-end;gap:2px;flex-shrink:0; }
        .db-book-qty { font-size:11px;color:var(--text-muted); }
        .db-book-rev { font-size:13px;font-weight:600;color:var(--text-primary); }
        .db-recent-orders { display:flex;flex-direction:column;gap:0; }
        .db-order-row { display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border); }
        .db-order-row:last-child { border-bottom:none; }
        .db-order-icon { width:34px;height:34px;border-radius:var(--radius-md);background:var(--bg-alt);display:flex;align-items:center;justify-content:center;color:var(--text-muted);flex-shrink:0; }
        .db-order-info { flex:1;min-width:0; }
        .db-order-id { font-size:12px;font-weight:500;font-family:monospace;color:var(--text-primary); }
        .db-order-date { font-size:11px;color:var(--text-muted);margin-top:1px; }
        .db-order-right { display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0; }
        .db-order-badge { font-size:10px !important; }
        .db-order-total { font-size:13px;font-weight:600;color:var(--text-primary); }
        .db-sold-card { padding:20px;display:flex;flex-direction:column;gap:14px; }
        .db-sold-stats { display:flex;gap:32px; }
        .db-sold-stat { display:flex;flex-direction:column;gap:4px; }
        .db-sold-num { font-size:28px;font-weight:700;color:var(--text-primary);line-height:1; }
        .db-sold-label { font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted); }
        .db-sold-track { height:8px;background:var(--bg-alt);border-radius:99px;overflow:hidden; }
        .db-sold-fill { height:100%;background:var(--success);border-radius:99px;transition:width .5s ease; }
        .db-sold-note { font-size:12px;color:var(--text-muted); }
        @media(max-width:1200px) { .db-stats-grid{grid-template-columns:repeat(2,1fr);} .db-charts-row{grid-template-columns:1fr;} }
        @media(max-width:768px) { .db-page{padding:16px;} .db-stats-grid{grid-template-columns:repeat(2,1fr);} .db-bottom-row{grid-template-columns:1fr;} }
        @media(max-width:480px) { .db-stats-grid{grid-template-columns:1fr;} }
      `}</style>
    </div>
  )
}