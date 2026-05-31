export const DEMO_USERS = [
  {
    id: 'u001',
    name: 'Alice Reader',
    email: 'alice@example.com',
    password: 'password123',
    role: 'customer',
    avatar: 'AR',
    joinedDate: '2024-01-15',
  },
  {
    id: 'u002',
    name: 'Bob Bookworm',
    email: 'bob@example.com',
    password: 'password123',
    role: 'customer',
    avatar: 'BB',
    joinedDate: '2024-02-20',
  },
]

export const DEMO_ADMINS = [
  {
    id: 'a001',
    name: 'Admin User',
    email: 'admin@folio.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'AU',
  },
]

export function authenticateUser(email, password) {
  const user = DEMO_USERS.find(u => u.email === email && u.password === password)
  if (user) {
    const { password: _, ...safeUser } = user
    return safeUser
  }
  return null
}

export function authenticateAdmin(email, password) {
  const admin = DEMO_ADMINS.find(a => a.email === email && a.password === password)
  if (admin) {
    const { password: _, ...safeAdmin } = admin
    return safeAdmin
  }
  return null
}