import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import sampleProducts from '../data/products';
import type { Product } from '../data/products';
import SellerInfo from './Sellerinfo';

// Small helper to display prices like "20K" when number >= 1000.
function formatPrice(raw?: number | string | null | undefined) {
  if (raw === null || raw === undefined || raw === '') return '';
  const n = typeof raw === 'number' ? raw : Number(String(raw).replace(/[^0-9.-]+/g, ''));
  if (!isFinite(n)) return String(raw);
  if (Math.abs(n) >= 1000) {
    const thousands = Math.round(n / 1000);
    return `${thousands}K`;
  }
  return String(n);
}

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as unknown) as { product?: Product } | null;

  const productFromState = state?.product as Product | undefined;
  const productFromData = id ? sampleProducts.find(p => String(p.id) === String(id)) : undefined;
  const product = productFromState ?? productFromData;

  const images = (product && product.images && product.images.length > 0) ? product.images : [product?.image ?? ''];
  const colors = (product && product.colors) ? product.colors : [];
  const sizes = (product && product.sizes) ? product.sizes : [];

  const defaultColors = ['#B97C6A', '#2F7A4A', '#FFFFFF'];
  const category = product?.category?.toLowerCase() || '';
  const defaultSizes = (): number[] => {
    if (category.includes('apparel') || category.includes('sport') || category.includes('shoe')) {
      return [8, 14, 20, 6, 18];
    }
    return [];
  };
  const normColors = (colors.length >= 3) ? colors.slice(0, 3) : [...colors, ...defaultColors].slice(0, 3);
  const normImages = (images.length >= 3) ? images.slice(0, 3) : [...images, ...Array(Math.max(0, 3 - images.length)).fill(images[0])];
  const normSizes = sizes.length > 0 ? sizes : defaultSizes();

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string>(normImages[0]);
  const [selectedColor, setSelectedColor] = useState<string | null>(normColors[0] ?? null);
  const [selectedSize, setSelectedSize] = useState<number | string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string>('256GB');
  const [selectedQuality, setSelectedQuality] = useState<number>(1);
  // const [activeTab, setActiveTab] = useState<'detail' | 'service' | 'feedback'>('detail');

  // Check if product is mobile/laptop/electronics
  const isElectronics = product?.category?.toLowerCase().includes('mobile') || 
                        product?.category?.toLowerCase().includes('phone') || 
                        product?.category?.toLowerCase().includes('laptop') || 
                        product?.category?.toLowerCase().includes('computer') || 
                        product?.category?.toLowerCase().includes('tablet') || 
                        product?.category?.toLowerCase().includes('electronics');

  // Storage options for electronics
  const storageOptions = ['256GB', '512GB', '1TB'];

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

  const storeDetails = product ? getStoreDetails(product.category) : { name: 'Gikundiro Store', location: 'Kigali, Rwanda', phone: '+250 780 000 000', rating: '4.5', responseTime: '2h' };

  // Color names mapping
  const colorNames: { [key: string]: string } = {
    '#B97C6A': 'Brown',
    '#2F7A4A': 'Green',
    '#FFFFFF': 'White',
    '#000000': 'Black',
    '#FF0000': 'Red',
    '#0000FF': 'Blue',
    '#FFD700': 'Gold',
    '#C0C0C0': 'Silver',
  };

  // Get color name
  const getColorName = (color: string) => colorNames[color] || color;

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <p className="text-gray-600 mb-4">We couldn't find the product details for id {id}.</p>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-[#3F4E40] text-white rounded">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px- py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: thumbnails + main image */}
        <div className="flex flex-col lg:flex-row items-start gap-4">
          <div className="hidden lg:flex flex-col gap-3 w-28">
            {normImages.map((src, i) => (
              <button
                key={i}
                onClick={() => { setSelectedIndex(i); setSelectedImage(src); }}
                onMouseEnter={() => { setSelectedIndex(i); setSelectedImage(src); }}
                className={`w-28 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:opacity-90 ${i === selectedIndex ? 'ring-2 ring-[#3F4E40] ring-offset-2' : 'border border-gray-200'}`}
              >
                <div className="relative">
                  <img src={src} alt={`View ${i + 1}`} className="w-full h-28 object-cover" />
                </div>
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            {/* <div className="absolute right-3 top-3 flex flex-col gap-2 z-10">
              <button className="w-9 h-9 bg-white rounded-md shadow flex items-center justify-center">❤</button>
            </div> */}
            <div className="rounded-md  overflow-hidden bg-gray-100" style={{ height: '500px', width: '500px' }}>
              <img src={selectedImage} alt={product.name} className="w-full h-full object-cover object-center" />
            </div>
            <div className="flex gap-3 mt-4 lg:hidden overflow-x-auto pb-2">
              {normImages.map((src, i) => (
                <button key={i} onClick={() => { setSelectedIndex(i); setSelectedImage(src); }} onMouseEnter={() => { setSelectedIndex(i); setSelectedImage(src); }} className={`w-24 shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:opacity-90 ${i === selectedIndex ? 'ring-2 ring-[#3F4E40] ring-offset-2' : 'border border-gray-200'}`}>
                  <div className="relative">
                    <img src={src} alt={`View ${i + 1}`} className="w-full h-24 object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 text-center">
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: details */}
        <div className="pt-2 ml-14">
          <div className="text-sm text-gray-500 mb-1">{storeDetails.name}</div>
          <h1 className="text-3xl font-bold mt-1">{storeDetails.name}</h1>

          {/* 5-Star Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(product.rating ?? 4.5) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating ?? 4.5} ({product.reviews ?? 0} reviews)</span>
          </div>
          <div className="mt-4 flex items-baseline gap-3 flex-wrap">
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through mr-2">
                  ${formatPrice(product.originalPrice)}
                </span>
             </>       
            )}
            <span className="text-3xl font-extrabold text-black">{formatPrice(product.price * selectedQuality)}RW</span>
          </div>
          <div className="mt-6">
            <div className="text-sm font-medium mb-2">Description:</div>
            <div className="text-gray-600 text-sm max-h-36 overflow-y-auto">{product.description}</div>
          </div>   
          {/* Select Color */}
          {normColors.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-3">
             <div className="text-sm font-medium mb-3">Select Color</div>
              {normColors.map((c, idx) => (
                <button
                  key={c + idx}
                  onClick={() => { setSelectedIndex(idx); setSelectedImage(normImages[idx] ?? normImages[0]); setSelectedColor(c); }}
                  className={`w-12 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${selectedColor === c ? 'ring-2 ring-offset-2 ring-red-500 bg-gray-100' : 'bg-gray-50 border border-gray-200'}`}
                  style={{ background: c === '#FFFFFF' ? '#fff' : c }}
                >
                  <span className={c === '#FFFFFF' || c === '#FFD700' || c === '#C0C0C0' ? 'text-gray-800' : 'text-white'}>
                    {getColorName(c)}
                  </span>
                </button>
              ))}
            </div>
          </div>
          )}

          {/* Select Storage - Only for mobile/laptop/electronics */}
          {isElectronics && (
          <div className="mt-6">
            <div className="text-sm font-medium mb-3">Select Storage</div>
            <div className="flex items-center gap-3">
              {storageOptions.map((storage) => (
                <button
                  key={storage}
                  onClick={() => setSelectedStorage(storage)}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                    selectedStorage === storage
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {storage}
                </button>
              ))}
            </div>
          </div>
          )}

          {normSizes.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium mb-2">Size:</div>
              {normSizes.map((s) => (
                <button key={s} onClick={() => setSelectedSize(s)} className={`px-3 py-1 rounded text-sm ${selectedSize === s ? 'bg-gray-300' : 'bg-gray-100'}`}>{s}</button>
              ))}
            </div>
          </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium mb-3">Quantity</div>
              <button 
                onClick={() => setSelectedQuality(Math.max(1, selectedQuality - 1))}
                className="w-10 h-8 rounded-lg bg-gray-100 flex items-center justify-center  text-xl font-bold hover:bg-gray-200"
              >
                -
              </button>
              <span className="w-12 text-center text-lg font-semibold">{selectedQuality}</span>
              <button 
                onClick={() => setSelectedQuality(Math.min(10, selectedQuality + 1))}
                className="w-10 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xl font-bold hover:bg-gray-200"
              >
                +
              </button>
              <span className="text-sm text-gray-500 ml-2">Only {15 - selectedQuality} items left</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-6 flex items-center gap-4">
            <button onClick={() => {
              try {
                const raw = window.localStorage.getItem('cart');
                const cart = raw ? JSON.parse(raw) : [];
                cart.push({ id: product.id, name: product.name, price: product.price, image: selectedImage, color: selectedColor, size: selectedSize, storage: selectedStorage, quality: selectedQuality, qty: selectedQuality });
                window.localStorage.setItem('cart', JSON.stringify(cart));
              } catch (err) { console.error(err); }
            }} className="bg-[#3F4E40] text-white rounded-lg w-32 h-10 text-base font-semibold hover:bg-red-700 transition-colors">Add To Cart</button>

          </div>
        </div>

      </div>
      <div className='mt-20'>
        <SellerInfo product={product} />
      </div>
    </div>
  );
};

export default ProductPage;


