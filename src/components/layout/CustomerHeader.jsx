import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  BookOpen, Search, ShoppingCart, User, LogOut,
  ChevronDown, Menu, X, Package
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function CustomerHeader({ onMenuToggle, menuOpen }) {
  const { isAuthenticated, user, logout } = useAuth()
  const { itemCount, toggleCart }         = useCart()
  const navigate  = useNavigate()
  const location  = useLocation()

  const [search, setSearch]         = useState('')
  const [userOpen, setUserOpen]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const userRef   = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    const handler = e => {
      if (userRef.current   && !userRef.current.contains(e.target))   setUserOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setUserOpen(false); setSearchOpen(false) }, [location.pathname])

  const handleSearch = e => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
      setSearch(''); setSearchOpen(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <header className="ch-header">
      <div className="ch-inner">

        <button className="ch-menu-btn hide-desktop" onClick={onMenuToggle} aria-label="Toggle menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" className="ch-brand">
          <div className="ch-brand-icon"><BookOpen size={18} /></div>
          <span className="ch-brand-name">Folio</span>
        </Link>

        <nav className="ch-nav hide-mobile">
          <Link to="/"                            className="ch-nav-link">Home</Link>
          <Link to="/books"                       className="ch-nav-link">All Books</Link>
          <Link to="/section/New Arrivals"        className="ch-nav-link">New Arrivals</Link>
          <Link to="/section/Best Sellers"        className="ch-nav-link">Best Sellers</Link>
          <Link to="/section/Deals & Discounts"   className="ch-nav-link">Deals</Link>
        </nav>

        <div className="ch-actions">
          {/* Search */}
          <div className="ch-search-wrap" ref={searchRef}>
            <button className="ch-icon-btn" onClick={() => setSearchOpen(s => !s)} aria-label="Search">
              <Search size={18} />
            </button>
            {searchOpen && (
              <form className="ch-search-dropdown" onSubmit={handleSearch}>
                <Search size={15} className="ch-search-icon" />
                <input autoFocus className="ch-search-input" value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search books or authors…" />
              </form>
            )}
          </div>

          {/* Cart */}
          <button className="ch-icon-btn ch-cart-btn" onClick={toggleCart} aria-label="Cart">
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="ch-cart-badge">{itemCount > 99 ? '99+' : itemCount}</span>
            )}
          </button>

          {/* User */}
          {isAuthenticated ? (
            <div className="ch-user-wrap" ref={userRef}>
              <button className="ch-user-btn" onClick={() => setUserOpen(o => !o)}>
                <div className="ch-avatar">{user?.avatar || user?.name?.[0] || 'U'}</div>
                <span className="ch-user-name hide-mobile">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className={`ch-chevron ${userOpen ? 'ch-chevron--open' : ''}`} />
              </button>
              {userOpen && (
                <div className="ch-dropdown">
                  <div className="ch-dropdown-header">
                    <div className="ch-avatar ch-avatar--lg">{user?.avatar || user?.name?.[0]}</div>
                    <div>
                      <p className="ch-dropdown-name">{user?.name}</p>
                      <p className="ch-dropdown-email">{user?.email}</p>
                    </div>
                  </div>
                  <div className="ch-dropdown-divider" />
                  <Link to="/profile" className="ch-dropdown-item"><User size={14} />My Profile</Link>
                  <Link to="/orders"  className="ch-dropdown-item"><Package size={14} />My Orders</Link>
                  <div className="ch-dropdown-divider" />
                  <button className="ch-dropdown-item ch-dropdown-item--danger" onClick={handleLogout}>
                    <LogOut size={14} />Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="ch-auth-links">
              <Link to="/auth/login"    className="btn btn-ghost btn-sm hide-mobile">Sign in</Link>
              <Link to="/auth/register" className="btn btn-accent btn-sm">Join free</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .ch-header { position:sticky;top:0;z-index:100;background:rgba(250,248,244,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);height:var(--header-h); }
        .ch-inner { max-width:1280px;margin:0 auto;padding:0 24px;height:100%;display:flex;align-items:center;gap:24px; }
        .ch-menu-btn { display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:var(--radius-md);color:var(--text-primary);transition:background .15s; }
        .ch-menu-btn:hover { background:var(--bg-alt); }
        .hide-desktop { display:none; }
        .ch-brand { display:flex;align-items:center;gap:8px;flex-shrink:0; }
        .ch-brand-icon { width:34px;height:34px;background:var(--brand);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:var(--accent); }
        .ch-brand-name { font-family:var(--font-display);font-size:22px;font-weight:600;color:var(--text-primary);letter-spacing:-.4px; }
        .ch-nav { display:flex;align-items:center;gap:4px;flex:1; }
        .ch-nav-link { padding:6px 12px;border-radius:var(--radius-md);font-size:14px;color:var(--text-secondary);transition:color .15s,background .15s;white-space:nowrap; }
        .ch-nav-link:hover { color:var(--text-primary);background:var(--bg-alt); }
        .ch-actions { display:flex;align-items:center;gap:8px;margin-left:auto; }
        .ch-icon-btn { position:relative;width:38px;height:38px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:var(--text-secondary);transition:color .15s,background .15s; }
        .ch-icon-btn:hover { color:var(--text-primary);background:var(--bg-alt); }
        .ch-search-wrap { position:relative; }
        .ch-search-dropdown { position:absolute;top:calc(100% + 8px);right:0;width:300px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);display:flex;align-items:center;padding:6px 12px;gap:8px;animation:ch-drop .15s ease; }
        .ch-search-icon { color:var(--text-muted);flex-shrink:0; }
        .ch-search-input { flex:1;border:none;outline:none;font-size:14px;background:transparent;color:var(--text-primary);padding:6px 0;font-family:var(--font-body); }
        .ch-search-input::placeholder { color:var(--text-muted); }
        .ch-cart-badge { position:absolute;top:4px;right:4px;min-width:16px;height:16px;border-radius:99px;background:var(--accent);color:var(--brand);font-size:9px;font-weight:600;display:flex;align-items:center;justify-content:center;padding:0 3px; }
        .ch-user-wrap { position:relative; }
        .ch-user-btn { display:flex;align-items:center;gap:8px;padding:5px 10px 5px 5px;border-radius:var(--radius-xl);border:1.5px solid var(--border);background:var(--surface);transition:border-color .15s,box-shadow .15s;cursor:pointer; }
        .ch-user-btn:hover { border-color:var(--accent);box-shadow:var(--shadow-sm); }
        .ch-avatar { width:28px;height:28px;border-radius:50%;background:var(--brand);color:var(--accent);font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .ch-avatar--lg { width:36px;height:36px;font-size:13px; }
        .ch-user-name { font-size:13px;font-weight:500;color:var(--text-primary); }
        .ch-chevron { color:var(--text-muted);transition:transform .2s; }
        .ch-chevron--open { transform:rotate(180deg); }
        .ch-dropdown { position:absolute;top:calc(100% + 8px);right:0;width:220px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);padding:8px;animation:ch-drop .15s ease; }
        @keyframes ch-drop { from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)} }
        .ch-dropdown-header { display:flex;align-items:center;gap:10px;padding:10px 8px 12px; }
        .ch-dropdown-name { font-size:13px;font-weight:600;color:var(--text-primary); }
        .ch-dropdown-email { font-size:11px;color:var(--text-muted);margin-top:1px; }
        .ch-dropdown-divider { border:none;border-top:1px solid var(--border);margin:4px 0; }
        .ch-dropdown-item { display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:var(--radius-md);font-size:13px;color:var(--text-secondary);transition:background .15s,color .15s;width:100%;text-decoration:none;cursor:pointer; }
        .ch-dropdown-item:hover { background:var(--bg-alt);color:var(--text-primary); }
        .ch-dropdown-item--danger:hover { background:#fadbd8;color:var(--danger); }
        .ch-auth-links { display:flex;align-items:center;gap:6px; }
        @media(max-width:768px){ .ch-inner{padding:0 16px;gap:12px;} .hide-desktop{display:flex;} .ch-search-dropdown{width:260px;right:-40px;} }
      `}</style>
    </header>
  )
}