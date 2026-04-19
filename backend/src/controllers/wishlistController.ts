import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthenticatedRequest } from '../types';

export const getWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const { data, error } = await supabaseAdmin
      .from('wishlist')
      .select('*, product:products(*, category:categories(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
};

export const addToWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { product_id } = req.body;

    const { data, error } = await supabaseAdmin
      .from('wishlist')
      .insert({ user_id: userId, product_id })
      .select('*, product:products(*)')
      .single();

    if (error) {
      if (error.code === '23505') {
        res.status(409).json({ message: 'Already in wishlist' });
        return;
      }
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
};

export const removeFromWishlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { product_id } = req.params;

    const { error } = await supabaseAdmin
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', product_id);

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove from wishlist' });
  }
};
