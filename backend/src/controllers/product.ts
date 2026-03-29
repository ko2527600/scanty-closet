import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, brand, minPrice, maxPrice, sortBy, order } = req.query;

    const where: any = {};
    if (category) where.category = { name: category };
    if (brand) where.brand = brand;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: true,
      },
      orderBy: sortBy ? { [sortBy as string]: order === 'desc' ? 'desc' : 'asc' } : { created_at: 'desc' },
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: String(id) },
      include: {
        category: true,
        variants: true,
        reviews: {
          include: {
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, brand, price, categoryId } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        brand,
        price,
        category_id: categoryId,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, brand, price, categoryId } = req.body;

    const product = await prisma.product.update({
      where: { id: String(id) },
      data: {
        name,
        description,
        brand,
        price,
        category_id: categoryId,
      },
    });

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: String(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
