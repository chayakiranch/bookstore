import { createContext, useContext, useReducer, useEffect } from 'react'

const initialState = { items: [], isOpen: false }

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
        ).filter(i => i.qty > 0),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'HYDRATE':
      return { ...state, items: action.payload }
    default:
      return state
  }
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('folio_cart')
      if (saved) dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('folio_cart', JSON.stringify(state.items))
  }, [state.items])

  const total     = state.items.reduce((s, i) => s + i.price * i.qty, 0)
  const itemCount = state.items.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{
      ...state, total, itemCount, dispatch,
      addItem:    (book)     => dispatch({ type: 'ADD_ITEM',    payload: book }),
      removeItem: (id)       => dispatch({ type: 'REMOVE_ITEM', payload: id }),
      updateQty:  (id, qty)  => dispatch({ type: 'UPDATE_QTY',  payload: { id, qty } }),
      clearCart:  ()         => dispatch({ type: 'CLEAR' }),
      openCart:   ()         => dispatch({ type: 'OPEN_CART' }),
      closeCart:  ()         => dispatch({ type: 'CLOSE_CART' }),
      toggleCart: ()         => dispatch({ type: 'TOGGLE_CART' }),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}