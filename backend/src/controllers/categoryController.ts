import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};
