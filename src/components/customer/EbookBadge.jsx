import { Zap, Download, Wifi } from 'lucide-react'

// ─── EbookBadge ───────────────────────────────────────────────────────────────
// Props:
//   variant — 'pill' (default) | 'card' | 'banner' | 'icon'
//   size    — 'sm' | 'md' (default) | 'lg'
//   showPerks — show instant download / read anywhere perks (card/banner only)

export default function EbookBadge({ variant = 'pill', size = 'md', showPerks = false }) {

  // ── icon only ──────────────────────────────────────────────────────────────
  if (variant === 'icon') {
    return (
      <span className={`eb-icon eb-icon--${size}`} title="E-Book — instant download">
        <Zap size={size === 'sm' ? 9 : size === 'lg' ? 14 : 11} />
        <style>{`
          .eb-icon { display:inline-flex;align-items:center;justify-content:center;
            width:var(--s);height:var(--s);border-radius:4px;
            background:rgba(41,128,185,.85);color:#fff;flex-shrink:0; }
          .eb-icon--sm  { --s:18px; }
          .eb-icon--md  { --s:22px; }
          .eb-icon--lg  { --s:28px; }
        `}</style>
      </span>
    )
  }

  // ── pill (default) ─────────────────────────────────────────────────────────
  if (variant === 'pill') {
    return (
      <span className={`eb-pill eb-pill--${size}`}>
        <Zap size={size === 'sm' ? 9 : size === 'lg' ? 13 : 11} />
        E-Book
        <style>{`
          .eb-pill { display:inline-flex;align-items:center;gap:4px;
            border-radius:99px;font-weight:600;letter-spacing:.03em;
            background:#d6eaf8;color:#1a5276;border:1px solid #aed6f1; }
          .eb-pill--sm { font-size:9px;  padding:2px 7px; }
          .eb-pill--md { font-size:11px; padding:3px 9px; }
          .eb-pill--lg { font-size:13px; padding:5px 12px; }
        `}</style>
      </span>
    )
  }

  // ── card ───────────────────────────────────────────────────────────────────
  if (variant === 'card') {
    return (
      <div className="eb-card">
        <div className="eb-card-head">
          <div className="eb-card-icon"><Zap size={16} /></div>
          <div>
            <p className="eb-card-title">E-Book Available</p>
            <p className="eb-card-sub">Digital instant download</p>
          </div>
        </div>
        {showPerks && (
          <div className="eb-card-perks">
            <div className="eb-perk"><Download size={12} />Instant delivery</div>
            <div className="eb-perk"><Wifi size={12} />Read anywhere</div>
          </div>
        )}
        <style>{`
          .eb-card { background:#eaf4fb;border:1px solid #aed6f1;border-radius:var(--radius-md);padding:12px 14px;display:flex;flex-direction:column;gap:10px; }
          .eb-card-head { display:flex;align-items:center;gap:10px; }
          .eb-card-icon { width:32px;height:32px;border-radius:var(--radius-sm);background:#2980b9;color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
          .eb-card-title { font-size:13px;font-weight:600;color:#1a5276; }
          .eb-card-sub { font-size:11px;color:#5499b8;margin-top:1px; }
          .eb-card-perks { display:flex;gap:12px;flex-wrap:wrap; }
          .eb-perk { display:flex;align-items:center;gap:5px;font-size:12px;font-weight:500;color:#2471a3; }
        `}</style>
      </div>
    )
  }

  // ── banner ─────────────────────────────────────────────────────────────────
  if (variant === 'banner') {
    return (
      <div className="eb-banner">
        <div className="eb-banner-bg" />
        <div className="eb-banner-inner">
          <div className="eb-banner-icon"><Zap size={22} /></div>
          <div className="eb-banner-text">
            <p className="eb-banner-title">Also available as an E-Book</p>
            <p className="eb-banner-sub">Download instantly and start reading in seconds</p>
          </div>
          {showPerks && (
            <div className="eb-banner-perks">
              <span className="eb-banner-perk"><Download size={12} />Instant</span>
              <span className="eb-banner-perk"><Wifi size={12} />Any device</span>
            </div>
          )}
        </div>
        <style>{`
          .eb-banner { position:relative;background:linear-gradient(135deg,#1a5276 0%,#2980b9 100%);border-radius:var(--radius-md);padding:14px 18px;overflow:hidden; }
          .eb-banner-bg { position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 90% 50%,rgba(255,255,255,.1) 0%,transparent 70%);pointer-events:none; }
          .eb-banner-inner { position:relative;z-index:1;display:flex;align-items:center;gap:14px;flex-wrap:wrap; }
          .eb-banner-icon { width:40px;height:40px;border-radius:var(--radius-md);background:rgba(255,255,255,.15);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0; }
          .eb-banner-text { flex:1;min-width:0; }
          .eb-banner-title { font-size:14px;font-weight:600;color:#fff; }
          .eb-banner-sub { font-size:12px;color:rgba(255,255,255,.65);margin-top:2px; }
          .eb-banner-perks { display:flex;gap:8px;flex-wrap:wrap;flex-shrink:0; }
          .eb-banner-perk { display:flex;align-items:center;gap:4px;font-size:11px;font-weight:500;color:rgba(255,255,255,.75);background:rgba(255,255,255,.12);padding:3px 9px;border-radius:99px;border:1px solid rgba(255,255,255,.15); }
        `}</style>
      </div>
    )
  }

  return null
}