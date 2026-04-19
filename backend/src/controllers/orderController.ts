import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthenticatedRequest } from '../types';

export const getOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const isAdmin = req.user!.role === 'admin';

    let query = supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!isAdmin) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const isAdmin = req.user!.role === 'admin';
    const { id } = req.params;

    let query = supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id);

    if (!isAdmin) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { shipping_address, items, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'Order must contain items' });
      return;
    }

    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        status: 'pending',
        total: Math.round(total * 100) / 100,
        shipping_address,
        items,
        notes: notes || '',
      })
      .select()
      .single();

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    // Clear user's cart after order
    await supabaseAdmin.from('cart_items').delete().eq('user_id', userId);

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order' });
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};
