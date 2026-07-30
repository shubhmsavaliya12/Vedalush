import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
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

const getOrigin = () => {
  if (process.env.NODE_ENV !== 'production') return ['http://localhost:5173', 'http://localhost:5174'];
  
  const url = process.env.FRONTEND_URL || '';
  const baseOrigin = url.startsWith('http') ? url : `https://${url}`;
  
  // If the base origin doesn't have www, add a www version as well
  if (baseOrigin.includes('://www.')) {
    return [baseOrigin, baseOrigin.replace('://www.', '://')];
  } else {
    return [baseOrigin, baseOrigin.replace('://', '://www.')];
  }
};

const corsOptions = {
  origin: getOrigin(),
  credentials: true,
};

app.use(cors(corsOptions));
app.use(compression()); // Compress all responses
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize()); // Prevent NoSQL Injection attacks globally
app.use(helmet()); // Set security HTTP headers

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter); // Apply rate limit to all API routes

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
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Self-ping to keep Render free tier awake (ping every 10 minutes)
import https from 'https';
setInterval(() => {
  const backendUrl = 'https://vedalush-backend.onrender.com/health';
  https.get(backendUrl, (res) => {
    if (res.statusCode === 200) {
      console.log('Self-ping successful. Server kept awake.');
    } else {
      console.log(`Self-ping failed with status code: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error('Self-ping error:', err.message);
  });
}, 10 * 60 * 1000);


// Graceful Shutdown for Render deployments
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    // MongoDB connection will be closed by the mongoose disconnect event
    process.exit(0);
  });
});

// Global Error Handler to prevent information disclosure in production
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});
