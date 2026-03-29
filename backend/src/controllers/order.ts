import { type Response, type NextFunction } from 'express';
import { type AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { type Prisma } from '@prisma/client';

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { cartItems, shippingAddress, billingAddress } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const userId = req.user.id;

    // Use a transaction for consistency
    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let totalAmount = 0;

      // 1. Validate variants and quantities
      const itemsToCreate = [];
      for (const item of cartItems) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true }
        });

        if (!variant) throw new Error(`Variant not found: ${item.variantId}`);
        if (variant.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${variant.product.name} (SKU: ${variant.sku})`);
        }

        const price = Number(variant.product.price);
        totalAmount += price * item.quantity;

        itemsToCreate.push({
          product_variant_id: variant.id,
          quantity: item.quantity,
          price_at_purchase: price
        });

        // 2. Decrement stock
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock_quantity: { decrement: item.quantity } }
        });
      }

      // 3. Create order
      return tx.order.create({
        data: {
          user_id: userId,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          billing_address: billingAddress || shippingAddress,
          order_items: {
            create: itemsToCreate
          }
        },
        include: {
          order_items: true
        }
      });
    });

    res.status(201).json(order);
  } catch (error: any) {
    if (error.message.includes('Variant not found') || error.message.includes('Insufficient stock')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const orders = await prisma.order.findMany({
      where: { user_id: req.user.id },
      include: {
        order_items: {
          include: {
            product_variant: {
              include: { product: true }
            }
          }
        }
      },
      orderBy: { order_date: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { email: true, first_name: true, last_name: true } },
        order_items: {
          include: {
            product_variant: {
              include: { product: true }
            }
          }
        }
      },
      orderBy: { order_date: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Order ID is required' });

    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: String(id) },
      data: { status }
    });

    res.json(order);
  } catch (error) {
    next(error);
  }
};
