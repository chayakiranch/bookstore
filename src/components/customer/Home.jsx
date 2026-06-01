import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, TrendingUp, Award, Tag, Zap } from 'lucide-react'
import { useBooks } from '../../context/BooksContext'
import { useAuth }  from '../../context/AuthContext'
import BookCard     from '../../components/customer/BookCard'

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, linkTo, linkLabel = 'View all', color }) {
  return (
    <div className="hm-sec-head">
      <div className="hm-sec-title-row">
        {Icon && (
          <span className="hm-sec-icon" style={{ background: `${color}18`, color }}>
            <Icon size={18} />
          </span>
        )}
        <div>
          <h2 className="hm-sec-title">{title}</h2>
          {subtitle && <p className="hm-sec-sub">{subtitle}</p>}
        </div>
      </div>
      {linkTo && (
        <Link to={linkTo} className="hm-sec-link">
          {linkLabel} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  )
}

// ─── Book grid row ────────────────────────────────────────────────────────────
function BookRow({ books, max = 5 }) {
  return (
    <div className="hm-book-row">
      {books.slice(0, max).map(book => (
        <div key={book.id} className="hm-book-col">
          <BookCard book={book} variant="grid" />
        </div>
      ))}
    </div>
  )
}

// ─── Genre tiles ──────────────────────────────────────────────────────────────
const GENRE_TILES = [
  { label: 'Fiction',          path: '/genre/Fiction',             emoji: '🧙', color: '#6c3483' },
  { label: 'Non-Fiction',      path: '/genre/Non-Fiction',         emoji: '🧠', color: '#1a5276' },
  { label: 'Academic',         path: '/genre/Academic',            emoji: '🎓', color: '#0e6655' },
  { label: "Children's Books", path: "/genre/Children's Books",    emoji: '🎨', color: '#d35400' },
  { label: 'E-Books',          path: '/section/E-Books',           emoji: '📱', color: '#2980b9' },
  { label: 'Deals',            path: '/section/Deals & Discounts', emoji: '🏷️', color: '#c0392b' },
]

// ─── Home page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { books }                  = useBooks()
  const { isAuthenticated, user }  = useAuth()

  const newArrivals  = books.filter(b => b.tags?.includes('New Arrivals'))
  const bestSellers  = books.filter(b => b.tags?.includes('Best Sellers'))
  const awardWinners = books.filter(b => b.tags?.includes('Award Winners'))
  const deals        = books.filter(b => b.tags?.includes('Deals & Discounts'))
  const ebooks       = books.filter(b => b.isEbook)

  return (
    <div className="hm-page">

      {/* ── HERO ── */}
      <section className="hm-hero">
        <div className="hm-hero-bg" />
        <div className="container hm-hero-inner">
          <div className="hm-hero-text">
            {isAuthenticated ? (
              <p className="hm-hero-greeting">Welcome back, <strong>{user?.name?.split(' ')[0]}</strong> 👋</p>
            ) : (
              <p className="hm-hero-greeting">Discover your next great read</p>
            )}
            <h1 className="hm-hero-title">
              Books that<br />
              <span className="hm-hero-accent">inspire</span> &amp; educate
            </h1>
            <p className="hm-hero-desc">
              Explore thousands of titles across every genre — from gripping fiction
              to life-changing non-fiction, academic texts, and children's classics.
            </p>
            <div className="hm-hero-actions">
              <Link to="/books" className="btn btn-accent btn-lg">
                Browse all books <ArrowRight size={18} />
              </Link>
              {!isAuthenticated && (
                <Link to="/auth/register" className="btn btn-outline btn-lg">Join free</Link>
              )}
            </div>
            <div className="hm-hero-stats">
              <div className="hm-stat"><span className="hm-stat-num">1,200+</span><span className="hm-stat-label">Books</span></div>
              <div className="hm-stat-divider" />
              <div className="hm-stat"><span className="hm-stat-num">50+</span><span className="hm-stat-label">Genres</span></div>
              <div className="hm-stat-divider" />
              <div className="hm-stat"><span className="hm-stat-num">Free</span><span className="hm-stat-label">Shipping $35+</span></div>
            </div>
          </div>

          {/* animated book stack */}
          <div className="hm-hero-visual">
            {books.slice(0, 4).map((book, i) => (
              <Link key={book.id} to={`/books/${book.id}`} className="hm-hero-book" style={{ '--i': i }}>
                <img src={book.cover} alt={book.title} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── GENRE TILES ── */}
      <section className="hm-section">
        <div className="container">
          <SectionHeader title="Browse by category" subtitle="Find your perfect genre" />
          <div className="hm-genre-grid">
            {GENRE_TILES.map(g => (
              <Link key={g.label} to={g.path} className="hm-genre-tile" style={{ '--gc': g.color }}>
                <span className="hm-genre-emoji">{g.emoji}</span>
                <span className="hm-genre-label">{g.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      {newArrivals.length > 0 && (
        <section className="hm-section">
          <div className="container">
            <SectionHeader icon={Sparkles} title="New Arrivals"
              subtitle="Fresh titles just added to the store"
              linkTo="/section/New Arrivals" color="#27ae60" />
            <BookRow books={newArrivals} />
          </div>
        </section>
      )}

      {/* ── BEST SELLERS ── */}
      {bestSellers.length > 0 && (
        <section className="hm-section hm-section--alt">
          <div className="container">
            <SectionHeader icon={TrendingUp} title="Best Sellers"
              subtitle="The books everyone is reading right now"
              linkTo="/section/Best Sellers" color="#e67e22" />
            <BookRow books={bestSellers} />
          </div>
        </section>
      )}

      {/* ── PROMO BANNER ── */}
      <section className="hm-section">
        <div className="container">
          <div className="hm-banner">
            <div className="hm-banner-left">
              <span className="hm-banner-pill"><Tag size={13} />Limited time</span>
              <h3 className="hm-banner-title">Up to 40% off selected titles</h3>
              <p className="hm-banner-sub">Grab your favourite books at unbeatable prices before the sale ends.</p>
              <Link to="/section/Deals & Discounts" className="btn btn-accent">
                Shop deals <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hm-banner-books">
              {deals.slice(0, 3).map(book => (
                <Link key={book.id} to={`/books/${book.id}`} className="hm-banner-book">
                  <img src={book.cover} alt={book.title} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AWARD WINNERS ── */}
      {awardWinners.length > 0 && (
        <section className="hm-section hm-section--alt">
          <div className="container">
            <SectionHeader icon={Award} title="Award Winners"
              subtitle="Acclaimed titles recognised for excellence"
              linkTo="/section/Award Winners" color="#8e44ad" />
            <BookRow books={awardWinners} />
          </div>
        </section>
      )}

      {/* ── E-BOOKS ── */}
      {ebooks.length > 0 && (
        <section className="hm-section">
          <div className="container">
            <SectionHeader icon={Zap} title="E-Books"
              subtitle="Instant download — start reading in seconds"
              linkTo="/section/E-Books" color="#2980b9" />
            <BookRow books={ebooks} />
          </div>
        </section>
      )}

      {/* ── FEATURES STRIP ── */}
      <section className="hm-features">
        <div className="container hm-features-grid">
          {[
            { emoji: '📦', title: 'Free Shipping',  desc: 'On all orders over $35' },
            { emoji: '🔒', title: 'Secure Payment', desc: 'Your data is always safe' },
            { emoji: '↩',  title: 'Easy Returns',   desc: '30-day hassle-free returns' },
            { emoji: '📚', title: '1,200+ Titles',  desc: 'New books added weekly' },
          ].map(f => (
            <div key={f.title} className="hm-feature">
              <span className="hm-feature-emoji">{f.emoji}</span>
              <div>
                <p className="hm-feature-title">{f.title}</p>
                <p className="hm-feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{` /* ... all styles ... */ `}</style>
    </div>
  )
}