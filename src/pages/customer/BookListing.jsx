import { useState, useMemo } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import {
  SlidersHorizontal, Grid3X3, List, ChevronDown,
  Search, X, BookOpen, Filter
} from 'lucide-react'
import { useBooks } from '../../context/BooksContext'
import BookCard    from '../../components/customer/BookCard'

const SORT_OPTIONS = [
  { value: 'default',      label: 'Featured' },
  { value: 'price-asc',   label: 'Price: Low to High' },
  { value: 'price-desc',  label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'title-asc',   label: 'Title A–Z' },
  { value: 'newest',      label: 'Newest First' },
]

export default function BookListing() {
  const { genre, tag }   = useParams()
  const [searchParams]   = useSearchParams()
  const { books }        = useBooks()

  const qParam   = searchParams.get('q')   || ''
  const catParam = searchParams.get('cat') || ''

  const [sort,        setSort]        = useState('default')
  const [viewMode,    setViewMode]    = useState('grid')
  const [search,      setSearch]      = useState(qParam)
  const [priceRange,  setPriceRange]  = useState([0, 100])
  const [filterOpen,  setFilterOpen]  = useState(false)
  const [selectedCat, setSelectedCat] = useState(catParam)

  const pageTitle = tag ? tag : genre ? genre : qParam ? `Search: "${qParam}"` : 'All Books'

  const subCats = useMemo(() => {
    if (!genre) return []
    return [...new Set(books.filter(b => b.genre === genre).map(b => b.category).filter(Boolean))]
  }, [books, genre])

  const filtered = useMemo(() => {
    let list = [...books]
    if (genre)       list = list.filter(b => b.genre === genre)
    if (tag)         list = list.filter(b => b.tags?.includes(tag))
    if (tag === 'E-Books') list = list.filter(b => b.isEbook)
    if (selectedCat) list = list.filter(b => b.category === selectedCat)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q)
      )
    }
    list = list.filter(b => b.price >= priceRange[0] && b.price <= priceRange[1])
    switch (sort) {
      case 'price-asc':   list.sort((a,b) => a.price - b.price); break
      case 'price-desc':  list.sort((a,b) => b.price - a.price); break
      case 'rating-desc': list.sort((a,b) => b.rating - a.rating); break
      case 'title-asc':   list.sort((a,b) => a.title.localeCompare(b.title)); break
      case 'newest':      list.sort((a,b) => b.publishedYear - a.publishedYear); break
      default: break
    }
    return list
  }, [books, genre, tag, selectedCat, search, priceRange, sort])

  const clearFilters = () => { setSearch(''); setSelectedCat(''); setPriceRange([0,100]); setSort('default') }
  const hasFilters = search || selectedCat || priceRange[0] > 0 || priceRange[1] < 100 || sort !== 'default'

  return (
    <div className="bl-page">
      {/* page header */}
      <div className="bl-page-head">
        <div className="container bl-head-inner">
          <div>
            <h1 className="bl-title">{pageTitle}</h1>
            <p className="bl-count">{filtered.length} book{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <nav className="bl-breadcrumb">
            <Link to="/">Home</Link><span>/</span>
            {genre ? <><Link to="/books">Books</Link><span>/</span><span>{genre}</span></>
                   : tag ? <span>{tag}</span> : <span>All Books</span>}
          </nav>
        </div>
      </div>

      <div className="container bl-body">
        {/* filter sidebar */}
        <aside className={`bl-filters ${filterOpen ? 'bl-filters--open' : ''}`}>
          <div className="bl-filters-head">
            <span className="bl-filters-title"><Filter size={15} />Filters</span>
            {hasFilters && <button className="bl-clear-btn" onClick={clearFilters}>Clear all</button>}
          </div>
          <div className="bl-filter-group">
            <p className="bl-filter-label">Search</p>
            <div className="bl-search-field">
              <Search size={14} className="bl-search-icon" />
              <input className="bl-search-input" value={search}
                onChange={e => setSearch(e.target.value)} placeholder="Title or author…" />
              {search && <button className="bl-search-clear" onClick={() => setSearch('')}><X size={13} /></button>}
            </div>
          </div>
          {subCats.length > 0 && (
            <div className="bl-filter-group">
              <p className="bl-filter-label">Category</p>
              <div className="bl-cat-list">
                <button className={`bl-cat-btn ${!selectedCat ? 'bl-cat-btn--active' : ''}`} onClick={() => setSelectedCat('')}>All</button>
                {subCats.map(c => (
                  <button key={c} className={`bl-cat-btn ${selectedCat === c ? 'bl-cat-btn--active' : ''}`} onClick={() => setSelectedCat(c)}>{c}</button>
                ))}
              </div>
            </div>
          )}
          <div className="bl-filter-group">
            <p className="bl-filter-label">Price range <span className="bl-price-display">${priceRange[0]} – ${priceRange[1]}</span></p>
            <input type="range" min="0" max="100" step="5" value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], +e.target.value])} className="bl-range" />
          </div>
        </aside>

        {/* main */}
        <div className="bl-main">
          <div className="bl-toolbar">
            <button className="bl-filter-toggle hide-desktop" onClick={() => setFilterOpen(o => !o)}>
              <SlidersHorizontal size={15} />Filters
              {hasFilters && <span className="bl-filter-dot" />}
            </button>
            <div className="bl-sort-wrap">
              <ChevronDown size={14} className="bl-sort-chevron" />
              <select className="bl-sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="bl-view-btns">
              <button className={`bl-view-btn ${viewMode==='grid'?'bl-view-btn--active':''}`} onClick={() => setViewMode('grid')}><Grid3X3 size={16} /></button>
              <button className={`bl-view-btn ${viewMode==='list'?'bl-view-btn--active':''}`} onClick={() => setViewMode('list')}><List size={16} /></button>
            </div>
          </div>

          {hasFilters && (
            <div className="bl-active-filters">
              {search && <span className="bl-active-tag">"{search}" <button onClick={() => setSearch('')}><X size={11} /></button></span>}
              {selectedCat && <span className="bl-active-tag">{selectedCat} <button onClick={() => setSelectedCat('')}><X size={11} /></button></span>}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="bl-empty">
              <BookOpen size={48} className="bl-empty-icon" />
              <h3 className="bl-empty-title">No books found</h3>
              <p className="bl-empty-desc">Try adjusting your filters or search term.</p>
              <button className="btn btn-accent" onClick={clearFilters}>Clear filters</button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="bl-grid">
              {filtered.map(book => <BookCard key={book.id} book={book} variant="grid" />)}
            </div>
          ) : (
            <div className="bl-list">
              {filtered.map(book => <BookCard key={book.id} book={book} variant="list" />)}
            </div>
          )}
        </div>
      </div>
      {/* styles in file above */}
    </div>
  )
}