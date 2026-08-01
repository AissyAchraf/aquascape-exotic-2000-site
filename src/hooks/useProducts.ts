import { useQuery } from '@tanstack/react-query';
import { Product, PageResponse } from '@/data/types';
import { fetchProductsByCategory, fetchProductsBySubcategory, fetchProductById } from '@/services/productService';

export function useProduct(productId: string | undefined) {
  return useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId!),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductsByCategory(categoryId: string | undefined, page = 0, size = 9) {
  return useQuery<PageResponse<Product>>({
    queryKey: ['products', 'category', categoryId, page, size],
    queryFn: () => fetchProductsByCategory(categoryId!, page, size),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductsBySubcategory(
  categoryId: string | undefined,
  subcategoryId: string | undefined,
  page = 0,
  size = 9
) {
  return useQuery<PageResponse<Product>>({
    queryKey: ['products', 'subcategory', categoryId, subcategoryId, page, size],
    queryFn: () => fetchProductsBySubcategory(categoryId!, subcategoryId!, page, size),
    enabled: !!categoryId && !!subcategoryId,
    staleTime: 5 * 60 * 1000,
  });
}
