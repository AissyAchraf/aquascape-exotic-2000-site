export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  color?: string;
  size?: string;
  image: string;
  price: number;
  originalPrice?: number | null;
  onSale: boolean;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  reference: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  variants: ProductVariant[];
  characteristics: Record<string, string>;
  images: string[];
  isBestSeller?: boolean;
  isPromotion?: boolean;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  createdAt: string;
  status: 'pending' | 'confirmed';
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}
