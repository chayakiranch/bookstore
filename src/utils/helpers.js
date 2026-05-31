export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

export const generateId = (prefix = 'id') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

export const discountPct = (original, current) =>
  Math.round(((original - current) / original) * 100)

export const truncate = (str, n = 80) =>
  str.length > n ? str.slice(0, n) + '…' : str

export const starsArray = (rating) => {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return { full, half, empty }
}

export const filterBooks = (books, { genre, category, tag, search, minPrice, maxPrice } = {}) => {
  return books.filter(book => {
    if (genre    && book.genre    !== genre)    return false
    if (category && book.category !== category) return false
    if (tag      && !book.tags.includes(tag))   return false
    if (search) {
      const q = search.toLowerCase()
      if (!book.title.toLowerCase().includes(q) && !book.author.toLowerCase().includes(q)) return false
    }
    if (minPrice !== undefined && book.price < minPrice) return false
    if (maxPrice !== undefined && book.price > maxPrice) return false
    return true
  })
}