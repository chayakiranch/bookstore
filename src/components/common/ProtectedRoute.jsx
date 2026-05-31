import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AuthLoading() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <span className="spinner" />
    </div>
  )
}

export function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  if (isLoading) return <AuthLoading />
  if (!isAuthenticated) return <Navigate to="/auth/login" state={{ from: location }} replace />
  return children
}

export function RequireCustomer({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()
  if (isLoading) return <AuthLoading />
  if (!isAuthenticated) return <Navigate to="/auth/login" state={{ from: location }} replace />
  if (user?.role !== 'customer') return <Navigate to="/admin/dashboard" replace />
  return children
}

export function RequireAdmin({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()
  if (isLoading) return <AuthLoading />
  if (!isAuthenticated) return <Navigate to="/auth/admin/login" state={{ from: location }} replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export function RedirectIfAuth({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  if (isLoading) return <AuthLoading />
  if (isAuthenticated) {
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    return <Navigate to="/" replace />
  }
  return children
}
