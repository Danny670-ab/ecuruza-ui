import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { sampleProducts } from '../data/products'

const ITEMS_PER_PAGE = 20

// Get store details based on category
const getStoreDetails = (category?: string) => {
  if (!category) return { name: 'Gikundiro Store', location: 'Kigali, Rwanda', phone: '+250 780 000 000', rating: '4.5', responseTime: '2h' };
  const cat = category.toLowerCase();
  if (cat.includes('consumer electronics')) return { name: 'TechZone Rwanda', location: 'Kigali, Rwanda', phone: '+250 780 111 111', rating: '4.9', responseTime: '30min' };
  if (cat.includes('apparel')) return { name: 'Fashion Hub Rwanda', location: 'Kigali, Rwanda', phone: '+250 780 222 222', rating: '4.8', responseTime: '1h' };
  if (cat.includes('home')) return { name: 'HomeStyle Rwanda', location: 'Kigali, Rwanda', phone: '+250 780 333 333', rating: '4.7', responseTime: '2h' };
  if (cat.includes('sports')) return { name: 'Sportify Rwanda', location: 'Kigali, Rwanda', phone: '+250 780 444 444', rating: '4.8', responseTime: '45min' };
  if (cat.includes('beauty')) return { name: 'Beauty Bliss Rwanda', location: 'Kigali, Rwanda', phone: '+250 780 555 555', rating: '4.9', responseTime: '30min' };
  if (cat.includes('jewelry')) return { name: 'Sparkle Gems Rwanda', location: 'Kigali, Rwanda', phone: '+250 780 666 666', rating: '5.0', responseTime: '15min' };
  if (cat.includes('luggage')) return { name: 'Travel Essentials Rwanda', location: 'Kigali, Rwanda', phone: '+250 780 777 777', rating: '4.7', responseTime: '1h' };
  if (cat.includes('kids')) return { name: 'Toy World Rwanda', location: 'Kigali, Rwanda', phone: '+250 780 888 888', rating: '4.8', responseTime: '45min' };
  if (cat.includes('pet')) return { name: 'Pet Care Rwanda', location: 'Kigali, Rwanda', phone: '+250 780 999 999', rating: '4.6', responseTime: '2h' };
  if (cat.includes('automotive')) return { name: 'Auto Parts Rwanda', location: 'Kigali, Rwanda', phone: '+250 780 101 010', rating: '4.7', responseTime: '1h' };
  if (cat.includes('lights')) return { name: 'Lighting Store Rwanda', location: 'Kigali, Rwanda', phone: '+250 780 202 020', rating: '4.8', responseTime: '1h' };
  if (cat.includes('appliance')) return { name: 'Appliances Rwanda', location: 'Kigali, Rwanda', phone: '+250 780 303 030', rating: '4.7', responseTime: '2h' };
  return { name: 'Gikundiro Store', location: 'Kigali, Rwanda', phone: '+250 780 000 000', rating: '4.5', responseTime: '2h' };
};

function Shop() {
  const [searchParams] = useSearchParams()
  const dealsOnly = searchParams.get('deals') === 'true'
  
  const [selectedCategory, setSelectedCategory] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)
  const scrollPositionRef = useRef(0)
  const hasScrolledToTopRef = useRef(false)
  const lastScrollDirectionRef = useRef<'up' | 'down' | null>(null)
  
  // Handle scroll to detect when user scrolls back to top and then down again
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Detect scroll direction
      if (currentScrollY < scrollPositionRef.current) {
        // User is scrolling up
        if (currentScrollY < 50) {
          hasScrolledToTopRef.current = true
        }
        lastScrollDirectionRef.current = 'up'
      } else {
        // User is scrolling down
        if (hasScrolledToTopRef.current && lastScrollDirectionRef.current === 'up') {
          // User scrolled to top and is now scrolling down - reset pagination
          if (page > 1 && !loadingRef.current) {
            setPage(1)
          }
          hasScrolledToTopRef.current = false
        }
        lastScrollDirectionRef.current = 'down'
      }
      
      scrollPositionRef.current = currentScrollY
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [page])
  
  // Get unique categories
  const categories = [...new Set(sampleProducts.map(p => p.category).filter(Boolean))]
  
  // Filter products based on current filters - computed value
  const filteredProducts = useMemo(() => {
    let products = [...sampleProducts]
    
    // Filter by deals (20%+ discount)
    if (dealsOnly) {
      products = products.filter(p => {
        if (!p.originalPrice) return false
        const discount = ((p.originalPrice - p.price) / p.originalPrice) * 100
        return discount >= 20
      })
    }
    
    // Filter by category
    if (selectedCategory) {
      products = products.filter(p => p.category === selectedCategory)
    }
    
    return products
  }, [dealsOnly, selectedCategory])
  
  // Derived state - displayed products based on current page
  const displayedProducts = filteredProducts.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = displayedProducts.length < filteredProducts.length
  
  // Handle category change - reset to page 1
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setPage(1)
    hasScrolledToTopRef.current = false
    lastScrollDirectionRef.current = null
  }
  
  // Load more - increment page
  const loadMore = () => {
    if (loadingRef.current || !hasMore) return
    
    loadingRef.current = true
    setLoading(true)
    
    // Simulate async delay - 3 seconds for loading spinner
    setTimeout(() => {
      setPage(prev => prev + 1)
      loadingRef.current = false
      setLoading(false)
    }, 2000)
  }
  
  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }
    
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, page, filteredProducts.length])

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8 min-h-screen">
      <div className=''>
        <h1 className="place-items-center justify-center flex text-3xl font-bold text-[#0C6227] mb-">
          {dealsOnly ? 'Score The Lowest Price on E-Curuza.com' : ''}
        </h1>
        
        {/* Filters */}
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none mb-5 focus:ring-2 focus:ring-[#3F4E40]"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group"
          >
            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white">
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.originalPrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-gray-800 font-medium text-sm truncate">{product.name}</h3>
                <div className="flex items-center mt-1 gap-2">
                  <span className="text-[#3F4E40] font-bold">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 text-sm line-through">${product.originalPrice}</span>
                  )}
                </div>
                {product.category && (
                  <p className="text-gray-500 text-xs mt-1">{getStoreDetails(product.category).name}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Intersection Observer Target - Load More Spinner */}
      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {loading && (
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="animate-spin h-6 w-6 text-[#3F4E40]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading more products...</span>
          </div>
        )}
        
        {!hasMore && displayedProducts.length > 0 && (
          <p className="text-gray-500 text-sm">No more data.</p>
        )}
      </div>
      
      {/* Empty state */}
      {displayedProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}
    </div>
  )
}

export default Shop
