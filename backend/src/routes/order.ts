import { Router } from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/order.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// User order routes
router.post('/checkout', authenticate, createOrder);
router.get('/my-orders', authenticate, getUserOrders);

// Admin-only order routes
router.get('/', authenticate, authorize(['ADMIN']), getAllOrders);
router.patch('/:id/status', authenticate, authorize(['ADMIN']), updateOrderStatus);

export default router;
