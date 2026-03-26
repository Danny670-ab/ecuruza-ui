import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sampleProducts from '../data/products';
import type { Product } from '../data/products';

interface SellerInfoProps {
  product?: Product;
}

const Sellerinfo: React.FC<SellerInfoProps> = ({ product }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'detail' | 'service' | 'feedback'>('detail');

  // Get similar products from same category
  const similarProducts = product?.category 
    ? sampleProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5)
    : sampleProducts.slice(0, 5);

  // If no product is provided, use a default one for demo
  const displayProduct = product || sampleProducts[0];

  // Get store details based on category
  const getStoreDetails = (category?: string) => {
    if (!category) return { name: 'Gikundiro Store', location: 'Kigali, Rwanda', phone: '+250 780 000 000', rating: '4.5', responseTime: '2h' };
    const cat = category.toLowerCase();
    if (cat.includes('consumer electronics')) return { name: 'TechZone Rwanda', location: 'Kigali, Rwanda', whatsapp: 'Whatssapp' };
    if (cat.includes('apparel')) return { name: 'Fashion Hub Rwanda', location: 'Kigali, Rwanda', whatsapp: 'Whatssapp' };
    if (cat.includes('home')) return { name: 'HomeStyle Rwanda', location: 'Kigali, Rwanda', whatsapp: 'Whatssapp'};
    if (cat.includes('sports')) return { name: 'Sportify Rwanda', location: 'Kigali, Rwanda', whatsapp: 'Whatssapp'};
    if (cat.includes('beauty')) return { name: 'Beauty Bliss Rwanda', location: 'Kigali, Rwanda', whatsapp: 'Whatssapp' };
    if (cat.includes('jewelry')) return { name: 'Sparkle Gems Rwanda', location: 'Kigali, Rwanda', whatsapp: 'Whatssapp' };
    if (cat.includes('luggage')) return { name: 'Travel Essentials Rwanda', location: 'Kigali, Rwanda', whatsapp: 'Whatssapp' };
    if (cat.includes('kids')) return { name: 'Toy World Rwanda', location: 'Kigali, Rwanda', whatsapp: 'Whatssapp' };
    if (cat.includes('pet')) return { name: 'Pet Care Rwanda', location: 'Kigali, Rwanda', whatsapp: 'Whatssapp' };
    if (cat.includes('automotive')) return { name: 'Auto Parts Rwanda', location: 'Kigali, Rwanda', whatsapp: 'Whatssapp',  };
    if (cat.includes('lights')) return { name: 'Lighting Store Rwanda', location: 'Kigali, Rwanda', whatsapp: 'Whatssapp'};
    if (cat.includes('appliance')) return { name: 'Appliances Rwanda', location: 'Kigali, Rwanda', whatsapp: 'Whatssapp' };
    if (cat.includes('food')) return { name: 'Food Market Rwanda', location: 'Kigali, Rwanda', whatsapp: 'Whatssapp' };
    if (cat.includes('health')) return { name: 'Health Store Rwanda', location: 'Kigali, Rwanda', whatsapp: 'Whatssapp' };
    return { name: 'Gikundiro Store', location: 'Kigali, Rwanda', whatsapp: 'Whatssapp' };
  };

  const storeDetails = getStoreDetails(displayProduct?.category);
  const storeInitial = storeDetails.name.charAt(0);

  return (
    <div className="max-w-7xl mx-auto  py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-1">
          {/* Seller Info Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Seller Info</h3>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#3F4E40] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {storeInitial}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{storeDetails.name}</div>
                <div className="text-xs text-gray-500">{storeDetails.location}</div>
              </div>
            </div>

  
            <div className="space-y-2 ">
              <button className="w-30 py-1 px- border border-[#3F4E40] text-[#3F4E40] rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                Visit Store
              </button>
              <button className="w-30 py-1 px- bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {storeDetails.whatsapp}
              </button>
            </div>
          </div>

          {/* Similar Items Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Similar Items</h3>
              <button className="text-sm text-[#3F4E40] hover:underline">View All</button>
            </div>

            <div className="space-y-4">
              {similarProducts.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate(`/product/${item.id}`, { state: { product: item } })}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 truncate">{item.name}</div>
                    <div className="text-sm font-semibold text-orange-600">{item.price.toLocaleString()} RWF</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT - RIGHT SIDE */}
        <div className="lg:col-span-3">
          {/* TABS SECTION */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Tab Headers */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('detail')}
                  className={`px-6 py-4 text-base font-medium transition-colors relative ${
                    activeTab === 'detail'
                      ? 'text-[#3F4E40]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Product Detail
                  {activeTab === 'detail' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3F4E40]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('service')}
                  className={`px-6 py-4 text-base font-medium transition-colors relative ${
                    activeTab === 'service'
                      ? 'text-[#3F4E40]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Service Commitment
                  {activeTab === 'service' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3F4E40]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`px-6 py-4 text-base font-medium transition-colors relative ${
                    activeTab === 'feedback'
                      ? 'text-[#3F4E40]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Feedback
                  {activeTab === 'feedback' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3F4E40]" />
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Product Detail Tab */}
              {activeTab === 'detail' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Features & details</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm font-medium text-gray-600 bg-gray-100 w-48">Group</td>
                          <td className="py-3 px-4 text-sm text-gray-900">Male, Female, common</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm font-medium text-gray-600 bg-gray-100 w-48">Size</td>
                          <td className="py-3 px-4 text-sm text-gray-900">Euro size</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm font-medium text-gray-600 bg-gray-100 w-48">Heel style</td>
                          <td className="py-3 px-4 text-sm text-gray-900">platform heels</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm font-medium text-gray-600 bg-gray-100 w-48">Heels</td>
                          <td className="py-3 px-4 text-sm text-gray-900">Low heel (1–3cm)</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm font-medium text-gray-600 bg-gray-100 w-48">Upper height</td>
                          <td className="py-3 px-4 text-sm text-gray-900">high top</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm font-medium text-gray-600 bg-gray-100 w-48">Styles</td>
                          <td className="py-3 px-4 text-sm text-gray-900">Short boots, Martin boots, Leather boots</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm font-medium text-gray-600 bg-gray-100 w-48">Pattern</td>
                          <td className="py-3 px-4 text-sm text-gray-900">Solid color</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm font-medium text-gray-600 bg-gray-100 w-48">Style</td>
                          <td className="py-3 px-4 text-sm text-gray-900">Youth trend, British style, Punk</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm font-medium text-gray-600 bg-gray-100 w-48">Toe style</td>
                          <td className="py-3 px-4 text-sm text-gray-900">Round toe</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm font-medium text-gray-600 bg-gray-100 w-48">Uppers material</td>
                          <td className="py-3 px-4 text-sm text-gray-900">Mixed materials</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-sm font-medium text-gray-600 bg-gray-100 w-48">Upper inside material</td>
                          <td className="py-3 px-4 text-sm text-gray-900">cotton</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Product Images Gallery */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
                  <div className="space-y-4">
                    {displayProduct.images && displayProduct.images.length > 0 ? (
                      displayProduct.images.slice(0, 5).map((img, idx) => (
                        <div key={idx} className="w-full h-full rounded-lg overflow-hidden bg-gray-100">
                          <img src={img} alt={`Product view ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))
                    ) : (
                      [
                        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
                        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800',
                        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
                        'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800',
                        'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800'
                      ].map((img, idx) => (
                        <div key={idx} className="w-full h-full rounded-lg overflow-hidden bg-gray-100">
                          <img src={img} alt={`Product view ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Service Commitment Tab */}
              {activeTab === 'service' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Commitment</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Genuine Product Guarantee</div>
                        <div className="text-sm text-gray-600 mt-1">All products are 100% authentic and quality verified</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Free Shipping</div>
                        <div className="text-sm text-gray-600 mt-1">Free shipping on orders over 50,000 RWF</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">24/7 Customer Support</div>
                        <div className="text-sm text-gray-600 mt-1">Round-the-clock assistance for all your needs</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Easy Returns</div>
                        <div className="text-sm text-gray-600 mt-1">30-day hassle-free return policy</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Tab */}
              {activeTab === 'feedback' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Feedback</h3>
                  <div className="space-y-4">
                    {/* Rating Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">{displayProduct.rating ?? 4.5}</div>
                        <div className="flex mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= Math.round(displayProduct.rating ?? 4.5) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{displayProduct.reviews ?? 0} reviews</div>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-600 w-3">{star}</span>
                            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-400 rounded-full" 
                                style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-8">{star === 5 ? '70%' : star === 4 ? '20%' : '10%'}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sample Reviews */}
                    <div className="border-t border-gray-200 pt-4 space-y-4">
                      <div className="pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">J</div>
                          <span className="text-sm font-medium text-gray-900">John D.</span>
                          <div className="flex ml-auto">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Great product! Exactly as described and shipped quickly. Highly recommend!</p>
                        <span className="text-xs text-gray-400 mt-1 block">Verified Purchase · 2 days ago</span>
                      </div>
                      <div className="pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">M</div>
                          <span className="text-sm font-medium text-gray-900">Mary K.</span>
                          <div className="flex ml-auto">
                            {[1, 2, 3, 4].map((star) => (
                              <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Good quality for the price. Delivery was a bit slow but overall satisfied.</p>
                        <span className="text-xs text-gray-400 mt-1 block">Verified Purchase · 1 week ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sellerinfo;
