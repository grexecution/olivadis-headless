/**
 * Cart Management
 * Client-side cart operations using localStorage
 */

'use client';

import { CartItem, WooCommerceProduct, WooCommerceVariation } from '@/types/woocommerce';

const CART_STORAGE_KEY = 'olivadis_cart';

export interface CartState {
  items: CartItem[];
  updatedAt: string;
}

/**
 * Get cart from localStorage
 */
export function getCart(): CartState {
  if (typeof window === 'undefined') {
    return { items: [], updatedAt: new Date().toISOString() };
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return { items: [], updatedAt: new Date().toISOString() };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return { items: [], updatedAt: new Date().toISOString() };
  }
}

/**
 * Save cart to localStorage
 */
export function saveCart(cart: CartState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
      ...cart,
      updatedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

/**
 * Add item to cart
 */
export function addToCart(
  product: WooCommerceProduct,
  quantity: number = 1,
  variation?: WooCommerceVariation
): CartState {
  const cart = getCart();
  const variationId = variation?.id;

  // Check if item already exists
  const existingIndex = cart.items.findIndex(
    item => item.product.id === product.id && item.variationId === variationId
  );

  if (existingIndex >= 0) {
    // Update quantity
    cart.items[existingIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({
      product,
      quantity,
      variationId,
      variation,
    });
  }

  saveCart(cart);
  return cart;
}

/**
 * Remove item from cart
 */
export function removeFromCart(productId: number, variationId?: number): CartState {
  const cart = getCart();
  cart.items = cart.items.filter(
    item => !(item.product.id === productId && item.variationId === variationId)
  );
  saveCart(cart);
  return cart;
}

/**
 * Update item quantity
 */
export function updateCartItemQuantity(
  productId: number,
  quantity: number,
  variationId?: number
): CartState {
  const cart = getCart();
  const item = cart.items.find(
    item => item.product.id === productId && item.variationId === variationId
  );

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId, variationId);
    }
    item.quantity = quantity;
  }

  saveCart(cart);
  return cart;
}

/**
 * Clear cart
 */
export function clearCart(): CartState {
  const cart: CartState = { items: [], updatedAt: new Date().toISOString() };
  saveCart(cart);
  return cart;
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(cart: CartState) {
  let subtotal = 0;
  let itemCount = 0;

  cart.items.forEach(item => {
    const price = item.variation?.price || item.product.price;
    subtotal += parseFloat(price) * item.quantity;
    itemCount += item.quantity;
  });

  // For now, we'll calculate basic totals
  // Tax and shipping would typically come from WooCommerce API
  const tax = 0;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    tax,
    shipping,
    total,
    itemCount,
  };
}

/**
 * Get cart item count
 */
export function getCartItemCount(): number {
  const cart = getCart();
  return cart.items.reduce((count, item) => count + item.quantity, 0);
}
