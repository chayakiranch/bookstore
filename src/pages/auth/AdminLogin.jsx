import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react'
import AuthCard from '../../components/common/AuthCard'
import FormInput from '../../components/common/FormInput'
import { useAuth } from '../../context/AuthContext'
import { authenticateAdmin } from '../../data/users'

export default function AdminLogin() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { login } = useAuth()
  const from      = location.state?.from?.pathname || '/admin/dashboard'

  const [form, setForm]         = useState({ email: '', password: '' })
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading]   = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
    if (apiError)     setApiError('')
  }

  const validate = () => {
    const errs = {}
    if (!form.email)    errs.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const admin = authenticateAdmin(form.email, form.password)
    if (admin) { login(admin); navigate(from, { replace: true }) }
    else setApiError('Invalid admin credentials. Try admin@folio.com / admin123')
    setLoading(false)
  }

  const fillDemo = () => {
    setForm({ email: 'admin@folio.com', password: 'admin123' })
    setErrors({}); setApiError('')
  }

  return (
    <AuthCard
      title="Admin portal"
      subtitle="Restricted access. Sign in with your administrator credentials."
      isAdmin
      footer={<>Not an admin? <Link to="/auth/login">Customer login</Link></>}
    >
      <div className="al-badge">
        <ShieldCheck size={14} />
        <span>Secure admin access — authorised personnel only</span>
      </div>
      <button type="button" className="al-demo-btn" onClick={fillDemo}>
        <span className="al-demo-dot" />Use demo admin account
      </button>
      {apiError && (
        <div className="al-alert"><AlertCircle size={15} /><span>{apiError}</span></div>
      )}
      <form onSubmit={handleSubmit} noValidate className="al-form">
        <FormInput label="Admin email" type="email" name="email" value={form.email}
          onChange={handleChange} placeholder="admin@folio.com" autoComplete="email"
          required icon={Mail} error={errors.email} />
        <FormInput label="Password" type="password" name="password" value={form.password}
          onChange={handleChange} placeholder="Admin password" autoComplete="current-password"
          required icon={Lock} error={errors.password} />
        <button type="submit" className="btn btn-accent btn-full btn-lg al-submit" disabled={loading}>
          {loading
            ? <span className="spinner" style={{ width: 18, height: 18 }} />
            : <><span>Access dashboard</span><ArrowRight size={18} /></>}
        </button>
      </form>

      <style>{`
        .ac-page--admin .fi-label { color: rgba(255,255,255,.55); }
        .ac-page--admin .fi-field { background: rgba(255,255,255,.07); border-color: rgba(255,255,255,.12); }
        .ac-page--admin .fi-field:focus-within { border-color: var(--accent); }
        .ac-page--admin .fi-input { color: #fff; }
        .ac-page--admin .fi-input::placeholder { color: rgba(255,255,255,.3); }
        .ac-page--admin .fi-icon, .ac-page--admin .fi-eye { color: rgba(255,255,255,.3); }
        .ac-page--admin .fi-eye:hover { color: rgba(255,255,255,.7); }
        .al-badge { display: flex; align-items: center; gap: 7px; padding: 8px 12px; border-radius: var(--radius-md); background: rgba(201,169,110,.1); color: var(--accent); border: 1px solid rgba(201,169,110,.2); font-size: 12px; font-weight: 500; margin-bottom: 16px; }
        .al-demo-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 10px 14px; border-radius: var(--radius-md); background: rgba(255,255,255,.05); border: 1.5px dashed rgba(255,255,255,.15); font-size: 13px; color: rgba(255,255,255,.45); cursor: pointer; transition: border-color .2s, color .2s; margin-bottom: 16px; font-family: var(--font-body); }
        .al-demo-btn:hover { border-color: var(--accent); color: var(--accent); }
        .al-demo-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--success); flex-shrink: 0; box-shadow: 0 0 0 2px rgba(39,174,96,.25); }
        .al-alert { display: flex; align-items: center; gap: 8px; padding: 11px 14px; border-radius: var(--radius-md); background: rgba(192,57,43,.15); color: #f1948a; border: 1px solid rgba(192,57,43,.3); font-size: 13px; margin-bottom: 16px; }
        .al-form { display: flex; flex-direction: column; gap: 16px; }
        .al-submit { font-size: 15px; }
        .al-submit:disabled { opacity: .6; cursor: not-allowed; transform: none !important; }
      `}</style>
    </AuthCard>
  )
}