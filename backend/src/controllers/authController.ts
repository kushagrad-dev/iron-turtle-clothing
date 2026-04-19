import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthenticatedRequest } from '../types';

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { full_name, phone, avatar_url } = req.body;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ full_name, phone, avatar_url, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
