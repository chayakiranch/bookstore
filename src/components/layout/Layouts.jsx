import { Outlet } from 'react-router-dom'

export function CustomerLayout() {
  return (
    <div className="page-wrapper">
      {/* CustomerHeader goes here — Phase 3 */}
      <main className="main-content">
        <Outlet />
      </main>
      {/* Footer goes here — Phase 3 */}
    </div>
  )
}

export function AdminLayout() {
  return (
    <div className="page-wrapper" style={{ flexDirection: 'row' }}>
      {/* AdminSidebar goes here — Phase 6 */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}