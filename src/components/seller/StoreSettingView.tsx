import React, { useState, useEffect } from 'react';
import type { SellerProfile, StoreSettings } from '../../types/seller';
import { toast } from 'react-toastify';
import {
  updateSellerProfileApi,
  updateShopApi,
  updateSellerBusinessApi,
  submitSellerOnboardingApi,
  fetchMySellerApplicationApi,
  changePasswordApi,
  verifyEmailApi,
  resendVerificationApi,
} from '../../redux/services/sellerService';

interface StoreSettingViewProps {
  seller: SellerProfile;
  onUpdateProfile: (updated: Partial<SellerProfile>) => void;
}

export const StoreSettingView: React.FC<StoreSettingViewProps> = ({
  seller,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'location' | 'verification' | 'payouts' | 'security' | 'notifications'>('profile');
  const [saving, setSaving] = useState(false);
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [submittingOnboarding, setSubmittingOnboarding] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Security & Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // Business verification state (POST /sellers/onboarding & PUT /sellers/business)
  const [businessData, setBusinessData] = useState<{
    businessName: string;
    businessType: 'INDIVIDUAL' | 'COMPANY';
    businessAddress: string;
    businessPhone: string;
    registrationNumber: string;
    taxId: string;
  }>({
    businessName: seller.businessName || seller.storeName || '',
    businessType: seller.businessType === 'COMPANY' ? 'COMPANY' : 'INDIVIDUAL',
    businessAddress: seller.businessAddress || 'Kigali, Rwanda',
    businessPhone: seller.phone || '',
    registrationNumber: '',
    taxId: '',
  });

  // Load verification status on mount (GET /sellers/applications/me)
  useEffect(() => {
    async function loadVerificationStatus() {
      try {
        const app = await fetchMySellerApplicationApi();
        if (app) {
          setApplicationData(app);
          const info = (app as any).application || app;
          if (info.businessName || info.taxId || info.registrationNumber) {
            setBusinessData((prev) => ({
              ...prev,
              businessName: info.businessName || prev.businessName,
              businessType: info.businessType || prev.businessType,
              businessAddress: info.businessAddress || prev.businessAddress,
              registrationNumber: info.registrationNumber || prev.registrationNumber,
              taxId: info.taxId || prev.taxId,
            }));
          }
        }
      } catch (err) {
        console.warn('Could not load application status:', err);
      }
    }
    loadVerificationStatus();
  }, []);

  // Form states initialized from seller or defaults
  const [settings, setSettings] = useState<StoreSettings>(() => {
    return {
      storeName: seller.storeName || seller.businessName || 'My Store',
      slug: seller.slug || (seller.storeName || 'my-store').toLowerCase().replace(/\s+/g, '-'),
      bio: seller.storeDescription || '',
      email: seller.email || '',
      phone: seller.phone || '',
      whatsapp: '',
      address: seller.businessAddress || '',
      city: 'Kigali, Rwanda',
      bannerUrl: seller.storeBanner || '',
      logoUrl: seller.storeLogo || '',
      openingHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
      paymentMethod: 'MTN Mobile Money',
      momoNumber: '',
      bankAccount: '',
      notificationsEnabled: true,
    };
  });

  const [logoPreview, setLogoPreview] = useState(settings.logoUrl || '');
  const [bannerPreview, setBannerPreview] = useState(settings.bannerUrl || '');

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      storeName: seller.storeName || prev.storeName,
      logoUrl: seller.storeLogo || prev.logoUrl,
      bannerUrl: seller.storeBanner || prev.bannerUrl,
    }));
  }, [seller.storeName, seller.storeLogo, seller.storeBanner]);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreview(settings.logoUrl || '');
      return;
    }
    const previewUrl = URL.createObjectURL(logoFile);
    setLogoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [logoFile, settings.logoUrl]);

  useEffect(() => {
    if (!bannerFile) {
      setBannerPreview(settings.bannerUrl || '');
      return;
    }
    const previewUrl = URL.createObjectURL(bannerFile);
    setBannerPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [bannerFile, settings.bannerUrl]);

  const selectImageFile = (
    event: React.ChangeEvent<HTMLInputElement>,
    imageType: 'logo' | 'banner'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Choose a JPEG, PNG, GIF, or WebP image.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Images must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    if (imageType === 'logo') setLogoFile(file);
    else setBannerFile(file);
  };

  const handleChange = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((logoFile || bannerFile) && !seller.shopId) {
      toast.error('A shop must be selected before uploading images.');
      return;
    }
    setSaving(true);
    try {
      // 1. Sync seller profile to API backend (PUT /sellers/profile)
      await updateSellerProfileApi({
        businessName: settings.storeName,
        businessAddress: `${settings.address}, ${settings.city}`,
        phone: settings.phone,
      });

      let savedLogoUrl = settings.logoUrl;
      let savedBannerUrl = settings.bannerUrl;

      // 2. Sync shop details when this seller has a shop ID.
      if (seller.shopId) {
        const response = await updateShopApi(seller.shopId, {
          name: settings.storeName,
          description: settings.bio,
          address: `${settings.address}, ${settings.city}`,
          phone: settings.phone,
          slug: settings.slug,
          logoFile,
          bannerFile,
        });
        const shop = (response as any)?.shop || response;
        const imageUrl = (value: unknown) =>
          typeof value === 'string' ? value : (value as any)?.url || (value as any)?.secure_url || '';
        savedLogoUrl = imageUrl(shop?.logo) || savedLogoUrl;
        savedBannerUrl = imageUrl(shop?.banner) || savedBannerUrl;
      }

      onUpdateProfile({
        storeName: settings.storeName,
        storeDescription: settings.bio,
        phone: settings.phone,
        storeLogo: savedLogoUrl,
        storeBanner: savedBannerUrl,
        businessAddress: `${settings.address}, ${settings.city}`,
      });
      setSettings((prev) => ({ ...prev, logoUrl: savedLogoUrl, bannerUrl: savedBannerUrl }));
      setLogoFile(null);
      setBannerFile(null);

      toast.success('Store settings saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Update seller business info (PUT /sellers/business)
  const handleUpdateBusinessInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBusiness(true);
    try {
      await updateSellerBusinessApi({
        businessName: businessData.businessName,
        businessType: businessData.businessType,
        businessAddress: businessData.businessAddress,
      });
      onUpdateProfile({
        businessName: businessData.businessName,
        businessType: businessData.businessType,
        businessAddress: businessData.businessAddress,
      });
      toast.success('Business information updated successfully!');
    } catch {
      toast.error('Failed to update business information.');
    } finally {
      setSavingBusiness(false);
    }
  };

  // Submit business verification for seller onboarding (POST /sellers/onboarding)
  const handleSubmitOnboardingVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessData.businessName.trim()) {
      toast.warning('Business name is required for verification.');
      return;
    }
    setSubmittingOnboarding(true);
    try {
      const res = await submitSellerOnboardingApi({
        businessName: businessData.businessName,
        businessType: businessData.businessType,
        businessAddress: businessData.businessAddress,
        country: 'Rwanda',
        city: 'Kigali',
        taxId: businessData.taxId || businessData.registrationNumber,
      });
      setApplicationData(res || { status: 'PENDING' });
      toast.success('Business verification submitted for onboarding review!');
    } catch {
      toast.error('Could not submit onboarding verification. Please check fields.');
    } finally {
      setSubmittingOnboarding(false);
    }
  };

  // Change password (POST /auth/change-password)
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      toast.warning('Please enter a new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warning('New password and confirm password do not match');
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePasswordApi({
        currentPassword,
        newPassword,
      });
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update password. Please check your current password.';
      toast.error(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Resend verification email (POST /auth/resend-verification)
  const handleResendEmail = async () => {
    if (!seller.email) return;
    setIsSendingCode(true);
    try {
      await resendVerificationApi(seller.email);
      toast.success(`Verification email sent to ${seller.email}`);
    } catch {
      toast.error('Failed to resend verification email');
    } finally {
      setIsSendingCode(false);
    }
  };

  // Verify email code (POST /auth/verify-email)
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      toast.warning('Please enter verification code');
      return;
    }
    setIsVerifyingCode(true);
    try {
      await verifyEmailApi({
        email: seller.email,
        code: verificationCode.trim(),
      });
      toast.success('Email verified successfully!');
      onUpdateProfile({ isVerified: true });
      setVerificationCode('');
    } catch {
      toast.error('Invalid or expired verification code');
    } finally {
      setIsVerifyingCode(false);
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
          { id: 'verification' as const, label: 'Business Verification' },
          { id: 'payouts' as const, label: 'Payouts & MoMo' },
          { id: 'security' as const, label: 'Account Security' },
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
                  src={bannerPreview}
                  alt="Store Banner"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                  <img
                    src={logoPreview}
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
                <label className="block text-xs font-bold text-gray-700 mb-1">Store Logo</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(event) => selectImageFile(event, 'logo')}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold"
                />
                <p className="mt-1 text-[11px] text-gray-500">JPEG, PNG, GIF, or WebP. Maximum 5 MB.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Store Banner</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(event) => selectImageFile(event, 'banner')}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold"
                />
                <p className="mt-1 text-[11px] text-gray-500">JPEG, PNG, GIF, or WebP. Maximum 5 MB.</p>
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

        {/* TAB 3: Business Verification & Onboarding (POST /sellers/onboarding & PUT /sellers/business & GET /sellers/applications/me) */}
        {activeTab === 'verification' && (
          <div className="bg-white rounded-xl border border-gray-300/80 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-black">
                  Business Verification & Seller Onboarding
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verify your business credentials in accordance with Rwandan trade regulations.
                </p>
              </div>

              {/* Status Badge */}
              <div>
                {seller.isVerified || applicationData?.status === 'APPROVED' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    Verified Merchant
                  </span>
                ) : applicationData?.status === 'PENDING' || applicationData?.status === 'UNDER_REVIEW' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    Verification In Review
                  </span>
                ) : applicationData?.status === 'REJECTED' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Verification Rejected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                    Pending Submission
                  </span>
                )}
              </div>
            </div>

            {applicationData?.reviewNotes && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                <span className="font-bold">Reviewer Feedback:</span> {applicationData.reviewNotes}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Registered Business Name *</label>
                <input
                  type="text"
                  required
                  value={businessData.businessName}
                  onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                  placeholder="e.g. Kigali Wholesale Ltd"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Business Structure / Type</label>
                <select
                  value={businessData.businessType}
                  onChange={(e) => setBusinessData({ ...businessData, businessType: e.target.value as 'INDIVIDUAL' | 'COMPANY' })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                >
                  <option value="INDIVIDUAL">Individual / Sole Trader</option>
                  <option value="COMPANY">Registered Company (Ltd)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">RDB Registration Certificate Number</label>
                <input
                  type="text"
                  value={businessData.registrationNumber}
                  onChange={(e) => setBusinessData({ ...businessData, registrationNumber: e.target.value })}
                  placeholder="e.g. 100987654"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">RRA Tax Identification Number (TIN)</label>
                <input
                  type="text"
                  value={businessData.taxId}
                  onChange={(e) => setBusinessData({ ...businessData, taxId: e.target.value })}
                  placeholder="e.g. 102345678"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Official Business Address</label>
                <input
                  type="text"
                  value={businessData.businessAddress}
                  onChange={(e) => setBusinessData({ ...businessData, businessAddress: e.target.value })}
                  placeholder="e.g. KN 4 Ave, Nyarugenge, Kigali"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Business Contact Phone</label>
                <input
                  type="tel"
                  value={businessData.businessPhone}
                  onChange={(e) => setBusinessData({ ...businessData, businessPhone: e.target.value })}
                  placeholder="+250 788 000 000"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                />
              </div>
            </div>

            {/* Action buttons specifically for business info & onboarding */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleUpdateBusinessInfo}
                disabled={savingBusiness}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-xs"
              >
                {savingBusiness ? 'Saving...' : 'Update Business Details (PUT /sellers/business)'}
              </button>

              <button
                type="button"
                onClick={handleSubmitOnboardingVerification}
                disabled={submittingOnboarding || seller.isVerified}
                className="rounded-xl bg-[#0C6227] px-4 py-2 text-xs md:text-sm font-bold text-white hover:bg-[#094d1e] transition-all shadow-xs disabled:opacity-50"
              >
                {submittingOnboarding
                  ? 'Submitting...'
                  : seller.isVerified
                  ? '✓ Verification Completed'
                  : 'Submit Verification for Onboarding (POST /sellers/onboarding)'}
              </button>
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

        {/* TAB: Account Security (POST /auth/change-password & POST /auth/verify-email) */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-xl border border-gray-300/80 p-6 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-black">Account Security & Password</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage your credentials and email verification status on real authentication database
              </p>
            </div>

            {/* Email Verification Card */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-gray-700 block">Registered Email</span>
                  <span className="font-semibold text-gray-900 text-sm">{seller.email}</span>
                </div>
                <div>
                  {seller.isVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Email Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Unverified
                    </span>
                  )}
                </div>
              </div>

              {!seller.isVerified && (
                <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit verification code"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#324035]"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isVerifyingCode}
                    className="rounded-lg bg-[#324035] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#222529] disabled:opacity-50"
                  >
                    {isVerifyingCode ? 'Verifying...' : 'Verify Email (POST /auth/verify-email)'}
                  </button>
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    disabled={isSendingCode}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    {isSendingCode ? 'Sending...' : 'Resend Code (POST /auth/resend-verification)'}
                  </button>
                </div>
              )}
            </div>

            {/* Change Password Form */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900">Change Account Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Current Password *</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">New Password *</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                  />
                </div>
              </div>

              <div className="flex justify-start pt-1">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="rounded-xl bg-[#324035] px-5 py-2 text-xs md:text-sm font-bold text-white hover:bg-[#222529] transition-all disabled:opacity-50"
                >
                  {isChangingPassword ? 'Updating Password...' : 'Update Password (POST /auth/change-password)'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Notifications */}
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
