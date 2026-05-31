import { createContext, useContext, useReducer, useEffect } from 'react'

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, isLoading: false }
    case 'INIT_DONE':
      return { ...state, isLoading: false }
    default:
      return state
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('folio_user')
      if (saved) {
        dispatch({ type: 'LOGIN', payload: JSON.parse(saved) })
      } else {
        dispatch({ type: 'INIT_DONE' })
      }
    } catch {
      dispatch({ type: 'INIT_DONE' })
    }
  }, [])

  const login = (userData) => {
    localStorage.setItem('folio_user', JSON.stringify(userData))
    dispatch({ type: 'LOGIN', payload: userData })
  }

  const logout = () => {
    localStorage.removeItem('folio_user')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}