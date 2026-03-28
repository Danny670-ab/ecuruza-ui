import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { sampleProducts } from '../data/products'

function Shop() {
  const [searchParams] = useSearchParams()
  const dealsOnly = searchParams.get('deals') === 'true'
  
  const [selectedCategory, setSelectedCategory] = useState('')

  // Get unique categories
  const categories = [...new Set(sampleProducts.map(p => p.category).filter(Boolean))]

  // Filter products
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



  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8 min-h-screen">
      <div className=''>
      <h1 className="place-items-center justify-center flex text-3xl font-bold text-[#0C6227] mb-">
        {dealsOnly ? 'Score The Lowest Price on E-Curuza.com' : ''}

      </h1>
      
      {/* Filters */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
          {products.map((product) => (
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
                    <p className="text-gray-500 text-xs mt-1">{product.category}</p>
                  )}
                </div>
              </div>
            </Link>))}
        </div>
      
    </div>
  )
}

export default Shop