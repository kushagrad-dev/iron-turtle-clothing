import { Router } from 'express';
import { getOrders, getOrderById, createOrder, updateOrderStatus } from '../controllers/orderController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getOrders);
router.post('/', authenticate, createOrder);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/status', authenticate, requireAdmin, updateOrderStatus);

export default router;
