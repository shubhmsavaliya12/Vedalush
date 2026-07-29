import express from 'express';
import Analytics from '../models/Analytics.js';
import { verifyAdminAuth } from '../utils/auth.js';

const router = express.Router();

// POST /api/analytics/visit - Record a new unique visit
router.post('/visit', async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: "YYYY-MM"
    
    // Find or create analytics doc for this month and increment visitor count
    await Analytics.findOneAndUpdate(
      { month: currentMonth },
      { $inc: { uniqueVisitors: 1 } },
      { upsert: true, new: true }
    );
    
    res.status(200).json({ message: 'Visit recorded' });
  } catch (error) {
    console.error('Error recording visit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/analytics - Fetch analytics data for dashboard (Protected)
router.get('/', async (req, res) => {
  const authResult = verifyAdminAuth(req);
  if (!authResult.authenticated || authResult.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    // Get all analytics data, sorted chronologically
    const analyticsData = await Analytics.find().sort({ month: 1 });
    
    // Calculate total visitors across all months
    const totalVisitors = analyticsData.reduce((sum, data) => sum + data.uniqueVisitors, 0);
    
    res.status(200).json({
      totalVisitors,
      months: analyticsData
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
