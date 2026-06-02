import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Image, Check, AlertCircle, Save } from 'lucide-react'
import { useBooks } from '../../context/BooksContext'
import FormInput from '../../components/common/FormInput'

const GENRES = ['Fiction','Non-Fiction','Academic',"Children's Books"]
const CATEGORIES = {
  'Fiction':          ['Fantasy','Romance','Mystery','Horror'],
  'Non-Fiction':      ['Self-Help','Business','Biography','History'],
  'Academic':         ['Engineering','Computer Science','Mathematics'],
  "Children's Books": [],
}
const SPECIAL_TAGS = ['New Arrivals','Best Sellers','Award Winners','Deals & Discounts','E-Books']

export default function EditBook() {
  const { id }             = useParams()
  const { books, updateBook } = useBooks()
  const navigate           = useNavigate()

  const book = books.find(b => b.id === id)

  const [form, setForm]       = useState(null)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (book) {
      setForm({
        title:         book.title,
        author:        book.author,
        price:         String(book.price),
        originalPrice: String(book.originalPrice || book.price),
        cover:         book.cover,
        genre:         book.genre,
        category:      book.category || '',
        description:   book.description,
        stock:         String(book.stock),
        publishedYear: String(book.publishedYear || ''),
        rating:        String(book.rating || '4.0'),
        reviews:       String(book.reviews || '0'),
        isEbook:       book.isEbook || false,
        tags:          book.tags || [],
      })
    }
  }, [book])

  if (!book) return (
    <div className="eb-notfound">
      <AlertCircle size={40} style={{ color:'var(--text-muted)' }} />
      <h2>Book not found</h2>
      <Link to="/admin/books" className="btn btn-accent">← Back to Books</Link>
    </div>
  )

  if (!form) return null

  const cats = CATEGORIES[form.genre] || []

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'genre' ? { category: '' } : {}),
    }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const toggleTag = tag => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())       e.title       = 'Title is required'
    if (!form.author.trim())      e.author      = 'Author is required'
    if (!form.price || isNaN(+form.price) || +form.price <= 0) e.price = 'Valid price required'
    if (!form.cover.trim())       e.cover       = 'Cover image URL required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.stock || isNaN(+form.stock) || +form.stock < 0) e.stock = 'Valid stock required'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 600))

    updateBook({
      ...book,
      title:         form.title.trim(),
      author:        form.author.trim(),
      price:         +form.price,
      originalPrice: +(form.originalPrice || form.price),
      cover:         form.cover.trim(),
      genre:         form.genre,
      category:      form.category || form.genre,
      description:   form.description.trim(),
      stock:         +form.stock,
      publishedYear: +form.publishedYear,
      rating:        +form.rating,
      reviews:       +form.reviews,
      isEbook:       form.isEbook,
      tags:          form.tags,
    })

    setSuccess(true)
    setLoading(false)
    setTimeout(() => navigate('/admin/books'), 1400)
  }

  return (
    <div className="eb-page">
      <div className="eb-page-head">
        <Link to="/admin/books" className="eb-back-btn">
          <ArrowLeft size={16} /> Back to Books
        </Link>
        <h1 className="eb-page-title"><BookOpen size={22} />Edit Book</h1>
        <p className="eb-book-id">ID: {book.id}</p>
      </div>

      {success && (
        <div className="eb-success"><Check size={16} /> Changes saved! Redirecting…</div>
      )}

      <div className="eb-layout">
        <form onSubmit={handleSubmit} className="eb-form-col" noValidate>

          {/* basic info */}
          <div className="card eb-card">
            <h2 className="eb-card-title">Book Information</h2>
            <div className="eb-form-grid">
              <div className="eb-span-2">
                <FormInput label="Title" name="title" value={form.title} onChange={handleChange}
                  placeholder="Book title" required error={errors.title} />
              </div>
              <div className="eb-span-2">
                <FormInput label="Author" name="author" value={form.author} onChange={handleChange}
                  placeholder="Author name" required error={errors.author} />
              </div>
              <div>
                <label className="eb-label">Genre *</label>
                <select name="genre" value={form.genre} onChange={handleChange} className="eb-select">
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="eb-label">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="eb-select" disabled={cats.length === 0}>
                  <option value="">— Select category —</option>
                  {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="eb-span-2">
                <label className="eb-label">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Book description…" rows={4}
                  className={`eb-textarea ${errors.description ? 'eb-textarea--error' : ''}`} />
                {errors.description && <p className="eb-error">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* pricing */}
          <div className="card eb-card">
            <h2 className="eb-card-title">Pricing & Stock</h2>
            <div className="eb-form-grid">
              <FormInput label="Sale price ($)" type="number" name="price" value={form.price}
                onChange={handleChange} placeholder="14.99" required error={errors.price} />
              <FormInput label="Original price ($)" type="number" name="originalPrice"
                value={form.originalPrice} onChange={handleChange} placeholder="19.99" />
              <FormInput label="Stock quantity" type="number" name="stock" value={form.stock}
                onChange={handleChange} placeholder="50" required error={errors.stock} />
              <FormInput label="Published year" type="number" name="publishedYear"
                value={form.publishedYear} onChange={handleChange} placeholder="2024" />
              <FormInput label="Rating (0–5)" type="number" name="rating" value={form.rating}
                onChange={handleChange} placeholder="4.5" />
              <FormInput label="Review count" type="number" name="reviews" value={form.reviews}
                onChange={handleChange} placeholder="0" />
            </div>
          </div>

          {/* cover */}
          <div className="card eb-card">
            <h2 className="eb-card-title">Cover Image</h2>
            <FormInput label="Image URL" name="cover" value={form.cover} onChange={handleChange}
              placeholder="https://…" required icon={Image} error={errors.cover} />
            {form.cover && (
              <div className="eb-cover-preview">
                <img src={form.cover} alt="Cover preview" className="eb-cover-img"
                  onError={e => { e.target.style.display = 'none' }} />
                <p className="eb-cover-hint">Cover preview</p>
              </div>
            )}
          </div>

          {/* tags */}
          <div className="card eb-card">
            <h2 className="eb-card-title">Tags & Format</h2>
            <div className="eb-tags-wrap">
              <p className="eb-label">Special sections</p>
              <div className="eb-tags">
                {SPECIAL_TAGS.map(tag => (
                  <button key={tag} type="button"
                    className={`eb-tag-btn ${form.tags.includes(tag) ? 'eb-tag-btn--active' : ''}`}
                    onClick={() => toggleTag(tag)}>
                    {form.tags.includes(tag) && <Check size={11} />}{tag}
                  </button>
                ))}
              </div>
            </div>
            <label className="eb-checkbox-label">
              <input type="checkbox" name="isEbook" checked={form.isEbook}
                onChange={handleChange} className="eb-checkbox" />
              <span>This book is available as an E-Book</span>
            </label>
          </div>

          <div className="eb-submit-row">
            <Link to="/admin/books" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-accent btn-lg eb-submit"
              disabled={loading || success}>
              {loading
                ? <><span className="spinner" style={{width:18,height:18}} /> Saving…</>
                : success
                  ? <><Check size={18} /> Saved!</>
                  : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </form>

        {/* preview sidebar */}
        <div className="eb-preview-col">
          <div className="card eb-preview-card">
            <h3 className="eb-preview-title">Live Preview</h3>
            <div className="eb-preview-book">
              <div className="eb-preview-cover">
                {form.cover
                  ? <img src={form.cover} alt="preview"
                      onError={e => e.target.style.display='none'} />
                  : <div className="eb-preview-cover-ph"><Image size={28} /></div>}
                {form.tags.length > 0 && (
                  <span className="eb-preview-badge" style={{ background:'#e67e22' }}>
                    {form.tags[0]}
                  </span>
                )}
              </div>
              <div className="eb-preview-body">
                <p className="eb-preview-genre">{form.category || form.genre}</p>
                <p className="eb-preview-book-title">{form.title || 'Book Title'}</p>
                <p className="eb-preview-author">by {form.author || 'Author'}</p>
                <div className="eb-preview-price">
                  <span className="eb-preview-sale">${form.price || '0.00'}</span>
                  {form.originalPrice && +form.originalPrice > +form.price && (
                    <span className="eb-preview-orig">${form.originalPrice}</span>
                  )}
                </div>
                {form.isEbook && <span className="eb-preview-ebook">⚡ E-Book</span>}
              </div>
            </div>
            <div className="eb-preview-meta">
              {[
                ['Genre',    form.genre],
                ['Category', form.category || '—'],
                ['Stock',    form.stock ? `${form.stock} units` : '—'],
                ['Rating',   form.rating ? `${form.rating}/5` : '—'],
              ].map(([k, v]) => (
                <div key={k} className="eb-preview-row">
                  <span className="eb-preview-key">{k}</span>
                  <span className="eb-preview-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* original values comparison */}
          <div className="card eb-changes-card">
            <h3 className="eb-preview-title">Original Values</h3>
            {[
              ['Title',  book.title],
              ['Price',  `$${book.price}`],
              ['Stock',  `${book.stock} units`],
              ['Rating', `${book.rating}/5`],
            ].map(([k, v]) => (
              <div key={k} className="eb-preview-row">
                <span className="eb-preview-key">{k}</span>
                <span className="eb-preview-val">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .eb-page { padding:24px;display:flex;flex-direction:column;gap:20px; }
        .eb-notfound { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;min-height:60vh;text-align:center; }
        .eb-page-head { display:flex;flex-direction:column;gap:6px; }
        .eb-back-btn { display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-muted);text-decoration:none;transition:color .15s; }
        .eb-back-btn:hover { color:var(--accent); }
        .eb-page-title { display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-size:24px;font-weight:600;color:var(--text-primary); }
        .eb-book-id { font-size:11px;color:var(--text-muted);font-family:monospace; }
        .eb-success { display:flex;align-items:center;gap:8px;padding:12px 16px;background:#d5f5e3;color:#1e8449;border:1px solid #a9dfbf;border-radius:var(--radius-md);font-size:14px; }
        .eb-layout { display:grid;grid-template-columns:1fr 300px;gap:24px;align-items:flex-start; }
        .eb-form-col { display:flex;flex-direction:column;gap:20px; }
        .eb-card { display:flex;flex-direction:column;gap:16px; }
        .eb-card-title { font-size:15px;font-weight:600;color:var(--text-primary);padding-bottom:4px;border-bottom:1px solid var(--border); }
        .eb-form-grid { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
        .eb-span-2 { grid-column:1/-1; }
        .eb-label { font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text-secondary);display:block;margin-bottom:6px; }
        .eb-select { width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:var(--radius-md);font-size:14px;background:var(--surface);color:var(--text-primary);outline:none;font-family:var(--font-body);transition:border-color .2s; }
        .eb-select:focus { border-color:var(--accent); }
        .eb-select:disabled { opacity:.5;cursor:not-allowed; }
        .eb-textarea { width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:var(--radius-md);font-size:14px;background:var(--surface);color:var(--text-primary);outline:none;resize:vertical;font-family:var(--font-body);transition:border-color .2s; }
        .eb-textarea:focus { border-color:var(--accent);box-shadow:0 0 0 3px rgba(201,169,110,.13); }
        .eb-textarea--error { border-color:var(--danger); }
        .eb-error { font-size:12px;color:var(--danger);margin-top:4px; }
        .eb-cover-preview { display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:4px; }
        .eb-cover-img { width:120px;height:170px;object-fit:cover;border-radius:var(--radius-md);box-shadow:var(--shadow-md); }
        .eb-cover-hint { font-size:11px;color:var(--text-muted); }
        .eb-tags-wrap { display:flex;flex-direction:column;gap:8px; }
        .eb-tags { display:flex;flex-wrap:wrap;gap:8px; }
        .eb-tag-btn { display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:99px;font-size:12px;font-weight:500;border:1.5px solid var(--border);color:var(--text-secondary);background:var(--surface);cursor:pointer;transition:all .15s;font-family:var(--font-body); }
        .eb-tag-btn:hover { border-color:var(--accent);color:var(--accent); }
        .eb-tag-btn--active { background:var(--accent-light);border-color:var(--accent);color:var(--accent-dark); }
        .eb-checkbox-label { display:flex;align-items:center;gap:10px;font-size:14px;color:var(--text-secondary);cursor:pointer; }
        .eb-checkbox { width:16px;height:16px;accent-color:var(--accent);cursor:pointer; }
        .eb-submit-row { display:flex;justify-content:flex-end;gap:12px; }
        .eb-submit { justify-content:center; }
        .eb-submit:disabled { opacity:.6;cursor:not-allowed; }
        .eb-preview-col { position:sticky;top:calc(var(--header-h) + 20px);display:flex;flex-direction:column;gap:16px; }
        .eb-preview-card,.eb-changes-card { display:flex;flex-direction:column;gap:12px; }
        .eb-preview-title { font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted); }
        .eb-preview-book { display:flex;gap:12px; }
        .eb-preview-cover { position:relative;width:80px;height:110px;border-radius:var(--radius-md);overflow:hidden;flex-shrink:0;background:var(--bg-alt); }
        .eb-preview-cover img { width:100%;height:100%;object-fit:cover; }
        .eb-preview-cover-ph { width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--text-muted); }
        .eb-preview-badge { position:absolute;top:4px;left:4px;font-size:8px;font-weight:700;color:#fff;padding:2px 5px;border-radius:3px;text-transform:uppercase; }
        .eb-preview-body { flex:1;min-width:0;display:flex;flex-direction:column;gap:3px; }
        .eb-preview-genre { font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--accent-dark); }
        .eb-preview-book-title { font-size:13px;font-weight:600;color:var(--text-primary);line-height:1.3; }
        .eb-preview-author { font-size:11px;color:var(--text-muted); }
        .eb-preview-price { display:flex;align-items:baseline;gap:6px; }
        .eb-preview-sale { font-size:15px;font-weight:700;color:var(--text-primary); }
        .eb-preview-orig { font-size:12px;color:var(--text-muted);text-decoration:line-through; }
        .eb-preview-ebook { font-size:10px;font-weight:600;color:#2980b9;background:#d6eaf8;padding:2px 6px;border-radius:4px;align-self:flex-start; }
        .eb-preview-meta { display:flex;flex-direction:column;gap:0;border-top:1px solid var(--border);padding-top:10px; }
        .eb-preview-row { display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:12px; }
        .eb-preview-row:last-child { border-bottom:none; }
        .eb-preview-key { color:var(--text-muted); }
        .eb-preview-val { font-weight:500;color:var(--text-primary); }
        @media(max-width:1024px) { .eb-layout{grid-template-columns:1fr;} .eb-preview-col{position:static;} }
        @media(max-width:640px) { .eb-form-grid{grid-template-columns:1fr;} .eb-span-2{grid-column:1;} }
      `}</style>
    </div>
  )
}