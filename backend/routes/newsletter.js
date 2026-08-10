import express from 'express';
import Subscriber from '../models/Subscriber.js';
import { verifyAdminAuth } from '../utils/auth.js';

const router = express.Router();

// POST /api/newsletter/subscribe (Public)
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    let subscriber = await Subscriber.findOne({ email: cleanEmail });
    if (subscriber) {
      if (!subscriber.isActive) {
        subscriber.isActive = true;
        await subscriber.save();
        return res.status(200).json({ 
          message: '✨ Welcome back! Your subscription has been reactivated.',
          subscriber 
        });
      }
      return res.status(200).json({ 
        message: 'You are already subscribed to our newsletter!',
        subscriber 
      });
    }

    subscriber = new Subscriber({ email: cleanEmail });
    await subscriber.save();

    res.status(201).json({ 
      message: '✨ Thank you for subscribing to Vedalush newsletter!',
      subscriber 
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ message: 'Error processing subscription.' });
  }
});

// GET /api/newsletter/subscribers (Admin only)
router.get('/subscribers', async (req, res) => {
  const auth = verifyAdminAuth(req);
  if (!auth.authenticated) return res.status(401).json({ message: auth.error });

  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.status(200).json(subscribers);
  } catch (error) {
    console.error('Fetch subscribers error:', error);
    res.status(500).json({ message: 'Error fetching subscribers.' });
  }
});

// DELETE /api/newsletter/subscribers/:id (Admin only)
router.delete('/subscribers/:id', async (req, res) => {
  const auth = verifyAdminAuth(req);
  if (!auth.authenticated) return res.status(401).json({ message: auth.error });

  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    res.status(200).json({ message: 'Subscriber removed successfully' });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({ message: 'Error deleting subscriber.' });
  }
});

export default router;
