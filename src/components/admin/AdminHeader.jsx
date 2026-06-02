import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Bell, Search, User, LogOut, BookOpen, ChevronDown, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useBooks } from '../../context/BooksContext'

const PAGE_TITLES = {
  '/admin/dashboard':  'Dashboard',
  '/admin/books':      'Manage Books',
  '/admin/books/add':  'Add New Book',
  '/admin/orders':     'Orders',
  '/admin/analytics':  'Analytics',
}

export default function AdminHeader({ onMenuToggle }) {
  const { user, logout }   = useAuth()
  const { books, orders }  = useBooks()
  const location           = useLocation()
  const navigate           = useNavigate()

  const [userOpen,   setUserOpen]   = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ,    setSearchQ]    = useState('')
  const userRef   = useRef(null)
  const searchRef = useRef(null)

  const pageTitle = PAGE_TITLES[location.pathname] ||
    (location.pathname.includes('/edit') ? 'Edit Book' : 'Admin')

  // close dropdowns on outside click
  useEffect(() => {
    const h = e => {
      if (userRef.current   && !userRef.current.contains(e.target))   setUserOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => { setUserOpen(false); setSearchOpen(false) }, [location.pathname])

  const handleSearch = e => {
    e.preventDefault()
    if (searchQ.trim()) navigate(`/admin/books?q=${encodeURIComponent(searchQ.trim())}`)
  }

  const handleLogout = () => { logout(); navigate('/') }

  // quick stats for header
  const totalBooks  = books.length
  const totalOrders = orders.length
  const newOrders   = orders.filter(o => o.status === 'confirmed').length

  return (
    <header className="ah-header">
      <div className="ah-left">
        <button className="ah-menu-btn hide-desktop" onClick={onMenuToggle} aria-label="Toggle menu">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="ah-page-title">{pageTitle}</h1>
          <p className="ah-breadcrumb">
            Admin <span>/</span> {pageTitle}
          </p>
        </div>
      </div>

      <div className="ah-right">
        {/* quick stats — desktop only */}
        <div className="ah-stats hide-mobile">
          <div className="ah-stat">
            <span className="ah-stat-num">{totalBooks}</span>
            <span className="ah-stat-label">Books</span>
          </div>
          <div className="ah-stat-div" />
          <div className="ah-stat">
            <span className="ah-stat-num">{totalOrders}</span>
            <span className="ah-stat-label">Orders</span>
          </div>
        </div>

        {/* search */}
        <div className="ah-search-wrap" ref={searchRef}>
          <button className="ah-icon-btn" onClick={() => setSearchOpen(o => !o)} aria-label="Search">
            <Search size={17} />
          </button>
          {searchOpen && (
            <form className="ah-search-drop" onSubmit={handleSearch}>
              <Search size={14} className="ah-search-icon" />
              <input
                autoFocus
                className="ah-search-input"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search books…"
              />
            </form>
          )}
        </div>

        {/* notifications */}
        <button className="ah-icon-btn ah-notif-btn" aria-label="Notifications">
          <Bell size={17} />
          {newOrders > 0 && <span className="ah-notif-badge">{newOrders}</span>}
        </button>

        {/* user menu */}
        <div className="ah-user-wrap" ref={userRef}>
          <button className="ah-user-btn" onClick={() => setUserOpen(o => !o)}>
            <div className="ah-avatar">{user?.avatar || user?.name?.[0] || 'A'}</div>
            <span className="ah-user-name hide-mobile">{user?.name?.split(' ')[0]}</span>
            <ChevronDown size={13} className={`ah-chevron ${userOpen ? 'ah-chevron--open' : ''}`} />
          </button>
          {userOpen && (
            <div className="ah-dropdown">
              <div className="ah-dropdown-head">
                <div className="ah-avatar ah-avatar--lg">{user?.avatar || user?.name?.[0]}</div>
                <div>
                  <p className="ah-dropdown-name">{user?.name}</p>
                  <p className="ah-dropdown-role">Administrator</p>
                </div>
              </div>
              <div className="ah-dropdown-div" />
              <Link to="/" className="ah-dropdown-item" target="_blank">
                <BookOpen size={14} /> View Store
              </Link>
              <button className="ah-dropdown-item ah-dropdown-item--danger" onClick={handleLogout}>
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .ah-header {
          height: 64px; background: var(--surface);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; gap: 16px;
          position: sticky; top: 0; z-index: 100;
          box-shadow: var(--shadow-sm);
        }
        .ah-left { display: flex; align-items: center; gap: 14px; }
        .ah-right { display: flex; align-items: center; gap: 8px; margin-left: auto; }
        .ah-menu-btn { width:38px;height:38px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:var(--text-secondary);transition:background .15s;background:none;border:none;cursor:pointer; }
        .ah-menu-btn:hover { background:var(--bg-alt); }
        .ah-page-title { font-size:17px;font-weight:600;color:var(--text-primary);line-height:1; }
        .ah-breadcrumb { font-size:11px;color:var(--text-muted);margin-top:2px; }
        .ah-breadcrumb span { margin:0 4px;opacity:.5; }
        .ah-stats { display:flex;align-items:center;gap:14px;padding:0 14px;border-right:1px solid var(--border);margin-right:4px; }
        .ah-stat { display:flex;flex-direction:column;align-items:center;gap:1px; }
        .ah-stat-num { font-size:15px;font-weight:700;color:var(--text-primary);line-height:1; }
        .ah-stat-label { font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em; }
        .ah-stat-div { width:1px;height:28px;background:var(--border); }
        .ah-search-wrap { position:relative; }
        .ah-search-drop { position:absolute;top:calc(100% + 8px);right:0;width:260px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);display:flex;align-items:center;padding:6px 12px;gap:8px;animation:ah-drop .15s ease; }
        .ah-search-icon { color:var(--text-muted);flex-shrink:0; }
        .ah-search-input { flex:1;border:none;outline:none;font-size:13px;background:transparent;color:var(--text-primary);padding:5px 0;font-family:var(--font-body); }
        .ah-search-input::placeholder { color:var(--text-muted); }
        .ah-icon-btn { position:relative;width:38px;height:38px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:var(--text-secondary);background:none;border:none;cursor:pointer;transition:background .15s,color .15s; }
        .ah-icon-btn:hover { background:var(--bg-alt);color:var(--text-primary); }
        .ah-notif-badge { position:absolute;top:6px;right:6px;min-width:14px;height:14px;border-radius:99px;background:var(--danger);color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 3px; }
        .ah-user-wrap { position:relative; }
        .ah-user-btn { display:flex;align-items:center;gap:7px;padding:4px 8px 4px 4px;border-radius:var(--radius-xl);border:1.5px solid var(--border);background:var(--surface);cursor:pointer;transition:border-color .15s;font-family:var(--font-body); }
        .ah-user-btn:hover { border-color:var(--accent); }
        .ah-avatar { width:28px;height:28px;border-radius:50%;background:var(--brand);color:var(--accent);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .ah-avatar--lg { width:34px;height:34px;font-size:13px; }
        .ah-user-name { font-size:13px;font-weight:500;color:var(--text-primary); }
        .ah-chevron { color:var(--text-muted);transition:transform .2s; }
        .ah-chevron--open { transform:rotate(180deg); }
        .ah-dropdown { position:absolute;top:calc(100% + 8px);right:0;width:210px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);padding:8px;animation:ah-drop .15s ease; }
        @keyframes ah-drop { from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)} }
        .ah-dropdown-head { display:flex;align-items:center;gap:10px;padding:8px 8px 10px; }
        .ah-dropdown-name { font-size:13px;font-weight:600;color:var(--text-primary); }
        .ah-dropdown-role { font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-top:1px; }
        .ah-dropdown-div { border:none;border-top:1px solid var(--border);margin:4px 0; }
        .ah-dropdown-item { display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:var(--radius-md);font-size:13px;color:var(--text-secondary);text-decoration:none;transition:background .15s,color .15s;width:100%;background:none;border:none;cursor:pointer;font-family:var(--font-body); }
        .ah-dropdown-item:hover { background:var(--bg-alt);color:var(--text-primary); }
        .ah-dropdown-item--danger:hover { background:#fadbd8;color:var(--danger); }
        .hide-desktop { display:none; }
        @media(max-width:768px) { .ah-header{padding:0 16px;} .hide-desktop{display:flex;} }
      `}</style>
    </header>
  )
}