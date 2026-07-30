import express from 'express';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { verifyAdminAuth, getCookieOptions } from '../utils/auth.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/check', (req, res) => {
  const authResult = verifyAdminAuth(req);
  if (!authResult.authenticated || authResult.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.status(200).json({ message: 'Authenticated' });
});

router.post('/seed', async (req, res) => {
  // Basic security to prevent accidental execution in production
  if (process.env.NODE_ENV === 'production' && req.headers['x-seed-secret'] !== process.env.SEED_SECRET) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const { username, password } = req.body;
    const seedUsername = username || 'admin';
    const seedPassword = password || 'admin123';

    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      if (req.headers['x-seed-secret'] === process.env.SEED_SECRET) {
         // Update existing admin (Password Reset)
         existingAdmin.username = seedUsername;
         const salt = await bcrypt.genSalt(10);
         existingAdmin.password = await bcrypt.hash(seedPassword, salt);
         await existingAdmin.save();
         return res.status(200).json({ message: 'Admin credentials updated successfully' });
      } else {
         return res.status(400).json({ message: 'Admin user already exists' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(seedPassword, salt);

    const newAdmin = new Admin({
      username: seedUsername,
      password: hashedPassword,
      role: 'admin'
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('admin_token', token, getCookieOptions());

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('admin_token', getCookieOptions());
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
