import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProducts, fetchProductBySlug, fetchCategories, fetchReviews,
  createReview, deleteReview, fetchWishlist, addToWishlistAPI,
  removeFromWishlistAPI, fetchOrders, createOrder as createOrderAPI,
  searchProducts, fetchProfile, updateProfile as updateProfileAPI,
  createProduct as createProductAPI, updateProduct as updateProductAPI,
  deleteProduct as deleteProductAPI, updateOrderStatus as updateOrderStatusAPI,
} from '../services/api';
import type { ProductFilters } from '../types';

// Products
export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 30000,
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => fetchProducts({ featured: true, limit: 8 }),
    staleTime: 60000,
  });
};

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 300000, // 5 min
  });
};

// Reviews
export const useReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviews(productId),
    enabled: !!productId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.product_id] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

// Wishlist
export const useWishlist = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    staleTime: 30000,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToWishlistAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromWishlistAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

// Orders
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrderAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatusAPI(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Search
export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchProducts(query),
    enabled: query.length >= 2,
    staleTime: 10000,
  });
};

// Profile
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfileAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Admin - Products
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProductAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateProductAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProductAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
