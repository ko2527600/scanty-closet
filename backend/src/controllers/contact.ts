import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { sendContactNotification } from '../lib/email.js';

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 1. Save to DB
    const newMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    // 2. Send Email alert (Async)
    // We don't await here to respond to the user as fast as possible.
    sendContactNotification({ name, email, subject, message });

    res.status(201).json({ 
      success: true, 
      message: 'Transmission received. We will get back to you shortly.' 
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const updateMessageStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: 'Status is required' });

    const updatedMessage = await prisma.contactMessage.update({
      where: { id: id as string },
      data: { status },
    });

    res.json(updatedMessage);
  } catch (error) {
    next(error);
  }
};
