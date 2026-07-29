import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  month: {
    type: String, // Format: "YYYY-MM"
    required: true,
    unique: true,
  },
  uniqueVisitors: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

export default mongoose.model('Analytics', analyticsSchema);
