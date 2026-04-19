import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/me', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;
