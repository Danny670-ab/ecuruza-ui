import Hero from '../components/Hero'
import { Link } from 'react-router-dom'
import glo from '../assets/glo.png'
import iphone from '../assets/iphone.png'
import furniture from '../assets/furniture.png'
import ball from '../assets/ball.png'
import curuza from '../assets/curuza.png'
import logo2 from '../assets/logo2.png'
import first from '../assets/first.png'
import second from '../assets/second.jpg'
import vegetable from '../assets/vegetable.png'

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
  return (
    <div className='w-full'>
      <Hero />
      
      {/* Categories Section - One Row with horizontal scroll */}
      <div className="max-w-screen-2xl mx-auto px-4 py-8 mt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Categories</h2>
          <Link 
            to="/shop" 
            className="text-[#3F4E40] font-medium hover:underline flex items-center gap-1"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {/* Single row with horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <Link 
              to={`/category?cat=${category.id}`} 
              key={category.id}
              className="group shrink-0"
            >
              <div className="w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                  <h3 className="text-white font-bold text-xs sm:text-sm text-center truncate">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
