import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  orderType: { type: String, enum: ['direct', 'checkout'], default: 'checkout' }, 
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  name: { type: String, required: [true, 'Name is required'] },
  email: { type: String, required: [true, 'Email is required'] },
  phone: { type: String, required: [true, 'Phone is required'] },
  
  // Kept for backward compatibility with direct order form
  country: { type: String },
  address: { type: String },
  product: { type: String },
  quantity: { type: Number, min: 1 },
  message: { type: String },

  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number, 
    quantity: Number,
    image: String,
    sku: String
  }],

  pricing: {
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' } 
  },

  orderStatus: {
    type: String,
    enum: ['pending_payment', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'return_requested', 'returned', 'refunded', 'pending', 'contacted', 'completed'], // Added old statuses for backward compat
    default: 'pending_payment'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  shippingStatus: {
    type: String,
    enum: ['unshipped', 'label_generated', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'rto_initiated', 'rto_delivered'],
    default: 'unshipped'
  },

  shippingAddress: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },

  paymentMethod: { type: String, enum: ['razorpay', 'cod'], default: 'razorpay' },
  paymentDetails: {
    razorpayOrderId: { type: String, sparse: true },
    razorpayPaymentId: { type: String, sparse: true },
    razorpaySignature: String
  },
  shippingDetails: {
    shiprocketOrderId: String,
    shipmentId: String,
    awbCode: String,
    courierName: String,
    trackingUrl: String
  }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
