import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import CustomerHeader from './CustomerHeader'
import GenreSidebar  from './GenreSidebar'
import Footer        from './Footer'
import { useCart }   from '../../context/CartContext'

// ── Cart drawer placeholder — replaced with full CartDrawer in Phase 5 ────────
function CartDrawerPlaceholder() {
  const { isOpen, closeCart, items, itemCount } = useCart()
  if (!isOpen) return null
  return (
    <>
      <div style={{ position:'fixed',inset:0,background:'rgba(26,26,46,.4)',zIndex:299,backdropFilter:'blur(2px)' }} onClick={closeCart} />
      <div style={{ position:'fixed',top:0,right:0,height:'100vh',width:380,background:'var(--surface)',zIndex:300,boxShadow:'var(--shadow-lg)',display:'flex',flexDirection:'column',padding:24,gap:16 }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <h2 style={{ fontFamily:'var(--font-display)',fontSize:22 }}>Cart ({itemCount})</h2>
          <button onClick={closeCart} style={{ fontSize:20,color:'var(--text-muted)',cursor:'pointer' }}>✕</button>
        </div>
        {items.length === 0
          ? <p style={{ color:'var(--text-muted)',marginTop:40,textAlign:'center' }}>Your cart is empty.</p>
          : items.map(i => (
            <div key={i.id} style={{ display:'flex',gap:12,alignItems:'center',padding:'12px 0',borderBottom:'1px solid var(--border)' }}>
              <img src={i.cover} alt={i.title} style={{ width:48,height:64,objectFit:'cover',borderRadius:6 }} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13,fontWeight:500 }}>{i.title}</p>
                <p style={{ fontSize:12,color:'var(--text-muted)' }}>${i.price} × {i.qty}</p>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

export function CustomerLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <div className="page-wrapper">
      <CustomerHeader onMenuToggle={() => setMobileMenuOpen(o => !o)} menuOpen={mobileMenuOpen} />
      <div style={{ display:'flex', flex:1 }}>
        <GenreSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="main-content" style={{ flex:1, minWidth:0 }}>
          <Outlet />
        </main>
      </div>
      <Footer />
      <CartDrawerPlaceholder />
    </div>
  )
}

export function AdminLayout() {
  return (
    <div className="page-wrapper" style={{ flexDirection:'row' }}>
      {/* AdminSidebar wired in Phase 6 */}
      <main className="main-content" style={{ flex:1, minWidth:0 }}>
        <Outlet />
      </main>
    </div>
  )
}