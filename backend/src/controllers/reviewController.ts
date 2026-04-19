import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthenticatedRequest } from '../types';

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select('*, profile:profiles(full_name, avatar_url)')
      .eq('product_id', product_id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

export const createReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { product_id, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert({ user_id: userId, product_id, rating, comment: comment || '' })
      .select('*, profile:profiles(full_name, avatar_url)')
      .single();

    if (error) {
      if (error.code === '23505') {
        res.status(409).json({ message: 'You have already reviewed this product' });
        return;
      }
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create review' });
  }
};

export const deleteReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const isAdmin = req.user!.role === 'admin';

    let query = supabaseAdmin.from('reviews').delete().eq('id', id);

    if (!isAdmin) {
      query = query.eq('user_id', userId);
    }

    const { error } = await query;

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete review' });
  }
};
