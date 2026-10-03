import React, { useState } from 'react';
import type { SellerProfile, StoreSettings } from '../../types/seller';
import { toast } from 'react-toastify';
import { updateSellerProfileApi, updateShopApi } from '../../redux/services/sellerService';

interface StoreSettingViewProps {
  seller: SellerProfile;
  onUpdateProfile: (updated: Partial<SellerProfile>) => void;
}

export const StoreSettingView: React.FC<StoreSettingViewProps> = ({
  seller,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'location' | 'payouts' | 'notifications'>('profile');
  const [saving, setSaving] = useState(false);

  // Form states initialized from seller or defaults
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('store_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      storeName: seller.storeName || seller.businessName || 'My Store',
      slug: seller.slug || (seller.storeName || 'my-store').toLowerCase().replace(/\s+/g, '-'),
      bio: seller.storeDescription || '',
      email: seller.email || '',
      phone: seller.phone || '',
      whatsapp: '',
      address: seller.businessAddress || '',
      city: 'Kigali, Rwanda',
      bannerUrl: '',
      logoUrl: seller.avatar || '',
      openingHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
      paymentMethod: 'MTN Mobile Money',
      momoNumber: '',
      bankAccount: '',
      notificationsEnabled: true,
    };
  });

  const handleChange = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Update in parent component
      onUpdateProfile({
        storeName: settings.storeName,
        storeDescription: settings.bio,
        phone: settings.phone,
        avatar: settings.logoUrl,
        businessAddress: `${settings.address}, ${settings.city}`,
      });

      // 2. Persist locally
      localStorage.setItem('store_settings', JSON.stringify(settings));

      // 3. Sync seller profile to API backend
      await updateSellerProfileApi({
        businessName: settings.storeName,
        businessAddress: `${settings.address}, ${settings.city}`,
        phone: settings.phone,
      });

      // 4. Sync shop details to API backend
      if (seller.shopId) {
        await updateShopApi(seller.shopId, {
          name: settings.storeName,
          description: settings.bio,
          address: `${settings.address}, ${settings.city}`,
          phone: settings.phone,
        });
      }

      toast.success('Store settings saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
            Store Settings
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Configure your store identity, Rwandan payout preferences, and operational hours
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="self-start sm:self-auto flex items-center gap-2 rounded-xl bg-[#324035] px-5 py-2.5 text-xs md:text-sm font-bold text-white hover:bg-[#222529] transition-all shadow-sm active:scale-98"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200">
        {[
          { id: 'profile' as const, label: 'Store Identity' },
          { id: 'location' as const, label: 'Address & Hours' },
          { id: 'payouts' as const, label: 'Payouts & MoMo' },
          { id: 'notifications' as const, label: 'Notifications' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium text-xs md:text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#222529] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: Profile & Identity */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-gray-300/80 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-black border-b border-gray-100 pb-3">
              Store Branding & Overview
            </h3>

            {/* Banner & Logo Visual Preview */}
            <div className="space-y-3">
              <span className="block text-xs font-bold text-gray-700">Store Visual Preview</span>
              <div className="relative rounded-xl overflow-hidden bg-gray-100 h-36 border border-gray-200">
                <img
                  src={settings.bannerUrl}
                  alt="Store Banner"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                  <img
                    src={settings.logoUrl}
                    alt="Store Logo"
                    className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded-lg">
                    <span className="font-bold text-sm block leading-tight">{settings.storeName}</span>
                    <span className="text-[11px] text-gray-300">ecuruza.rw/store/{settings.slug}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Store Name *</label>
                <input
                  type="text"
                  required
                  value={settings.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Store URL Slug</label>
                <div className="flex rounded-lg border border-gray-300 bg-gray-50 overflow-hidden">
                  <span className="px-3 py-2 text-xs text-gray-500 bg-gray-100 border-r border-gray-300 flex items-center">
                    ecuruza.rw/store/
                  </span>
                  <input
                    type="text"
                    value={settings.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    className="w-full bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Store Bio / Description</label>
              <textarea
                rows={3}
                value={settings.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Store Logo URL</label>
                <input
                  type="url"
                  value={settings.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Store Banner URL</label>
                <input
                  type="url"
                  value={settings.bannerUrl}
                  onChange={(e) => handleChange('bannerUrl', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Address & Hours */}
        {activeTab === 'location' && (
          <div className="bg-white rounded-xl border border-gray-300/80 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-black border-b border-gray-100 pb-3">
              Contact & Physical Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Public Support Email *</label>
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Customer Support Phone *</label>
                <input
                  type="tel"
                  required
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Business Number</label>
                <input
                  type="tel"
                  value={settings.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="+250 788 123 456"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={settings.openingHours}
                  onChange={(e) => handleChange('openingHours', e.target.value)}
                  placeholder="e.g. Mon - Sat: 8:00 AM - 7:00 PM"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Physical Address / Street</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City / District</label>
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Payouts */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-xl border border-gray-300/80 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-black border-b border-gray-100 pb-3">
              Payout & Mobile Money (Rwanda)
            </h3>
            <p className="text-xs text-gray-500">
              Earnings from customer purchases are deposited directly to your verified payout account every Tuesday.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Primary Payout Method</label>
                <select
                  value={settings.paymentMethod}
                  onChange={(e) => handleChange('paymentMethod', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                >
                  <option value="MTN Mobile Money">MTN Mobile Money Rwanda (MoMo)</option>
                  <option value="Airtel Money">Airtel Money Rwanda</option>
                  <option value="Bank Transfer">Bank of Kigali / Commercial Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">MoMo Registered Phone Number</label>
                <input
                  type="tel"
                  value={settings.momoNumber}
                  onChange={(e) => handleChange('momoNumber', e.target.value)}
                  placeholder="+250 788..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Bank Account (Optional)</label>
              <input
                type="text"
                value={settings.bankAccount}
                onChange={(e) => handleChange('bankAccount', e.target.value)}
                placeholder="Bank Name, Account Holder, Account Number"
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
              />
            </div>
          </div>
        )}

        {/* TAB 4: Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-xl border border-gray-300/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-black border-b border-gray-100 pb-3">
              Notifications & Security
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
                  className="w-4 h-4 accent-[#324035]"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-900 block">Instant Order Notifications</span>
                  <span className="text-xs text-gray-500">Receive SMS and email when a new customer places an order</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 accent-[#324035]"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-900 block">Low Stock Alerts</span>
                  <span className="text-xs text-gray-500">Get notified when any inventory drops below 10 units</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Save button at bottom */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#324035] px-6 py-2.5 text-xs md:text-sm font-bold text-white hover:bg-[#222529] transition-all shadow-sm"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
