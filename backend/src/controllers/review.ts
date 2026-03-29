import { type Response, type NextFunction } from 'express';
import { type AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

export const getReviewsByProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { product_id: String(productId) },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { productId, rating, comment, imageUrls } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ error: 'Product ID and rating are required' });
    }

    const review = await prisma.review.create({
      data: {
        product_id: productId,
        user_id: req.user.id,
        rating,
        comment,
        image_urls: imageUrls || []
      }
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};
