import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  country: {
    type: String,
    default: 'India',
    trim: true,
  },
  preferredCurrency: {
    type: String,
    enum: ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD'],
    default: 'INR',
  },
  phone: {
    type: String,
    default: '',
    trim: true,
  },
  address: {
    type: String,
    default: '',
    trim: true,
  },
  city: {
    type: String,
    default: '',
    trim: true,
  },
  state: {
    type: String,
    default: '',
    trim: true,
  },
  pincode: {
    type: String,
    default: '',
    trim: true,
  },
  addresses: [{
    label: { type: String, default: 'Home', trim: true },
    phone: { type: String, default: '', trim: true },
    address: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    state: { type: String, default: '', trim: true },
    pincode: { type: String, default: '', trim: true },
    country: { type: String, default: 'India', trim: true },
    isDefault: { type: Boolean, default: false }
  }]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
