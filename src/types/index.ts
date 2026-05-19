export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  images: string[]
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  total_amount: number
  status: 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled'
  shipping_address: ShippingAddress
  payment_key?: string
  created_at: string
}

export interface OrderItem {
  product_id: string
  product_name: string
  price: number
  quantity: number
}

export interface ShippingAddress {
  name: string
  phone: string
  address: string
  detail_address: string
  postal_code: string
}

export interface User {
  id: string
  email: string
  name?: string
  role: 'user' | 'admin'
}
