import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import AuthCard from '../../components/common/AuthCard'
import FormInput from '../../components/common/FormInput'
import { useAuth } from '../../context/AuthContext'
import { generateId } from '../../utils/helpers'

export default function CustomerRegister() {
  const navigate  = useNavigate()
  const { login } = useAuth()
  const [form, setForm]         = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim())    errs.name    = 'Full name is required'
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters'
    if (!form.email)          errs.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password)       errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (!form.confirm)        errs.confirm = 'Please confirm your password'
    else if (form.confirm !== form.password) errs.confirm = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const newUser = {
      id: generateId('u'), name: form.name.trim(), email: form.email.toLowerCase(),
      role: 'customer',
      avatar: form.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      joinedDate: new Date().toISOString().split('T')[0],
    }
    login(newUser)
    navigate('/', { replace: true })
    setLoading(false)
  }

  const strength = (() => {
    const p = form.password; if (!p) return 0
    let s = 0
    if (p.length >= 6)  s++
    if (p.length >= 10) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  })()
  const strengthLabel = ['','Weak','Fair','Good','Strong','Very strong'][strength]
  const strengthColor = ['','#c0392b','#e67e22','#f1c40f','#27ae60','#1abc9c'][strength]

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join Folio and start your reading journey today."
      footer={<>Already have an account? <Link to="/auth/login">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate className="cr-form">
        <FormInput label="Full name" type="text" name="name" value={form.name}
          onChange={handleChange} placeholder="Alice Reader" autoComplete="name"
          required icon={User} error={errors.name} />
        <FormInput label="Email address" type="email" name="email" value={form.email}
          onChange={handleChange} placeholder="you@example.com" autoComplete="email"
          required icon={Mail} error={errors.email} />
        <div>
          <FormInput label="Password" type="password" name="password" value={form.password}
            onChange={handleChange} placeholder="At least 6 characters" autoComplete="new-password"
            required icon={Lock} error={errors.password} />
          {form.password && (
            <div className="cr-strength">
              <div className="cr-strength-bars">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="cr-strength-bar"
                    style={{ background: i <= strength ? strengthColor : 'var(--border)' }} />
                ))}
              </div>
              <span className="cr-strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
            </div>
          )}
        </div>
        <FormInput label="Confirm password" type="password" name="confirm" value={form.confirm}
          onChange={handleChange} placeholder="Repeat your password" autoComplete="new-password"
          required icon={form.confirm && form.confirm === form.password ? CheckCircle : Lock}
          error={errors.confirm} />
        <p className="cr-terms">
          By creating an account you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
        </p>
        <button type="submit" className="btn btn-accent btn-full btn-lg cr-submit" disabled={loading}>
          {loading
            ? <span className="spinner" style={{ width: 18, height: 18 }} />
            : <><span>Create account</span><ArrowRight size={18} /></>}
        </button>
      </form>

      <style>{`
        .cr-form { display: flex; flex-direction: column; gap: 16px; }
        .cr-strength { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
        .cr-strength-bars { display: flex; gap: 4px; flex: 1; }
        .cr-strength-bar { height: 3px; flex: 1; border-radius: 99px; transition: background .3s; }
        .cr-strength-label { font-size: 11px; font-weight: 500; min-width: 60px; }
        .cr-terms { font-size: 12px; color: var(--text-muted); line-height: 1.5; margin-top: -4px; }
        .cr-terms a { color: var(--accent); text-decoration: none; }
        .cr-terms a:hover { text-decoration: underline; }
        .cr-submit { font-size: 15px; }
        .cr-submit:disabled { opacity: .6; cursor: not-allowed; transform: none !important; }
      `}</style>
    </AuthCard>
  )
}