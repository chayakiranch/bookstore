import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, BookOpen, DollarSign, ShoppingBag,
  Award, Tag, Star, Package, ArrowRight
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'
import { useBooks } from '../../context/BooksContext'
import { formatPrice } from '../../utils/helpers'

const COLORS = ['#c9a96e','#1a1a2e','#27ae60','#8e44ad','#2980b9','#e67e22','#c0392b']

export default function Analytics() {
  const { books, orders } = useBooks()

  // ── core metrics ──
  const totalRevenue  = orders.reduce((s,o) => s + o.total, 0)
  const totalUnits    = orders.reduce((s,o) => s + o.items.reduce((ss,i) => ss + i.qty, 0), 0)
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0
  const soldIds       = new Set(orders.flatMap(o => o.items.map(i => i.id)))

  // ── revenue by day (last 14 days) ──
  const revenueByDay = useMemo(() => {
    const days = Array.from({length:14}, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (13 - i))
      return { day: d.toLocaleDateString('en',{month:'short',day:'numeric'}), revenue:0, orders:0 }
    })
    orders.forEach((o, idx) => {
      const slot = idx % 14
      days[slot].revenue += o.total
      days[slot].orders  += 1
    })
    return days
  }, [orders])

  // ── revenue by genre ──
  const revenueByGenre = useMemo(() => {
    const map = {}
    orders.forEach(o => o.items.forEach(i => {
      const book = books.find(b => b.id === i.id)
      if (book) map[book.genre] = (map[book.genre] || 0) + i.price * i.qty
    }))
    return Object.entries(map).map(([name, value]) => ({ name, value: +value.toFixed(2) }))
      .sort((a,b) => b.value - a.value)
  }, [orders, books])

  // ── books sold per genre ──
  const genreSales = useMemo(() => {
    const map = {}
    books.forEach(b => { map[b.genre] = { genre: b.genre, total: (map[b.genre]?.total || 0) + 1, sold: map[b.genre]?.sold || 0 } })
    orders.forEach(o => o.items.forEach(i => {
      const book = books.find(b => b.id === i.id)
      if (book && map[book.genre]) map[book.genre].sold += i.qty
    }))
    return Object.values(map)
  }, [orders, books])

  // ── top books by revenue ──
  const topByRevenue = useMemo(() => {
    const map = {}
    orders.forEach(o => o.items.forEach(i => {
      map[i.id] = map[i.id]
        ? { ...map[i.id], revenue: map[i.id].revenue + i.price * i.qty, qty: map[i.id].qty + i.qty }
        : { ...i, revenue: i.price * i.qty, qty: i.qty }
    }))
    return Object.values(map).sort((a,b) => b.revenue - a.revenue).slice(0, 8)
  }, [orders])

  // ── sold vs unsold breakdown ──
  const soldCount   = books.filter(b => soldIds.has(b.id)).length
  const unsoldCount = books.length - soldCount
  const soldPieData = [
    { name: 'Sold',   value: soldCount   },
    { name: 'Unsold', value: unsoldCount },
  ]

  // ── price range distribution ──
  const priceRanges = useMemo(() => {
    const ranges = [
      { label: 'Under $10', min:0,   max:10  },
      { label: '$10–$20',   min:10,  max:20  },
      { label: '$20–$40',   min:20,  max:40  },
      { label: '$40–$80',   min:40,  max:80  },
      { label: '$80+',      min:80,  max:9999},
    ]
    return ranges.map(r => ({
      label: r.label,
      count: books.filter(b => b.price >= r.min && b.price < r.max).length,
    }))
  }, [books])

  return (
    <div className="an-page">
      {/* header */}
      <div className="an-page-head">
        <div>
          <h1 className="an-page-title"><TrendingUp size={22} />Analytics</h1>
          <p className="an-page-sub">Sales performance and inventory insights</p>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="an-kpi-grid">
        {[
          { icon: DollarSign,  label: 'Total Revenue',    value: formatPrice(totalRevenue),  color:'#27ae60', sub:`${orders.length} orders`       },
          { icon: ShoppingBag, label: 'Units Sold',       value: totalUnits,                 color:'#c9a96e', sub:'total book units'               },
          { icon: BookOpen,    label: 'Catalogue Size',   value: books.length,               color:'#2980b9', sub:`${soldCount} sold`              },
          { icon: TrendingUp,  label: 'Avg Order Value',  value: formatPrice(avgOrderValue), color:'#8e44ad', sub:'per transaction'                },
          { icon: Star,        label: 'Sell-through Rate',value: books.length ? `${Math.round((soldCount/books.length)*100)}%` : '0%',
            color:'#e67e22', sub:`${soldCount} of ${books.length} books`                                                                           },
          { icon: Package,     label: 'Unsold Books',     value: unsoldCount,                color:'#c0392b', sub:'never purchased'                },
        ].map(k => {
          const Icon = k.icon
          return (
            <div key={k.label} className="an-kpi">
              <div className="an-kpi-icon" style={{ background:`${k.color}18`, color:k.color }}>
                <Icon size={20} />
              </div>
              <div>
                <p className="an-kpi-label">{k.label}</p>
                <p className="an-kpi-value">{k.value}</p>
                <p className="an-kpi-sub">{k.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── revenue trend ── */}
      <div className="card an-card">
        <div className="an-card-head">
          <div>
            <h3 className="an-card-title"><DollarSign size={15} />Revenue Trend (14 days)</h3>
            <p className="an-card-sub">Daily revenue and order volume</p>
          </div>
        </div>
        {orders.length === 0 ? (
          <div className="an-empty">Place orders to see revenue data</div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueByDay} margin={{top:8,right:12,bottom:0,left:0}}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#c9a96e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c9a96e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3ddd0" />
              <XAxis dataKey="day" tick={{fontSize:10,fill:'#9590a8'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:10,fill:'#9590a8'}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`} />
              <Tooltip formatter={(v,n) => [n==='revenue'?formatPrice(v):v, n==='revenue'?'Revenue':'Orders']}
                contentStyle={{borderRadius:8,border:'1px solid #e3ddd0',fontSize:12}} />
              <Area type="monotone" dataKey="revenue" stroke="#c9a96e" strokeWidth={2.5} fill="url(#aGrad)" />
              <Line type="monotone" dataKey="orders" stroke="#1a1a2e" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── genre charts row ── */}
      <div className="an-two-col">
        {/* revenue by genre bar */}
        <div className="card an-card">
          <h3 className="an-card-title"><TrendingUp size={15} />Revenue by genre</h3>
          {revenueByGenre.length === 0 ? (
            <div className="an-empty">No sales data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueByGenre} margin={{top:8,right:8,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3ddd0" />
                <XAxis dataKey="name" tick={{fontSize:10,fill:'#9590a8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize:10,fill:'#9590a8'}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`} />
                <Tooltip formatter={v=>[formatPrice(v),'Revenue']}
                  contentStyle={{borderRadius:8,border:'1px solid #e3ddd0',fontSize:12}} />
                <Bar dataKey="value" radius={[4,4,0,0]}>
                  {revenueByGenre.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* sold vs unsold pie */}
        <div className="card an-card">
          <h3 className="an-card-title"><BookOpen size={15} />Sold vs Unsold</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={soldPieData} cx="50%" cy="50%"
                innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                <Cell fill="#27ae60" />
                <Cell fill="#e3ddd0" />
              </Pie>
              <Tooltip contentStyle={{borderRadius:8,fontSize:12}} />
              <Legend iconType="circle" iconSize={9} wrapperStyle={{fontSize:12}} />
            </PieChart>
          </ResponsiveContainer>
          <div className="an-sold-note">
            <span className="an-sold-pct" style={{color:'#27ae60'}}>
              {books.length ? Math.round((soldCount/books.length)*100) : 0}%
            </span>
            sell-through rate
          </div>
        </div>
      </div>

      {/* ── genre sales bar ── */}
      <div className="card an-card">
        <h3 className="an-card-title"><ShoppingBag size={15} />Units sold by genre</h3>
        {genreSales.every(g => g.sold === 0) ? (
          <div className="an-empty">No sales yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={genreSales} margin={{top:8,right:8,bottom:0,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3ddd0" />
              <XAxis dataKey="genre" tick={{fontSize:10,fill:'#9590a8'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:10,fill:'#9590a8'}} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{borderRadius:8,border:'1px solid #e3ddd0',fontSize:12}} />
              <Bar name="Total" dataKey="total" fill="#e3ddd0" radius={[4,4,0,0]} />
              <Bar name="Sold"  dataKey="sold"  fill="#c9a96e" radius={[4,4,0,0]} />
              <Legend iconType="circle" iconSize={9} wrapperStyle={{fontSize:12}} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── bottom row ── */}
      <div className="an-two-col">
        {/* top books by revenue */}
        <div className="card an-card">
          <div className="an-card-head">
            <h3 className="an-card-title"><Award size={15} />Top books by revenue</h3>
            <Link to="/admin/books" className="an-link">View all <ArrowRight size={13} /></Link>
          </div>
          {topByRevenue.length === 0 ? (
            <div className="an-empty">No sales data</div>
          ) : (
            <div className="an-top-list">
              {topByRevenue.map((book, i) => (
                <div key={book.id} className="an-top-item">
                  <span className="an-rank">{i+1}</span>
                  <img src={book.cover} alt={book.title} className="an-top-cover" />
                  <div className="an-top-info">
                    <p className="an-top-title">{book.title}</p>
                    <p className="an-top-author">{book.author}</p>
                    <div className="an-top-bar-wrap">
                      <div className="an-top-bar"
                        style={{ width:`${(book.revenue/topByRevenue[0].revenue)*100}%` }} />
                    </div>
                  </div>
                  <div className="an-top-stats">
                    <span className="an-top-rev">{formatPrice(book.revenue)}</span>
                    <span className="an-top-qty">{book.qty} sold</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* price range distribution */}
        <div className="card an-card">
          <h3 className="an-card-title"><Tag size={15} />Price distribution</h3>
          <div className="an-price-ranges">
            {priceRanges.map(r => (
              <div key={r.label} className="an-price-range">
                <div className="an-price-range-head">
                  <span className="an-price-label">{r.label}</span>
                  <span className="an-price-count">{r.count} books</span>
                </div>
                <div className="an-price-track">
                  <div className="an-price-fill"
                    style={{ width:`${books.length ? (r.count/books.length)*100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .an-page { padding:24px;display:flex;flex-direction:column;gap:24px; }
        .an-page-head { display:flex;align-items:center;justify-content:space-between; }
        .an-page-title { display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-size:24px;font-weight:600;color:var(--text-primary); }
        .an-page-sub { font-size:13px;color:var(--text-muted);margin-top:4px; }
        .an-kpi-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:16px; }
        .an-kpi { background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px 20px;display:flex;align-items:center;gap:14px; }
        .an-kpi-icon { width:44px;height:44px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .an-kpi-label { font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted); }
        .an-kpi-value { font-size:22px;font-weight:700;color:var(--text-primary);line-height:1.1;margin-top:2px; }
        .an-kpi-sub { font-size:11px;color:var(--text-muted);margin-top:2px; }
        .an-card { padding:20px;display:flex;flex-direction:column;gap:14px; }
        .an-card-head { display:flex;align-items:center;justify-content:space-between; }
        .an-card-title { display:flex;align-items:center;gap:7px;font-size:15px;font-weight:600;color:var(--text-primary); }
        .an-card-sub { font-size:11px;color:var(--text-muted);margin-top:3px; }
        .an-link { display:flex;align-items:center;gap:4px;font-size:12px;font-weight:500;color:var(--accent);text-decoration:none;transition:gap .15s; }
        .an-link:hover { gap:7px; }
        .an-empty { height:200px;display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--text-muted); }
        .an-two-col { display:grid;grid-template-columns:1fr 1fr;gap:20px; }
        .an-sold-note { display:flex;align-items:baseline;gap:6px;font-size:13px;color:var(--text-muted);justify-content:center; }
        .an-sold-pct { font-size:24px;font-weight:700; }
        .an-top-list { display:flex;flex-direction:column;gap:0; }
        .an-top-item { display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border); }
        .an-top-item:last-child { border-bottom:none; }
        .an-rank { width:18px;font-size:11px;font-weight:700;color:var(--text-muted);text-align:center;flex-shrink:0; }
        .an-top-cover { width:32px;height:44px;object-fit:cover;border-radius:4px;flex-shrink:0; }
        .an-top-info { flex:1;min-width:0; }
        .an-top-title { font-size:12px;font-weight:500;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .an-top-author { font-size:11px;color:var(--text-muted);margin-top:1px; }
        .an-top-bar-wrap { height:3px;background:var(--border);border-radius:99px;overflow:hidden;margin-top:5px; }
        .an-top-bar { height:100%;background:var(--accent);border-radius:99px; }
        .an-top-stats { display:flex;flex-direction:column;align-items:flex-end;gap:2px;flex-shrink:0; }
        .an-top-rev { font-size:13px;font-weight:600;color:var(--text-primary); }
        .an-top-qty { font-size:11px;color:var(--text-muted); }
        .an-price-ranges { display:flex;flex-direction:column;gap:14px; }
        .an-price-range { display:flex;flex-direction:column;gap:6px; }
        .an-price-range-head { display:flex;justify-content:space-between;font-size:13px; }
        .an-price-label { color:var(--text-primary);font-weight:500; }
        .an-price-count { color:var(--text-muted);font-size:12px; }
        .an-price-track { height:6px;background:var(--bg-alt);border-radius:99px;overflow:hidden; }
        .an-price-fill { height:100%;background:var(--accent);border-radius:99px;transition:width .5s ease; }
        @media(max-width:1200px) { .an-kpi-grid{grid-template-columns:repeat(3,1fr);} }
        @media(max-width:900px)  { .an-kpi-grid{grid-template-columns:repeat(2,1fr);} .an-two-col{grid-template-columns:1fr;} }
        @media(max-width:640px)  { .an-page{padding:16px;} .an-kpi-grid{grid-template-columns:1fr 1fr;} }
      `}</style>
    </div>
  )
}