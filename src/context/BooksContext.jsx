import { createContext, useContext, useReducer, useEffect } from 'react'
import { SAMPLE_BOOKS } from '../data/books'

const initialState = { books: [], orders: [] }

function booksReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload }
    case 'ADD_BOOK':
      return { ...state, books: [action.payload, ...state.books] }
    case 'UPDATE_BOOK':
      return {
        ...state,
        books: state.books.map(b => b.id === action.payload.id ? action.payload : b),
      }
    case 'REMOVE_BOOK':
      return { ...state, books: state.books.filter(b => b.id !== action.payload) }
    case 'PLACE_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] }
    default:
      return state
  }
}

const BooksContext = createContext(null)

export function BooksProvider({ children }) {
  const [state, dispatch] = useReducer(booksReducer, initialState)

  useEffect(() => {
    try {
      const savedBooks  = localStorage.getItem('folio_books')
      const savedOrders = localStorage.getItem('folio_orders')
      dispatch({
        type: 'HYDRATE',
        payload: {
          books:  savedBooks  ? JSON.parse(savedBooks)  : SAMPLE_BOOKS,
          orders: savedOrders ? JSON.parse(savedOrders) : [],
        },
      })
    } catch {
      dispatch({ type: 'HYDRATE', payload: { books: SAMPLE_BOOKS, orders: [] } })
    }
  }, [])

  useEffect(() => {
    if (state.books.length) localStorage.setItem('folio_books', JSON.stringify(state.books))
  }, [state.books])

  useEffect(() => {
    localStorage.setItem('folio_orders', JSON.stringify(state.orders))
  }, [state.orders])

  const soldBookIds = new Set(state.orders.flatMap(o => o.items.map(i => i.id)))

  return (
    <BooksContext.Provider value={{
      ...state,
      soldBookIds,
      addBook:        (book)  => dispatch({ type: 'ADD_BOOK',    payload: book }),
      updateBook:     (book)  => dispatch({ type: 'UPDATE_BOOK', payload: book }),
      removeBook:     (id)    => dispatch({ type: 'REMOVE_BOOK', payload: id }),
      placeOrder:     (order) => dispatch({ type: 'PLACE_ORDER', payload: order }),
      getBooksByGenre: (genre) =>
        state.books.filter(b => b.genre === genre || b.category === genre),
    }}>
      {children}
    </BooksContext.Provider>
  )
}

export const useBooks = () => {
  const ctx = useContext(BooksContext)
  if (!ctx) throw new Error('useBooks must be used within BooksProvider')
  return ctx
}