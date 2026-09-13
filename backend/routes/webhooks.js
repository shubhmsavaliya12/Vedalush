import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { sendCustomerConfirmationEmail, sendAdminOrderEmail, sendPaymentFailedEmail, sendOrderStatusUpdateEmail } from '../utils/email.js';

const router = express.Router();

// 1. Razorpay Webhook
router.post('/razorpay', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return res.status(200).send('Webhook secret not configured'); // Return 200 so razorpay doesn't retry infinitely

    const signature = req.headers['x-razorpay-signature'];
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'order.paid' || event === 'payment.captured') {
      const orderId = payload.payment.entity.order_id;
      const paymentId = payload.payment.entity.id;

      const order = await Order.findOne({ 'paymentDetails.razorpayOrderId': orderId });
      
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.paymentDetails.razorpayPaymentId = paymentId;
        await order.save();
        
        Promise.all([
          sendAdminOrderEmail(order),
          sendCustomerConfirmationEmail(order)
        ]).catch(console.error);
      }
    } else if (event === 'payment.failed') {
      const orderId = payload.payment.entity.order_id;
      const order = await Order.findOne({ 'paymentDetails.razorpayOrderId': orderId });
      
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'failed';
        await order.save();
        
        sendPaymentFailedEmail(order).catch(console.error);
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Razorpay Webhook Error:', error);
    res.status(500).json({ status: 'error' });
  }
});

// 2. Shiprocket Webhook
router.post('/shiprocket', async (req, res) => {
  try {
    // Note: Shiprocket sends a specific header or token depending on configuration.
    // Assuming simple token validation if configured:
    const token = req.headers['x-api-key'];
    if (process.env.SHIPROCKET_WEBHOOK_TOKEN && token !== process.env.SHIPROCKET_WEBHOOK_TOKEN) {
      return res.status(401).send('Unauthorized');
    }

    const data = req.body;
    /*
      Shiprocket typically sends:
      {
        "awb": "12345678",
        "current_status": "DELIVERED", // "SHIPPED", "OUT FOR DELIVERY", "RTO INITIATED", etc.
        ...
      }
    */
    
    if (data && data.awb && data.current_status) {
      const order = await Order.findOne({ 'shippingDetails.awbCode': data.awb });
      
      if (order) {
        let newShippingStatus = order.shippingStatus;
        let newOrderStatus = order.orderStatus;
        const srStatus = data.current_status.toUpperCase();

        if (srStatus.includes('SHIPPED') || srStatus.includes('IN TRANSIT')) {
          newShippingStatus = 'in_transit';
          newOrderStatus = 'shipped';
        } else if (srStatus.includes('OUT FOR DELIVERY')) {
          newShippingStatus = 'out_for_delivery';
          newOrderStatus = 'out_for_delivery';
        } else if (srStatus.includes('DELIVERED')) {
          newShippingStatus = 'delivered';
          newOrderStatus = 'delivered';
          // If COD, mark as paid
          if (order.paymentMethod === 'cod') {
            order.paymentStatus = 'paid';
          }
        } else if (srStatus.includes('RTO')) {
          newShippingStatus = srStatus.includes('DELIVERED') ? 'rto_delivered' : 'rto_initiated';
          newOrderStatus = 'returned';
        }

        let statusChanged = false;
        if (order.shippingStatus !== newShippingStatus) {
          order.shippingStatus = newShippingStatus;
        }
        if (order.orderStatus !== newOrderStatus) {
          order.orderStatus = newOrderStatus;
          statusChanged = true;
        }

        await order.save();

        if (statusChanged && ['shipped', 'out_for_delivery', 'delivered', 'returned'].includes(newOrderStatus)) {
          sendOrderStatusUpdateEmail(order, newOrderStatus).catch(console.error);
        }
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Shiprocket Webhook Error:', error);
    res.status(500).json({ status: 'error' });
  }
});

export default router;
