import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ChevronRight, BookOpen, Sparkles, TrendingUp, Award,
  Tablet, Tag, Wand2, Heart, Search, Skull,
  Brain, Briefcase, User, Clock,
  Wrench, Monitor, Calculator, Baby, X
} from 'lucide-react'

const GENRE_TREE = [
  {
    label: 'Fiction', icon: BookOpen, path: '/genre/Fiction',
    children: [
      { label: 'Fantasy', icon: Wand2,  path: '/genre/Fiction?cat=Fantasy' },
      { label: 'Romance', icon: Heart,  path: '/genre/Fiction?cat=Romance' },
      { label: 'Mystery', icon: Search, path: '/genre/Fiction?cat=Mystery' },
      { label: 'Horror',  icon: Skull,  path: '/genre/Fiction?cat=Horror'  },
    ],
  },
  {
    label: 'Non-Fiction', icon: Brain, path: '/genre/Non-Fiction',
    children: [
      { label: 'Self-Help', icon: Sparkles,  path: '/genre/Non-Fiction?cat=Self-Help' },
      { label: 'Business',  icon: Briefcase, path: '/genre/Non-Fiction?cat=Business'  },
      { label: 'Biography', icon: User,      path: '/genre/Non-Fiction?cat=Biography' },
      { label: 'History',   icon: Clock,     path: '/genre/Non-Fiction?cat=History'   },
    ],
  },
  {
    label: 'Academic', icon: Monitor, path: '/genre/Academic',
    children: [
      { label: 'Engineering',      icon: Wrench,     path: '/genre/Academic?cat=Engineering'      },
      { label: 'Computer Science', icon: Monitor,    path: '/genre/Academic?cat=Computer Science'  },
      { label: 'Mathematics',      icon: Calculator, path: '/genre/Academic?cat=Mathematics'      },
    ],
  },
  { label: "Children's Books", icon: Baby, path: "/genre/Children's Books" },
]

const SPECIAL_SECTIONS = [
  { label: 'New Arrivals',      icon: Sparkles,   path: '/section/New Arrivals',      color: '#27ae60' },
  { label: 'Best Sellers',      icon: TrendingUp, path: '/section/Best Sellers',      color: '#e67e22' },
  { label: 'Award Winners',     icon: Award,      path: '/section/Award Winners',     color: '#8e44ad' },
  { label: 'E-Books',           icon: Tablet,     path: '/section/E-Books',           color: '#2980b9' },
  { label: 'Deals & Discounts', icon: Tag,        path: '/section/Deals & Discounts', color: '#c0392b' },
]

