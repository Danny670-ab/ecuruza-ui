import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  nameKn: string;
}

const categories: Category[] = [
  { id: 1, name: 'Apparel & Accessories', nameKn: 'Imyenda' },
  { id: 2, name: 'Consumer Electronics', nameKn: 'Ibinyabubuzi' },
  { id: 3, name: 'Home & Garden', nameKn: 'Inzu' },
  { id: 4, name: 'Sports & Entertainment', nameKn: 'Imikino' },
  { id: 5, name: 'Beauty', nameKn: 'Ub Beautification' },
  { id: 6, name: 'Sportswear & Outdoor', nameKn: 'Imyenda' },
  { id: 7, name: 'Jewelry & Watches', nameKn: 'Ibijyanye' },
  { id: 8, name: 'Shoes & Accessories', nameKn: 'Inyundo' },
  { id: 9, name: 'Luggage & Bags', nameKn: 'Amaboko' },
  { id: 10, name: 'Packaging & Printing', nameKn: 'Ibyabuguzwa' },
  { id: 11, name: 'Kids & Toys', nameKn: 'Abana' },
  { id: 12, name: 'Personal Care', nameKn: 'Kwifata' },
  { id: 13, name: 'Health & Medical', nameKn: 'Ubuvuzi' },
  { id: 14, name: 'Gifts & Crafts', nameKn: 'Impano' },
  { id: 15, name: 'Pet Supplies', nameKn: 'Impetsi' },
  { id: 16, name: 'School & Office', nameKn: 'Ishuri' },
  { id: 17, name: 'Industrial Machinery', nameKn: 'Imashini' },
  { id: 18, name: 'Commercial Equipment', nameKn: 'Bucuruzi' },
  { id: 19, name: 'Construction & Building', nameKn: 'Ibyubakishwa' },
  { id: 20, name: 'Furniture', nameKn: 'Ibibata' },
  { id: 21, name: 'Lights & Lighting', nameKn: 'Imicaso' },
  { id: 22, name: 'Home Appliances', nameKn: 'Ibyabuguzwa' },
  { id: 23, name: 'Automotive Supplies', nameKn: 'Ngendo' },
  { id: 24, name: 'Tools & Hardware', nameKn: 'Ibyuma' },
  { id: 25, name: 'Renewable Energy', nameKn: 'Energie' },
  { id: 26, name: 'Electrical Equipment', nameKn: 'Amashanyarazi' },
  { id: 27, name: 'Safety & Security', nameKn: 'Kwirinda' },
  { id: 28, name: 'Food & Beverage', nameKn: 'Ubuhinzi' },
  { id: 29, name: 'Raw Materials', nameKn: 'Ibicuruza' },
  { id: 30, name: 'Fabrication Services', nameKn: 'Serivisi' },
  { id: 31, name: 'Service', nameKn: 'Serivisi' },
];

// Product interface
import sampleProducts from '../data/products';

