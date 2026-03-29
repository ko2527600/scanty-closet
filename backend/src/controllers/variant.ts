import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

export const getVariantsByProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const variants = await prisma.productVariant.findMany({
      where: { product_id: String(productId) }
    });
    res.json(variants);
  } catch (error) {
    next(error);
  }
};

export const createVariant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, size, color, sku, stockQuantity, imageUrls } = req.body;
    
    if (!productId || !sku) {
      return res.status(400).json({ error: 'Product ID and SKU are required' });
    }

    const variant = await prisma.productVariant.create({
      data: {
        product_id: productId,
        size,
        color,
        sku,
        stock_quantity: stockQuantity || 0,
        image_urls: imageUrls || []
      }
    });

    res.status(201).json(variant);
  } catch (error) {
    next(error);
  }
};

export const updateVariant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { size, color, sku, stockQuantity, imageUrls } = req.body;

    const data: any = {};
    if (size !== undefined) data.size = size;
    if (color !== undefined) data.color = color;
    if (sku !== undefined) data.sku = sku;
    if (stockQuantity !== undefined) data.stock_quantity = stockQuantity;
    if (imageUrls !== undefined) data.image_urls = imageUrls;

    const variant = await prisma.productVariant.update({
      where: { id: String(id) },
      data: data
    });

    res.json(variant);
  } catch (error) {
    next(error);
  }
};

export const deleteVariant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.productVariant.delete({ where: { id: String(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
