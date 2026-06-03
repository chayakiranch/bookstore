import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)
let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts(t => t.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback(({ message, type = 'info', duration = 3500 }) => {
    const id = ++toastId
    setToasts(t => [...t, { id, message, type, duration }])
    if (duration !== Infinity) setTimeout(() => removeToast(id), duration)
    return id
  }, [removeToast])

  const toast = {
    success: (message, opts) => addToast({ message, type: 'success', ...opts }),
    error:   (message, opts) => addToast({ message, type: 'error',   ...opts }),
    warning: (message, opts) => addToast({ message, type: 'warning', ...opts }),
    info:    (message, opts) => addToast({ message, type: 'info',    ...opts }),
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}