const Category: React.FC = () => {
  const [searchParams] = useSearchParams();
  const catId = searchParams.get('cat');
  const initialCategory = catId ? (parseInt(catId, 10) || 1) : 1;
  
  const [selectedCategory, setSelectedCategory] = useState<number>(initialCategory);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // Mobile panel ref and measured height so the backdrop can match the panel's height
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const [mobilePanelHeight, setMobilePanelHeight] = useState<number | null>(null);

  // Anchor for desktop fixed sidebar and its measured offsets
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [leftOffset, setLeftOffset] = useState<number>(0);
  const [topOffset, setTopOffset] = useState<number>(0);

  

  // Measure the mobile panel height when it opens and on resize so the backdrop height
  // can be set to the same value (mobile-only effect)
  useEffect(() => {
    if (!mobileSidebarOpen) {
      // Defer clearing state to avoid sync setState inside effect
      const clearId = window.setTimeout(() => setMobilePanelHeight(null), 0);
      return () => window.clearTimeout(clearId);
    }

    const measure = () => {
      if (mobilePanelRef.current) {
        // Use getBoundingClientRect to get the rendered height
        const h = mobilePanelRef.current.getBoundingClientRect().height;
        setMobilePanelHeight(h);
      }
    };

    // Measure after the panel has been painted
    const id = window.setTimeout(measure, 0);
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('resize', measure);
    };
  }, [mobileSidebarOpen]);

  // Measure anchor position for the fixed desktop sidebar. Runs on mount and resize.
  useEffect(() => {
    const update = () => {
      if (anchorRef.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        // Defer state updates slightly to avoid sync setState-in-effect warnings
        const id = window.setTimeout(() => {
          setLeftOffset(rect.left);
          setTopOffset(rect.top);
        }, 0);
        return () => window.clearTimeout(id);
      }
    };

    // Do initial measurement
    const initialId = window.setTimeout(() => {
      if (anchorRef.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        setLeftOffset(rect.left);
        setTopOffset(rect.top);
      }
    }, 0);

    window.addEventListener('resize', update);
    return () => {
      window.clearTimeout(initialId);
      window.removeEventListener('resize', update);
    };
  }, []);

  const currentCategory = categories.find(c => c.id === selectedCategory);
  
  const products = sampleProducts.filter(p => p.category === currentCategory?.name);

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

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    // close mobile sidebar if open
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="flex flex-col  lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="w-full lg:w-72 shrink-0">
            {/* Desktop: placeholder anchor for the fixed sidebar (keeps layout intact) */}
            <div ref={anchorRef} className="w-full hidden lg:block mt-5" />

            {/* Mobile placeholder: space preserved for mobile flow */}
            <div className="w-full lg:hidden mt-5" />
          </aside>

          {/* Desktop fixed sidebar (aligned to placeholder) */}
          <div className="hidden lg:block" aria-hidden>
            <div
              style={{
                position: 'fixed',
                top: topOffset,
                left: leftOffset,
                width: 288, // 18rem (lg:w-72)
                maxHeight: '80vh'
              }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 bg-white">
                <h2 className="font-bold text-xl text-[#0C6227]">All Categories For You</h2>
              </div>
              <div className="p-2 overflow-y-auto" style={{ flex: '1 1 auto' }}>
                {categories.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-[#3F4E40] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="font-medium text-sm">{category.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile overlay sidebar (small screens only) */}
          {mobileSidebarOpen && (
            // mobile-only overlay: align children to the top so the backdrop can match panel height
            <div className="fixed inset-0 z-50 flex lg:hidden items-start">
              <div ref={mobilePanelRef} className="w-70 sm:w-72 bg-white p-4 shadow-lg rounded-b-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-[#0C6227]">All Categories For You</h3>
                  <button onClick={() => setMobileSidebarOpen(false)} className="text-gray-600">Close</button>
                </div>
                <div className="overflow-y-auto" style={{ maxHeight: '40vh' }}>
                  {categories.map((category) => (
                    <div key={category.id}>
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                          selectedCategory === category.id
                            ? 'bg-[#3F4E40] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="font-medium text-sm">{category.name}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="flex-1 bg-black/20 backdrop-blur-sm"
                onClick={() => setMobileSidebarOpen(false)}
                // set explicit height equal to the panel height so the blur only covers that vertical area
                style={mobilePanelHeight ? { height: `${mobilePanelHeight}px` } : undefined}
              />
            </div>
          )}

          <main className="flex-1">
            {/* Mobile: categories toggle */}
            <div className="md:hidden mb-4">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#3F4E40] text-white"
              >
                Categories
              </button>
            </div>

            {/* Selected Category Header */}
            <div className="flex bg-white rounded-md shadow-sm border border-gray-200  mb-6">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold ml-5 text-gray-800">
                    {currentCategory?.name}
                  </h2>
                  <p className="text-gray-500 ml-5">
                    {products.length} {products.length === 1 ? 'product' : 'products'} available
                  </p>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div 
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer flex flex-col"
                    style={{ minHeight: '480px', maxHeight: '480px' }}
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-gray-100" style={{ height: '280px' }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                   
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      {/* plus button removed per request (was shown on hover) */}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 relative flex flex-col flex-1">
                      {/* Rating at the top right */}
                      <div className="absolute top-4 right-4 flex items-center gap-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 ${i < Math.floor(product.rating ?? 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{product.rating}</span>
                      </div>
                      <h3 className="font-bold text-black mb-2 line-clamp-2 group-hover:text-[#3F4E40] transition-colors pr-16">
                        {product.name}
                      </h3>
                      {/* Location and Uploaded Time */}
                      <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
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
                      {/* Seller Name */}
                      <div className="flex items-center gap-2 mb-3 text-xs text-[#0C6227]">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">{getStoreDetails(product.category).name}</span>
                      </div>
                      {/* Price at bottom */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {product.originalPrice && (
                          <>
                           <span className="text-sm text-gray-400 line-through">{product.originalPrice}RW</span>
                          </>
                        )}
                       <span className="text-xl font-bold text-[#3F4E40]">{product.price}RW</span>
                      </div>
                      {/* View More Button */}
                      <div className='flex justify-center items-center mt-auto'>
                       <button onClick={() => { navigate(`/product/${product.id}`, { state: { product } }); }} className="flex justify-center items-center mt-3 w-ful py-1 px-8 border text-[#0C6227] text-sm font-medium rounded-full hover:bg-[#aec7b0] transition-colors duration-200 ">
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
          {/* product page navigation used instead of modal */}
        </div>
      </div>
    </div>
  );
};

export default Category;
