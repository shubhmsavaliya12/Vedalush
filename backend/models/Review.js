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
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
}, { timestamps: true });

ReviewSchema.statics.getAverageRating = async function (productId) {
  const obj = await this.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        ratingCount: { $sum: 1 }
      }
    }
  ]);

  try {
    const Product = mongoose.model('Product');
    if (obj[0]) {
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(obj[0].averageRating * 10) / 10,
        ratingCount: obj[0].ratingCount
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        ratingCount: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

ReviewSchema.post('save', function () {
  if (this.product) {
    this.constructor.getAverageRating(this.product);
  }
});

ReviewSchema.post('remove', function () {
  if (this.product) {
    this.constructor.getAverageRating(this.product);
  }
});

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

export default Review;
