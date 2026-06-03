import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  PlusCircle, Search, Edit2, Trash2, Eye,
  Filter, ChevronDown, ChevronUp, AlertTriangle,
  BookOpen, X, Star, Package
} from 'lucide-react'
import { useBooks }  from '../../context/BooksContext'
import { formatPrice } from '../../utils/helpers'

// ─── Confirm delete modal ─────────────────────────────────────────────────────
function DeleteModal({ book, onConfirm, onCancel }) {
  return (
    <div className="mb-overlay">
      <div className="mb-modal">
        <div className="mb-modal-icon"><Trash2 size={24} /></div>
        <h3 className="mb-modal-title">Delete book?</h3>
        <p className="mb-modal-desc">
          Are you sure you want to delete <strong>"{book.title}"</strong>?
          This action cannot be undone.
        </p>
        <div className="mb-modal-btns">
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

// ─── Stock badge ──────────────────────────────────────────────────────────────
function StockBadge({ stock }) {
  if (stock === 0)  return <span className="badge badge-danger">Out of stock</span>
  if (stock <= 10)  return <span className="badge badge-warning">Low ({stock})</span>
  return                   <span className="badge badge-success">In stock ({stock})</span>
}

// ─── ManageBooks ──────────────────────────────────────────────────────────────
export default function ManageBooks() {
  const { books, removeBook, orders } = useBooks()
  const [searchParams]                = useSearchParams()

  const [search,     setSearch]     = useState(searchParams.get('q') || '')
  const [genre,      setGenre]      = useState('all')
  const [sortField,  setSortField]  = useState('title')
  const [sortDir,    setSortDir]    = useState('asc')
  const [deleteBook, setDeleteBook] = useState(null)
  const [page,       setPage]       = useState(1)
  const PER_PAGE = 10

  const genres = ['all', ...new Set(books.map(b => b.genre))]

  const soldIds = useMemo(() =>
    new Set(orders.flatMap(o => o.items.map(i => i.id))),
    [orders]
  )

  const filtered = useMemo(() => {
    let list = [...books]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q)
      )
    }
    if (genre !== 'all') list = list.filter(b => b.genre === genre)
    list.sort((a, b) => {
      let av = a[sortField], bv = b[sortField]
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ?  1 : -1
      return 0
    })
    return list
  }, [books, search, genre, sortField, sortDir])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const toggleSort = field => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={13} style={{ opacity: .3 }} />
    return sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
  }

  const handleDelete = () => {
    if (deleteBook) { removeBook(deleteBook.id); setDeleteBook(null) }
  }

  const lowStock = books.filter(b => b.stock > 0 && b.stock <= 10).length
  const outStock = books.filter(b => b.stock === 0).length

  return (
    <div className="mb-page">
      {deleteBook && (
        <DeleteModal book={deleteBook} onConfirm={handleDelete} onCancel={() => setDeleteBook(null)} />
      )}

      {/* header */}
      <div className="mb-page-head">
        <div>
          <h1 className="mb-page-title"><BookOpen size={22} />Manage Books</h1>
          <p className="mb-page-sub">{books.length} books in catalogue</p>
        </div>
        <Link to="/admin/books/add" className="btn btn-accent">
          <PlusCircle size={16} /> Add New Book
        </Link>
      </div>

      {/* alerts */}
      {(outStock > 0 || lowStock > 0) && (
        <div className="mb-alerts">
          {outStock > 0 && (
            <div className="mb-alert mb-alert--danger">
              <AlertTriangle size={14} />
              {outStock} book{outStock > 1 ? 's' : ''} out of stock
            </div>
          )}
          {lowStock > 0 && (
            <div className="mb-alert mb-alert--warning">
              <AlertTriangle size={14} />
              {lowStock} book{lowStock > 1 ? 's' : ''} low on stock
            </div>
          )}
        </div>
      )}

      {/* toolbar */}
      <div className="card mb-toolbar">
        <div className="mb-search-wrap">
          <Search size={15} className="mb-search-icon" />
          <input
            className="mb-search-input"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by title, author or genre…"
          />
          {search && (
            <button className="mb-search-clear" onClick={() => setSearch('')}>
              <X size={13} />
            </button>
          )}
        </div>
        <div className="mb-genre-filter">
          <Filter size={14} />
          <select
            className="mb-genre-select"
            value={genre}
            onChange={e => { setGenre(e.target.value); setPage(1) }}
          >
            {genres.map(g => (
              <option key={g} value={g}>{g === 'all' ? 'All Genres' : g}</option>
            ))}
          </select>
        </div>
        <span className="mb-result-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* table */}
      <div className="card mb-table-card">
        <div className="mb-table-wrap">
          <table className="mb-table">
            <thead>
              <tr>
                <th className="mb-th">Cover</th>
                <th className="mb-th mb-th-sortable" onClick={() => toggleSort('title')}>
                  Title <SortIcon field="title" />
                </th>
                <th className="mb-th hide-mobile" onClick={() => toggleSort('genre')}>
                  Genre <SortIcon field="genre" />
                </th>
                <th className="mb-th" onClick={() => toggleSort('price')}>
                  Price <SortIcon field="price" />
                </th>
                <th className="mb-th hide-mobile" onClick={() => toggleSort('stock')}>
                  Stock <SortIcon field="stock" />
                </th>
                <th className="mb-th hide-mobile">Status</th>
                <th className="mb-th hide-mobile" onClick={() => toggleSort('rating')}>
                  Rating <SortIcon field="rating" />
                </th>
                <th className="mb-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="mb-empty-row">
                    <BookOpen size={32} style={{ color:'var(--text-muted)', marginBottom:8 }} />
                    <p>No books found</p>
                  </td>
                </tr>
              ) : paginated.map(book => (
                <tr key={book.id} className="mb-row">
                  <td className="mb-td">
                    <img src={book.cover} alt={book.title} className="mb-book-cover" />
                  </td>
                  <td className="mb-td mb-td-title">
                    <p className="mb-book-title">{book.title}</p>
                    <p className="mb-book-author">{book.author}</p>
                    {book.isEbook && <span className="mb-ebook-tag">E-Book</span>}
                    {book.tags?.length > 0 && (
                      <div className="mb-book-tags">
                        {book.tags.slice(0, 2).map(t => (
                          <span key={t} className="mb-book-tag">{t}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="mb-td hide-mobile">
                    <span className="mb-genre-pill">{book.genre}</span>
                    {book.category && book.category !== book.genre && (
                      <span className="mb-cat-pill">{book.category}</span>
                    )}
                  </td>
                  <td className="mb-td">
                    <p className="mb-price">{formatPrice(book.price)}</p>
                    {book.originalPrice > book.price && (
                      <p className="mb-orig-price">{formatPrice(book.originalPrice)}</p>
                    )}
                  </td>
                  <td className="mb-td hide-mobile">
                    <StockBadge stock={book.stock} />
                  </td>
                  <td className="mb-td hide-mobile">
                    {soldIds.has(book.id)
                      ? <span className="badge badge-success"><Package size={10} />Sold</span>
                      : <span className="badge badge-muted">Unsold</span>
                    }
                  </td>
                  <td className="mb-td hide-mobile">
                    <div className="mb-rating">
                      <Star size={12} className="mb-star" />
                      <span>{book.rating}</span>
                    </div>
                  </td>
                  <td className="mb-td mb-td-actions">
                    <Link to={`/books/${book.id}`} className="mb-action-btn mb-action-btn--view" title="View" target="_blank">
                      <Eye size={15} />
                    </Link>
                    <Link to={`/admin/books/${book.id}/edit`} className="mb-action-btn mb-action-btn--edit" title="Edit">
                      <Edit2 size={15} />
                    </Link>
                    <button className="mb-action-btn mb-action-btn--delete" title="Delete" onClick={() => setDeleteBook(book)}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mb-pagination">
            <button className="btn btn-outline btn-sm"
              onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              ← Prev
            </button>
            <div className="mb-page-nums">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p}
                  className={`mb-page-num ${p === page ? 'mb-page-num--active' : ''}`}
                  onClick={() => setPage(p)}>{p}
                </button>
              ))}
            </div>
            <button className="btn btn-outline btn-sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next →
            </button>
          </div>
        )}
      </div>
      {/* styles in file */}
    </div>
  )
}