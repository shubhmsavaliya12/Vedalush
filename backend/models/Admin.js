import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    default: 'admin',
  }
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

export default Admin;
