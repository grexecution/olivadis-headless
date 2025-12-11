# Checkout Components

This directory contains the checkout-related components for the Olivadis headless store.

## Components

### CheckoutForm

A comprehensive billing and shipping address form component.

**Location:** `components/checkout/checkout-form.tsx`

**Features:**
- Billing address collection (name, email, phone, address, city, postcode, country)
- Shipping address collection (can be same as billing or separate)
- Form validation (HTML5 required fields)
- Clean, minimal design using Olivadis design system
- Country selector (Austria, Germany, Switzerland, etc.)
- Loading state support

**Props:**
```typescript
interface CheckoutFormProps {
  onSubmit: (billing: WooCommerceAddress, shipping: WooCommerceAddress) => void
  isLoading?: boolean
}
```

**Usage:**
```tsx
import { CheckoutForm } from '@/components/checkout/checkout-form'

<CheckoutForm
  onSubmit={(billing, shipping) => {
    // Handle checkout submission
  }}
  isLoading={false}
/>
```

### OrderSummary

Displays a summary of the cart items and order totals.

**Location:** `components/checkout/order-summary.tsx`

**Features:**
- Cart items display with images and quantities
- Subtotal, shipping, and tax calculations
- Total price display
- Responsive design
- Uses Olivadis design system (cream background, primary colors)

**Props:**
```typescript
interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  shipping?: number
  tax?: number
}
```

**Usage:**
```tsx
import { OrderSummary } from '@/components/checkout/order-summary'
import { useCart } from '@/lib/cart-context'

const { items, totalPrice } = useCart()

<OrderSummary
  items={items}
  subtotal={totalPrice}
  shipping={5.99}
  tax={20}
/>
```

## API Routes

### Cart API (`/api/cart`)

Manages cart operations (GET, POST, DELETE).

**Location:** `app/api/cart/route.ts`

**Endpoints:**

#### GET /api/cart
Retrieve cart items for the current session.

**Response:**
```json
{
  "success": true,
  "items": [...],
  "total": 99.99
}
```

#### POST /api/cart
Add item to cart.

**Request Body:**
```json
{
  "productId": 123,
  "name": "Product Name",
  "price": 29.99,
  "quantity": 1,
  "image": "https://...",
  "variationId": 456
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "items": [...],
  "total": 99.99
}
```

#### DELETE /api/cart
Remove item from cart or clear entire cart.

**Query Params:**
- `itemId` (optional): Remove specific item
- If no `itemId` provided, clears entire cart

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "items": [...]
}
```

### Checkout API (`/api/checkout`)

Creates WooCommerce orders.

**Location:** `app/api/checkout/route.ts`

**Endpoints:**

#### POST /api/checkout
Create a new WooCommerce order.

**Request Body:**
```json
{
  "billing": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+43 123 456789",
    "address_1": "Main Street 123",
    "address_2": "",
    "city": "Vienna",
    "postcode": "1010",
    "country": "AT",
    "state": "",
    "company": ""
  },
  "shipping": { ... },
  "line_items": [
    {
      "product_id": 123,
      "variation_id": 456,
      "quantity": 2
    }
  ],
  "payment_method": "bacs",
  "payment_method_title": "Direct Bank Transfer",
  "customer_note": "Please leave at the door"
}
```

**Response:**
```json
{
  "success": true,
  "order_id": 12345,
  "order_number": "12345",
  "order_key": "wc_order_xyz123",
  "status": "pending",
  "total": "99.99",
  "currency": "EUR",
  "payment_url": "https://olivadis.com/checkout/order-pay/12345/?key=wc_order_xyz123",
  "message": "Order created successfully"
}
```

#### GET /api/checkout
Retrieve order details by order ID.

**Query Params:**
- `order_id` (required): The WooCommerce order ID

**Response:**
```json
{
  "success": true,
  "order": {
    "id": 12345,
    "number": "12345",
    "status": "processing",
    "total": "99.99",
    "currency": "EUR",
    "billing": { ... },
    "shipping": { ... },
    "line_items": [...],
    "date_created": "2025-12-10T18:00:00"
  }
}
```

## Pages

### Checkout Page

**Location:** `app/checkout/page.tsx`

The main checkout page that combines the CheckoutForm and OrderSummary components.

**Features:**
- Two-column layout (form + summary)
- Integration with cart context
- Order creation via API
- Error handling
- Loading states
- Redirects to success page after order creation

### Checkout Success Page

**Location:** `app/checkout/success/page.tsx`

Order confirmation page displayed after successful checkout.

**Features:**
- Order details display
- Success message
- Next steps information
- Links to continue shopping or view account

## Design System

All components use the Olivadis design system:

**Colors:**
- Primary: `#1C4220` (Olivadis green)
- Cream: `#F2E9DB` (Background)
- Cream Light: `#FCFBF7` (Cards)

**Typography:**
- `text-h2`: Large headings (56px)
- `text-h3`: Section headings (26.642px)
- `text-h4`: Subsection headings (24px)
- `text-body`: Body text (16px)
- `text-body-sm`: Small text (13.321px)
- `text-price`: Price display (24px)

**Components:**
- All components use the shared Input and Button components from `components/ui/`
- Consistent spacing, borders, and shadows
- Responsive design (mobile-first)

## Usage Example

Complete checkout flow:

```tsx
'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { OrderSummary } from '@/components/checkout/order-summary'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async (billing, shipping) => {
    setIsLoading(true)

    const line_items = items.map(item => ({
      product_id: item.productId,
      variation_id: item.variationId,
      quantity: item.quantity,
    }))

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ billing, shipping, line_items }),
    })

    const data = await response.json()

    if (data.success) {
      clearCart()
      // Redirect to success page
    }

    setIsLoading(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <CheckoutForm onSubmit={handleCheckout} isLoading={isLoading} />
      </div>
      <div className="lg:col-span-1">
        <OrderSummary items={items} subtotal={totalPrice} />
      </div>
    </div>
  )
}
```

## Notes

- The cart API uses in-memory storage for demo purposes. In production, use a database or session storage.
- All API routes are server-side only and use the WooCommerce REST API client.
- Error handling is included in all API routes with descriptive error messages.
- The checkout flow integrates seamlessly with the existing cart context.
- All components are fully typed with TypeScript interfaces.
