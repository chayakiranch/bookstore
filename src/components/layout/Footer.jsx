import { Link } from 'react-router-dom'
import { BookOpen, Github, Twitter, Instagram, Mail } from 'lucide-react'

const LINKS = {
  Shop: [
    { label: 'All Books',          to: '/books' },
    { label: 'New Arrivals',       to: '/section/New Arrivals' },
    { label: 'Best Sellers',       to: '/section/Best Sellers' },
    { label: 'Award Winners',      to: '/section/Award Winners' },
    { label: 'Deals & Discounts',  to: '/section/Deals & Discounts' },
    { label: 'E-Books',            to: '/section/E-Books' },
  ],
  Genres: [
    { label: 'Fiction',          to: '/genre/Fiction' },
    { label: 'Non-Fiction',      to: '/genre/Non-Fiction' },
    { label: 'Academic',         to: '/genre/Academic' },
    { label: "Children's Books", to: "/genre/Children's Books" },
  ],
  Account: [
    { label: 'Sign In',    to: '/auth/login' },
    { label: 'Register',   to: '/auth/register' },
    { label: 'My Orders',  to: '/orders' },
    { label: 'My Profile', to: '/profile' },
  ],
  Company: [
    { label: 'About Folio',     to: '#' },
    { label: 'Contact Us',      to: '#' },
    { label: 'Privacy Policy',  to: '#' },
    { label: 'Terms of Service',to: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="ft-footer">
      <div className="ft-top">
        <div className="container ft-grid">
          <div className="ft-brand-col">
            <Link to="/" className="ft-brand">
              <div className="ft-brand-icon"><BookOpen size={18} /></div>
              <span className="ft-brand-name">Folio</span>
            </Link>
            <p className="ft-tagline">Your curated destination for books that inspire, educate, and entertain.</p>
            <div className="ft-socials">
              {[
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Github, href: '#', label: 'GitHub' },
                { Icon: Mail, href: '#', label: 'Email' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} className="ft-social-btn" aria-label={label}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group} className="ft-link-col">
              <p className="ft-col-heading">{group}</p>
              <ul className="ft-link-list">
                {items.map(item => (
                  <li key={item.label}><Link to={item.to} className="ft-link">{item.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="ft-bottom">
        <div className="container ft-bottom-inner">
          <p className="ft-copy">© {new Date().getFullYear()} Folio Bookstore. All rights reserved.</p>
          <div className="ft-badges">
            <span className="ft-badge">📦 Free shipping over $35</span>
            <span className="ft-badge">🔒 Secure checkout</span>
            <span className="ft-badge">↩ Easy returns</span>
          </div>
        </div>
      </div>

      <style>{`
        .ft-footer { background:var(--brand);color:rgba(255,255,255,.7);margin-top:auto; }
        .ft-top { padding:60px 0 48px; }
        .ft-grid { display:grid;grid-template-columns:1.8fr repeat(4,1fr);gap:40px; }
        .ft-brand { display:flex;align-items:center;gap:8px;margin-bottom:14px; }
        .ft-brand-icon { width:34px;height:34px;background:var(--accent);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:var(--brand); }
        .ft-brand-name { font-family:var(--font-display);font-size:22px;font-weight:600;color:#fff; }
        .ft-tagline { font-size:13px;line-height:1.6;max-width:220px;margin-bottom:20px; }
        .ft-socials { display:flex;gap:8px; }
        .ft-social-btn { width:34px;height:34px;border-radius:var(--radius-md);background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.6);transition:background .15s,color .15s; }
        .ft-social-btn:hover { background:var(--accent);color:var(--brand); }
        .ft-col-heading { font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#fff;margin-bottom:14px; }
        .ft-link-list { display:flex;flex-direction:column;gap:8px; }
        .ft-link { font-size:13px;color:rgba(255,255,255,.55);text-decoration:none;transition:color .15s; }
        .ft-link:hover { color:var(--accent); }
        .ft-bottom { border-top:1px solid rgba(255,255,255,.08);padding:18px 0; }
        .ft-bottom-inner { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px; }
        .ft-copy { font-size:12px;color:rgba(255,255,255,.35); }
        .ft-badges { display:flex;gap:16px;flex-wrap:wrap; }
        .ft-badge { font-size:12px;color:rgba(255,255,255,.45); }
        @media(max-width:1024px){ .ft-grid{grid-template-columns:1fr 1fr;} .ft-brand-col{grid-column:1/-1;} }
        @media(max-width:640px){ .ft-grid{grid-template-columns:1fr 1fr;gap:28px;} .ft-top{padding:40px 0 32px;} .ft-bottom-inner{flex-direction:column;align-items:flex-start;} }
      `}</style>
    </footer>
  )
}