import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['signup', 'forgot_password'],
    required: true,
  },
  data: {
    type: Object, // Stores temporary { name, password, country } during signup
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // TTL index: automatically deletes document after 600 seconds (10 minutes)
  },
});

const Otp = mongoose.models.Otp || mongoose.model('Otp', OtpSchema);

export default Otp;
