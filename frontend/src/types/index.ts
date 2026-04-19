export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  rating: number;
  review_count: number;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product?: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface LocalCartItem {
  product_id: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  phone: string;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profile?: {
    full_name: string;
    avatar_url: string;
  };
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  featured?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
