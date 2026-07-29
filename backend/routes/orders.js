import express from 'express';
import Order from '../models/Order.js';
import { verifyAdminAuth } from '../utils/auth.js';
import jwt from 'jsonwebtoken';
import { sendAdminOrderEmail, sendCustomerConfirmationEmail } from '../utils/email.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    
    // Check if user is logged in (if token present, verify it)
    const token = req.cookies?.user_token;
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod');
      } catch (err) {
        console.warn('User token verification warning during order:', err.message);
      }
    }

    // Trigger email notifications asynchronously (non-blocking for fast UI response)
    Promise.all([
      sendAdminOrderEmail(req.body),
      sendCustomerConfirmationEmail(req.body)
    ]).catch(err => console.error('Error triggering order notifications:', err));

    res.status(201).json({ message: 'Order submitted successfully', order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({ message: 'Failed to submit order', error: error.message });
  }
});

router.get('/', async (req, res) => {
  const authResult = verifyAdminAuth(req);
  if (!authResult.authenticated || authResult.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.put('/:id/status', async (req, res) => {
  const authResult = verifyAdminAuth(req);
  if (!authResult.authenticated || authResult.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { status } = req.body;
    if (!['pending', 'contacted', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

export default router;
