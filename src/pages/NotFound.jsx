import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '70vh', gap: 16, textAlign: 'center',
      padding: '0 24px'
    }}>
      <span style={{
        fontSize: 80, fontFamily: 'var(--font-display)',
        color: 'var(--accent)', lineHeight: 1
      }}>404</span>
      <h1 className="section-title">Page not found</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 360 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 8 }}>
        Back to Home
      </Link>
    </div>
  )
}