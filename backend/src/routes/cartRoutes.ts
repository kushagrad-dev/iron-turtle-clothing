import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, syncCart, clearCart } from '../controllers/cartController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getCart);
router.post('/', authenticate, addToCart);
router.post('/sync', authenticate, syncCart);
router.delete('/clear', authenticate, clearCart);
router.put('/:id', authenticate, updateCartItem);
router.delete('/:id', authenticate, removeFromCart);

export default router;
