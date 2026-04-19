import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, limit = '10' } = req.query;

    if (!q || (q as string).trim().length === 0) {
      res.json([]);
      return;
    }

    const searchTerm = (q as string).trim();
    const limitNum = Math.min(50, Math.max(1, Number(limit)));

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('id, name, slug, price, images, category:categories(name)')
      .eq('active', true)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(limitNum);

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Search failed' });
  }
};