function GenreItem({ item, depth = 0 }) {
  const location = useLocation()
  const isActive = location.pathname + location.search === item.path ||
                   location.pathname === item.path
  const [open, setOpen] = useState(
    item.children?.some(c => location.pathname.includes(c.path.split('?')[0]))
  )
  const Icon = item.icon

  if (item.children?.length) {
    return (
      <div className="gs-group">
        <button
          className={`gs-item gs-item--parent ${isActive ? 'gs-item--active' : ''}`}
          onClick={() => setOpen(o => !o)}
        >
          <Icon size={15} className="gs-item-icon" />
          <span className="gs-item-label">{item.label}</span>
          <ChevronRight size={13} className={`gs-item-chevron ${open ? 'gs-item-chevron--open' : ''}`} />
        </button>
        {open && (
          <div className="gs-children">
            {item.children.map(child => (
              <GenreItem key={child.label} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link to={item.path} className={`gs-item ${depth > 0 ? 'gs-item--child' : ''} ${isActive ? 'gs-item--active' : ''}`}>
      <Icon size={depth > 0 ? 13 : 15} className="gs-item-icon" />
      <span className="gs-item-label">{item.label}</span>
    </Link>
  )
}

export default function GenreSidebar({ mobileOpen, onClose }) {
  return (
    <>
      {mobileOpen && <div className="gs-overlay" onClick={onClose} />}
      <aside className={`gs-sidebar ${mobileOpen ? 'gs-sidebar--open' : ''}`}>
        <div className="gs-mobile-head">
          <span className="gs-mobile-title">Browse</span>
          <button className="gs-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="gs-scroll">
          <div className="gs-section">
            <p className="gs-section-label">Discover</p>
            {SPECIAL_SECTIONS.map(s => {
              const Icon = s.icon
              return (
                <Link key={s.label} to={s.path} className="gs-special" onClick={onClose}>
                  <span className="gs-special-dot" style={{ background: s.color }} />
                  <Icon size={14} style={{ color: s.color }} />
                  <span className="gs-special-label">{s.label}</span>
                </Link>
              )
            })}
          </div>
          <div className="gs-divider" />
          <div className="gs-section">
            <p className="gs-section-label">Browse by genre</p>
            {GENRE_TREE.map(item => (
              <div key={item.label} onClick={item.children ? undefined : onClose}>
                <GenreItem item={item} />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .gs-overlay { display:none;position:fixed;inset:0;background:rgba(26,26,46,.4);z-index:199;backdrop-filter:blur(2px); }
          .gs-sidebar { width:var(--sidebar-w);flex-shrink:0;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;height:calc(100vh - var(--header-h));position:sticky;top:var(--header-h);overflow:hidden; }
          .gs-mobile-head { display:none;align-items:center;justify-content:space-between;padding:16px 16px 8px;flex-shrink:0; }
          .gs-mobile-title { font-family:var(--font-display);font-size:18px;font-weight:600; }
          .gs-close-btn { width:32px;height:32px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:var(--text-secondary);transition:background .15s; }
          .gs-close-btn:hover { background:var(--bg-alt); }
          .gs-scroll { flex:1;overflow-y:auto;padding:16px 12px; }
          .gs-section { display:flex;flex-direction:column;gap:2px; }
          .gs-section-label { font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted);padding:4px 8px 8px; }
          .gs-divider { border:none;border-top:1px solid var(--border);margin:12px 0; }
          .gs-special { display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:var(--radius-md);font-size:13px;font-weight:500;color:var(--text-secondary);transition:background .15s,color .15s;text-decoration:none; }
          .gs-special:hover { background:var(--bg-alt);color:var(--text-primary); }
          .gs-special-dot { width:5px;height:5px;border-radius:50%;flex-shrink:0; }
          .gs-special-label { flex:1; }
          .gs-item { display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:var(--radius-md);font-size:13px;color:var(--text-secondary);transition:background .15s,color .15s;width:100%;text-decoration:none;cursor:pointer;background:none;border:none;font-family:var(--font-body); }
          .gs-item:hover { background:var(--bg-alt);color:var(--text-primary); }
          .gs-item--active { background:var(--accent-light);color:var(--accent-dark);font-weight:500; }
          .gs-item--active:hover { background:var(--accent-light); }
          .gs-item--child { padding-left:32px;font-size:12.5px; }
          .gs-item-icon { flex-shrink:0;color:inherit; }
          .gs-item-label { flex:1;text-align:left; }
          .gs-item-chevron { flex-shrink:0;color:var(--text-muted);transition:transform .2s; }
          .gs-item-chevron--open { transform:rotate(90deg); }
          .gs-children { display:flex;flex-direction:column;gap:1px;margin-top:2px; }
          .gs-group { display:flex;flex-direction:column; }
          @media(max-width:768px){
            .gs-overlay{display:block;}
            .gs-sidebar{position:fixed;top:0;left:0;z-index:200;height:100vh;transform:translateX(-100%);transition:transform .25s ease;box-shadow:var(--shadow-lg);}
            .gs-sidebar--open{transform:translateX(0);}
            .gs-mobile-head{display:flex;}
          }
        `}</style>
      </aside>
    </>
  )
}