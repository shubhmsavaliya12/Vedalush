import express from 'express';
import Cart from '../models/Cart.js';
import { verifyUserAuth as protect } from '../utils/auth.js';

const router = express.Router();

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Filter out items where product is null (e.g., product was deleted from DB)
    const validItems = cart.items.filter(item => item.product != null);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Sync user cart (Overwrites entire items array)
// @route   PUT /api/cart/sync
// @access  Private
router.put('/sync', protect, async (req, res) => {
  try {
    const { items } = req.body;
    
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = await Cart.create({
        user: req.user.id,
        items
      });
    }

    await cart.populate('items.product');

    // Filter out items where product is null
    const validItems = cart.items.filter(item => item.product != null);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error('Error syncing cart:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
