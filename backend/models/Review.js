import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  content: {
    type: String,
    required: true,
  },
  adminReply: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

export default Review;
