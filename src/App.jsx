import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// ─── Contexts ─────────────────────────────────────────────────────────────────
import { AuthProvider }  from './context/AuthContext'
import { CartProvider }  from './context/CartContext'
import { BooksProvider } from './context/BooksContext'

// ─── Route guards ─────────────────────────────────────────────────────────────
import {
  RequireCustomer,
  RequireAdmin,
  RedirectIfAuth,
} from './components/common/ProtectedRoute'

// ─── Layouts ──────────────────────────────────────────────────────────────────
import { CustomerLayout, AdminLayout } from './components/layout/Layouts'

// ─── Auth pages ───────────────────────────────────────────────────────────────
import CustomerLogin    from './pages/auth/CustomerLogin'
import CustomerRegister from './pages/auth/CustomerRegister'
import AdminLogin       from './pages/auth/AdminLogin'

// ─── Customer pages ───────────────────────────────────────────────────────────
import Home              from './pages/customer/Home'
import BookListing       from './pages/customer/BookListing'
import BookDetail        from './pages/customer/BookDetail'
import Cart              from './pages/customer/Cart'
import Checkout          from './pages/customer/Checkout'
import OrderConfirmation from './pages/customer/OrderConfirmation'
import CustomerProfile   from './pages/customer/CustomerProfile'
import Orders            from './pages/customer/Orders'

// ─── Admin pages ──────────────────────────────────────────────────────────────
import Dashboard   from './pages/admin/Dashboard'
import ManageBooks from './pages/admin/ManageBooks'
import AddBook     from './pages/admin/AddBook'
import EditBook    from './pages/admin/EditBook'
import AdminOrders from './pages/admin/AdminOrders'
import Analytics   from './pages/admin/Analytics'

// ─── Misc ─────────────────────────────────────────────────────────────────────
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BooksProvider>
          <CartProvider>
            <Routes>

              {/* ── AUTH ROUTES ───────────────────────────────────────────── */}
              <Route path="/auth">
                <Route path="login"       element={<RedirectIfAuth><CustomerLogin /></RedirectIfAuth>} />
                <Route path="register"    element={<RedirectIfAuth><CustomerRegister /></RedirectIfAuth>} />
                <Route path="admin/login" element={<RedirectIfAuth adminPage><AdminLogin /></RedirectIfAuth>} />
              </Route>

              {/* ── CUSTOMER ROUTES ───────────────────────────────────────── */}
              <Route element={<CustomerLayout />}>
                <Route index                              element={<Home />} />
                <Route path="books"                       element={<BookListing />} />
                <Route path="books/:id"                   element={<BookDetail />} />
                <Route path="genre/:genre"                element={<BookListing />} />
                <Route path="section/:tag"                element={<BookListing />} />
                <Route path="search"                      element={<BookListing />} />
                <Route path="cart"     element={<RequireCustomer><Cart /></RequireCustomer>} />
                <Route path="checkout" element={<RequireCustomer><Checkout /></RequireCustomer>} />
                <Route path="order-confirmation/:orderId" element={<RequireCustomer><OrderConfirmation /></RequireCustomer>} />
                <Route path="profile"  element={<RequireCustomer><CustomerProfile /></RequireCustomer>} />
                <Route path="orders"   element={<RequireCustomer><Orders /></RequireCustomer>} />
              </Route>

              {/* ── ADMIN ROUTES ──────────────────────────────────────────── */}
              <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                <Route index                  element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard"       element={<Dashboard />} />
                <Route path="books"           element={<ManageBooks />} />
                <Route path="books/add"       element={<AddBook />} />
                <Route path="books/:id/edit"  element={<EditBook />} />
                <Route path="orders"          element={<AdminOrders />} />
                <Route path="analytics"       element={<Analytics />} />
              </Route>

              {/* ── FALLBACK ──────────────────────────────────────────────── */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </CartProvider>
        </BooksProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}