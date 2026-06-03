import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, ShoppingCart, User, Tag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { label: 'Home',    path: '/',                           icon: Home        },
  { label: 'Books',   path: '/books',                      icon: BookOpen    },
  { label: 'Deals',   path: '/section/Deals & Discounts',  icon: Tag         },
  { label: 'Cart',    path: '/cart',                       icon: ShoppingCart, isCart: true },
  { label: 'Account', path: '/profile',                    icon: User,         isAuth: true },
]

export default function MobileNav() {
  const { itemCount, toggleCart } = useCart()
  const { isAuthenticated }       = useAuth()
  const location                  = useLocation()

  const isActive = path =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <>
      <nav className="mn-nav" role="navigation" aria-label="Mobile navigation">
        {NAV_ITEMS.map(item => {
          const Icon    = item.icon
          const active  = isActive(item.path)
          const authPath = !isAuthenticated && item.isAuth ? '/auth/login' : item.path

          if (item.isCart) {
            return (
              <button key="cart" className={`mn-item ${active ? 'mn-item--active' : ''}`}
                onClick={toggleCart} aria-label="Cart">
                <div className="mn-icon-wrap">
                  <Icon size={22} />
                  {itemCount > 0 && (
                    <span className="mn-badge">{itemCount > 9 ? '9+' : itemCount}</span>
                  )}
                </div>
                <span className="mn-label">Cart</span>
              </button>
            )
          }

          return (
            <Link key={item.path} to={authPath}
              className={`mn-item ${active ? 'mn-item--active' : ''}`}>
              <div className="mn-icon-wrap"><Icon size={22} /></div>
              <span className="mn-label">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mn-spacer" aria-hidden="true" />

      <style>{`
        .mn-nav { display:none;position:fixed;bottom:0;left:0;right:0;height:64px;background:var(--surface);border-top:1px solid var(--border);box-shadow:0 -4px 20px rgba(26,26,46,.08);z-index:150;align-items:stretch;justify-content:space-around;padding:0 4px;padding-bottom:env(safe-area-inset-bottom,0px); }
        .mn-item { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;flex:1;padding:8px 4px;border:none;background:none;cursor:pointer;text-decoration:none;color:var(--text-muted);font-family:var(--font-body);transition:color .15s;position:relative;border-radius:var(--radius-md); }
        .mn-item:active { opacity:.7; }
        .mn-item--active { color:var(--accent); }
        .mn-item--active::before { content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:28px;height:3px;background:var(--accent);border-radius:0 0 99px 99px; }
        .mn-icon-wrap { position:relative;display:flex;align-items:center;justify-content:center; }
        .mn-badge { position:absolute;top:-6px;right:-8px;min-width:16px;height:16px;border-radius:99px;background:var(--accent);color:var(--brand);font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 3px;border:2px solid var(--surface); }
        .mn-label { font-size:10px;font-weight:500;letter-spacing:.02em; }
        .mn-spacer { display:none;height:64px; }
        @media(max-width:768px) { .mn-nav{display:flex;} .mn-spacer{display:block;} }
        @supports (padding-bottom:env(safe-area-inset-bottom)) {
          .mn-nav { height:calc(64px + env(safe-area-inset-bottom));padding-bottom:env(safe-area-inset-bottom); }
          .mn-spacer { height:calc(64px + env(safe-area-inset-bottom)); }
        }
      `}</style>
    </>
  )
}