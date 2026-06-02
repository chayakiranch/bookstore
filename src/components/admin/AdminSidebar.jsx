import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  BookOpen, LayoutDashboard, PlusCircle,
  ShoppingBag, BarChart2, LogOut,
  ChevronLeft, ChevronRight, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
    ],
  },
  {
    group: 'Catalogue',
    items: [
      { label: 'All Books', path: '/admin/books',     icon: BookOpen   },
      { label: 'Add Book',  path: '/admin/books/add', icon: PlusCircle },
    ],
  },
  {
    group: 'Sales',
    items: [
      { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    ],
  },
]

function NavItem({ item, collapsed, onClick }) {
  const location = useLocation()
  const isActive = location.pathname === item.path ||
    (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path))
  const Icon = item.icon

  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={`as-nav-item ${isActive ? 'as-nav-item--active' : ''} ${collapsed ? 'as-nav-item--collapsed' : ''}`}
      title={collapsed ? item.label : undefined}
    >
      <Icon size={18} className="as-nav-icon" />
      {!collapsed && <span className="as-nav-label">{item.label}</span>}
      {isActive && !collapsed && <span className="as-nav-dot" />}
    </Link>
  )
}

export default function AdminSidebar({ mobileOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <>
      {mobileOpen && <div className="as-overlay" onClick={onClose} />}

      <aside className={`as-sidebar ${collapsed ? 'as-sidebar--collapsed' : ''} ${mobileOpen ? 'as-sidebar--mobile-open' : ''}`}>

        {/* brand */}
        <div className="as-brand">
          <div className="as-brand-icon"><BookOpen size={18} /></div>
          {!collapsed && (
            <div className="as-brand-text">
              <span className="as-brand-name">Folio</span>
              <span className="as-brand-sub">Admin Panel</span>
            </div>
          )}
          <button className="as-mobile-close hide-desktop" onClick={onClose}><X size={18} /></button>
        </div>

        {/* collapse toggle */}
        <button
          className="as-collapse-btn hide-mobile"
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>

        {/* nav */}
        <nav className="as-nav">
          {NAV.map(group => (
            <div key={group.group} className="as-nav-group">
              {!collapsed && <p className="as-group-label">{group.group}</p>}
              {group.items.map(item => (
                <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
              ))}
            </div>
          ))}
        </nav>

        {/* footer */}
        <div className="as-footer">
          {!collapsed && (
            <Link to="/" className="as-view-store">
              <BookOpen size={13} /> View store
            </Link>
          )}
          <div className="as-user-row">
            <div className="as-avatar">{user?.avatar || user?.name?.[0] || 'A'}</div>
            {!collapsed && (
              <div className="as-user-info">
                <p className="as-user-name">{user?.name}</p>
                <p className="as-user-role">Administrator</p>
              </div>
            )}
            <button className="as-logout-btn" onClick={handleLogout} title="Sign out">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
      {/* styles in file */}
    </>
  )
}