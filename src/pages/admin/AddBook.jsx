import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Image, Check, AlertCircle } from 'lucide-react'
import { useBooks } from '../../context/BooksContext'
import { generateId } from '../../utils/helpers'
import FormInput from '../../components/common/FormInput'

const GENRES = ['Fiction','Non-Fiction','Academic',"Children's Books"]
const CATEGORIES = {
  'Fiction':           ['Fantasy','Romance','Mystery','Horror'],
  'Non-Fiction':       ['Self-Help','Business','Biography','History'],
  'Academic':          ['Engineering','Computer Science','Mathematics'],
  "Children's Books":  [],
}
const SPECIAL_TAGS = ['New Arrivals','Best Sellers','Award Winners','Deals & Discounts','E-Books']

const EMPTY = {
  title: '', author: '', price: '', originalPrice: '',
  cover: '', genre: 'Fiction', category: '', description: '',
  stock: '', publishedYear: new Date().getFullYear().toString(),
  rating: '4.0', reviews: '0', isEbook: false, tags: [],
}

export default function AddBook() {
  const { addBook }  = useBooks()
  const navigate     = useNavigate()

  const [form, setForm]       = useState(EMPTY)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [preview, setPreview] = useState(false)

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
    if (!form.stock || isNaN(+form.stock) || +form.stock < 0) e.stock = 'Valid stock quantity required'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 600))

    const newBook = {
      id:            generateId('b'),
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
    }

    addBook(newBook)
    setSuccess(true)
    setLoading(false)
    setTimeout(() => navigate('/admin/books'), 1500)
  }

  return (
    <div className="ab-page">
      {/* header */}
      <div className="ab-page-head">
        <Link to="/admin/books" className="ab-back-btn">
          <ArrowLeft size={16} /> Back to Books
        </Link>
        <h1 className="ab-page-title"><BookOpen size={22} />Add New Book</h1>
      </div>

      {success && (
        <div className="ab-success">
          <Check size={16} /> Book added successfully! Redirecting…
        </div>
      )}

      <div className="ab-layout">
        {/* ── form ── */}
        <form onSubmit={handleSubmit} className="ab-form-col" noValidate>

          {/* basic info */}
          <div className="card ab-card">
            <h2 className="ab-card-title">Book Information</h2>
            <div className="ab-form-grid">
              <div className="ab-span-2">
                <FormInput label="Title" name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. The Great Gatsby" required error={errors.title} />
              </div>
              <div className="ab-span-2">
                <FormInput label="Author" name="author" value={form.author} onChange={handleChange}
                  placeholder="e.g. F. Scott Fitzgerald" required error={errors.author} />
              </div>
              <div>
                <label className="ab-label">Genre *</label>
                <select name="genre" value={form.genre} onChange={handleChange} className="ab-select">
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="ab-label">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="ab-select" disabled={cats.length === 0}>
                  <option value="">— Select category —</option>
                  {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="ab-span-2">
                <label className="ab-label">Description *</label>
                <textarea
                  name="description" value={form.description} onChange={handleChange}
                  placeholder="Brief description of the book…"
                  rows={4} className={`ab-textarea ${errors.description ? 'ab-textarea--error' : ''}`}
                />
                {errors.description && <p className="ab-error">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* pricing */}
          <div className="card ab-card">
            <h2 className="ab-card-title">Pricing & Stock</h2>
            <div className="ab-form-grid">
              <FormInput label="Sale price ($)" type="number" name="price" value={form.price}
                onChange={handleChange} placeholder="14.99" required error={errors.price} />
              <FormInput label="Original price ($)" type="number" name="originalPrice" value={form.originalPrice}
                onChange={handleChange} placeholder="19.99 (leave blank if no discount)" error={errors.originalPrice} />
              <FormInput label="Stock quantity" type="number" name="stock" value={form.stock}
                onChange={handleChange} placeholder="50" required error={errors.stock} />
              <FormInput label="Published year" type="number" name="publishedYear" value={form.publishedYear}
                onChange={handleChange} placeholder="2024" error={errors.publishedYear} />
              <FormInput label="Rating (0–5)" type="number" name="rating" value={form.rating}
                onChange={handleChange} placeholder="4.5" error={errors.rating} />
              <FormInput label="Review count" type="number" name="reviews" value={form.reviews}
                onChange={handleChange} placeholder="0" error={errors.reviews} />
            </div>
          </div>

          {/* cover */}
          <div className="card ab-card">
            <h2 className="ab-card-title">Cover Image</h2>
            <FormInput label="Image URL" name="cover" value={form.cover} onChange={handleChange}
              placeholder="https://images.unsplash.com/…" required icon={Image} error={errors.cover} />
            {form.cover && (
              <div className="ab-cover-preview">
                <img
                  src={form.cover}
                  alt="Cover preview"
                  className="ab-cover-img"
                  onError={e => { e.target.style.display = 'none' }}
                />
                <p className="ab-cover-hint">Cover preview</p>
              </div>
            )}
          </div>

          {/* tags & format */}
          <div className="card ab-card">
            <h2 className="ab-card-title">Tags & Format</h2>
            <div className="ab-tags-wrap">
              <p className="ab-label">Special sections</p>
              <div className="ab-tags">
                {SPECIAL_TAGS.map(tag => (
                  <button
                    key={tag} type="button"
                    className={`ab-tag-btn ${form.tags.includes(tag) ? 'ab-tag-btn--active' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {form.tags.includes(tag) && <Check size={11} />}
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <label className="ab-checkbox-label">
              <input type="checkbox" name="isEbook" checked={form.isEbook} onChange={handleChange} className="ab-checkbox" />
              <span>This book is available as an E-Book</span>
            </label>
          </div>

          {/* submit */}
          <div className="ab-submit-row">
            <Link to="/admin/books" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-accent btn-lg ab-submit" disabled={loading || success}>
              {loading
                ? <><span className="spinner" style={{width:18,height:18}} /> Adding…</>
                : success
                  ? <><Check size={18} /> Added!</>
                  : <><BookOpen size={18} /> Add Book</>
              }
            </button>
          </div>
        </form>

        {/* ── live preview sidebar ── */}
        <div className="ab-preview-col">
          <div className="card ab-preview-card">
            <h3 className="ab-preview-title">Live Preview</h3>
            <div className="ab-preview-book">
              <div className="ab-preview-cover">
                {form.cover
                  ? <img src={form.cover} alt="preview" onError={e => e.target.style.display='none'} />
                  : <div className="ab-preview-cover-placeholder"><Image size={32} /></div>
                }
                {form.tags.length > 0 && (
                  <span className="ab-preview-badge" style={{ background: '#e67e22' }}>
                    {form.tags[0]}
                  </span>
                )}
              </div>
              <div className="ab-preview-body">
                <p className="ab-preview-genre">{form.category || form.genre}</p>
                <p className="ab-preview-book-title">{form.title || 'Book Title'}</p>
                <p className="ab-preview-author">by {form.author || 'Author Name'}</p>
                <div className="ab-preview-price">
                  <span className="ab-preview-sale">${form.price || '0.00'}</span>
                  {form.originalPrice && +form.originalPrice > +form.price && (
                    <span className="ab-preview-orig">${form.originalPrice}</span>
                  )}
                </div>
                {form.isEbook && <span className="ab-preview-ebook">⚡ E-Book</span>}
              </div>
            </div>

            <div className="ab-preview-meta">
              {[
                ['Genre',    form.genre],
                ['Category', form.category || '—'],
                ['Stock',    form.stock ? `${form.stock} units` : '—'],
                ['Rating',   form.rating ? `${form.rating}/5` : '—'],
              ].map(([k, v]) => (
                <div key={k} className="ab-preview-row">
                  <span className="ab-preview-key">{k}</span>
                  <span className="ab-preview-val">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ab-page { padding:24px;display:flex;flex-direction:column;gap:20px; }
        .ab-page-head { display:flex;flex-direction:column;gap:8px; }
        .ab-back-btn { display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-muted);text-decoration:none;transition:color .15s; }
        .ab-back-btn:hover { color:var(--accent); }
        .ab-page-title { display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-size:24px;font-weight:600;color:var(--text-primary); }
        .ab-success { display:flex;align-items:center;gap:8px;padding:12px 16px;background:#d5f5e3;color:#1e8449;border:1px solid #a9dfbf;border-radius:var(--radius-md);font-size:14px; }
        .ab-layout { display:grid;grid-template-columns:1fr 300px;gap:24px;align-items:flex-start; }
        .ab-form-col { display:flex;flex-direction:column;gap:20px; }
        .ab-card { display:flex;flex-direction:column;gap:16px; }
        .ab-card-title { font-size:15px;font-weight:600;color:var(--text-primary);padding-bottom:4px;border-bottom:1px solid var(--border); }
        .ab-form-grid { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
        .ab-span-2 { grid-column:1/-1; }
        .ab-label { font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text-secondary);display:block;margin-bottom:6px; }
        .ab-select { width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:var(--radius-md);font-size:14px;background:var(--surface);color:var(--text-primary);outline:none;font-family:var(--font-body);transition:border-color .2s; }
        .ab-select:focus { border-color:var(--accent); }
        .ab-select:disabled { opacity:.5;cursor:not-allowed; }
        .ab-textarea { width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:var(--radius-md);font-size:14px;background:var(--surface);color:var(--text-primary);outline:none;resize:vertical;font-family:var(--font-body);transition:border-color .2s; }
        .ab-textarea:focus { border-color:var(--accent);box-shadow:0 0 0 3px rgba(201,169,110,.13); }
        .ab-textarea--error { border-color:var(--danger); }
        .ab-error { font-size:12px;color:var(--danger);margin-top:4px; }
        .ab-cover-preview { display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:4px; }
        .ab-cover-img { width:120px;height:170px;object-fit:cover;border-radius:var(--radius-md);box-shadow:var(--shadow-md); }
        .ab-cover-hint { font-size:11px;color:var(--text-muted); }
        .ab-tags-wrap { display:flex;flex-direction:column;gap:8px; }
        .ab-tags { display:flex;flex-wrap:wrap;gap:8px; }
        .ab-tag-btn { display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:99px;font-size:12px;font-weight:500;border:1.5px solid var(--border);color:var(--text-secondary);background:var(--surface);cursor:pointer;transition:all .15s;font-family:var(--font-body); }
        .ab-tag-btn:hover { border-color:var(--accent);color:var(--accent); }
        .ab-tag-btn--active { background:var(--accent-light);border-color:var(--accent);color:var(--accent-dark); }
        .ab-checkbox-label { display:flex;align-items:center;gap:10px;font-size:14px;color:var(--text-secondary);cursor:pointer; }
        .ab-checkbox { width:16px;height:16px;accent-color:var(--accent);cursor:pointer; }
        .ab-submit-row { display:flex;justify-content:flex-end;gap:12px; }
        .ab-submit { justify-content:center; }
        .ab-submit:disabled { opacity:.6;cursor:not-allowed; }
        /* preview */
        .ab-preview-col { position:sticky;top:calc(var(--header-h) + 20px); }
        .ab-preview-card { display:flex;flex-direction:column;gap:16px; }
        .ab-preview-title { font-size:13px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--text-muted); }
        .ab-preview-book { display:flex;gap:12px; }
        .ab-preview-cover { position:relative;width:80px;height:110px;border-radius:var(--radius-md);overflow:hidden;flex-shrink:0;background:var(--bg-alt); }
        .ab-preview-cover img { width:100%;height:100%;object-fit:cover; }
        .ab-preview-cover-placeholder { width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--text-muted); }
        .ab-preview-badge { position:absolute;top:4px;left:4px;font-size:8px;font-weight:700;color:#fff;padding:2px 5px;border-radius:3px;text-transform:uppercase; }
        .ab-preview-body { flex:1;min-width:0;display:flex;flex-direction:column;gap:3px; }
        .ab-preview-genre { font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--accent-dark); }
        .ab-preview-book-title { font-size:13px;font-weight:600;color:var(--text-primary);line-height:1.3; }
        .ab-preview-author { font-size:11px;color:var(--text-muted); }
        .ab-preview-price { display:flex;align-items:baseline;gap:6px; }
        .ab-preview-sale { font-size:15px;font-weight:700;color:var(--text-primary); }
        .ab-preview-orig { font-size:12px;color:var(--text-muted);text-decoration:line-through; }
        .ab-preview-ebook { font-size:10px;font-weight:600;color:#2980b9;background:#d6eaf8;padding:2px 6px;border-radius:4px;margin-top:2px;align-self:flex-start; }
        .ab-preview-meta { display:flex;flex-direction:column;gap:0;border-top:1px solid var(--border);padding-top:12px; }
        .ab-preview-row { display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px; }
        .ab-preview-row:last-child { border-bottom:none; }
        .ab-preview-key { color:var(--text-muted); }
        .ab-preview-val { font-weight:500;color:var(--text-primary); }
        @media(max-width:1024px) { .ab-layout{grid-template-columns:1fr;} .ab-preview-col{position:static;} }
        @media(max-width:640px) { .ab-form-grid{grid-template-columns:1fr;} .ab-span-2{grid-column:1;} }
      `}</style>
    </div>
  )
}
