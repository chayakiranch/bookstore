import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, CreditCard, Truck, ShieldCheck, Lock, Check } from 'lucide-react'
import { useCart }  from '../../context/CartContext'
import { useAuth }  from '../../context/AuthContext'
import { useBooks } from '../../context/BooksContext'
import { formatPrice, generateId } from '../../utils/helpers'
import FormInput from '../../components/common/FormInput'

const STEPS = ['Shipping', 'Payment', 'Review']

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ current }) {
  return (
    <div className="ch-steps">
      {STEPS.map((s, i) => (
        <div key={s} className="ch-step-wrap">
          <div className={`ch-step ${i < current ? 'ch-step--done' : i === current ? 'ch-step--active' : ''}`}>
            {i < current ? <Check size={14} /> : <span>{i + 1}</span>}
          </div>
          <span className={`ch-step-label ${i === current ? 'ch-step-label--active' : ''}`}>{s}</span>
          {i < STEPS.length - 1 && <div className={`ch-step-line ${i < current ? 'ch-step-line--done' : ''}`} />}
        </div>
      ))}
      <style>{`
        .ch-steps { display:flex;align-items:center;gap:0;margin-bottom:36px; }
        .ch-step-wrap { display:flex;align-items:center;gap:8px;flex:1; }
        .ch-step-wrap:last-child { flex:none; }
        .ch-step { width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;border:2px solid var(--border);color:var(--text-muted);background:var(--surface);flex-shrink:0;transition:all .2s; }
        .ch-step--active { border-color:var(--accent);color:var(--brand);background:var(--accent-light); }
        .ch-step--done { border-color:var(--success);background:var(--success);color:#fff; }
        .ch-step-label { font-size:13px;font-weight:500;color:var(--text-muted);white-space:nowrap; }
        .ch-step-label--active { color:var(--text-primary); }
        .ch-step-line { flex:1;height:2px;background:var(--border);border-radius:99px; }
        .ch-step-line--done { background:var(--success); }
      `}</style>
    </div>
  )
}

// ─── Order item mini ──────────────────────────────────────────────────────────
function OrderItem({ item }) {
  return (
    <div className="ch-order-item">
      <img src={item.cover} alt={item.title} className="ch-order-cover" />
      <div className="ch-order-body">
        <p className="ch-order-title">{item.title}</p>
        <p className="ch-order-author">by {item.author}</p>
        <p className="ch-order-qty">Qty: {item.qty}</p>
      </div>
      <span className="ch-order-price">{formatPrice(item.price * item.qty)}</span>
    </div>
  )
}

