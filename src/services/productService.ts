import { Product, ProductVariant, PageResponse } from '@/data/types';

const API_BASE_URL = 'http://139.59.172.236:8082/api/catalog-service/products';
const ORGANIZATION_ID = '11df577d-565f-4574-bf87-7a7463b2adc3';

interface ApiVariant {
  id: string;
  name: string;
  color?: string;
  size?: string;
  image: string;
  price: number;
  originalPrice?: number | null;
  onSale: boolean;
  isAvailable: boolean;
}

function mapVariant(v: ApiVariant): ProductVariant {
  return {
    id: v.id,
    name: v.name,
    color: v.color,
    size: v.size,
    image: v.image,
    price: v.price,
    originalPrice: v.originalPrice,
    onSale: v.onSale,
    inStock: v.isAvailable,
  };
}

function mapProduct(p: any): Product {
  return {
    ...p,
    variants: (p.variants || []).map(mapVariant),
  };
}

export async function fetchProductsByCategory(
  categoryId: string,
  page = 0,
  size = 12
): Promise<PageResponse<Product>> {
  const response = await fetch(
    `${API_BASE_URL}/categories/${categoryId}?page=${page}&size=${size}`,
    { headers: { 'X-ORG-ID': ORGANIZATION_ID } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const data = await response.json();
  return {
    ...data,
    content: data.content.map(mapProduct),
  };
}

export async function fetchProductById(productId: string): Promise<Product> {
  const response = await fetch(
    `${API_BASE_URL}/${productId}`,
    { headers: { 'X-ORG-ID': ORGANIZATION_ID } }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.status}`);
  }
  const data = await response.json();
  return mapProduct(data);
}

export async function fetchProductsBySubcategory(
  categoryId: string,
  subcategoryId: string,
  page = 0,
  size = 12
): Promise<PageResponse<Product>> {
  const response = await fetch(
    `${API_BASE_URL}/categories/${categoryId}/subcategories/${subcategoryId}?page=${page}&size=${size}`,
    { headers: { 'X-ORG-ID': ORGANIZATION_ID } }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const data = await response.json();
  return {
    ...data,
    content: data.content.map(mapProduct),
  };
}
