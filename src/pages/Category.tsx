import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  nameKn: string;
  subcategories: string[];
}

const categories: Category[] = [
  { 
    id: 1, 
    name: 'Apparel & Accessories', 
    nameKn: 'Imyenda', 
    subcategories: ['Clothing', 'Dresses', 'Jackets', 'Sweaters', 'Pants', 'Skirts', 'Socks', 'Hats', 'Gloves']
  },
  { 
    id: 2, 
    name: 'Consumer Electronics', 
    nameKn: 'Ibinyabubuzi', 
    subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Smartwatches', 'Cameras', 'Headphones', 'Speakers', 'Gaming']
  },
  { 
    id: 3, 
    name: 'Home & Garden', 
    nameKn: 'Inzu', 
    subcategories: ['Furniture', 'Decor', 'Bedding', 'Kitchenware', 'Lighting', 'Gardening', 'Plants', 'Storage']
  },
  { 
    id: 4, 
    name: 'Sports & Entertainment', 
    nameKn: 'Imikino', 
    subcategories: ['Fitness', 'Outdoor Sports', 'Team Sports', 'Water Sports', 'Camping', 'Cycling', 'Musical Instruments']
  },
  { 
    id: 5, 
    name: 'Beauty', 
    nameKn: 'Ub Beautification', 
    subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Beauty Tools', 'Nail Care', 'Body Care']
  },
  { 
    id: 6, 
    name: 'Sportswear & Outdoor', 
    nameKn: 'Imyenda', 
    subcategories: ['Running Shoes', 'Hiking Boots', 'Sportswear', 'Outdoor Jackets', 'Athletic Wear', 'Swimwear']
  },
  { 
    id: 7, 
    name: 'Jewelry & Watches', 
    nameKn: 'Ibijyanye', 
    subcategories: ['Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Sunglasses', 'Eyeglasses', 'Watches']
  },
  { 
    id: 8, 
    name: 'Shoes & Accessories', 
    nameKn: 'Inyundo', 
    subcategories: ['Casual Shoes', 'Formal Shoes', 'Sandals', 'Boots', 'Heels', 'Shoe Accessories']
  },
  { 
    id: 9, 
    name: 'Luggage & Bags', 
    nameKn: 'Amaboko', 
    subcategories: ['Travel Bags', 'Backpacks', 'Handbags', 'Wallets', 'Laptop Bags', 'Briefcases', 'Suitcases']
  },
  { 
    id: 10, 
    name: 'Packaging & Printing', 
    nameKn: 'Ibyabuguzwa', 
    subcategories: ['Paper Packaging', 'Plastic Packaging', 'Boxes', 'Labels', 'Bags', 'Printing Services']
  },
  { 
    id: 11, 
    name: 'Kids & Toys', 
    nameKn: 'Abana', 
    subcategories: ['Baby Products', 'Kids Clothing', 'Toys', 'Educational Toys', 'Puzzles', 'Outdoor Toys']
  },
  { 
    id: 12, 
    name: 'Personal Care', 
    nameKn: 'Kwifata', 
    subcategories: ['Shampoo', 'Soap', 'Detergents', 'Cleaning Supplies', 'Oral Care', 'Deodorants']
  },
  { 
    id: 13, 
    name: 'Health & Medical', 
    nameKn: 'Ubuvuzi', 
    subcategories: ['Medical Supplies', 'Pharmaceuticals', 'Health Products', 'First Aid', 'Vitamins', 'Supplements']
  },
  { 
    id: 14, 
    name: 'Gifts & Crafts', 
    nameKn: 'Impano', 
    subcategories: ['Gift Boxes', 'Handmade Crafts', 'Art Supplies', 'Party Supplies', 'Holiday Decorations']
  },
  { 
    id: 15, 
    name: 'Pet Supplies', 
    nameKn: 'Impetsi', 
    subcategories: ['Pet Food', 'Pet Toys', 'Pet Beds', 'Pet Care', 'Aquarium Supplies', 'Bird Supplies']
  },
  { 
    id: 16, 
    name: 'School & Office', 
    nameKn: 'Ishuri', 
    subcategories: ['Stationery', 'Office Supplies', 'School Supplies', 'Notebooks', 'Pens', 'Folders']
  },
  { 
    id: 17, 
    name: 'Industrial Machinery', 
    nameKn: 'Imashini', 
    subcategories: ['Manufacturing Machinery', 'Agricultural Machinery', 'Construction Machinery', 'Food Processing']
  },
  { 
    id: 18, 
    name: 'Commercial Equipment', 
    nameKn: 'Bucuruzi', 
    subcategories: ['Restaurant Equipment', 'Store Fixtures', 'Commercial Refrigeration', 'Display Equipment']
  },
  { 
    id: 19, 
    name: 'Construction & Building', 
    nameKn: 'Ibyubakishwa', 
    subcategories: ['Building Materials', 'Construction Tools', 'Steel', 'Cement', 'Tiles', 'Flooring']
  },
  { 
    id: 20, 
    name: 'Furniture', 
    nameKn: 'Ibibata', 
    subcategories: ['Living Room', 'Bedroom', 'Office', 'Dining', 'Outdoor', 'Kids Furniture', 'Mattresses']
  },
  { 
    id: 21, 
    name: 'Lights & Lighting', 
    nameKn: 'Imicaso', 
    subcategories: ['LED Lights', 'Chandeliers', 'Floor Lamps', 'Table Lamps', 'Outdoor Lights']
  },
  { 
    id: 22, 
    name: 'Home Appliances', 
    nameKn: 'Ibyabuguzwa', 
    subcategories: ['Refrigerators', 'Washing Machines', 'Air Conditioners', 'Microwaves', 'Vacuum Cleaners']
  },
  { 
    id: 23, 
    name: 'Automotive Supplies', 
    nameKn: 'Ngendo', 
    subcategories: ['Car Parts', 'Auto Accessories', 'Car Electronics', 'Tires', 'Batteries', 'Oil & Fluids']
  },
  { 
    id: 24, 
    name: 'Tools & Hardware', 
    nameKn: 'Ibyuma', 
    subcategories: ['Power Tools', 'Hand Tools', 'Fasteners', 'Hardware Supplies', 'Measuring Tools']
  },
  { 
    id: 25, 
    name: 'Renewable Energy', 
    nameKn: 'Energie', 
    subcategories: ['Solar Panels', 'Wind Energy', 'Inverters', 'Batteries', 'Solar Accessories']
  },
  { 
    id: 26, 
    name: 'Electrical Equipment', 
    nameKn: 'Amashanyarazi', 
    subcategories: ['Wires & Cables', 'Switches', 'Sockets', 'Circuit Breakers', 'Transformers']
  },
  { 
    id: 27, 
    name: 'Safety & Security', 
    nameKn: 'Kwirinda', 
    subcategories: ['Security Cameras', 'Alarms', 'Locks', 'Fire Safety', 'Safety Gear', 'Access Control']
  },
  { 
    id: 28, 
    name: 'Food & Beverage', 
    nameKn: 'Ubuhinzi', 
    subcategories: ['Fresh Produce', 'Dairy', 'Meat', 'Seafood', 'Beverages', 'Snacks', 'Organic']
  },
  { 
    id: 29, 
    name: 'Raw Materials', 
    nameKn: 'Ibicuruza', 
    subcategories: ['Metals', 'Plastics', 'Rubber', 'Wood', 'Textiles', 'Chemicals', 'Paper']
  },
  { 
    id: 30, 
    name: 'Fabrication Services', 
    nameKn: 'Serivisi', 
    subcategories: ['Metal Fabrication', 'CNC Machining', 'Welding', 'Assembly Services']
  },
  { 
    id: 31, 
    name: 'Service', 
    nameKn: 'Serivisi', 
    subcategories: ['Consulting', 'Maintenance', 'Repair', 'Installation', 'Logistics', 'IT Services']
  },
];

