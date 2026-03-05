import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import iphone from '../assets/iphone.png'
import furniture from '../assets/furniture.png'
import vegetable from '../assets/vegetable.png'
import ball from '../assets/ball.png'
import glo from '../assets/glo.png'
import logo2 from '../assets/logo2.png'
import curuza from '../assets/curuza.png'
import first from '../assets/first.png'
import second from '../assets/second.jpg'

interface CategoryRow {
  id: number
  name: string
  nameKn: string
  image: string
  subcategories: string[]
}

const categories: CategoryRow[] = [
  { 
    id: 1, 
    name: 'Apparel & Accessories', 
    nameKn: 'Imyenda', 
    image: glo,
    subcategories: ['Clothing', 'Dresses', 'Jackets', 'Sweaters', 'Pants', 'Skirts', 'Socks', 'Hats', 'Gloves']
  },
  { 
    id: 2, 
    name: 'Consumer Electronics', 
    nameKn: 'Ibinyabubuzi', 
    image: iphone,
    subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Smartwatches', 'Cameras', 'Headphones', 'Speakers', 'Gaming']
  },
  { 
    id: 3, 
    name: 'Home & Garden', 
    nameKn: 'Inzu', 
    image: furniture,
    subcategories: ['Furniture', 'Decor', 'Bedding', 'Kitchenware', 'Lighting', 'Gardening', 'Plants', 'Storage']
  },
  { 
    id: 4, 
    name: 'Sports & Entertainment', 
    nameKn: 'Imikino', 
    image: ball,
    subcategories: ['Fitness', 'Outdoor Sports', 'Team Sports', 'Water Sports', 'Camping', 'Cycling', 'Musical Instruments']
  },
  { 
    id: 5, 
    name: 'Beauty', 
    nameKn: 'Ub Beautification', 
    image: curuza,
    subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Beauty Tools', 'Nail Care', 'Body Care']
  },
  { 
    id: 6, 
    name: 'Sportswear & Outdoor', 
    nameKn: 'Imyenda', 
    image: ball,
    subcategories: ['Running Shoes', 'Hiking Boots', 'Sportswear', 'Outdoor Jackets', 'Athletic Wear', 'Swimwear']
  },
  { 
    id: 7, 
    name: 'Jewelry & Watches', 
    nameKn: 'Ibijyanye', 
    image: logo2,
    subcategories: ['Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Sunglasses', 'Eyeglasses', 'Watches']
  },
  { 
    id: 8, 
    name: 'Shoes & Accessories', 
    nameKn: 'Inyundo', 
    image: furniture,
    subcategories: ['Casual Shoes', 'Formal Shoes', 'Sandals', 'Boots', 'Heels', 'Shoe Accessories']
  },
  { 
    id: 9, 
    name: 'Luggage & Bags', 
    nameKn: 'Amaboko', 
    image: first,
    subcategories: ['Travel Bags', 'Backpacks', 'Handbags', 'Wallets', 'Laptop Bags', 'Briefcases', 'Suitcases']
  },
  { 
    id: 10, 
    name: 'Packaging & Printing', 
    nameKn: 'Ibyabuguzwa', 
    image: second,
    subcategories: ['Paper Packaging', 'Plastic Packaging', 'Boxes', 'Labels', 'Bags', 'Printing Services']
  },
  { 
    id: 11, 
    name: 'Kids & Toys', 
    nameKn: 'Abana', 
    image: ball,
    subcategories: ['Baby Products', 'Kids Clothing', 'Toys', 'Educational Toys', 'Puzzles', 'Outdoor Toys']
  },
  { 
    id: 12, 
    name: 'Personal Care', 
    nameKn: 'Kwifata', 
    image: vegetable,
    subcategories: ['Shampoo', 'Soap', 'Detergents', 'Cleaning Supplies', 'Oral Care', 'Deodorants']
  },
  { 
    id: 13, 
    name: 'Health & Medical', 
    nameKn: 'Ubuvuzi', 
    image: curuza,
    subcategories: ['Medical Supplies', 'Pharmaceuticals', 'Health Products', 'First Aid', 'Vitamins', 'Supplements']
  },
  { 
    id: 14, 
    name: 'Gifts & Crafts', 
    nameKn: 'Impano', 
    image: glo,
    subcategories: ['Gift Boxes', 'Handmade Crafts', 'Art Supplies', 'Party Supplies', 'Holiday Decorations']
  },
  { 
    id: 15, 
    name: 'Pet Supplies', 
    nameKn: 'Impetsi', 
    image: ball,
    subcategories: ['Pet Food', 'Pet Toys', 'Pet Beds', 'Pet Care', 'Aquarium Supplies', 'Bird Supplies']
  },
  { 
    id: 16, 
    name: 'School & Office', 
    nameKn: 'Ishuri', 
    image: furniture,
    subcategories: ['Stationery', 'Office Supplies', 'School Supplies', 'Notebooks', 'Pens', 'Folders']
  },
  { 
    id: 17, 
    name: 'Industrial Machinery', 
    nameKn: 'Imashini', 
    image: first,
    subcategories: ['Manufacturing Machinery', 'Agricultural Machinery', 'Construction Machinery', 'Food Processing']
  },
  { 
    id: 18, 
    name: 'Commercial Equipment', 
    nameKn: 'Bucuruzi', 
    image: second,
    subcategories: ['Restaurant Equipment', 'Store Fixtures', 'Commercial Refrigeration', 'Display Equipment']
  },
  { 
    id: 19, 
    name: 'Construction & Building', 
    nameKn: 'Ibyubakishwa', 
    image: furniture,
    subcategories: ['Building Materials', 'Construction Tools', 'Steel', 'Cement', 'Tiles', 'Flooring']
  },
  { 
    id: 20, 
    name: 'Furniture', 
    nameKn: 'Ibibata', 
    image: furniture,
    subcategories: ['Living Room', 'Bedroom', 'Office', 'Dining', 'Outdoor', 'Kids Furniture', 'Mattresses']
  },
  { 
    id: 21, 
    name: 'Lights & Lighting', 
    nameKn: 'Imicaso', 
    image: curuza,
    subcategories: ['LED Lights', 'Chandeliers', 'Floor Lamps', 'Table Lamps', 'Outdoor Lights']
  },
  { 
    id: 22, 
    name: 'Home Appliances', 
    nameKn: 'Ibyabuguzwa', 
    image: iphone,
    subcategories: ['Refrigerators', 'Washing Machines', 'Air Conditioners', 'Microwaves', 'Vacuum Cleaners']
  },
  { 
    id: 23, 
    name: 'Automotive Supplies', 
    nameKn: 'Ngendo', 
    image: first,
    subcategories: ['Car Parts', 'Auto Accessories', 'Car Electronics', 'Tires', 'Batteries', 'Oil & Fluids']
  },
  { 
    id: 24, 
    name: 'Tools & Hardware', 
    nameKn: 'Ibyuma', 
    image: furniture,
    subcategories: ['Power Tools', 'Hand Tools', 'Fasteners', 'Hardware Supplies', 'Measuring Tools']
  },
  { 
    id: 25, 
    name: 'Renewable Energy', 
    nameKn: 'Energie', 
    image: second,
    subcategories: ['Solar Panels', 'Wind Energy', 'Inverters', 'Batteries', 'Solar Accessories']
  },
  { 
    id: 26, 
    name: 'Electrical Equipment', 
    nameKn: 'Amashanyarazi', 
    image: glo,
    subcategories: ['Wires & Cables', 'Switches', 'Sockets', 'Circuit Breakers', 'Transformers']
  },
  { 
    id: 27, 
    name: 'Safety & Security', 
    nameKn: 'Kwirinda', 
    image: curuza,
    subcategories: ['Security Cameras', 'Alarms', 'Locks', 'Fire Safety', 'Safety Gear', 'Access Control']
  },
  { 
    id: 28, 
    name: 'Food & Beverage', 
    nameKn: 'Ubuhinzi', 
    image: vegetable,
    subcategories: ['Fresh Produce', 'Dairy', 'Meat', 'Seafood', 'Beverages', 'Snacks', 'Organic']
  },
  { 
    id: 29, 
    name: 'Raw Materials', 
    nameKn: 'Ibicuruza', 
    image: first,
    subcategories: ['Metals', 'Plastics', 'Rubber', 'Wood', 'Textiles', 'Chemicals', 'Paper']
  },
  { 
    id: 30, 
    name: 'Fabrication Services', 
    nameKn: 'Serivisi', 
    image: second,
    subcategories: ['Metal Fabrication', 'CNC Machining', 'Welding', 'Assembly Services']
  },
  { 
    id: 31, 
    name: 'Service', 
    nameKn: 'Serivisi', 
    image: logo2,
    subcategories: ['Consulting', 'Maintenance', 'Repair', 'Installation', 'Logistics', 'IT Services']
  },
]

function Shop() {
  return (
    <div className="w-full">
      <Hero />
      
      {/* All Categories Section - Each category on one row */}
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Categories</h2>
        
        {/* Each category in one row */}
        <div className="space-y-4">
          {categories.map((category) => (
            <Link 
              to={`/category?cat=${category.id}`} 
              key={category.id}
              className="block group"
            >
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#3F4E40] transition-all duration-300">
                {/* Category Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 shrink-0 overflow-hidden rounded-lg">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Category Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-[#3F4E40] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{category.nameKn}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.slice(0, 5).map((sub, index) => (
                      <span 
                        key={index}
                        className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                      >
                        {sub}
                      </span>
                    ))}
                    {category.subcategories.length > 5 && (
                      <span className="inline-block px-2 py-1 text-xs bg-[#3F4E40] text-white rounded-md">
                        +{category.subcategories.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#3F4E40] transition-colors duration-300">
                  <svg 
                    className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Shop
