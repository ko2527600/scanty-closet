import { type Response, type NextFunction } from 'express';
import { type AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        address: true,
        phone_number: true,
        role: true,
        created_at: true
      }
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { firstName, lastName, address, phoneNumber } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        first_name: firstName,
        last_name: lastName,
        address,
        phone_number: phoneNumber,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true
      }
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        created_at: true
      }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};
