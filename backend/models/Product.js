import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
  },
  shortDesc: {
    type: String,
    required: [true, 'Short description is required'],
  },
  fullDesc: {
    type: String,
    required: [true, 'Full description is required'],
  },
  images: [{
    type: String,
    required: [true, 'At least one image URL is required'],
  }],
  ingredients: {
    type: String,
    required: [true, 'Ingredients are required'],
  },
  benefits: {
    type: String,
    required: [true, 'Benefits are required'],
  },
  rating:{
    type: Number,
    required: [false, 'Rating is required'],
  },
  ratingCount:{
    type: Number,
    required: [false, 'Rating count is required'],
  },
  price:{
    type: Number,
    required: [true, 'Price is required'],
  },
  discountPrice: {
    type: Number,
    required: false,
  },
  internationalPrices: {
    type: Map,
    of: new mongoose.Schema({ price: Number, discountPrice: Number }, { _id: false }),
    default: {},
  },
  weight: {
    type: String,
    required: [true, 'Weight is required'],
  },
  skinType: {
    type: String,
    required: [true, 'Skin type is required'],
  },
  amazonLink: {
    type: String,
  },
  flipkartLink: {
    type: String,
  }
}, { timestamps: true });

// Performance Indexes for high-traffic scalability
ProductSchema.index({ createdAt: -1 }); // Optimize sorting for latest products
ProductSchema.index({ name: 'text', shortDesc: 'text' }); // Optimize text search

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
