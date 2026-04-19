import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthenticatedRequest } from '../types';

export const getCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const { data, error } = await supabaseAdmin
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};

export const addToCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { product_id, size, color, quantity = 1 } = req.body;

    // Check if item already exists in cart
    const { data: existing } = await supabaseAdmin
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .eq('size', size || '')
      .eq('color', color || '')
      .single();

    if (existing) {
      // Update quantity
      const { data, error } = await supabaseAdmin
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select('*, product:products(*)')
        .single();

      if (error) {
        res.status(400).json({ message: error.message });
        return;
      }

      res.json(data);
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id,
        size: size || '',
        color: color || '',
        quantity,
      })
      .select('*, product:products(*)')
      .single();

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to cart' });
  }
};

export const updateCartItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      // Remove item if quantity is 0
      await supabaseAdmin.from('cart_items').delete().eq('id', id).eq('user_id', userId);
      res.status(204).send();
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*, product:products(*)')
      .single();

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};

export const removeFromCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove from cart' });
  }
};

export const syncCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { items } = req.body; // Array of {product_id, size, color, quantity}

    if (!Array.isArray(items)) {
      res.status(400).json({ message: 'Items must be an array' });
      return;
    }

    // Upsert each item
    for (const item of items) {
      const { data: existing } = await supabaseAdmin
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', item.product_id)
        .eq('size', item.size || '')
        .eq('color', item.color || '')
        .single();

      if (existing) {
        await supabaseAdmin
          .from('cart_items')
          .update({ quantity: Math.max(existing.quantity, item.quantity) })
          .eq('id', existing.id);
      } else {
        await supabaseAdmin.from('cart_items').insert({
          user_id: userId,
          product_id: item.product_id,
          size: item.size || '',
          color: item.color || '',
          quantity: item.quantity,
        });
      }
    }

    // Fetch updated cart
    const { data } = await supabaseAdmin
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Failed to sync cart' });
  }
};

export const clearCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};
