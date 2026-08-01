import { Category } from '@/data/types';

const API_BASE_URL = 'http://139.59.172.236:8082/api/catalog-service';
const ORGANIZATION_ID = '11df577d-565f-4574-bf87-7a7463b2adc3';

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(
    `${API_BASE_URL}/categories?organizationId=${ORGANIZATION_ID}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }

  return response.json();
}
