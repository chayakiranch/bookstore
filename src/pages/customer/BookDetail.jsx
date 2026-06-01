import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, ArrowLeft, Truck, Shield,
  RotateCcw, Zap, Share2, Heart, BookOpen,
  ChevronRight, Minus, Plus, Check
} from 'lucide-react'
import { useBooks }  from '../../context/BooksContext'
import { useCart }   from '../../context/CartContext'
import { useAuth }   from '../../context/AuthContext'
import BookCard      from '../../components/customer/BookCard'
import StarRating    from '../../components/common/StarRating'
import { formatPrice, discountPct } from '../../utils/helpers'

export default function BookDetail() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const { books }   = useBooks()
  const { addItem, items, openCart } = useCart()
  const { isAuthenticated } = useAuth()

  const [qty,          setQty]          = useState(1)
  const [imgLoaded,    setImgLoaded]    = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [addedAnim,    setAddedAnim]    = useState(false)

  const book = books.find(b => b.id === id)
  if (!book) return (
    <div className="bd-notfound">
      <BookOpen size={52} style={{ color:'var(--text-muted)' }} />
      <h2 className="section-title">Book not found</h2>
      <Link to="/books" className="btn btn-accent" style={{ marginTop:16 }}>
        <ArrowLeft size={16} />Back to books
      </Link>
    </div>
  )

  const inCart      = items.some(i => i.id === book.id)
  const hasDiscount = book.originalPrice > book.price
  const pct         = hasDiscount ? discountPct(book.originalPrice, book.price) : 0
  const related     = books.filter(b => b.genre === book.genre && b.id !== book.id).slice(0, 5)

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(book)
    setAddedAnim(true)
    setTimeout(() => setAddedAnim(false), 1800)
    openCart()
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) { navigate('/auth/login'); return }
    for (let i = 0; i < qty; i++) addItem(book)
    navigate('/checkout')
  }

  return (
    <div className="bd-page">
      {/* breadcrumb, cover lightbox, info, related — full code in file above */}
    </div>
  )
}