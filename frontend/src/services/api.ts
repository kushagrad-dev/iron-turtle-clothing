import axios from 'axios';
import { supabase } from './supabase';
import type { Product, ProductsResponse, ProductFilters, Category, CartItem, Order, WishlistItem, Review, Profile } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// ===========================
// Products
// ===========================
export const fetchProducts = async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  const { data } = await api.get(`/products?${params.toString()}`);
  return data;
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const { data } = await api.get(`/products/${slug}`);
  return data;
};

export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const { data } = await api.post('/products', product);
  return data;
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  const { data } = await api.put(`/products/${id}`, product);
  return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

// ===========================
// Categories
// ===========================
export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/categories');
  return data;
};

// ===========================
// Cart
// ===========================
export const fetchCart = async (): Promise<CartItem[]> => {
  const { data } = await api.get('/cart');
  return data;
};

export const addToCartAPI = async (item: { product_id: string; size: string; color: string; quantity: number }): Promise<CartItem> => {
  const { data } = await api.post('/cart', item);
  return data;
};

export const updateCartItemAPI = async (id: string, quantity: number): Promise<CartItem> => {
  const { data } = await api.put(`/cart/${id}`, { quantity });
  return data;
};

export const removeFromCartAPI = async (id: string): Promise<void> => {
  await api.delete(`/cart/${id}`);
};

export const syncCartAPI = async (items: { product_id: string; size: string; color: string; quantity: number }[]): Promise<CartItem[]> => {
  const { data } = await api.post('/cart/sync', { items });
  return data;
};

export const clearCartAPI = async (): Promise<void> => {
  await api.delete('/cart/clear');
};

// ===========================
// Orders
// ===========================
export const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await api.get('/orders');
  return data;
};

export const fetchOrderById = async (id: string): Promise<Order> => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export const createOrder = async (order: { shipping_address: any; items: any[]; notes?: string }): Promise<Order> => {
  const { data } = await api.post('/orders', order);
  return data;
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
  const { data } = await api.put(`/orders/${id}/status`, { status });
  return data;
};

// ===========================
// Wishlist
// ===========================
export const fetchWishlist = async (): Promise<WishlistItem[]> => {
  const { data } = await api.get('/wishlist');
  return data;
};

export const addToWishlistAPI = async (product_id: string): Promise<WishlistItem> => {
  const { data } = await api.post('/wishlist', { product_id });
  return data;
};

export const removeFromWishlistAPI = async (product_id: string): Promise<void> => {
  await api.delete(`/wishlist/${product_id}`);
};

// ===========================
// Reviews
// ===========================
export const fetchReviews = async (product_id: string): Promise<Review[]> => {
  const { data } = await api.get(`/reviews/product/${product_id}`);
  return data;
};

export const createReview = async (review: { product_id: string; rating: number; comment: string }): Promise<Review> => {
  const { data } = await api.post('/reviews', review);
  return data;
};

export const deleteReview = async (id: string): Promise<void> => {
  await api.delete(`/reviews/${id}`);
};

// ===========================
// Search
// ===========================
export const searchProducts = async (query: string): Promise<Product[]> => {
  const { data } = await api.get(`/search?q=${encodeURIComponent(query)}`);
  return data;
};

// ===========================
// Profile
// ===========================
export const fetchProfile = async (): Promise<Profile> => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const updateProfile = async (profile: Partial<Profile>): Promise<Profile> => {
  const { data } = await api.put('/auth/profile', profile);
  return data;
};

export default api;
