import Hero from '../components/Hero'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import glo from '../assets/glo.png'
import iphone from '../assets/iphone.png'
import furniture from '../assets/furniture.png'
import ball from '../assets/ball.png'
import curuza from '../assets/curuza.png'
import logo2 from '../assets/logo2.png'
import first from '../assets/first.png'
import second from '../assets/second.jpg'
import vegetable from '../assets/vegetable.png'
import { sampleProducts } from '../data/products'

interface CategoryItem {
  id: number
  name: string
  image: string
}

// All 31 categories with same images as Category page
const categories: CategoryItem[] = [
  { id: 1, name: 'Apparel & Accessories', image: glo },
  { id: 2, name: 'Consumer Electronics', image: iphone },
  { id: 3, name: 'Home & Garden', image: furniture },
  { id: 4, name: 'Sports & Entertainment', image: ball },
  { id: 5, name: 'Beauty', image: curuza },
  { id: 6, name: 'Sportswear & Outdoor', image: ball },
  { id: 7, name: 'Jewelry & Watches', image: logo2 },
  { id: 8, name: 'Shoes & Accessories', image: furniture },
  { id: 9, name: 'Luggage & Bags', image: first },
  { id: 10, name: 'Packaging & Printing', image: second },
  { id: 11, name: 'Kids & Toys', image: ball },
  { id: 12, name: 'Personal Care', image: vegetable },
  { id: 13, name: 'Health & Medical', image: curuza },
  { id: 14, name: 'Gifts & Crafts', image: glo },
  { id: 15, name: 'Pet Supplies', image: ball },
  { id: 16, name: 'School & Office', image: furniture },
  { id: 17, name: 'Industrial Machinery', image: first },
  { id: 18, name: 'Commercial Equipment', image: second },
  { id: 19, name: 'Construction & Building', image: furniture },
  { id: 20, name: 'Furniture', image: furniture },
  { id: 21, name: 'Lights & Lighting', image: curuza },
  { id: 22, name: 'Home Appliances', image: iphone },
  { id: 23, name: 'Automotive Supplies', image: first },
  { id: 24, name: 'Tools & Hardware', image: furniture },
  { id: 25, name: 'Renewable Energy', image: second },
  { id: 26, name: 'Electrical Equipment', image: glo },
  { id: 27, name: 'Safety & Security', image: curuza },
  { id: 28, name: 'Food & Beverage', image: vegetable },
  { id: 29, name: 'Raw Materials', image: first },
  { id: 30, name: 'Fabrication Services', image: second },
  { id: 31, name: 'Service', image: logo2 },
]

function Home() {
  // Get products with 20%+ discount and duplicate for more scroll items
  const dealProducts = sampleProducts.filter(p => {
    if (!p.originalPrice) return false;
    const discount = ((p.originalPrice - p.price) / p.originalPrice) * 100;
    return discount >= 20;
  });
  // Duplicate products for better scrolling experience
  const scrollProducts = [...dealProducts, ...dealProducts];

  // Ref for the scrollable container
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className='w-full'>
      <Hero />
      
      {/* Categories Section - One Row with horizontal scroll */}
      <div className="max-w-screen-2xl mx-auto px-6 py-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl px-2 font-bold text-black">All Categories</h2>
        </div>
        
        {/* Single row with horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide px-1">
          {categories.map((category) => (
            <Link 
              to={`/ctegory?cat=${category.id}`} 
              key={category.id}
              className="group shrink-0"
            >
              <div className="flex w-28 items-center justify-center sm:w-18 md:w-30 h-28 sm:h-18 md:h-30 relative overflow-hidden rounded-lg shadow-m hover:shadow-x transition-all duration-300">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-40 flex rounded-m object-cover group-hover:scale- transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                  <h3 className="text-white font-bo text-sm sm:text-sm  truncate">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Super Deals Section */}
        <div className='mt-5'>
          {/* Header with View All */}
          <div className='flex items-center justify-between mb-3 px-1'>
            <h2 className='text-xl font-bold text-[#3F4E40]'></h2>
            <Link 
              to="/shopnow?deals=true" 
              className='text-[#3F4E40] right-2 font-medium text-sm hover:underline flex items-center gap-1'
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className='flex flex-col md:flex-row items-start gap-4'> 
            <div className="bg-[#3F4E40] rounded-lg p-4 md:p-8 text-center w-full md:w-50 shrink-0">
              <h1 className='text-white font-bold text-xl md:text-2xl'>Super Deals</h1>
              <h2 className='text-white mt-2 md:mt-3 font-semibold text-sm md:text-base'>Up To 20% Off</h2>
              <p className='text-xs text-white mt-3 md:mt-5'>This Round Ends in 3 Days</p>
              <div className='flex mt-3 md:mt-4 items-center justify-center'>
                <button className='flex bg-white items-center justify-center rounded-full text-black px-3 py-1.5 md:px-4 md:py-2 text-sm font-semibold hover:bg-gray-100 transition-colors'>Shop Now</button>
              </div>
            </div>
            
            {/* Products scroll - horizontally scrollable */}
            <div className='flex-1 w-full overflow-hidden relative'>
              {/* Left Arrow */}
              <button 
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-8">
                {scrollProducts.map((product, index) => (
                  <Link 
                    to={`/product/${product.id}`}
                    key={`${product.id}-${index}`}
                    className="group shrink-0"
                  >
                    <div className="w-40 md:w-44 relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                      <div className="relative h-36 md:h-40 overflow-hidden">
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
                      <div className="p-2 md:p-3">
                        <h3 className="text-gray-800 font-medium text-xs md:text-sm truncate">{product.name}</h3>
                        <div className="flex items-center mt-1 gap-1">
                          <span className="text-[#3F4E40] font-bold text-sm md:text-base">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-gray-400 text-xs line-through">${product.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Right Arrow */}
              <button 
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
