import { Router } from 'express';
import { getProductReviews, createReview, deleteReview } from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/product/:product_id', getProductReviews);
router.post('/', authenticate, createReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
