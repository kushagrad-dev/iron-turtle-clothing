import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getWishlist);
router.post('/', authenticate, addToWishlist);
router.delete('/:product_id', authenticate, removeFromWishlist);

export default router;
