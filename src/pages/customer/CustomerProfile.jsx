import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Mail, Calendar, Package, BookOpen,
  Edit2, Check, ShoppingBag, Heart, Star,
  Shield, Bell, ChevronRight, Camera
} from 'lucide-react'
import { useAuth }  from '../../context/AuthContext'
import { useBooks } from '../../context/BooksContext'
import { formatPrice, formatDate } from '../../utils/helpers'

// ─── Stat card ────────────────────────────────────────────────────────────────
function ProfileStat({ icon: Icon, label, value, color }) {
  return (
    <div className="cp-stat">
      <div className="cp-stat-icon" style={{ background: `${color}18`, color }}>
        <Icon size={18} />
      </div>
      <div>
        <p className="cp-stat-value">{value}</p>
        <p className="cp-stat-label">{label}</p>
      </div>
    </div>
  )
}

// ─── CustomerProfile ──────────────────────────────────────────────────────────
export default function CustomerProfile() {
  const { user, login } = useAuth()
  const { orders }      = useBooks()

  const [editing, setEditing]   = useState(false)
  const [saved,   setSaved]     = useState(false)
  const [form, setForm]         = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio:   user?.bio   || '',
  })

  // this user's orders
  const myOrders       = orders.filter(o => o.userId === user?.id)
  const totalSpent     = myOrders.reduce((s, o) => s + o.total, 0)
  const totalBooks     = myOrders.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.qty, 0), 0)
  const recentOrders   = myOrders.slice(0, 3)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    // update user in auth context
    const updated = { ...user, ...form }
    login(updated)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="cp-page">
      {/* ── hero banner ── */}
      <div className="cp-hero">
        <div className="cp-hero-bg" />
        <div className="container cp-hero-inner">
          {/* avatar */}
          <div className="cp-avatar-wrap">
            <div className="cp-avatar">{user?.avatar || user?.name?.[0] || 'U'}</div>
            <button className="cp-avatar-edit" aria-label="Change photo">
              <Camera size={13} />
            </button>
          </div>
          <div className="cp-hero-info">
            <h1 className="cp-hero-name">{user?.name}</h1>
            <p className="cp-hero-email">{user?.email}</p>
            {user?.joinedDate && (
              <p className="cp-hero-joined">
                <Calendar size={12} />
                Member since {formatDate(user.joinedDate)}
              </p>
            )}
          </div>
          <button
            className={`cp-edit-btn ${editing ? 'cp-edit-btn--cancel' : ''}`}
            onClick={() => { setEditing(e => !e); setSaved(false) }}
          >
            {editing ? 'Cancel' : <><Edit2 size={14} /> Edit Profile</>}
          </button>
        </div>
      </div>

      <div className="container cp-body">
        {/* ── stats strip ── */}
        <div className="cp-stats-row">
          <ProfileStat icon={Package}   label="Orders placed" value={myOrders.length}      color="#2980b9" />
          <ProfileStat icon={BookOpen}  label="Books bought"  value={totalBooks}            color="#c9a96e" />
          <ProfileStat icon={DollarSign2} label="Total spent" value={formatPrice(totalSpent)} color="#27ae60" />
        </div>

        <div className="cp-layout">
          {/* ── left: profile info ── */}
          <div className="cp-main-col">

            {saved && (
              <div className="cp-saved-banner">
                <Check size={15} /> Profile updated successfully!
              </div>
            )}

            {/* profile card */}
            <div className="card cp-card">
              <div className="cp-card-head">
                <h2 className="cp-card-title"><User size={16} />Personal Information</h2>
                {!editing && (
                  <button className="cp-inline-edit" onClick={() => setEditing(true)}>
                    <Edit2 size={13} /> Edit
                  </button>
                )}
              </div>

              {editing ? (
                <div className="cp-edit-form">
                  <div className="cp-form-row">
                    <div className="cp-form-group">
                      <label className="cp-label">Full name</label>
                      <input className="cp-input" name="name" value={form.name}
                        onChange={handleChange} placeholder="Your name" />
                    </div>
                    <div className="cp-form-group">
                      <label className="cp-label">Email address</label>
                      <input className="cp-input" name="email" type="email" value={form.email}
                        onChange={handleChange} placeholder="you@example.com" />
                    </div>
                  </div>
                  <div className="cp-form-group">
                    <label className="cp-label">Phone number</label>
                    <input className="cp-input" name="phone" value={form.phone}
                      onChange={handleChange} placeholder="+1 555 000 0000" />
                  </div>
                  <div className="cp-form-group">
                    <label className="cp-label">Bio</label>
                    <textarea className="cp-textarea" name="bio" value={form.bio}
                      onChange={handleChange} placeholder="Tell us about yourself…" rows={3} />
                  </div>
                  <div className="cp-edit-actions">
                    <button className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                    <button className="btn btn-accent" onClick={handleSave}>
                      <Check size={15} /> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="cp-info-list">
                  {[
                    { icon: User,     label: 'Name',    value: user?.name  || '—' },
                    { icon: Mail,     label: 'Email',   value: user?.email || '—' },
                    { icon: PhoneIcon,label: 'Phone',   value: user?.phone || 'Not set' },
                    { icon: Calendar, label: 'Joined',  value: user?.joinedDate ? formatDate(user.joinedDate) : '—' },
                  ].map(row => {
                    const Icon = row.icon
                    return (
                      <div key={row.label} className="cp-info-row">
                        <Icon size={15} className="cp-info-icon" />
                        <span className="cp-info-label">{row.label}</span>
                        <span className="cp-info-value">{row.value}</span>
                      </div>
                    )
                  })}
                  {user?.bio && (
                    <div className="cp-bio">
                      <p className="cp-bio-label">Bio</p>
                      <p className="cp-bio-text">{user.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* recent orders */}
            <div className="card cp-card">
              <div className="cp-card-head">
                <h2 className="cp-card-title"><Package size={16} />Recent Orders</h2>
                <Link to="/orders" className="cp-card-link">
                  View all <ChevronRight size={13} />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="cp-no-orders">
                  <ShoppingBag size={36} className="cp-no-orders-icon" />
                  <p className="cp-no-orders-title">No orders yet</p>
                  <p className="cp-no-orders-sub">Start shopping to see your order history here.</p>
                  <Link to="/books" className="btn btn-accent btn-sm">Browse books</Link>
                </div>
              ) : (
                <div className="cp-orders-list">
                  {recentOrders.map(order => (
                    <div key={order.id} className="cp-order-item">
                      <div className="cp-order-covers">
                        {order.items.slice(0, 3).map(item => (
                          <img key={item.id} src={item.cover} alt={item.title} className="cp-order-cover" />
                        ))}
                        {order.items.length > 3 && (
                          <div className="cp-order-more">+{order.items.length - 3}</div>
                        )}
                      </div>
                      <div className="cp-order-info">
                        <p className="cp-order-id">#{order.id.slice(0, 12)}…</p>
                        <p className="cp-order-date">{formatDate(order.date)}</p>
                        <p className="cp-order-items">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="cp-order-right">
                        <span className="badge badge-success cp-order-status">Confirmed</span>
                        <span className="cp-order-total">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── right: sidebar ── */}
          <div className="cp-side-col">
            {/* account links */}
            <div className="card cp-card">
              <h2 className="cp-card-title"><Shield size={16} />Account</h2>
              <div className="cp-account-links">
                {[
                  { icon: Package,  label: 'My Orders',       to: '/orders',  sub: `${myOrders.length} orders` },
                  { icon: Heart,    label: 'Wishlist',         to: '#',        sub: 'Saved books' },
                  { icon: Star,     label: 'My Reviews',       to: '#',        sub: 'Rate books' },
                  { icon: Bell,     label: 'Notifications',    to: '#',        sub: 'Preferences' },
                  { icon: Shield,   label: 'Privacy & Security',to: '#',       sub: 'Settings' },
                ].map(item => {
                  const Icon = item.icon
                  return (
                    <Link key={item.label} to={item.to} className="cp-account-link">
                      <div className="cp-account-link-icon">
                        <Icon size={15} />
                      </div>
                      <div className="cp-account-link-body">
                        <p className="cp-account-link-label">{item.label}</p>
                        <p className="cp-account-link-sub">{item.sub}</p>
                      </div>
                      <ChevronRight size={14} className="cp-account-link-arrow" />
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* membership card */}
            <div className="cp-membership-card">
              <div className="cp-membership-bg" />
              <div className="cp-membership-inner">
                <div className="cp-membership-icon"><BookOpen size={20} /></div>
                <div>
                  <p className="cp-membership-label">Member</p>
                  <p className="cp-membership-name">Folio Reader</p>
                </div>
              </div>
              <div className="cp-membership-perks">
                <p className="cp-perk">✓ Free shipping on $35+</p>
                <p className="cp-perk">✓ Early access to deals</p>
                <p className="cp-perk">✓ Exclusive member pricing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cp-page { min-height: 80vh; }

        /* hero */
        .cp-hero { background:linear-gradient(135deg,var(--brand) 0%,#0f3460 100%);padding:40px 0;position:relative;overflow:hidden; }
        .cp-hero-bg { position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 80% 50%,rgba(201,169,110,.12) 0%,transparent 70%);pointer-events:none; }
        .cp-hero-inner { display:flex;align-items:center;gap:24px;position:relative;z-index:1;flex-wrap:wrap; }
        .cp-avatar-wrap { position:relative;flex-shrink:0; }
        .cp-avatar { width:80px;height:80px;border-radius:50%;background:var(--accent);color:var(--brand);font-family:var(--font-display);font-size:28px;font-weight:600;display:flex;align-items:center;justify-content:center;border:3px solid rgba(255,255,255,.2); }
        .cp-avatar-edit { position:absolute;bottom:2px;right:2px;width:24px;height:24px;border-radius:50%;background:var(--surface);color:var(--text-primary);display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;box-shadow:var(--shadow-sm);transition:background .15s; }
        .cp-avatar-edit:hover { background:var(--bg-alt); }
        .cp-hero-info { flex:1;min-width:0; }
        .cp-hero-name { font-family:var(--font-display);font-size:clamp(22px,4vw,32px);font-weight:600;color:#fff;line-height:1.2; }
        .cp-hero-email { font-size:14px;color:rgba(255,255,255,.6);margin-top:4px; }
        .cp-hero-joined { display:flex;align-items:center;gap:5px;font-size:12px;color:rgba(255,255,255,.45);margin-top:6px; }
        .cp-edit-btn { display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:var(--radius-md);border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;font-family:var(--font-body); }
        .cp-edit-btn:hover { background:rgba(255,255,255,.15);color:#fff; }
        .cp-edit-btn--cancel { border-color:rgba(192,57,43,.4);background:rgba(192,57,43,.12);color:#f1948a; }

        /* body */
        .cp-body { padding:28px 0 60px;display:flex;flex-direction:column;gap:24px; }
        .cp-stats-row { display:grid;grid-template-columns:repeat(3,1fr);gap:16px; }
        .cp-stat { background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px 20px;display:flex;align-items:center;gap:14px; }
        .cp-stat-icon { width:44px;height:44px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .cp-stat-value { font-size:22px;font-weight:700;color:var(--text-primary);line-height:1; }
        .cp-stat-label { font-size:11px;color:var(--text-muted);margin-top:3px;text-transform:uppercase;letter-spacing:.04em; }

        /* layout */
        .cp-layout { display:grid;grid-template-columns:1fr 300px;gap:24px;align-items:flex-start; }
        .cp-main-col { display:flex;flex-direction:column;gap:20px; }
        .cp-side-col { position:sticky;top:calc(var(--header-h) + 20px);display:flex;flex-direction:column;gap:16px; }

        /* card */
        .cp-card { display:flex;flex-direction:column;gap:16px; }
        .cp-card-head { display:flex;align-items:center;justify-content:space-between; }
        .cp-card-title { display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600;color:var(--text-primary); }
        .cp-card-link { display:flex;align-items:center;gap:4px;font-size:12px;font-weight:500;color:var(--accent);text-decoration:none;transition:gap .15s; }
        .cp-card-link:hover { gap:7px; }
        .cp-inline-edit { display:flex;align-items:center;gap:5px;font-size:12px;color:var(--text-muted);background:none;border:1px solid var(--border);padding:4px 10px;border-radius:var(--radius-md);cursor:pointer;font-family:var(--font-body);transition:all .15s; }
        .cp-inline-edit:hover { border-color:var(--accent);color:var(--accent); }

        /* saved banner */
        .cp-saved-banner { display:flex;align-items:center;gap:8px;padding:11px 16px;background:#d5f5e3;color:#1e8449;border:1px solid #a9dfbf;border-radius:var(--radius-md);font-size:13px; }

        /* info list */
        .cp-info-list { display:flex;flex-direction:column;gap:0; }
        .cp-info-row { display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);font-size:14px; }
        .cp-info-row:last-child { border-bottom:none; }
        .cp-info-icon { color:var(--text-muted);flex-shrink:0; }
        .cp-info-label { color:var(--text-secondary);width:80px;flex-shrink:0; }
        .cp-info-value { font-weight:500;color:var(--text-primary);flex:1; }
        .cp-bio { padding:14px;background:var(--bg-alt);border-radius:var(--radius-md); }
        .cp-bio-label { font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted);margin-bottom:6px; }
        .cp-bio-text { font-size:14px;color:var(--text-secondary);line-height:1.6; }

        /* edit form */
        .cp-edit-form { display:flex;flex-direction:column;gap:14px; }
        .cp-form-row { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
        .cp-form-group { display:flex;flex-direction:column;gap:6px; }
        .cp-label { font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text-secondary); }
        .cp-input { padding:10px 14px;border:1.5px solid var(--border);border-radius:var(--radius-md);font-size:14px;background:var(--surface);color:var(--text-primary);outline:none;font-family:var(--font-body);transition:border-color .2s; }
        .cp-input:focus { border-color:var(--accent);box-shadow:0 0 0 3px rgba(201,169,110,.13); }
        .cp-textarea { padding:10px 14px;border:1.5px solid var(--border);border-radius:var(--radius-md);font-size:14px;background:var(--surface);color:var(--text-primary);outline:none;resize:vertical;font-family:var(--font-body);transition:border-color .2s; }
        .cp-textarea:focus { border-color:var(--accent);box-shadow:0 0 0 3px rgba(201,169,110,.13); }
        .cp-edit-actions { display:flex;justify-content:flex-end;gap:10px; }

        /* orders */
        .cp-no-orders { display:flex;flex-direction:column;align-items:center;gap:10px;padding:32px;text-align:center; }
        .cp-no-orders-icon { color:var(--text-muted); }
        .cp-no-orders-title { font-size:16px;font-weight:600;color:var(--text-primary); }
        .cp-no-orders-sub { font-size:13px;color:var(--text-muted); }
        .cp-orders-list { display:flex;flex-direction:column;gap:0; }
        .cp-order-item { display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border); }
        .cp-order-item:last-child { border-bottom:none; }
        .cp-order-covers { display:flex;gap:-4px; }
        .cp-order-cover { width:40px;height:56px;object-fit:cover;border-radius:4px;border:2px solid var(--surface);margin-left:-6px;flex-shrink:0; }
        .cp-order-cover:first-child { margin-left:0; }
        .cp-order-more { width:40px;height:56px;border-radius:4px;background:var(--bg-alt);border:2px solid var(--surface);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--text-muted);margin-left:-6px;flex-shrink:0; }
        .cp-order-info { flex:1;min-width:0; }
        .cp-order-id { font-size:12px;font-weight:500;font-family:monospace;color:var(--text-primary); }
        .cp-order-date { font-size:11px;color:var(--text-muted);margin-top:2px; }
        .cp-order-items { font-size:11px;color:var(--text-muted); }
        .cp-order-right { display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0; }
        .cp-order-status { font-size:10px !important; }
        .cp-order-total { font-size:14px;font-weight:700;color:var(--text-primary); }

        /* account links */
        .cp-account-links { display:flex;flex-direction:column;gap:0; }
        .cp-account-link { display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--border);text-decoration:none;transition:padding-left .15s; }
        .cp-account-link:last-child { border-bottom:none; }
        .cp-account-link:hover { padding-left:4px; }
        .cp-account-link-icon { width:32px;height:32px;border-radius:var(--radius-md);background:var(--bg-alt);display:flex;align-items:center;justify-content:center;color:var(--text-secondary);flex-shrink:0; }
        .cp-account-link-body { flex:1;min-width:0; }
        .cp-account-link-label { font-size:13px;font-weight:500;color:var(--text-primary); }
        .cp-account-link-sub { font-size:11px;color:var(--text-muted);margin-top:1px; }
        .cp-account-link-arrow { color:var(--text-muted);flex-shrink:0; }

        /* membership card */
        .cp-membership-card { background:linear-gradient(135deg,var(--brand) 0%,#1a3a6e 100%);border-radius:var(--radius-lg);padding:20px;position:relative;overflow:hidden; }
        .cp-membership-bg { position:absolute;inset:0;background:radial-gradient(ellipse 70% 70% at 80% 20%,rgba(201,169,110,.2) 0%,transparent 70%);pointer-events:none; }
        .cp-membership-inner { display:flex;align-items:center;gap:12px;margin-bottom:16px;position:relative;z-index:1; }
        .cp-membership-icon { width:40px;height:40px;border-radius:var(--radius-md);background:var(--accent);color:var(--brand);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .cp-membership-label { font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:rgba(255,255,255,.4); }
        .cp-membership-name { font-size:15px;font-weight:600;color:#fff;margin-top:1px; }
        .cp-membership-perks { position:relative;z-index:1;display:flex;flex-direction:column;gap:6px; }
        .cp-perk { font-size:12px;color:rgba(255,255,255,.6); }

        @media(max-width:1024px) { .cp-layout{grid-template-columns:1fr;} .cp-side-col{position:static;} }
        @media(max-width:768px) { .cp-stats-row{grid-template-columns:repeat(3,1fr);} .cp-form-row{grid-template-columns:1fr;} }
        @media(max-width:480px) { .cp-stats-row{grid-template-columns:1fr;} }
      `}</style>
    </div>
  )
}

// helper inline icon component (phone)
function PhoneIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.93a16 16 0 006.16 6.16l1.29-1.29a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  )
}

function DollarSign2({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  )
}