// Product interface
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory: string;
  rating: number;
  reviews: number;
  location: string;
  uploadedTime: string;
}

const sampleProducts: Product[] = [
  { id: 1, name: 'Premium Smartphone Pro', price: 899, originalPrice: 999, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', category: 'Consumer Electronics', subcategory: 'Smartphones', rating: 4.8, reviews: 234, location: 'Kigali, Rwanda', uploadedTime: '2 hours ago' },
  { id: 2, name: 'Ultra Laptop 15"', price: 1299, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', category: 'Consumer Electronics', subcategory: 'Laptops', rating: 4.9, reviews: 156, location: 'Kigali, Rwanda', uploadedTime: '5 hours ago' },
  { id: 3, name: 'Smart Watch Series X', price: 299, originalPrice: 349, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category: 'Consumer Electronics', subcategory: 'Smartwatches', rating: 4.7, reviews: 189, location: 'Kigali, Rwanda', uploadedTime: '1 day ago' },
  { id: 4, name: 'Wireless Earbuds Pro', price: 199, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', category: 'Consumer Electronics', subcategory: 'Headphones', rating: 4.6, reviews: 312, location: 'Kigali, Rwanda', uploadedTime: '3 hours ago' },
  { id: 5, name: 'Professional Camera', price: 1499, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', category: 'Consumer Electronics', subcategory: 'Cameras', rating: 4.9, reviews: 89, location: 'Kigali, Rwanda', uploadedTime: '2 days ago' },
  { id: 6, name: 'Designer Dress Collection', price: 159, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', category: 'Apparel & Accessories', subcategory: 'Dresses', rating: 4.6, reviews: 89, location: 'Kigali, Rwanda', uploadedTime: '4 hours ago' },
  { id: 7, name: 'Premium Winter Jacket', price: 249, originalPrice: 299, image: 'https://images.unsplash.com/photo-1544923246-77307dd628b5?w=400', category: 'Apparel & Accessories', subcategory: 'Jackets', rating: 4.8, reviews: 67, location: 'Kigali, Rwanda', uploadedTime: '6 hours ago' },
  { id: 7.1, name: 'Classic Denim Pants', price: 89, image: '/src/assets/pant1.jpeg', category: 'Apparel & Accessories', subcategory: 'Pants', rating: 4.5, reviews: 45, location: 'Kigali, Rwanda', uploadedTime: '2 hours ago' },
  { id: 8, name: 'Casual Sweater', price: 89, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', category: 'Apparel & Accessories', subcategory: 'Sweaters', rating: 4.5, reviews: 45, location: 'Kigali, Rwanda', uploadedTime: '1 day ago' },
  { id: 9, name: 'Modern Sofa Set', price: 899, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', category: 'Home & Garden', subcategory: 'Furniture', rating: 4.5, reviews: 123, location: 'Kigali, Rwanda', uploadedTime: '3 days ago' },
  { id: 10, name: 'LED Table Lamp', price: 49, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', category: 'Home & Garden', subcategory: 'Lighting', rating: 4.4, reviews: 78, location: 'Kigali, Rwanda', uploadedTime: '5 hours ago' },
  { id: 11, name: 'Garden Tools Set', price: 129, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', category: 'Home & Garden', subcategory: 'Gardening', rating: 4.6, reviews: 56, location: 'Kigali, Rwanda', uploadedTime: '2 days ago' },
  { id: 12, name: 'Professional Fitness Equipment', price: 599, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', category: 'Sports & Entertainment', subcategory: 'Fitness', rating: 4.7, reviews: 45, location: 'Kigali, Rwanda', uploadedTime: '1 day ago' },
  { id: 13, name: 'Luxury Skincare Set', price: 189, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', category: 'Beauty', subcategory: 'Skincare', rating: 4.9, reviews: 234, location: 'Kigali, Rwanda', uploadedTime: '8 hours ago' },
  { id: 14, name: 'Makeup Palette', price: 79, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400', category: 'Beauty', subcategory: 'Makeup', rating: 4.7, reviews: 156, location: 'Kigali, Rwanda', uploadedTime: '12 hours ago' },
  { id: 15, name: 'Vintage Leather Bag', price: 179, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', category: 'Luggage & Bags', subcategory: 'Handbags', rating: 4.6, reviews: 78, location: 'Kigali, Rwanda', uploadedTime: '2 days ago' },
  { id: 16, name: 'Travel Backpack', price: 129, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', category: 'Luggage & Bags', subcategory: 'Travel Bags', rating: 4.8, reviews: 134, location: 'Kigali, Rwanda', uploadedTime: '1 day ago' },
  { id: 17, name: 'Diamond Pendant Necklace', price: 1299, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', category: 'Jewelry & Watches', subcategory: 'Necklaces', rating: 4.9, reviews: 56, location: 'Kigali, Rwanda', uploadedTime: '5 days ago' },
  { id: 18, name: 'Running Sneakers Pro', price: 129, originalPrice: 159, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category: 'Sportswear & Outdoor', subcategory: 'Running Shoes', rating: 4.7, reviews: 189, location: 'Kigali, Rwanda', uploadedTime: '3 hours ago' },
  { id: 19, name: 'Hiking Boots', price: 179, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category: 'Sportswear & Outdoor', subcategory: 'Hiking Boots', rating: 4.8, reviews: 67, location: 'Kigali, Rwanda', uploadedTime: '6 hours ago' },
  { id: 20, name: 'Organic Baby Food Set', price: 39, image: 'https://images.unsplash.com/photo-1560891958-68bb1b0e49f6?w=400', category: 'Kids & Toys', subcategory: 'Baby Products', rating: 4.8, reviews: 67, location: 'Kigali, Rwanda', uploadedTime: '1 day ago' },
  { id: 21, name: 'Building Blocks Toy', price: 49, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400', category: 'Kids & Toys', subcategory: 'Toys', rating: 4.6, reviews: 234, location: 'Kigali, Rwanda', uploadedTime: '2 days ago' },
  { id: 22, name: 'Pet Food Premium', price: 49, image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400', category: 'Pet Supplies', subcategory: 'Pet Food', rating: 4.6, reviews: 134, location: 'Kigali, Rwanda', uploadedTime: '4 hours ago' },
  { id: 23, name: 'Pet Toy Set', price: 29, image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400', category: 'Pet Supplies', subcategory: 'Pet Toys', rating: 4.5, reviews: 89, location: 'Kigali, Rwanda', uploadedTime: '1 day ago' },
  { id: 24, name: 'LED Ceiling Light', price: 89, image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400', category: 'Lights & Lighting', subcategory: 'LED Lights', rating: 4.5, reviews: 45, location: 'Kigali, Rwanda', uploadedTime: '3 days ago' },
  { id: 25, name: 'Smart Home Hub', price: 199, image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400', category: 'Home Appliances', subcategory: 'Smart Home', rating: 4.7, reviews: 89, location: 'Kigali, Rwanda', uploadedTime: '2 days ago' },
  { id: 26, name: 'Car Performance Tires', price: 299, image: 'https://images.unsplash.com/photo-1569391570861-20c3b82a1a02?w=400', category: 'Automotive Supplies', subcategory: 'Tires', rating: 4.8, reviews: 112, location: 'Kigali, Rwanda', uploadedTime: '5 days ago' },
  { id: 27, name: 'Car Battery', price: 159, image: 'https://images.unsplash.com/photo-1569391570861-20c3b82a1a02?w=400', category: 'Automotive Supplies', subcategory: 'Batteries', rating: 4.7, reviews: 67, location: 'Kigali, Rwanda', uploadedTime: '4 days ago' },
];

const Category: React.FC = () => {
  const [searchParams] = useSearchParams();
  const catId = searchParams.get('cat');
  const initialCategory = catId ? (parseInt(catId, 10) || 1) : 1;
  
  const [selectedCategory, setSelectedCategory] = useState<number>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const categoryRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const currentCategory = categories.find(c => c.id === selectedCategory);
  
  // Filter products by subcategory if selected, otherwise by category
  const products = selectedSubcategory 
    ? sampleProducts.filter(p => p.subcategory === selectedSubcategory)
    : sampleProducts.filter(p => p.category === currentCategory?.name);

  const handleSubcategoryClick = (subcategory: string, categoryId: number) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (categoryId: number) => {
    setSelectedSubcategory(null);
    setSelectedCategory(categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-white">
                <h2 className="font-semibold text-lg text-gray-800">All Categories For You</h2>
              </div>
              <div className="p-2">
                {categories.map((category) => (
                  <div 
                    key={category.id}
                    ref={(el) => { categoryRefs.current[category.id] = el; }}
                    className="relative"
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        selectedCategory === category.id && !selectedSubcategory
                          ? 'bg-[#3F4E40] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="font-medium text-sm">{category.name}</span>
                    </button>

                    {/* Subcategories Popup on Hover */}
                    {hoveredCategory === category.id && category.subcategories && (
                      <div className="absolute left-full top-0 ml-2 z-50 w-64">
                        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                          <div className="p-3 bg-[#3F4E40] text-white">
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-xs text-gray-200">{category.subcategories.length} subcategories</p>
                          </div>
                          {/* Click category name to see all products */}
                          <button
                            onClick={() => handleCategoryClick(category.id)}
                            className={`w-full px-4 py-3 text-left font-semibold flex items-center justify-between border-b border-gray-200 ${
                              selectedCategory === category.id && !selectedSubcategory
                                ? 'bg-green-50 text-[#3F4E40]'
                                : 'text-[#3F4E40] hover:bg-gray-50'
                            }`}
                          >
                            <span>View All {category.name}</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                          </button>
                          <div className="py-2 max-h-64 overflow-y-auto">
                            {category.subcategories.map((sub, index) => (
                              <button
                                key={index}
                                onClick={() => handleSubcategoryClick(sub, category.id)}
                                className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between ${
                                  selectedSubcategory === sub
                                    ? 'bg-[#3F4E40] text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <span>{sub}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            ))}
                          </div>
                          <div className="p-3 border-t border-gray-200 bg-gray-50">
                            <button className="w-full text-center text-sm text-[#3F4E40] font-medium hover:underline">
                              View All {category.name} →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content - Products */}
          <main className="flex-1">
            {/* Selected Category Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedSubcategory || currentCategory?.name}
                  </h2>
                  <p className="text-gray-500">
                    {products.length} {products.length === 1 ? 'product' : 'products'} available
                    {selectedSubcategory && ` in ${selectedSubcategory}`}
                  </p>
                </div>
              </div>
              {selectedSubcategory && (
                <button 
                  onClick={() => {
                    setSelectedSubcategory(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-4 text-sm text-[#3F4E40] hover:underline flex items-center gap-1"
                >
                  ← Back to {currentCategory?.name}
                </button>
              )}
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div 
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                   
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button className="absolute bottom-3 right-3 w-8 h-8 bg-[#3F4E40] rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#2d3a2e]">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 relative">
                      {/* Rating at the top right */}
                      <div className="absolute top-4 right-4 flex items-center gap-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{product.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{product.subcategory}</p>
                      <h3 className="font-bold text-black mb-2 line-clamp-2 group-hover:text-[#3F4E40] transition-colors pr-16">
                        {product.name}
                      </h3>
                      {/* Location and Uploaded Time */}
                      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{product.location}</span>
                        <span className="text-gray-300">•</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{product.uploadedTime}</span>
                      </div>
                      {/* Price at bottom */}
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-[#3F4E40]">{product.price}RW</span>
                      </div>
                      {/* View More Button */}
                      <div className='flex justify-center items-center'>
                       <button className="flex justify-center items-center mt-3 w-ful py-1 px-8 border text-[#0C6227] text-sm font-medium rounded-full hover:bg-[#aec7b0] transition-colors duration-200 ">
                        View More
                      </button>
                      </div>
                    
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500">Products in this category will appear here</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Category;
