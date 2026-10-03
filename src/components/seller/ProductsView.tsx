import React, { useState, useMemo, useEffect } from 'react';
import type { SellerProduct, ProductVariant } from '../../types/seller';
import { toast } from 'react-toastify';
import {
  fetchProductByIdApi,
  updateProductApi,
  fetchProductVariantsApi,
  createProductVariantApi,
  updateProductVariantApi,
  deleteProductVariantApi,
  updateVariantInventoryApi,
} from '../../redux/services/sellerService';

interface ProductsViewProps {
  products: SellerProduct[];
  onAddProduct: (product: Omit<SellerProduct, 'id'>) => void;
  onDeleteProduct: (id: string) => void;
  onEditProduct?: (product: SellerProduct) => void;
  categoriesList?: Array<{ id: string; name: string }>;
  shopId?: string;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onAddProduct,
  onDeleteProduct,
  onEditProduct,
  categoriesList,
  shopId,
}) => {
  // Navigation tabs within Products section
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'inventory'>('all');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);
  const [viewingProduct, setViewingProduct] = useState<SellerProduct | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Variant & Inventory management modal
  const [variantProduct, setVariantProduct] = useState<SellerProduct | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantSku, setNewVariantSku] = useState('');
  const [newVariantPrice, setNewVariantPrice] = useState('');
  const [newVariantStock, setNewVariantStock] = useState('');

  // Inline stock edit states
  const [stockEditMap, setStockEditMap] = useState<Record<string, number>>({});
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);

  // New product form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Electronics');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductImage, setNewProductImage] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');

  // Edit product form state
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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

  // Open Edit Product Modal
  const handleOpenEdit = (product: SellerProduct) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditCategory(product.category || 'General');
    setEditPrice(String(product.price));
    setEditStock(String(product.stockRemaining));
    setEditImage(product.image || '');
    setEditDesc(product.description || '');
  };

  // Submit Product Edit (PUT /api/v1/products/{id})
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editName.trim()) {
      toast.warning('Please enter a product name');
      return;
    }
    const priceNum = parseFloat(editPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.warning('Please enter a valid price');
      return;
    }
    const stockNum = parseInt(editStock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      toast.warning('Please enter a valid stock quantity');
      return;
    }

    setIsSavingEdit(true);
    try {
      const updatedData: Partial<SellerProduct> = {
        name: editName.trim(),
        category: editCategory,
        price: priceNum,
        stockRemaining: stockNum,
        status: stockNum === 0 ? 'Out of Stock' : stockNum < 10 ? 'Low Stock' : 'Available',
        image: editImage.trim() || editingProduct.image,
        description: editDesc.trim(),
        shopId: editingProduct.shopId || shopId,
      };

      const result = await updateProductApi(editingProduct.id, updatedData);
      const merged: SellerProduct = {
        ...editingProduct,
        ...updatedData,
        id: editingProduct.id,
      };

      if (onEditProduct) {
        onEditProduct(result || merged);
      }
      toast.success(`Product "${editName}" updated successfully!`);
      setEditingProduct(null);
    } catch {
      toast.error('Failed to update product');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Open Product Details (GET /api/v1/products/{id})
  const handleOpenDetails = async (product: SellerProduct) => {
    setViewingProduct(product);
    setIsLoadingDetails(true);
    try {
      const realDetails = await fetchProductByIdApi(product.id);
      if (realDetails) {
        setViewingProduct({ ...product, ...realDetails });
      }
    } catch {
      // Keep existing product if fetch fails
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Open Variants & Inventory Modal (GET /api/v1/products/{productId}/variants)
  const handleOpenVariantsModal = async (product: SellerProduct) => {
    setVariantProduct(product);
    setIsLoadingVariants(true);
    setIsAddingVariant(false);
    try {
      const list = await fetchProductVariantsApi(product.id);
      setVariants(list);
    } catch {
      setVariants([]);
    } finally {
      setIsLoadingVariants(false);
    }
  };

  // Add Product Variant (POST /api/v1/products/{productId}/variants)
  const handleCreateVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!variantProduct) return;
    if (!newVariantName.trim()) {
      toast.warning('Variant option name is required');
      return;
    }
    const priceNum = parseFloat(newVariantPrice) || variantProduct.price;
    const stockNum = parseInt(newVariantStock, 10) || 0;

    try {
      const created = await createProductVariantApi(variantProduct.id, {
        name: newVariantName.trim(),
        sku: newVariantSku.trim() || undefined,
        price: priceNum,
        stock: stockNum,
      });
      setVariants((prev) => [...prev, created]);
      toast.success(`Variant "${newVariantName}" added successfully!`);
      setNewVariantName('');
      setNewVariantSku('');
      setNewVariantPrice('');
      setNewVariantStock('');
      setIsAddingVariant(false);
    } catch {
      toast.error('Failed to add variant');
    }
  };

  // Delete Variant (DELETE /api/v1/products/variants/{variantId})
  const handleDeleteVariant = async (variantId: string) => {
    if (!window.confirm('Delete this product variant?')) return;
    try {
      await deleteProductVariantApi(variantId);
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
      toast.success('Variant removed');
    } catch {
      toast.error('Failed to delete variant');
    }
  };

  // Quick Update Variant Inventory (PUT /api/v1/products/variants/{variantId}/inventory)
  const handleUpdateVariantStock = async (variantId: string, newInventory: number) => {
    try {
      await updateVariantInventoryApi(variantId, newInventory);
      setVariants((prev) =>
        prev.map((v) => (v.id === variantId ? { ...v, stock: newInventory } : v))
      );
      toast.success('Variant inventory updated');
    } catch {
      toast.error('Failed to update variant inventory');
    }
  };

  // Quick Update Product Stock (PUT /api/v1/products/{id})
  const handleQuickUpdateStock = async (productId: string) => {
    const newStock = stockEditMap[productId];
    if (newStock === undefined || isNaN(newStock) || newStock < 0) {
      toast.warning('Please enter a valid stock quantity');
      return;
    }
    setUpdatingStockId(productId);
    try {
      const prod = products.find((p) => p.id === productId);
      if (prod) {
        const updated = await updateProductApi(productId, {
          stockRemaining: newStock,
          status: newStock === 0 ? 'Out of Stock' : newStock < 10 ? 'Low Stock' : 'Available',
        });
        if (onEditProduct) {
          onEditProduct(updated || {
            ...prod,
            stockRemaining: newStock,
            status: newStock === 0 ? 'Out of Stock' : newStock < 10 ? 'Low Stock' : 'Available',
          });
        }
      }
      toast.success('Stock inventory updated successfully!');
    } catch {
      toast.error('Failed to update stock');
    } finally {
      setUpdatingStockId(null);
    }
  };

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
      shopId,
    });

    setIsAddModalOpen(false);
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
            Manage your store inventory, pricing, catalog items, variants, and stock visibility
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#324035] px-4 py-2.5 text-xs md:text-sm font-bold text-white hover:bg-[#222529] transition-all shadow-sm active:scale-98"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Internal Subtabs: All Products vs Inventory */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`px-4 py-2 rounded-xl font-medium text-xs md:text-sm transition-all ${
            activeSubTab === 'all'
              ? 'bg-[#222529] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 hover:text-black'
          }`}
        >
          All Products ({products.length})
        </button>
        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`px-4 py-2 rounded-xl font-medium text-xs md:text-sm transition-all ${
            activeSubTab === 'inventory'
              ? 'bg-[#222529] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 hover:text-black'
          }`}
        >
          Inventory & Stock Management
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

      {/* SUBTAB 1: ALL PRODUCTS TABLE */}
      {activeSubTab === 'all' && (
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
                        Rwf {typeof prod.price === 'number' ? prod.price.toLocaleString() : prod.price || '0'}
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
                        {prod.salesCount ?? 0} sold
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleOpenDetails(prod)}
                            className="rounded-lg bg-[#e2e4e8] px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-300 transition-colors"
                            title="View product details"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="rounded-lg bg-[#324035] px-2 py-1 text-xs font-semibold text-white hover:bg-[#222529] transition-colors"
                            title="Edit product"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleOpenVariantsModal(prod)}
                            className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            title="Manage Variants"
                          >
                            Variants
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to remove ${prod.name}?`)) {
                                onDeleteProduct(prod.id);
                              }
                            }}
                            className="rounded-lg bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                            title="Delete product"
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
      )}

      {/* SUBTAB 2: INVENTORY & STOCK MANAGEMENT TABLE */}
      {activeSubTab === 'inventory' && (
        <div className="bg-white rounded-xl border border-gray-300/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div>
              <h3 className="text-base font-bold text-black">Inventory Stock Control</h3>
              <p className="text-xs text-gray-500">Update item quantities or manage variant stock levels directly</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-300/80 text-gray-800 font-medium">
                  <th className="py-3.5 px-3">Product Name</th>
                  <th className="py-3.5 px-3">Current Stock</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Quick Adjust Stock</th>
                  <th className="py-3.5 px-3 text-right">Variants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="text-gray-700 hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-gray-900">
                      {prod.name}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-gray-800">
                      {prod.stockRemaining} units
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
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          defaultValue={prod.stockRemaining}
                          onChange={(e) =>
                            setStockEditMap({
                              ...stockEditMap,
                              [prod.id]: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#324035]"
                        />
                        <button
                          onClick={() => handleQuickUpdateStock(prod.id)}
                          disabled={updatingStockId === prod.id}
                          className="rounded-lg bg-[#324035] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#222529] disabled:opacity-50"
                        >
                          {updatingStockId === prod.id ? 'Saving...' : 'Update'}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleOpenVariantsModal(prod)}
                        className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 text-xs font-semibold"
                      >
                        Manage Variants
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD PRODUCT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
                <p className="text-xs text-gray-500 mt-0.5">List a new item in your seller storefront (POST /products)</p>
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
                  placeholder="e.g. Rwandan Highland Arabica Coffee"
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

      {/* MODAL 2: EDIT PRODUCT (PUT /products/{id}) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Edit Product</h3>
                <p className="text-xs text-gray-500 mt-0.5">Update product details in database (PUT /products/{editingProduct.id})</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-700 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
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
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Stock Remaining *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="rounded-xl bg-[#324035] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#222529] transition-all shadow-sm"
                >
                  {isSavingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PRODUCT DETAILS (GET /products/{id}) */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Product Details</h3>
                <span className="text-xs text-gray-500">ID: {viewingProduct.id}</span>
              </div>
              <button
                onClick={() => setViewingProduct(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {isLoadingDetails ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                Fetching latest details from database...
              </div>
            ) : (
              <div className="mt-4 space-y-4 text-xs md:text-sm">
                <div className="flex items-center gap-4">
                  <img
                    src={viewingProduct.image}
                    alt={viewingProduct.name}
                    className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{viewingProduct.name}</h4>
                    <span className="text-emerald-700 font-bold block text-sm mt-0.5">
                      Rwf {typeof viewingProduct.price === 'number' ? viewingProduct.price.toLocaleString() : viewingProduct.price}
                    </span>
                    <span className="text-gray-500 block text-xs mt-0.5">Category: {viewingProduct.category || 'General'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl">
                  <div>
                    <span className="text-gray-500 block text-xs">Inventory Stock</span>
                    <span className="font-bold text-gray-900">{viewingProduct.stockRemaining} units remaining</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Status</span>
                    <span className="font-bold text-emerald-700">{viewingProduct.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Sales Volume</span>
                    <span className="font-bold text-gray-900">{viewingProduct.salesCount ?? 0} units sold</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Rating</span>
                    <span className="font-bold text-amber-600">★ {viewingProduct.rating || 5.0}</span>
                  </div>
                </div>

                {viewingProduct.description && (
                  <div>
                    <span className="font-bold text-gray-700 block mb-1">Description</span>
                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {viewingProduct.description}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      const p = viewingProduct;
                      setViewingProduct(null);
                      handleOpenEdit(p);
                    }}
                    className="rounded-xl bg-[#324035] px-4 py-2 text-xs font-bold text-white hover:bg-[#222529]"
                  >
                    Edit This Product
                  </button>
                  <button
                    onClick={() => setViewingProduct(null)}
                    className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: VARIANTS & INVENTORY (GET/POST/PUT/DELETE /products/{id}/variants) */}
      {variantProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  Manage Product Variants & Inventory
                </h3>
                <p className="text-xs text-gray-500">
                  Product: <span className="font-semibold text-gray-900">{variantProduct.name}</span>
                </p>
              </div>
              <button
                onClick={() => setVariantProduct(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Add Variant Toggle */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-700">Available Variants ({variants.length})</span>
                <button
                  type="button"
                  onClick={() => setIsAddingVariant(!isAddingVariant)}
                  className="rounded-lg bg-[#324035] text-white px-3 py-1.5 text-xs font-bold hover:bg-[#222529]"
                >
                  {isAddingVariant ? 'Cancel Variant' : '+ Add Variant'}
                </button>
              </div>

              {/* Add Variant Form */}
              {isAddingVariant && (
                <form onSubmit={handleCreateVariant} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">New Variant Specification</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Variant Name (e.g. Size XL, Color Blue) *</label>
                      <input
                        type="text"
                        required
                        value={newVariantName}
                        onChange={(e) => setNewVariantName(e.target.value)}
                        placeholder="e.g. 500g Bag / Roasted"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#324035]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">SKU Code (Optional)</label>
                      <input
                        type="text"
                        value={newVariantSku}
                        onChange={(e) => setNewVariantSku(e.target.value)}
                        placeholder="e.g. SKU-COF-500"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#324035]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Price (Rwf)</label>
                      <input
                        type="number"
                        min="0"
                        value={newVariantPrice}
                        onChange={(e) => setNewVariantPrice(e.target.value)}
                        placeholder={String(variantProduct.price)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#324035]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Initial Stock</label>
                      <input
                        type="number"
                        min="0"
                        value={newVariantStock}
                        onChange={(e) => setNewVariantStock(e.target.value)}
                        placeholder="10"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#324035]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-[#324035] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#222529]"
                    >
                      Save Variant (POST /products/{variantProduct.id}/variants)
                    </button>
                  </div>
                </form>
              )}

              {/* Variants List Table */}
              {isLoadingVariants ? (
                <div className="py-8 text-center text-gray-500 text-xs">Loading variants...</div>
              ) : variants.length === 0 ? (
                <div className="py-6 text-center text-gray-400 text-xs bg-gray-50 rounded-xl">
                  No separate variants defined yet. Standard catalog inventory applies.
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                      <tr>
                        <th className="py-2.5 px-3">Variant</th>
                        <th className="py-2.5 px-3">SKU</th>
                        <th className="py-2.5 px-3">Price</th>
                        <th className="py-2.5 px-3">Stock Units</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {variants.map((v) => (
                        <tr key={v.id} className="hover:bg-gray-50/60">
                          <td className="py-2.5 px-3 font-semibold text-gray-900">{v.name}</td>
                          <td className="py-2.5 px-3 text-gray-500 font-mono text-[11px]">{v.sku || '—'}</td>
                          <td className="py-2.5 px-3 font-bold text-gray-800">
                            Rwf {typeof v.price === 'number' ? v.price.toLocaleString() : v.price}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min="0"
                                defaultValue={v.stock}
                                onBlur={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val !== v.stock) {
                                    handleUpdateVariantStock(v.id, val);
                                  }
                                }}
                                className="w-16 rounded border border-gray-300 px-1.5 py-0.5 text-xs text-gray-900"
                              />
                              <span className="text-[10px] text-gray-400">units</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleDeleteVariant(v.id)}
                              className="text-red-600 hover:text-red-700 font-semibold text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setVariantProduct(null)}
                className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsView;
