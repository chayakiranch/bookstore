import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

export default function AuthCard({ title, subtitle, footer, isAdmin = false, children }) {
  return (
    <div className={`ac-page ${isAdmin ? 'ac-page--admin' : ''}`}>
      <div className="ac-bg-panel ac-bg-panel--1" />
      <div className="ac-bg-panel ac-bg-panel--2" />

      <div className="ac-inner">
        <Link to={isAdmin ? '/auth/admin/login' : '/'} className="ac-brand">
          <div className={`ac-brand-icon ${isAdmin ? 'ac-brand-icon--admin' : ''}`}>
            <BookOpen size={20} />
          </div>
          <span className="ac-brand-name">Folio</span>
          {isAdmin && <span className="ac-admin-pill">Admin</span>}
        </Link>

        <div className="ac-card">
          <div className="ac-card-head">
            <h1 className="ac-title">{title}</h1>
            {subtitle && <p className="ac-subtitle">{subtitle}</p>}
          </div>
          <div className="ac-card-body">{children}</div>
        </div>

        {footer && <div className="ac-footer">{footer}</div>}
      </div>

      <style>{`
        .ac-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); padding: 32px 16px; position: relative; overflow: hidden; }
        .ac-page--admin { background: var(--brand); }
        .ac-bg-panel { position: absolute; border-radius: 50%; pointer-events: none; }
        .ac-bg-panel--1 { width: 480px; height: 480px; background: radial-gradient(circle, rgba(201,169,110,.12) 0%, transparent 70%); top: -120px; right: -120px; }
        .ac-bg-panel--2 { width: 320px; height: 320px; background: radial-gradient(circle, rgba(201,169,110,.08) 0%, transparent 70%); bottom: -80px; left: -80px; }
        .ac-inner { width: 100%; max-width: 440px; display: flex; flex-direction: column; align-items: center; gap: 24px; position: relative; z-index: 1; animation: ac-fade-up .4s ease both; }
        @keyframes ac-fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .ac-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .ac-brand-icon { width: 40px; height: 40px; background: var(--accent); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--brand); box-shadow: 0 4px 12px rgba(201,169,110,.35); }
        .ac-brand-name { font-family: var(--font-display); font-size: 26px; font-weight: 600; color: var(--text-primary); letter-spacing: -.5px; }
        .ac-page--admin .ac-brand-name { color: #fff; }
        .ac-admin-pill { font-size: 10px; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; background: rgba(201,169,110,.2); color: var(--accent); border: 1px solid rgba(201,169,110,.3); padding: 2px 8px; border-radius: 99px; margin-left: 2px; }
        .ac-card { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden; }
        .ac-page--admin .ac-card { background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.1); backdrop-filter: blur(12px); }
        .ac-card-head { padding: 32px 32px 0; }
        .ac-title { font-family: var(--font-display); font-size: 26px; font-weight: 600; color: var(--text-primary); line-height: 1.2; }
        .ac-page--admin .ac-title { color: #fff; }
        .ac-subtitle { font-size: 14px; color: var(--text-secondary); margin-top: 6px; line-height: 1.5; }
        .ac-page--admin .ac-subtitle { color: rgba(255,255,255,.5); }
        .ac-card-body { padding: 28px 32px 32px; }
        .ac-footer { font-size: 13px; color: var(--text-secondary); text-align: center; }
        .ac-page--admin .ac-footer { color: rgba(255,255,255,.5); }
        .ac-footer a { color: var(--accent); font-weight: 500; text-decoration: none; transition: opacity .15s; }
        .ac-footer a:hover { opacity: .75; }
        @media (max-width: 480px) { .ac-card-head { padding: 24px 24px 0; } .ac-card-body { padding: 20px 24px 24px; } }
      `}</style>
    </div>
  )
}