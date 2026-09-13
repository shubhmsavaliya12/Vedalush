import axios from 'axios';

let shiprocketToken = null;
let tokenExpiry = null;

/**
 * Authenticates with Shiprocket and caches the JWT token.
 * Tokens usually expire after 10 days.
 */
export const getShiprocketToken = async () => {
  try {
    // Check if we have a valid cached token
    if (shiprocketToken && tokenExpiry && new Date() < tokenExpiry) {
      return shiprocketToken;
    }

    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;

    if (!email || !password) {
      console.warn('Shiprocket credentials missing in .env. Mocking token.');
      return 'mock_shiprocket_token';
    }

    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email,
      password
    });

    if (response.data && response.data.token) {
      shiprocketToken = response.data.token;
      // Set expiry to 9 days from now to be safe
      tokenExpiry = new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000);
      return shiprocketToken;
    } else {
      throw new Error('No token in Shiprocket response');
    }
  } catch (error) {
    console.error('Error authenticating with Shiprocket:', error?.response?.data || error.message);
    return null;
  }
};

/**
 * Creates a custom order in Shiprocket based on Vedalush order data.
 */
export const createShiprocketOrder = async (orderData) => {
  try {
    const token = await getShiprocketToken();
    if (token === 'mock_shiprocket_token') {
      console.log('[MOCK SHIPROCKET] Order created successfully.');
      return {
        order_id: 'mock_shiprocket_order_' + Date.now(),
        shipment_id: 'mock_shipment_' + Date.now(),
        status: 'NEW'
      };
    }

    if (!token) throw new Error('Could not get Shiprocket Token');

    // Map Vedalush Order Data to Shiprocket format
    const shiprocketPayload = {
      order_id: orderData.orderNumber,
      order_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      pickup_location: "Primary", // Must match your Shiprocket pickup location name
      channel_id: "",
      comment: orderData.message || "",
      billing_customer_name: orderData.name,
      billing_last_name: "",
      billing_address: orderData.shippingAddress.address,
      billing_address_2: "",
      billing_city: orderData.shippingAddress.city,
      billing_pincode: orderData.shippingAddress.pincode,
      billing_state: orderData.shippingAddress.state,
      billing_country: orderData.shippingAddress.country || "India",
      billing_email: orderData.email,
      billing_phone: orderData.phone,
      shipping_is_billing: true,
      order_items: orderData.items.map(item => ({
        name: item.name,
        sku: item.sku || "VEDA-DEFAULT-SKU",
        units: item.quantity,
        selling_price: item.price,
        discount: 0,
        tax: 0,
        hsn: ""
      })),
      payment_method: orderData.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
      sub_total: orderData.pricing.subtotal,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5 // Default 500g
    };

    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', shiprocketPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Shiprocket order:', error?.response?.data || error.message);
    throw error;
  }
};