// ─── Checkout ─────────────────────────────────────────────────────────────────
export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user }   = useAuth()
  const { placeOrder } = useBooks()
  const navigate   = useNavigate()

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [ship, setShip] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName:  user?.name?.split(' ')[1] || '',
    email:     user?.email || '',
    phone:     '',
    address:   '',
    city:      '',
    state:     '',
    zip:       '',
    country:   'US',
  })

  const [pay, setPay] = useState({
    cardName:   '',
    cardNumber: '',
    expiry:     '',
    cvv:        '',
  })

  const [errors, setErrors] = useState({})

  const shipping   = total >= 35 ? 0 : 4.99
  const tax        = +(total * 0.08).toFixed(2)
  const grandTotal = total + shipping + tax

  // ── field helpers ──
  const handleShip = e => {
    const { name, value } = e.target
    setShip(s => ({ ...s, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }
  const handlePay = e => {
    let { name, value } = e.target
    if (name === 'cardNumber') value = value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19)
    if (name === 'expiry')     value = value.replace(/\D/g,'').replace(/(\d{2})(\d)/,'$1/$2').slice(0,5)
    if (name === 'cvv')        value = value.replace(/\D/g,'').slice(0,4)
    setPay(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  // ── step validation ──
  const validateShip = () => {
    const e = {}
    if (!ship.firstName.trim()) e.firstName = 'Required'
    if (!ship.lastName.trim())  e.lastName  = 'Required'
    if (!ship.email.trim() || !/\S+@\S+\.\S+/.test(ship.email)) e.email = 'Valid email required'
    if (!ship.address.trim()) e.address = 'Required'
    if (!ship.city.trim())    e.city    = 'Required'
    if (!ship.zip.trim())     e.zip     = 'Required'
    return e
  }
  const validatePay = () => {
    const e = {}
    if (!pay.cardName.trim())             e.cardName   = 'Required'
    if (pay.cardNumber.replace(/\s/g,'').length < 16) e.cardNumber = 'Enter valid 16-digit card'
    if (!pay.expiry || pay.expiry.length < 5) e.expiry = 'Enter MM/YY'
    if (!pay.cvv || pay.cvv.length < 3)   e.cvv = 'Enter CVV'
    return e
  }

  const nextStep = () => {
    if (step === 0) {
      const e = validateShip(); if (Object.keys(e).length) { setErrors(e); return }
    }
    if (step === 1) {
      const e = validatePay(); if (Object.keys(e).length) { setErrors(e); return }
    }
    setErrors({})
    setStep(s => s + 1)
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const order = {
      id:        generateId('ord'),
      userId:    user?.id,
      items:     [...items],
      total:     grandTotal,
      subtotal:  total,
      shipping,
      tax,
      status:    'confirmed',
      date:      new Date().toISOString(),
      address:   ship,
    }
    placeOrder(order)
    clearCart()
    navigate(`/order-confirmation/${order.id}`, { state: { order } })
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="ch-page">
      <div className="ch-page-head">
        <div className="container">
          <h1 className="ch-page-title"><Lock size={22} />Secure Checkout</h1>
        </div>
      </div>

      <div className="container ch-body">
        <div className="ch-layout">
          {/* ── main form col ── */}
          <div className="ch-form-col">
            <StepBar current={step} />

            {/* STEP 0 — shipping */}
            {step === 0 && (
              <div className="ch-card card">
                <h2 className="ch-card-title"><Truck size={18} />Shipping Address</h2>
                <div className="ch-form-grid">
                  <FormInput label="First name" name="firstName" value={ship.firstName} onChange={handleShip} placeholder="John" required error={errors.firstName} />
                  <FormInput label="Last name"  name="lastName"  value={ship.lastName}  onChange={handleShip} placeholder="Doe"  required error={errors.lastName}  />
                  <div className="ch-span-2">
                    <FormInput label="Email" type="email" name="email" value={ship.email} onChange={handleShip} placeholder="you@example.com" required error={errors.email} />
                  </div>
                  <div className="ch-span-2">
                    <FormInput label="Phone" type="tel" name="phone" value={ship.phone} onChange={handleShip} placeholder="+1 555 000 0000" error={errors.phone} />
                  </div>
                  <div className="ch-span-2">
                    <FormInput label="Street address" name="address" value={ship.address} onChange={handleShip} placeholder="123 Main St" required error={errors.address} />
                  </div>
                  <FormInput label="City"     name="city"  value={ship.city}  onChange={handleShip} placeholder="New York" required error={errors.city} />
                  <FormInput label="ZIP code" name="zip"   value={ship.zip}   onChange={handleShip} placeholder="10001"    required error={errors.zip} />
                </div>

                <div className="ch-ship-option">
                  <div className={`ch-ship-card ${total >= 35 ? 'ch-ship-card--free' : ''}`}>
                    <Truck size={16} />
                    <div>
                      <p className="ch-ship-label">{total >= 35 ? 'Free Standard Shipping' : 'Standard Shipping — $4.99'}</p>
                      <p className="ch-ship-sub">5–7 business days</p>
                    </div>
                    <Check size={15} className="ch-ship-check" />
                  </div>
                </div>

                <button className="btn btn-accent btn-full btn-lg ch-next-btn" onClick={nextStep}>
                  Continue to Payment <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* STEP 1 — payment */}
            {step === 1 && (
              <div className="ch-card card">
                <h2 className="ch-card-title"><CreditCard size={18} />Payment Details</h2>
                <div className="ch-demo-notice">
                  <ShieldCheck size={14} />
                  Demo mode — no real payment is processed. Use any card number.
                </div>
                <div className="ch-form-grid">
                  <div className="ch-span-2">
                    <FormInput label="Name on card" name="cardName" value={pay.cardName} onChange={handlePay} placeholder="John Doe" required error={errors.cardName} />
                  </div>
                  <div className="ch-span-2">
                    <FormInput label="Card number" name="cardNumber" value={pay.cardNumber} onChange={handlePay} placeholder="1234 5678 9012 3456" required error={errors.cardNumber} />
                  </div>
                  <FormInput label="Expiry" name="expiry" value={pay.expiry} onChange={handlePay} placeholder="MM/YY" required error={errors.expiry} />
                  <FormInput label="CVV" name="cvv" value={pay.cvv} onChange={handlePay} placeholder="123" required error={errors.cvv} />
                </div>
                <div className="ch-card-logos">
                  {['Visa', 'MC', 'Amex', 'PayPal'].map(c => (
                    <span key={c} className="ch-card-logo">{c}</span>
                  ))}
                </div>
                <div className="ch-step-btns">
                  <button className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                  <button className="btn btn-accent btn-lg ch-next-btn" onClick={nextStep}>
                    Review Order <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 — review */}
            {step === 2 && (
              <div className="ch-card card">
                <h2 className="ch-card-title"><Check size={18} />Review Your Order</h2>

                <div className="ch-review-section">
                  <p className="ch-review-label">Shipping to</p>
                  <p className="ch-review-val">{ship.firstName} {ship.lastName}</p>
                  <p className="ch-review-val">{ship.address}, {ship.city}, {ship.zip}</p>
                  <p className="ch-review-val">{ship.email}</p>
                </div>

                <div className="ch-review-section">
                  <p className="ch-review-label">Payment</p>
                  <p className="ch-review-val">Card ending in {pay.cardNumber.slice(-4)}</p>
                </div>

                <div className="ch-review-items">
                  {items.map(i => <OrderItem key={i.id} item={i} />)}
                </div>

                <div className="ch-step-btns">
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button
                    className="btn btn-accent btn-lg ch-place-btn"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading
                      ? <><span className="spinner" style={{width:18,height:18}} /> Placing order…</>
                      : `Place Order — ${formatPrice(grandTotal)}`
                    }
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── order summary sidebar ── */}
          <div className="ch-summary-col">
            <div className="ch-summary card">
              <h3 className="ch-summary-title">Order Summary</h3>
              <div className="ch-summary-items">
                {items.map(i => <OrderItem key={i.id} item={i} />)}
              </div>
              <div className="ch-summary-rows">
                <div className="ch-sum-row"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                <div className="ch-sum-row"><span>Shipping</span><span className={shipping===0?'ch-free':''}>{shipping===0?'FREE':formatPrice(shipping)}</span></div>
                <div className="ch-sum-row"><span>Tax (8%)</span><span>{formatPrice(tax)}</span></div>
                <div className="ch-sum-total"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
              </div>
              <div className="ch-secure-strip">
                <Lock size={12} />
                SSL encrypted &nbsp;·&nbsp; Secure checkout
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ch-page { min-height: 80vh; }
        .ch-page-head { background:var(--brand);padding:24px 0; }
        .ch-page-title { display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-size:26px;font-weight:600;color:#fff; }
        .ch-body { padding:32px 0 60px; }
        .ch-layout { display:grid;grid-template-columns:1fr 360px;gap:32px;align-items:flex-start; }
        .ch-form-col { display:flex;flex-direction:column;gap:0; }
        .ch-card { display:flex;flex-direction:column;gap:20px; }
        .ch-card-title { display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-size:20px;font-weight:600; }
        .ch-form-grid { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
        .ch-span-2 { grid-column:1/-1; }
        .ch-demo-notice { display:flex;align-items:center;gap:8px;padding:10px 14px;background:#d6eaf8;color:#1a5276;border-radius:var(--radius-md);font-size:12px;border:1px solid #aed6f1; }
        .ch-ship-option { margin-top:4px; }
        .ch-ship-card { display:flex;align-items:center;gap:12px;padding:14px 16px;border:1.5px solid var(--border);border-radius:var(--radius-md);font-size:13px;color:var(--text-secondary); }
        .ch-ship-card--free { border-color:var(--success);background:#d5f5e3;color:#1e8449; }
        .ch-ship-label { font-weight:500;color:inherit; }
        .ch-ship-sub { font-size:11px;color:var(--text-muted);margin-top:2px; }
        .ch-ship-check { margin-left:auto;color:var(--success); }
        .ch-next-btn { justify-content:center; }
        .ch-card-logos { display:flex;gap:8px;flex-wrap:wrap; }
        .ch-card-logo { padding:4px 10px;border:1px solid var(--border);border-radius:4px;font-size:11px;font-weight:500;color:var(--text-secondary);background:var(--bg-alt); }
        .ch-step-btns { display:flex;justify-content:space-between;gap:12px; }
        .ch-place-btn { flex:1;justify-content:center; }
        .ch-place-btn:disabled { opacity:.6;cursor:not-allowed; }
        .ch-review-section { background:var(--bg-alt);border-radius:var(--radius-md);padding:14px 16px;display:flex;flex-direction:column;gap:4px; }
        .ch-review-label { font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px; }
        .ch-review-val { font-size:14px;color:var(--text-primary); }
        .ch-review-items { display:flex;flex-direction:column;gap:12px;border:1px solid var(--border);border-radius:var(--radius-md);padding:12px; }
        .ch-summary-col { position:sticky;top:calc(var(--header-h) + 20px); }
        .ch-summary { display:flex;flex-direction:column;gap:16px; }
        .ch-summary-title { font-family:var(--font-display);font-size:18px;font-weight:600; }
        .ch-summary-items { display:flex;flex-direction:column;gap:10px;max-height:300px;overflow-y:auto; }
        .ch-summary-rows { display:flex;flex-direction:column;gap:10px;border-top:1px solid var(--border);padding-top:16px; }
        .ch-sum-row { display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary); }
        .ch-free { color:var(--success);font-weight:600; }
        .ch-sum-total { display:flex;justify-content:space-between;font-size:17px;font-weight:700;color:var(--text-primary);padding-top:12px;border-top:1px solid var(--border); }
        .ch-secure-strip { display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text-muted);justify-content:center; }
        .ch-order-item { display:flex;gap:10px;align-items:center; }
        .ch-order-cover { width:44px;height:60px;object-fit:cover;border-radius:4px;flex-shrink:0; }
        .ch-order-body { flex:1;min-width:0; }
        .ch-order-title { font-size:13px;font-weight:500;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .ch-order-author { font-size:11px;color:var(--text-muted); }
        .ch-order-qty { font-size:11px;color:var(--text-muted);margin-top:2px; }
        .ch-order-price { font-size:14px;font-weight:600;color:var(--text-primary);flex-shrink:0; }
        @media(max-width:1024px) { .ch-layout{grid-template-columns:1fr;} .ch-summary-col{position:static;} }
        @media(max-width:640px) { .ch-form-grid{grid-template-columns:1fr;} .ch-span-2{grid-column:1;} }
      `}</style>
    </div>
  )
}