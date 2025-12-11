/**
 * WooCommerce API Client
 * Handles all interactions with the WooCommerce REST API
 */

const WC_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || 'https://olivadis.com';
const WC_CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

const WC_API_BASE = `${WC_URL}/wp-json/wc/v3`;

interface WooCommerceRequestOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  params?: Record<string, string | number | boolean>;
}

/**
 * Make authenticated request to WooCommerce API
 */
async function woocommerceRequest<T>({
  endpoint,
  method = 'GET',
  data,
  params = {},
}: WooCommerceRequestOptions): Promise<T> {
  const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value));
  });

  const url = `${WC_API_BASE}${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
    // Cache for 60 seconds for GET requests
    next: method === 'GET' ? { revalidate: 60 } : undefined,
  });

  if (!response.ok) {
    throw new Error(`WooCommerce API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all products with pagination
 */
export async function getProducts(params: {
  page?: number;
  per_page?: number;
  category?: string;
  search?: string;
  orderby?: 'date' | 'title' | 'price' | 'popularity' | 'rating';
  order?: 'asc' | 'desc';
  featured?: boolean;
  on_sale?: boolean;
} = {}) {
  return woocommerceRequest({
    endpoint: '/products',
    params: {
      per_page: 20,
      ...params,
    },
  });
}

/**
 * Get single product by ID or slug
 */
export async function getProduct(idOrSlug: string | number) {
  const isId = typeof idOrSlug === 'number' || !isNaN(Number(idOrSlug));

  if (isId) {
    return woocommerceRequest({
      endpoint: `/products/${idOrSlug}`,
    });
  }

  // Search by slug
  const products = await woocommerceRequest<any[]>({
    endpoint: '/products',
    params: { slug: idOrSlug },
  });

  return products[0] || null;
}

/**
 * Get product categories
 */
export async function getCategories(params: {
  page?: number;
  per_page?: number;
  parent?: number;
  hide_empty?: boolean;
} = {}) {
  return woocommerceRequest({
    endpoint: '/products/categories',
    params: {
      per_page: 100,
      hide_empty: true,
      ...params,
    },
  });
}

/**
 * Get single category
 */
export async function getCategory(id: number) {
  return woocommerceRequest({
    endpoint: `/products/categories/${id}`,
  });
}

/**
 * Get product variations
 */
export async function getProductVariations(productId: number) {
  return woocommerceRequest({
    endpoint: `/products/${productId}/variations`,
    params: { per_page: 100 },
  });
}

/**
 * Create order
 */
export async function createOrder(orderData: any) {
  return woocommerceRequest({
    endpoint: '/orders',
    method: 'POST',
    data: orderData,
  });
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: number) {
  return woocommerceRequest({
    endpoint: `/orders/${orderId}`,
  });
}

/**
 * Search products
 */
export async function searchProducts(searchTerm: string, limit = 10) {
  return woocommerceRequest({
    endpoint: '/products',
    params: {
      search: searchTerm,
      per_page: limit,
    },
  });
}
