export interface SellerProfile {
  id?: string;
  userId?: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  storeName?: string;
  storeDescription?: string;
  storeLogo?: string;
  storeBanner?: string;
  storeReturnPolicy?: string;
  storeShippingPolicy?: string;
  storeFacebookUrl?: string;
  storeTwitterUrl?: string;
  storeInstagramUrl?: string;
  storeLinkedinUrl?: string;
  storeYoutubeUrl?: string;
  storeTiktokUrl?: string;
  businessName?: string;
  businessAddress?: string;
  businessType?: string;
  businessPhone?: string;
  isVerified?: boolean;
  verificationStatus?: string;
  shopId?: string;
  slug?: string;
}

export interface SellerMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  bgColor: string;
}

export interface SellerProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  categoryId?: string;
  description?: string;
  status: 'Available' | 'Low Stock' | 'Out of Stock' | string;
  stockRemaining: number;
  salesCount: number;
  rating: number;
  shopId?: string;
}

export interface SellerOrder {
  id: string;
  code: string;
  product: string;
  customerName?: string;
  customerEmail?: string;
  orderDate: string;
  price: string;
  payment: string;
  status: string;
  action?: string;
  quantity?: number;
  shippingAddress?: string;
  items?: Array<{
    id?: string;
    productName?: string;
    quantity?: number;
    price?: number;
    image?: string;
  }>;
}

export interface SalesDataPoint {
  month: string;
  revenueHeight: number;
  orderHeight?: number;
  revenueAmount: number;
  orderCount: number;
}

export interface SellerCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: string;
  lastOrderDate: string;
  status: 'Active' | 'VIP' | 'New' | 'Inactive' | string;
}

export interface SellerShipment {
  id: string;
  trackingNumber: string;
  orderId: string;
  customerName: string;
  destination: string;
  carrier: string;
  shipDate: string;
  estimatedDelivery: string;
  status: 'Delivered' | 'In Transit' | 'Out for Delivery' | 'Processing' | string;
}

export interface SellerReview {
  id: string;
  customerName: string;
  customerAvatar?: string;
  productName?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase?: boolean;
  sellerReply?: string;
  shopId?: string;
  productId?: string;
}

export interface StoreSettings {
  storeName: string;
  slug?: string;
  bio?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city?: string;
  bannerUrl?: string;
  logoUrl?: string;
  returnPolicy?: string;
  shippingPolicy?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  openingHours?: string;
  paymentMethod?: string;
  momoNumber?: string;
  bankAccount?: string;
  notificationsEnabled?: boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Review' | 'Resolved' | string;
  createdAt: string;
  message: string;
}

export interface SellerApplication {
  id?: string;
  sellerId?: string;
  businessName?: string;
  businessType?: string;
  registrationNumber?: string;
  taxId?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW' | string;
  documents?: Array<{ type: string; url: string }>;
  reviewNotes?: string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SellerOnboardingPayload {
  businessName: string;
  businessType?: string;
  businessAddress?: string;
  businessPhone?: string;
  registrationNumber?: string;
  taxId?: string;
  idDocumentUrl?: string;
  businessLicenseUrl?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  attributes?: Record<string, string>;
  createdAt?: string;
}

export interface SellerNotification {
  id: string;
  title: string;
  message: string;
  type?: 'order' | 'review' | 'verification' | 'system' | string;
  isRead: boolean;
  createdAt: string;
}

export interface SellerMessage {
  id: string;
  senderName: string;
  senderEmail?: string;
  senderAvatar?: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}