import express from 'express';
import Ingredient from '../models/Ingredient.js';
import { verifyAdminAuth } from '../utils/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ingredients', error: error.message });
  }
});

router.post('/', async (req, res) => {
  const authResult = verifyAdminAuth(req);
  if (!authResult.authenticated || authResult.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const ingredient = new Ingredient(req.body);
    await ingredient.save();
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create ingredient', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const authResult = verifyAdminAuth(req);
  if (!authResult.authenticated || authResult.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!ingredient) return res.status(404).json({ message: 'Ingredient not found' });
    res.json(ingredient);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update ingredient', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const authResult = verifyAdminAuth(req);
  if (!authResult.authenticated || authResult.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) return res.status(404).json({ message: 'Ingredient not found' });
    res.json({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete ingredient', error: error.message });
  }
});

export default router;
