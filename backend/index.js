import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectToDatabase } from './utils/db.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import reviewRoutes from './routes/reviews.js';
import uploadRoutes from './routes/upload.js';
import analyticsRoutes from './routes/analytics.js';
import currencyRoutes from './routes/currency.js';
import ingredientRoutes from './routes/ingredients.js';
import newsletterRoutes from './routes/newsletter.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Connect DB
connectToDatabase().then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
