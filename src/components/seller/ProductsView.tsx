import React, { useState, useMemo } from 'react';
import type { SellerProduct } from '../../types/seller';
import { toast } from 'react-toastify';

interface ProductsViewProps {
  products: SellerProduct[];
  onAddProduct: (product: Omit<SellerProduct, 'id'>) => void;
  onDeleteProduct: (id: string) => void;
  onEditProduct?: (product: SellerProduct) => void;
  categoriesList?: Array<{ id: string; name: string }>;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onAddProduct,
  onDeleteProduct,
  categoriesList,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Electronics');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductImage, setNewProductImage] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');

  // Extract categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    if (categoriesList && categoriesList.length > 0) {
      categoriesList.forEach((c) => set.add(c.name));
    }
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    if (set.size === 0) {
      return ['All', 'Electronics', 'Footwear & Sports', 'Phones & Tablets', 'Audio & Music', 'Apparel & Fashion'];
    }
    return ['All', ...Array.from(set)];
  }, [products, categoriesList]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchStatus = selectedStatus === 'All' || p.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  // Inventory statistics
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.status === 'Available').length;
  const lowStockCount = products.filter((p) => p.status === 'Low Stock').length;
  const outOfStockCount = products.filter((p) => p.status === 'Out of Stock').length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) {
      toast.warning('Please enter a product name');
      return;
    }
    const priceNum = parseFloat(newProductPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.warning('Please enter a valid price in Rwf');
      return;
    }
    const stockNum = parseInt(newProductStock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      toast.warning('Please enter a valid stock quantity');
      return;
    }

    const defaultImg =
      newProductImage.trim() ||
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&auto=format&fit=crop&q=80';

    onAddProduct({
      name: newProductName.trim(),
      category: newProductCategory,
      price: priceNum,
      stockRemaining: stockNum,
      status: stockNum === 0 ? 'Out of Stock' : stockNum < 10 ? 'Low Stock' : 'Available',
      image: defaultImg,
      description: newProductDesc.trim(),
      salesCount: 0,
      rating: 5.0,
    });

    toast.success(`Product "${newProductName}" added successfully!`);
    setIsAddModalOpen(false);
    // Reset form
    setNewProductName('');
    setNewProductPrice('');
    setNewProductStock('');
    setNewProductImage('');
    setNewProductDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
            Products Management
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Manage your store inventory, pricing, catalog items, and stock visibility
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 rounded-xl bg-[#324035] px-4 py-2.5 text-xs md:text-sm font-bold text-white hover:bg-[#222529] transition-all shadow-sm active:scale-98"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Product</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm">
          <span className="text-xs font-medium text-gray-500">Total Products</span>
          <div className="mt-2 text-2xl font-bold text-gray-900">{totalProducts}</div>
          <span className="text-[11px] text-gray-400 mt-1 block">Catalog items</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm">
          <span className="text-xs font-medium text-emerald-700">In Stock</span>
          <div className="mt-2 text-2xl font-bold text-emerald-800">{inStockCount}</div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Ready for orders</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm">
          <span className="text-xs font-medium text-amber-700">Low Stock</span>
          <div className="mt-2 text-2xl font-bold text-amber-800">{lowStockCount}</div>
          <span className="text-[11px] text-amber-600 mt-1 block">&lt; 10 units left</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm">
          <span className="text-xs font-medium text-rose-700">Out of Stock</span>
          <div className="mt-2 text-2xl font-bold text-rose-800">{outOfStockCount}</div>
          <span className="text-[11px] text-rose-600 mt-1 block">Action required</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name or category..."
            className="w-full bg-[#dbe0e5] text-xs md:text-sm text-gray-800 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#324035]/40 placeholder-gray-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#f3f4f6] text-xs font-semibold text-gray-700 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#f3f4f6] text-xs font-semibold text-gray-700 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-300/80 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 className="text-base font-bold text-black">
            All Products ({filteredProducts.length})
          </h3>
          <span className="text-xs text-gray-500">Live inventory synchronized</span>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-300/80 text-gray-800 font-medium">
                <th className="py-3.5 px-3">Product</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Price</th>
                <th className="py-3.5 px-3">Stock Left</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Sales</th>
                <th className="py-3.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No products found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="text-gray-700 hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100 shadow-2xs"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div>
                          <span className="font-semibold text-gray-900 block leading-tight">
                            {prod.name}
                          </span>
                          <span className="text-[11px] text-gray-400">ID: {prod.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-gray-700 font-medium">
                      {prod.category || 'General'}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-gray-900">
                      Rwf {typeof prod.price === 'number' ? prod.price.toLocaleString() : prod.price || '50,000'}
                    </td>
                    <td className="py-3.5 px-3 text-gray-700">
                      <span className="font-semibold">{prod.stockRemaining}</span> units
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          prod.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : prod.status === 'Low Stock'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {prod.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-600">
                      {prod.salesCount ?? 24} sold
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            toast.info(`Viewing details for: ${prod.name}`);
                          }}
                          className="rounded-lg bg-[#e2e4e8] px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-300 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${prod.name}?`)) {
                              onDeleteProduct(prod.id);
                              toast.info(`Product removed from catalog`);
                            }
                          }}
                          className="rounded-lg bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
                <p className="text-xs text-gray-500 mt-0.5">List a new item in your seller storefront</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Nike Air Max Sport Shoes"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                  >
                    {categories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price (Rwf) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    placeholder="e.g. 45000"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Initial Stock Remaining *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={newProductImage}
                    onChange={(e) => setNewProductImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  placeholder="Describe the product specifications, materials, sizing, etc."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#324035] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#222529] transition-all shadow-sm"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
