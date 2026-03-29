import { Router } from 'express';
import { getVariantsByProduct, createVariant, updateVariant, deleteVariant } from '../controllers/variant.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/product/:productId', getVariantsByProduct);

// Admin-only routes
router.post('/', authenticate, authorize(['ADMIN']), createVariant);
router.patch('/:id', authenticate, authorize(['ADMIN']), updateVariant);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteVariant);

export default router;
