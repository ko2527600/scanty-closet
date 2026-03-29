import { Router } from 'express';
import { getReviewsByProduct, createReview } from '../controllers/review.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public review routes
router.get('/product/:productId', getReviewsByProduct);

// Protected review routes
router.post('/', authenticate, createReview);

export default router;
