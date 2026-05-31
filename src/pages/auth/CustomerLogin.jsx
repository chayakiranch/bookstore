import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import AuthCard from '../../components/common/AuthCard'
import FormInput from '../../components/common/FormInput'
import { useAuth } from '../../context/AuthContext'
import { authenticateUser } from '../../data/users'

export default function CustomerLogin() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { login } = useAuth()
  const from      = location.state?.from?.pathname || '/'

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
    const user = authenticateUser(form.email, form.password)
    if (user) { login(user); navigate(from, { replace: true }) }
    else setApiError('Invalid email or password. Try alice@example.com / password123')
    setLoading(false)
  }

  const fillDemo = () => {
    setForm({ email: 'alice@example.com', password: 'password123' })
    setErrors({}); setApiError('')
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your Folio account to continue reading."
      footer={
        <>
          Don't have an account? <Link to="/auth/register">Create one free</Link>
          <span style={{ margin: '0 8px', opacity: .4 }}>·</span>
          <Link to="/auth/admin/login">Admin login</Link>
        </>
      }
    >
      <button type="button" className="cl-demo-btn" onClick={fillDemo}>
        <span className="cl-demo-dot" />
        Use demo account
      </button>

      {apiError && (
        <div className="cl-alert">
          <AlertCircle size={15} /><span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="cl-form">
        <FormInput label="Email address" type="email" name="email" value={form.email}
          onChange={handleChange} placeholder="you@example.com" autoComplete="email"
          required icon={Mail} error={errors.email} />
        <FormInput label="Password" type="password" name="password" value={form.password}
          onChange={handleChange} placeholder="Your password" autoComplete="current-password"
          required icon={Lock} error={errors.password} />
        <div className="cl-forgot"><a href="#forgot">Forgot password?</a></div>
        <button type="submit" className="btn btn-accent btn-full btn-lg cl-submit" disabled={loading}>
          {loading
            ? <span className="spinner" style={{ width: 18, height: 18 }} />
            : <><span>Sign in</span><ArrowRight size={18} /></>}
        </button>
      </form>

      <style>{`
        .cl-demo-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 10px 14px; border-radius: var(--radius-md); background: var(--bg-alt); border: 1.5px dashed var(--border-strong); font-size: 13px; color: var(--text-secondary); cursor: pointer; transition: border-color .2s, color .2s; margin-bottom: 20px; font-family: var(--font-body); }
        .cl-demo-btn:hover { border-color: var(--accent); color: var(--accent-dark); }
        .cl-demo-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--success); flex-shrink: 0; box-shadow: 0 0 0 2px rgba(39,174,96,.2); }
        .cl-alert { display: flex; align-items: center; gap: 8px; padding: 11px 14px; border-radius: var(--radius-md); background: #fadbd8; color: var(--danger); border: 1px solid #f1948a; font-size: 13px; margin-bottom: 16px; }
        .cl-form { display: flex; flex-direction: column; gap: 16px; }
        .cl-forgot { display: flex; justify-content: flex-end; margin-top: -6px; }
        .cl-forgot a { font-size: 12px; color: var(--text-muted); text-decoration: none; transition: color .15s; }
        .cl-forgot a:hover { color: var(--accent); }
        .cl-submit { margin-top: 6px; font-size: 15px; }
        .cl-submit:disabled { opacity: .6; cursor: not-allowed; transform: none !important; }
      `}</style>
    </AuthCard>
  )
}