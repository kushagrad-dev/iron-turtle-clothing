import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthenticatedRequest } from '../types';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      min_price,
      max_price,
      min_rating,
      featured,
      sort = 'created_at',
      order = 'desc',
      page = '1',
      limit = '12',
    } = req.query;

    let query = supabaseAdmin
      .from('products')
      .select('*, category:categories(*)', { count: 'exact' })
      .eq('active', true);

    if (category) {
      const { data: cat } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('slug', category as string)
        .single();
      if (cat) query = query.eq('category_id', cat.id);
    }

    if (min_price) query = query.gte('price', Number(min_price));
    if (max_price) query = query.lte('price', Number(max_price));
    if (min_rating) query = query.gte('rating', Number(min_rating));
    if (featured === 'true') query = query.eq('featured', true);

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    const validSortFields = ['price', 'created_at', 'rating', 'name'];
    const sortField = validSortFields.includes(sort as string) ? (sort as string) : 'created_at';
    const ascending = order === 'asc';

    query = query.order(sortField, { ascending }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.json({
      products: data || [],
      total: count || 0,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil((count || 0) / limitNum),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

export const createProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, description, price, compare_at_price, category_id, images, sizes, colors, stock, featured } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name,
        slug,
        description,
        price,
        compare_at_price,
        category_id,
        images: images || [],
        sizes: sizes || ['S', 'M', 'L', 'XL', 'XXL'],
        colors: colors || [],
        stock: stock || 0,
        featured: featured || false,
      })
      .select()
      .single();

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product' });
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updated_at = new Date().toISOString();

    if (updates.name) {
      updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
};
