import express from 'express';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { verifyUserAuth, getCookieOptions } from '../utils/auth.js';
import { sendOtpEmail } from '../utils/email.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

const formatUserData = (user) => {
  let addrs = user.addresses ? [...user.addresses] : [];
  if (addrs.length === 0 && (user.address || user.phone || user.city || user.state || user.pincode)) {
    addrs = [{
      _id: (user._id || user.id) + '_default',
      label: 'Home',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      pincode: user.pincode || '',
      country: user.country || 'India',
      isDefault: true
    }];
  } else if (addrs.length > 0) {
    const defIdx = addrs.findIndex(a => a.isDefault);
    const idx = defIdx >= 0 ? defIdx : 0;
    if (!addrs[idx].address && user.address) {
      addrs[idx] = {
        ...addrs[idx],
        phone: addrs[idx].phone || user.phone || '',
        address: user.address || '',
        city: addrs[idx].city || user.city || '',
        state: addrs[idx].state || user.state || '',
        pincode: addrs[idx].pincode || user.pincode || '',
        country: addrs[idx].country || user.country || 'India'
      };
    }
  }
  return {
    id: user._id || user.id,
    name: user.name || '',
    email: user.email || '',
    country: user.country || 'India',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    pincode: user.pincode || '',
    preferredCurrency: user.preferredCurrency || 'INR',
    addresses: addrs
  };
};

router.post('/signup', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();
    
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const token = jwt.sign(
      { id: newUser._id, name: newUser.name, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Removed res.cookie

    res.status(201).json({ message: 'User created successfully', user: { name: newUser.name, email: newUser.email }, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Removed res.cookie

    let modified = false;
    if ((!user.addresses || user.addresses.length === 0) && (user.address || user.city || user.state || user.pincode || user.phone)) {
      user.addresses = [{
        label: 'Home',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        country: user.country || 'India',
        isDefault: true
      }];
      modified = true;
    } else if (user.addresses && user.addresses.length > 0) {
      const defIdx = user.addresses.findIndex(a => a.isDefault);
      const idx = defIdx >= 0 ? defIdx : 0;
      if (!user.addresses[idx].address && user.address) {
        user.addresses[idx].phone = user.phone || '';
        user.addresses[idx].address = user.address || '';
        user.addresses[idx].city = user.city || '';
        user.addresses[idx].state = user.state || '';
        user.addresses[idx].pincode = user.pincode || '';
        user.addresses[idx].country = user.country || 'India';
        modified = true;
      }
    }
    if (modified) await user.save();

    res.status(200).json({ message: 'Login successful', user: formatUserData(user), token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/me', verifyUserAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let modified = false;
    if ((!user.addresses || user.addresses.length === 0) && (user.address || user.city || user.state || user.pincode || user.phone)) {
      user.addresses = [{
        label: 'Home',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        country: user.country || 'India',
        isDefault: true
      }];
      modified = true;
    } else if (user.addresses && user.addresses.length > 0) {
      const defIdx = user.addresses.findIndex(a => a.isDefault);
      const idx = defIdx >= 0 ? defIdx : 0;
      if (!user.addresses[idx].address && user.address) {
        user.addresses[idx].phone = user.phone || '';
        user.addresses[idx].address = user.address || '';
        user.addresses[idx].city = user.city || '';
        user.addresses[idx].state = user.state || '';
        user.addresses[idx].pincode = user.pincode || '';
        user.addresses[idx].country = user.country || 'India';
        modified = true;
      }
    }
    if (modified) await user.save();
    res.status(200).json({ user: formatUserData(user) });
  } catch (error) {
    console.error('Fetch me error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/profile', verifyUserAuth, async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode, country, preferredCurrency, addresses } = req.body;
    
    const user = await User.findById(req.user.id || req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name !== undefined) {
      if (!/^[A-Za-z\s\-']+$/.test(name)) {
        return res.status(400).json({ message: 'Name can only contain letters, spaces, hyphens, and apostrophes.' });
      }
      user.name = name;
    }
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (pincode !== undefined) user.pincode = pincode;
    if (country !== undefined) user.country = country;
    if (preferredCurrency !== undefined) user.preferredCurrency = preferredCurrency;

    if (addresses !== undefined && Array.isArray(addresses)) {
      user.addresses = addresses;
      if (user.addresses.length > 0) {
        const defAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
        user.phone = defAddr.phone || '';
        user.address = defAddr.address || '';
        user.city = defAddr.city || '';
        user.state = defAddr.state || '';
        user.pincode = defAddr.pincode || '';
        user.country = defAddr.country || 'India';
      }
    } else if (address !== undefined || city !== undefined || state !== undefined || pincode !== undefined || phone !== undefined || country !== undefined) {
      if (!user.addresses) user.addresses = [];
      const defIdx = user.addresses.findIndex(a => a.isDefault);
      const idx = defIdx >= 0 ? defIdx : 0;
      if (user.addresses.length === 0) {
        user.addresses.push({
          label: 'Home',
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || '',
          state: user.state || '',
          pincode: user.pincode || '',
          country: user.country || 'India',
          isDefault: true
        });
      } else {
        if (phone !== undefined) user.addresses[idx].phone = user.phone || '';
        if (address !== undefined) user.addresses[idx].address = user.address || '';
        if (city !== undefined) user.addresses[idx].city = user.city || '';
        if (state !== undefined) user.addresses[idx].state = user.state || '';
        if (pincode !== undefined) user.addresses[idx].pincode = user.pincode || '';
        if (country !== undefined) user.addresses[idx].country = user.country || 'India';
      }
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user: formatUserData(user) });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

router.post('/logout', (req, res) => {
  // Removed res.clearCookie
  res.status(200).json({ message: 'Logged out successfully' });
});

// --- OTP & Verification Endpoints ---

// 1. Send OTP for Signup
router.post('/signup-otp', async (req, res) => {
  try {
    const { name, email, password, country } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!/^[A-Za-z\s\-']+$/.test(name)) {
      return res.status(400).json({ message: 'Name can only contain letters, spaces, hyphens, and apostrophes.' });
    }

    if (!/^[\x20-\x7E]{8,}$/.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and contain only standard characters.' });
    }

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any previous signup OTPs for this email
    await Otp.deleteMany({ email: email.trim().toLowerCase(), type: 'signup' });

    await new Otp({
      email: email.trim().toLowerCase(),
      otp: otpCode,
      type: 'signup',
      data: { name, password: hashedPassword, country: country || 'India' }
    }).save();

    const emailSent = await sendOtpEmail(email.trim().toLowerCase(), otpCode, 'signup', name);
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
    }

    res.status(200).json({ message: 'Verification code sent to your email', email: email.trim().toLowerCase() });
  } catch (error) {
    console.error('Signup OTP error:', error);
    res.status(500).json({ message: 'Internal server error during verification' });
  }
});

// 2. Verify Signup OTP & Create Account
router.post('/signup-verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and verification code' });
    }

    const otpRecord = await Otp.findOne({ email: email.trim().toLowerCase(), otp: otp.trim(), type: 'signup' });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    const { name, password, country } = otpRecord.data;

    // Double check if user was created in the meantime
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      await Otp.deleteMany({ email: email.trim().toLowerCase(), type: 'signup' });
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      name,
      email: email.trim().toLowerCase(),
      password,
      country: country || 'India'
    });

    await newUser.save();
    await Otp.deleteMany({ email: email.trim().toLowerCase(), type: 'signup' });

    const token = jwt.sign(
      { id: newUser._id, name: newUser.name, email: newUser.email },
      process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod',
      { expiresIn: '7d' }
    );

    // Removed res.cookie

    res.status(201).json({ message: 'Account verified and created successfully', user: formatUserData(newUser), token });
  } catch (error) {
    console.error('Signup verify error:', error);
    res.status(500).json({ message: 'Internal server error during account creation' });
  }
});

