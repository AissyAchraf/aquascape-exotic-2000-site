import { CartItem, CustomerInfo } from '@/data/types';

const API_BASE_URL = 'http://139.59.172.236:8082/api/customer-service';
const ORGANIZATION_ID = '11df577d-565f-4574-bf87-7a7463b2adc3';

export interface CreateOrderRequest {
  items: {
    productId: string;
    variantId: string;
    quantity: number;
  }[];
  customer: CustomerInfo;
}

export async function submitOrder(cartItems: CartItem[], customer: CustomerInfo): Promise<{ id: string }> {
  const body: CreateOrderRequest = {
    items: cartItems.map(item => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
    })),
    customer,
  };

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-ORG-ID': ORGANIZATION_ID,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to submit order');
  }

  return response.json();
}
