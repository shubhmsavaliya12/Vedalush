import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { verifyAdminAuth } from '../utils/auth.js';
import jwt from 'jsonwebtoken';
import { sendAdminOrderEmail, sendCustomerConfirmationEmail, sendOrderStatusUpdateEmail } from '../utils/email.js';
import { createShiprocketOrder } from '../utils/shiprocket.js';

const router = express.Router();

// Initialize Razorpay
let razorpayInstance = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (error) {
  console.warn("Razorpay not initialized properly:", error.message);
}

// 1. Legacy Direct Order Route (From Homepage)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, country, address, product, quantity, message } = req.body;
    
    // Map to new schema structure
    const newOrderData = {
      orderNumber: 'VDL-DIR-' + Date.now(),
      orderType: 'direct',
      name, email, phone, country, address, product, message,
      quantity: quantity || 1,
      orderStatus: 'pending_payment',
      paymentStatus: 'pending',
      shippingStatus: 'unshipped',
      items: [], // Might not have exact product references in direct order
      shippingAddress: { address, country }
    };

    const order = new Order(newOrderData);
    await order.save();
    
    // Trigger email notifications non-blockingly
    Promise.all([
      sendAdminOrderEmail(order),
      sendCustomerConfirmationEmail(order)
    ]).catch(err => console.error('Error triggering order notifications:', err));

    res.status(201).json({ message: 'Order submitted successfully', order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({ message: 'Failed to submit order', error: error.message });
  }
});

// 2. New Checkout Route
router.post('/checkout', async (req, res) => {
  try {
    const { items, address, paymentMethod, email, name, phone } = req.body;
    
    if (!items || items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    let subtotal = 0;
    const snapshottedItems = [];

    // Backend Zero-Trust Pricing
    for (const item of items) {
      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct) return res.status(404).json({ message: `Product not found: ${item.productId}` });
      if (dbProduct.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${dbProduct.name}` });

      const price = dbProduct.price;
      subtotal += price * item.quantity;
      
      snapshottedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        price: price,
        quantity: item.quantity,
        image: dbProduct.images?.[0] || '',
        sku: dbProduct.sku || 'VEDA-SKU'
      });
      
      // Optionally deduct stock here (or wait till payment verified)
    }

    const shippingCharge = 0; // Simplified for v1
    const total = subtotal + shippingCharge;
    const orderNumber = 'VDL-' + Date.now();

    const order = new Order({
      orderNumber,
      orderType: 'checkout',
      name, email, phone,
      items: snapshottedItems,
      shippingAddress: address,
      paymentMethod,
      pricing: { subtotal, shippingCharge, total, currency: 'INR' },
      orderStatus: paymentMethod === 'cod' ? 'confirmed' : 'pending_payment',
      paymentStatus: 'pending',
    });

    // Check for user token
    const token = req.cookies?.user_token || req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod');
        order.user = decoded.userId;
      } catch (err) { /* guest checkout */ }
    }

    if (paymentMethod === 'cod') {
      await order.save();
      // Send confirmation emails
      Promise.all([
        sendAdminOrderEmail(order),
        sendCustomerConfirmationEmail(order)
      ]).catch(console.error);
      return res.status(201).json({ message: 'COD Order created', orderId: order._id, orderNumber });
    }

    // Razorpay Flow
    if (!razorpayInstance) return res.status(500).json({ message: 'Razorpay not configured' });

    const rzpOrder = await razorpayInstance.orders.create({
      amount: Math.round(total * 100), // in paise
      currency: 'INR',
      receipt: orderNumber
    });

    order.paymentDetails = { razorpayOrderId: rzpOrder.id };
    await order.save();

    res.status(201).json({
      message: 'Razorpay order created',
      orderId: order._id,
      razorpayOrderId: rzpOrder.id,
      amount: total,
      currency: 'INR'
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Checkout failed', error: error.message });
  }
});

// 3. Verify Payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return res.status(500).json({ message: 'Razorpay secret missing' });

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.paymentStatus === 'paid') return res.status(200).json({ message: 'Already paid' });

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.paymentDetails.razorpayPaymentId = razorpay_payment_id;
    order.paymentDetails.razorpaySignature = razorpay_signature;
    await order.save();

    // Trigger emails
    Promise.all([
      sendAdminOrderEmail(order),
      sendCustomerConfirmationEmail(order)
    ]).catch(console.error);

    res.status(200).json({ message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
});

// 4. Retry Payment
router.post('/:id/retry-payment', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.paymentStatus === 'paid') return res.status(400).json({ message: 'Order already paid' });
    if (order.paymentMethod !== 'razorpay') return res.status(400).json({ message: 'Not a prepaid order' });
    if (!razorpayInstance) return res.status(500).json({ message: 'Razorpay not configured' });

    const rzpOrder = await razorpayInstance.orders.create({
      amount: Math.round(order.pricing.total * 100),
      currency: 'INR',
      receipt: order.orderNumber
    });

    order.paymentDetails.razorpayOrderId = rzpOrder.id;
    await order.save();

    res.status(200).json({
      razorpayOrderId: rzpOrder.id,
      amount: order.pricing.total,
      currency: 'INR'
    });
  } catch (error) {
    console.error('Retry payment error:', error);
    res.status(500).json({ message: 'Failed to generate retry link' });
  }
});

// 5. User My Orders
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.user_token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod');
    
    const orders = await Order.find({ user: decoded.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// 6. Request Return (User)
router.post('/:id/request-return', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.user_token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod');
    
    const order = await Order.findOne({ _id: req.params.id, user: decoded.userId });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (order.orderStatus !== 'delivered') return res.status(400).json({ message: 'Only delivered orders can be returned' });

    order.orderStatus = 'return_requested';
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to request return' });
  }
});

// 7. Admin Get All Orders
router.get('/', async (req, res) => {
  const authResult = verifyAdminAuth(req);
  if (!authResult.authenticated || authResult.user.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });

  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// 8. Admin Update Status
router.put('/:id/status', async (req, res) => {
  const authResult = verifyAdminAuth(req);
  if (!authResult.authenticated || authResult.user.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });

  try {
    const { orderStatus, shippingStatus, pushToShiprocket } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    let statusChanged = false;
    if (orderStatus && order.orderStatus !== orderStatus) {
      order.orderStatus = orderStatus;
      statusChanged = true;
    }
    if (shippingStatus) order.shippingStatus = shippingStatus;

    if (pushToShiprocket && !order.shippingDetails?.shiprocketOrderId) {
      try {
        const srResponse = await createShiprocketOrder(order);
        if (srResponse?.order_id) {
          order.shippingDetails = {
            shiprocketOrderId: srResponse.order_id,
            shipmentId: srResponse.shipment_id,
            awbCode: srResponse.awb_code || '',
            courierName: srResponse.courier_name || '',
            trackingUrl: ''
          };
          order.shippingStatus = 'label_generated';
        }
      } catch (err) {
        console.error('Shiprocket push failed manually:', err);
      }
    }

    await order.save();

    if (statusChanged && ['packed', 'shipped', 'out_for_delivery', 'delivered', 'returned'].includes(orderStatus)) {
      sendOrderStatusUpdateEmail(order, orderStatus).catch(console.error);
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

export default router;
