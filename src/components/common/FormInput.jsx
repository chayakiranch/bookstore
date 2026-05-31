import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function FormInput({
  label, type = 'text', name, value, onChange,
  placeholder, error, required = false, autoComplete, icon: Icon,
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputType  = isPassword ? (show ? 'text' : 'password') : type

  return (
    <div className="fi-wrap">
      {label && (
        <label className="fi-label" htmlFor={name}>
          {label}
          {required && <span className="fi-required">*</span>}
        </label>
      )}
      <div className={`fi-field ${error ? 'fi-field--error' : ''}`}>
        {Icon && <Icon className="fi-icon" size={16} />}
        <input
          id={name} name={name} type={inputType} value={value}
          onChange={onChange} placeholder={placeholder}
          autoComplete={autoComplete} required={required}
          className={`fi-input ${Icon ? 'fi-input--icon' : ''}`}
        />
        {isPassword && (
          <button type="button" className="fi-eye"
            onClick={() => setShow(s => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p className="fi-error">{error}</p>}

      <style>{`
        .fi-wrap { display: flex; flex-direction: column; gap: 6px; }
        .fi-label { font-size: 12px; font-weight: 500; letter-spacing: .04em; text-transform: uppercase; color: var(--text-secondary); }
        .fi-required { color: var(--accent); margin-left: 3px; }
        .fi-field { position: relative; display: flex; align-items: center; border: 1.5px solid var(--border); border-radius: var(--radius-md); background: var(--surface); transition: border-color .2s, box-shadow .2s; }
        .fi-field:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(201,169,110,.13); }
        .fi-field--error { border-color: var(--danger); }
        .fi-field--error:focus-within { box-shadow: 0 0 0 3px rgba(192,57,43,.1); }
        .fi-icon { position: absolute; left: 13px; color: var(--text-muted); pointer-events: none; flex-shrink: 0; }
        .fi-input { width: 100%; padding: 11px 14px; border: none; outline: none; background: transparent; font-size: 14px; color: var(--text-primary); font-family: var(--font-body); }
        .fi-input--icon { padding-left: 38px; }
        .fi-input::placeholder { color: var(--text-muted); }
        .fi-eye { position: absolute; right: 12px; background: none; border: none; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; padding: 4px; border-radius: 4px; transition: color .15s; }
        .fi-eye:hover { color: var(--text-primary); }
        .fi-error { font-size: 12px; color: var(--danger); margin-top: 2px; }
      `}</style>
    </div>
  )
}