// 3. Send OTP for Forgot Password
router.post('/forgot-password-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide your email address' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ email: email.trim().toLowerCase(), type: 'forgot_password' });

    await new Otp({
      email: email.trim().toLowerCase(),
      otp: otpCode,
      type: 'forgot_password'
    }).save();

    const emailSent = await sendOtpEmail(email.trim().toLowerCase(), otpCode, 'forgot_password', user.name);
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send password reset code. Please try again.' });
    }

    res.status(200).json({ message: 'Password reset code sent to your email', email: email.trim().toLowerCase() });
  } catch (error) {
    console.error('Forgot password OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 4. Verify Forgot Password OTP
router.post('/forgot-password-verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and verification code' });
    }

    const otpRecord = await Otp.findOne({ email: email.trim().toLowerCase(), otp: otp.trim(), type: 'forgot_password' });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    res.status(200).json({ message: 'Verification code is valid', valid: true });
  } catch (error) {
    console.error('Forgot password verify OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 5. Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!/^[\x20-\x7E]{8,}$/.test(newPassword)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and contain only standard characters.' });
    }

    const otpRecord = await Otp.findOne({ email: email.trim().toLowerCase(), otp: otp.trim(), type: 'forgot_password' });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate({ email: email.trim().toLowerCase() }, { password: hashedPassword });
    await Otp.deleteMany({ email: email.trim().toLowerCase(), type: 'forgot_password' });

    res.status(200).json({ message: 'Password reset successfully! You can now log in with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error during password reset' });
  }
});

export default router;
