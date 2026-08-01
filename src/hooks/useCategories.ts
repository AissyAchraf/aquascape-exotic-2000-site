import { useQuery } from '@tanstack/react-query';
import { Category } from '@/data/types';
import { fetchCategories } from '@/services/categoryService';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
