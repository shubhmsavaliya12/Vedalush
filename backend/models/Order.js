import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  product: {
    type: String,
    required: [true, 'Product is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 1
  },
  items: [{
    product: String,
    quantity: Number
  }],
  message: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
