import express from 'express';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyAdminAuth } from '../utils/auth.js';

const router = express.Router();

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
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const newAdmin = new Admin({
      username: 'admin',
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

router.post('/login', async (req, res) => {
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

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod',
      { expiresIn: '1d' }
    );

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 60 * 60 * 24 * 1000 // 1 day in ms
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
