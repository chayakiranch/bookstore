import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

const TYPE_CONFIG = {
  success: { icon: CheckCircle,   bg:'#d5f5e3', color:'#1e8449', border:'#a9dfbf', progress:'#27ae60' },
  error:   { icon: AlertCircle,   bg:'#fadbd8', color:'#c0392b', border:'#f1948a', progress:'#e74c3c' },
  warning: { icon: AlertTriangle, bg:'#fdebd0', color:'#d35400', border:'#f9cba3', progress:'#e67e22' },
  info:    { icon: Info,          bg:'#d6eaf8', color:'#1a5276', border:'#aed6f1', progress:'#2980b9' },
}

function ToastItem({ toast, onRemove }) {
  const [visible,  setVisible]  = useState(false)
  const [leaving,  setLeaving]  = useState(false)
  const [paused,   setPaused]   = useState(false)
  const [progress, setProgress] = useState(100)
  const cfg = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info
  const Icon = cfg.icon

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (toast.duration === Infinity || paused) return
    const step = 100 / (toast.duration / 50)
    const interval = setInterval(() => {
      setProgress(p => {
        if (p <= 0) { clearInterval(interval); return 0 }
        return p - step
      })
    }, 50)
    return () => clearInterval(interval)
  }, [toast.duration, paused])

  const dismiss = () => {
    setLeaving(true)
    setTimeout(() => onRemove(toast.id), 280)
  }

  return (
    <div
      className={`ti-wrap ${visible ? 'ti-wrap--in' : ''} ${leaving ? 'ti-wrap--out' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="alert"
    >
      <div className="ti-toast" style={{
        '--tb': cfg.bg, '--tc': cfg.color, '--tbd': cfg.border, '--tp': cfg.progress
      }}>
        <div className="ti-icon-wrap"><Icon size={18} className="ti-icon" /></div>
        <p className="ti-message">{toast.message}</p>
        <button className="ti-close" onClick={dismiss} aria-label="Dismiss"><X size={14} /></button>
        {toast.duration !== Infinity && (
          <div className="ti-progress-track">
            <div className="ti-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      <style>{`
        .ti-wrap { opacity:0;transform:translateX(calc(100% + 16px));transition:opacity .28s ease,transform .28s cubic-bezier(.34,1.56,.64,1);width:360px;max-width:calc(100vw - 32px); }
        .ti-wrap--in  { opacity:1;transform:translateX(0); }
        .ti-wrap--out { opacity:0;transform:translateX(calc(100% + 16px));transition-timing-function:ease-in; }
        .ti-toast { background:var(--tb);border:1px solid var(--tbd);border-radius:var(--radius-lg);box-shadow:var(--shadow-md);display:flex;align-items:flex-start;gap:10px;padding:14px 14px 18px;position:relative;overflow:hidden; }
        .ti-icon-wrap { flex-shrink:0;margin-top:1px; }
        .ti-icon { color:var(--tc); }
        .ti-message { flex:1;font-size:13px;font-weight:500;color:var(--tc);line-height:1.5;padding-right:4px; }
        .ti-close { flex-shrink:0;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:var(--radius-sm);color:var(--tc);opacity:.6;background:none;border:none;cursor:pointer;transition:opacity .15s,background .15s; }
        .ti-close:hover { opacity:1;background:rgba(0,0,0,.06); }
        .ti-progress-track { position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(0,0,0,.08); }
        .ti-progress-fill { height:100%;background:var(--tp);border-radius:99px;transition:width .05s linear; }
      `}</style>
    </div>
  )
}

export default function Toast() {
  const { toasts, removeToast } = useToast()
  if (toasts.length === 0) return null
  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map(t => <ToastItem key={t.id} toast={t} onRemove={removeToast} />)}
      <style>{`
        .toast-container { position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none; }
        .toast-container > * { pointer-events:all; }
        @media(max-width:480px) { .toast-container{bottom:80px;right:16px;left:16px;} }
      `}</style>
    </div>
  )
}