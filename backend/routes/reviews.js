import express from 'express';
import Review from '../models/Review.js';
import { verifyUserAuth, verifyAdminAuth } from '../utils/auth.js';

const router = express.Router();

// GET all reviews (Public)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.product) {
      filter.product = req.query.product;
    }
    const reviews = await Review.find(filter)
      .populate('user', 'name') // Only fetch the user's name
      .populate('product', 'name') // Fetch product name
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// GET user's personal reviews (Protected by user auth)
router.get('/me', verifyUserAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('user', 'name')
      .populate('product', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching personal reviews' });
  }
});

// POST a new review (Protected by user auth)
router.post('/', verifyUserAuth, async (req, res) => {
  try {
    const { rating, content, product } = req.body;
    
    if (!rating || !content) {
      return res.status(400).json({ message: 'Rating and content are required' });
    }

    const review = new Review({
      user: req.user.id,
      rating,
      content,
      product: product || undefined
    });

    await review.save();
    
    // Populate user name before sending response
    await review.populate('user', 'name');
    
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review' });
  }
});
// PUT (User edits their own review)
router.put('/:id', verifyUserAuth, async (req, res) => {
  try {
    const { rating, content } = req.body;
    if (!rating || !content) {
      return res.status(400).json({ message: 'Rating and content are required' });
    }

    const review = await Review.findOne({ _id: req.params.id, user: req.user.id });
    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    review.rating = rating;
    review.content = content;
    await review.save();
    await review.populate('user', 'name');

    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Error updating review' });
  }
});

// PUT (Admin replies to a review)
router.put('/:id/reply', async (req, res) => {
  const auth = verifyAdminAuth(req);
  if (!auth.authenticated) return res.status(401).json({ message: auth.error });

  try {
    const { adminReply } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { adminReply },
      { new: true }
    ).populate('user', 'name');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review' });
  }
});

// DELETE a review (Admin only)
router.delete('/:id', async (req, res) => {
  const auth = verifyAdminAuth(req);
  if (!auth.authenticated) return res.status(401).json({ message: auth.error });

  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.product) {
      await Review.getAverageRating(review.product);
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review' });
  }
});

export default router;
