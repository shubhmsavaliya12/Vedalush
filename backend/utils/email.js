import { BrevoClient } from '@getbrevo/brevo';

// Helper to escape HTML characters and prevent HTML injection / XSS in emails
const escapeHtml = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Helper to validate basic email format
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

// Helper to generate receipt-style HTML email (modeled after Cashfree / VedaOils reference format)
const buildReceiptHtml = (orderData, isAdmin = false) => {
  const safeName = escapeHtml(orderData.name || 'Valued Customer');
  const safeEmail = escapeHtml(orderData.email || 'N/A');
  const safePhone = escapeHtml(orderData.phone || 'N/A');
  const safeCountry = escapeHtml(orderData.country || 'India');
  const safeAddress = escapeHtml(orderData.address || 'N/A');
  const safeMessage = escapeHtml(orderData.message || '');
  
  let itemsList = [];
  if (Array.isArray(orderData.items) && orderData.items.length > 0) {
    itemsList = orderData.items.map(item => ({
      name: escapeHtml(item.product || 'Vedalush Organic Soap'),
      qty: escapeHtml(String(item.quantity || 1))
    }));
  } else {
    itemsList = [{
      name: escapeHtml(orderData.product || 'Vedalush Organic Soap'),
      qty: escapeHtml(String(orderData.quantity || 1))
    }];
  }

  const totalUnits = itemsList.reduce((acc, item) => acc + (parseInt(item.qty, 10) || 1), 0);
  const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const bannerTitle = isAdmin ? 'New Order Received' : 'Order Request Confirmed';
  const bannerSub = isAdmin ? `Received on ${currentDate}` : `Confirmed Successfully on ${currentDate}`;
  const actionText = isAdmin 
    ? '🔔 Action Required: Contact customer within 24 hours to arrange payment &rsaquo;' 
    : '👤 We will contact you via phone or email within 24 hours to finalize payment & shipping &rsaquo;';

  const itemsHtmlTable = itemsList.map(item => `
    <table style="width: 100%; border-collapse: collapse; background-color: #FFFFFF; border: 1px solid #E6DED2; border-radius: 8px; margin-bottom: 10px;">
      <tr>
        <td style="width: 50px; text-align: center; vertical-align: middle; padding: 12px;">
          <div style="width: 42px; height: 42px; background-color: #F8F4EC; border: 1px solid #E6DED2; border-radius: 8px; text-align: center; line-height: 42px; font-size: 22px; margin: 0 auto;">🛒</div>
        </td>
        <td style="vertical-align: middle; padding: 12px 14px;">
          <div style="font-size: 15px; font-weight: bold; color: #5D4E42; margin-bottom: 4px;">${item.name}</div>
          <span style="display: inline-block; background-color: #FDFBF7; border: 1px solid #E6DED2; color: #5D4E42; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 4px; font-family: monospace;">Qty: ${item.qty}</span>
        </td>
        <td style="text-align: right; vertical-align: middle; padding: 12px 18px; font-size: 13px; font-weight: bold; color: #34A853;">
          ✓ Confirmed
        </td>
      </tr>
    </table>
  `).join('');

  return `
    <div style="background-color: #F8F4EC; padding: 30px 10px; font-family: Arial, sans-serif; color: #6F6A65;">
      <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #E6DED2; border-collapse: collapse;">
        <!-- Top Luxury Accent Bar -->
        <tr>
          <td style="background: linear-gradient(90deg, #8E7A65 0%, #B88A5A 50%, #C19A6B 100%); height: 8px; padding: 0;"></td>
        </tr>

        <!-- Header: Brand & Badge -->
        <tr>
          <td style="padding: 22px 25px; border-bottom: 1px solid #E6DED2;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="vertical-align: middle;">
                  <span style="font-family: 'Georgia', serif; font-size: 22px; font-weight: bold; color: #5D4E42; letter-spacing: 0.5px;">🌿 Vedalush</span>
                  <span style="display: block; font-size: 12px; color: #8E7A65; font-weight: bold; margin-top: 2px;">Private Limited</span>
                </td>
                <td style="text-align: right; vertical-align: middle;">
                  <span style="background-color: #F8F4EC; border: 1px solid #E6DED2; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: bold; color: #8E7A65; text-transform: uppercase; letter-spacing: 0.5px;">100% Organic</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Green Status Banner -->
        <tr>
          <td style="background-color: #E6F4EA; border-bottom: 1px solid #CEEAD6; padding: 20px 25px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 45px; vertical-align: middle;">
                  <div style="width: 36px; height: 36px; background-color: #34A853; color: #FFFFFF; border-radius: 50%; text-align: center; line-height: 36px; font-size: 18px; font-weight: bold;">✓</div>
                </td>
                <td style="vertical-align: middle;">
                  <div style="font-size: 18px; font-weight: bold; color: #1E4620;">${bannerTitle}</div>
                  <div style="font-size: 12px; color: #2D6A31; margin-top: 3px;">${bannerSub}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Action / Status Bar -->
        <tr>
          <td style="background-color: #FDFBF7; padding: 12px 25px; border-bottom: 1px solid #E6DED2; font-size: 12px; font-weight: bold; color: #8E7A65;">
            ${actionText}
          </td>
        </tr>

        <!-- Body Content -->
        <tr>
          <td style="padding: 25px;">
            <!-- Order Details Section -->
            <div style="font-size: 15px; font-weight: bold; color: #5D4E42; margin-bottom: 12px; border-bottom: 1px solid #E6DED2; padding-bottom: 8px;">Order Details</div>
            <div style="background-color: #F8F4EC; border: 1px solid #E6DED2; border-radius: 12px; padding: 16px; margin-bottom: 25px;">
              ${itemsHtmlTable}
            </div>

            <!-- Customer Details Section -->
            <div style="font-size: 15px; font-weight: bold; color: #5D4E42; margin-bottom: 12px; border-bottom: 1px solid #E6DED2; padding-bottom: 8px;">Customer Details</div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <td style="width: 50%; vertical-align: top; padding-right: 15px; padding-bottom: 15px;">
                  <div style="font-size: 11px; color: #9D948B; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">ISSUED TO:</div>
                  <div style="font-size: 14px; font-weight: bold; color: #5D4E42; margin-bottom: 4px;">${safeName}</div>
                  <div style="font-size: 13px; margin-bottom: 4px;"><a href="mailto:${safeEmail}" style="color: #B88A5A; text-decoration: none; font-weight: bold;">${safeEmail}</a></div>
                  <div style="font-size: 13px; color: #6F6A65;">${safePhone}</div>
                </td>
                <td style="width: 50%; vertical-align: top; padding-left: 15px; padding-bottom: 15px;">
                  <div style="font-size: 11px; color: #9D948B; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">SHIPPING DETAILS:</div>
                  <div style="font-size: 13px; color: #6F6A65; line-height: 1.5; margin-bottom: 4px;">${safeAddress}</div>
                  <div style="font-size: 13px; font-weight: bold; color: #5D4E42;">${safeCountry}</div>
                </td>
              </tr>
            </table>

            <!-- Summary Table Section -->
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #E6DED2; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
              <tr style="background-color: #F8F4EC;">
                <th style="text-align: left; padding: 12px 16px; font-size: 13px; font-weight: bold; color: #5D4E42; border-bottom: 1px solid #E6DED2;">Description</th>
                <th style="text-align: right; padding: 12px 16px; font-size: 13px; font-weight: bold; color: #5D4E42; border-bottom: 1px solid #E6DED2;">Status</th>
              </tr>
              <tr>
                <td style="padding: 12px 16px; font-size: 14px; color: #6F6A65; border-bottom: 1px solid #E6DED2;">Total Items Ordered</td>
                <td style="text-align: right; padding: 12px 16px; font-size: 14px; font-weight: bold; color: #5D4E42; border-bottom: 1px solid #E6DED2;">${totalUnits} Units</td>
              </tr>
              <tr style="background-color: #FDFBF7;">
                <td style="padding: 14px 16px; font-size: 15px; font-weight: bold; color: #5D4E42;">Order Status</td>
                <td style="text-align: right; padding: 14px 16px; font-size: 15px; font-weight: bold; color: #B88A5A;">Pending Confirmation</td>
              </tr>
            </table>

            ${safeMessage ? `
              <div style="background-color: #FDFBF7; border-left: 4px solid #C19A6B; padding: 14px 16px; border-radius: 6px; margin-bottom: 10px;">
                <div style="font-size: 11px; font-weight: bold; color: #8E7A65; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Special Request / Notes:</div>
                <div style="font-size: 13px; color: #5D4E42; font-style: italic; line-height: 1.5;">"${safeMessage}"</div>
              </div>
            ` : ''}
          </td>
        </tr>

        <!-- Footer Section -->
        <tr>
          <td style="background-color: #F8F4EC; padding: 25px; text-align: center; border-top: 1px solid #E6DED2;">
            <div style="font-size: 14px; font-weight: bold; color: #5D4E42; margin-bottom: 6px;">Vedalush Private Limited</div>
            <div style="font-size: 12px; color: #9D948B; margin-bottom: 16px;">In case of query or feedback, please contact Vedalush Private Limited</div>
            <div style="font-size: 13px;">
              <a href="mailto:shubhm.savaliya@gmail.com" style="color: #B88A5A; text-decoration: none; font-weight: bold;">Email</a>
              <span style="color: #E6DED2; margin: 0 12px;">|</span>
              <a href="https://www.vedalush.com" style="color: #B88A5A; text-decoration: none; font-weight: bold;">Visit Our Website</a>
            </div>
          </td>
        </tr>

        <!-- Bottom Accent Bar -->
        <tr>
          <td style="background: linear-gradient(90deg, #8E7A65 0%, #B88A5A 50%, #C19A6B 100%); height: 8px; padding: 0;"></td>
        </tr>
      </table>
    </div>
  `;
};

export const sendAdminOrderEmail = async (orderData) => {
  try {
    if (!orderData || typeof orderData !== 'object') {
      console.error('Invalid orderData provided to sendAdminOrderEmail');
      return false;
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'shubhm.savaliya@gmail.com';
    const senderName = process.env.BREVO_SENDER_NAME || 'Vedalush Orders';
    const adminEmail = process.env.ADMIN_EMAIL || senderEmail;
    const htmlContent = buildReceiptHtml(orderData, true);

    // Check if API key is present and configured
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey || apiKey === 'your_brevo_api_key_here') {
      console.warn('Brevo API key not configured in .env. Using mock email mode for Admin notification.');
      console.log('--- [MOCK ADMIN EMAIL] ---');
      console.log(`To Admin (${adminEmail}) from: ${orderData.email}`);
      console.log(`Subject: 🌿 New Direct Order from ${orderData.name}`);
      console.log('--- [RECEIPT HTML GENERATED SUCCESSFULY] ---');
      return true;
    }

    if (!isValidEmail(adminEmail)) {
      console.error(`Invalid admin email address configured: ${adminEmail}`);
      return false;
    }

    const client = new BrevoClient({ apiKey });
    const safeName = escapeHtml(orderData.name || 'Anonymous');

    const emailPayload = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: adminEmail, name: 'Vedalush Admin' }],
      subject: `🌿 New Direct Order from ${safeName}`,
      htmlContent
    };

    if (isValidEmail(orderData.email)) {
      emailPayload.replyTo = { email: orderData.email.trim(), name: safeName };
    }

    const response = await client.transactionalEmails.sendTransacEmail(emailPayload);
    console.log('Admin order notification sent successfully via Brevo. MessageId:', response?.messageId);
    return true;
  } catch (error) {
    console.error('Error sending admin order email via Brevo:', error?.message || error);
    return false;
  }
};

export const sendCustomerConfirmationEmail = async (orderData) => {
  try {
    if (!orderData || !isValidEmail(orderData.email)) {
      console.warn('No valid customer email provided for confirmation email.');
      return false;
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'shubhm.savaliya@gmail.com';
    const senderName = process.env.BREVO_SENDER_NAME || 'Vedalush Orders';
    const htmlContent = buildReceiptHtml(orderData, false);

    // Check if API key is present and configured
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey || apiKey === 'your_brevo_api_key_here') {
      console.warn('Brevo API key not configured in .env. Using mock email mode for Customer confirmation.');
      console.log('--- [MOCK CUSTOMER EMAIL] ---');
      console.log(`To Customer: ${orderData.email}`);
      console.log(`Subject: 🌿 Order Request Confirmed | Vedalush`);
      console.log('--- [RECEIPT HTML GENERATED SUCCESSFULY] ---');
      return true;
    }

    const client = new BrevoClient({ apiKey });
    const safeName = escapeHtml(orderData.name || 'Valued Customer');

    const emailPayload = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: orderData.email.trim(), name: safeName }],
      subject: `🌿 Order Request Confirmed | Vedalush`,
      htmlContent
    };

    const response = await client.transactionalEmails.sendTransacEmail(emailPayload);
    console.log('Customer order confirmation email sent successfully via Brevo. MessageId:', response?.messageId);
    return true;
  } catch (error) {
    console.error('Error sending customer confirmation email via Brevo:', error?.message || error);
    return false;
  }
};

export const sendOtpEmail = async (email, otp, type, userName = 'Valued User') => {
  try {
    if (!isValidEmail(email) || !otp) {
      console.error('Invalid parameters for sendOtpEmail');
      return false;
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'shubhm.savaliya@gmail.com';
    const senderName = process.env.BREVO_SENDER_NAME || 'Vedalush Security';
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey || apiKey === 'your_brevo_api_key_here') {
      console.warn('Brevo API key not configured in .env. Using mock OTP mode.');
      console.log('--- [MOCK OTP EMAIL] ---');
      console.log(`To: ${email}`);
      console.log(`Type: ${type}`);
      console.log(`OTP CODE: ${otp}`);
      console.log('------------------------');
      return true;
    }

    const client = new BrevoClient({ apiKey });
    const safeName = escapeHtml(userName);
    const safeOtp = escapeHtml(otp);
    const isSignup = type === 'signup';
    const actionTitle = isSignup ? 'Account Verification' : 'Password Reset Request';
    const actionDescription = isSignup 
      ? 'Please use the 6-digit verification code below to complete your registration with <strong>Vedalush</strong>.'
      : 'We received a request to reset the password for your <strong>Vedalush</strong> account. Use the code below to set up a new password.';

    const emailPayload = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: email.trim(), name: safeName }],
      subject: `🌿 ${isSignup ? 'Verification Code' : 'Password Reset'}: ${safeOtp} | Vedalush`,
      htmlContent: `
        <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 550px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #fbfcf8; text-align: center;">
          <div style="margin-bottom: 25px;">
            <h1 style="color: #2F3E1E; font-size: 28px; margin: 0; font-weight: normal;">Vedalush<span style="color: #c9a875;">.</span></h1>
            <p style="color: #718096; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Security & Verification</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); text-align: left; font-family: Arial, sans-serif;">
            <h3 style="color: #2F3E1E; font-size: 20px; margin-top: 0;">Hello ${safeName},</h3>
            <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">
              ${actionDescription}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background-color: #f4f6f0; border: 2px dashed #2F3E1E; border-radius: 10px; padding: 15px 35px;">
                <span style="font-family: monospace; font-size: 32px; font-weight: bold; color: #2F3E1E; letter-spacing: 6px;">${safeOtp}</span>
              </div>
            </div>
            
            <p style="color: #718096; font-size: 13px; line-height: 1.5; margin-bottom: 0;">
              This code will expire in <strong>10 minutes</strong>. If you did not request this code, please ignore this email or contact security.
            </p>
          </div>
          
          <div style="margin-top: 25px; font-family: Arial, sans-serif; font-size: 12px; color: #a0aec0;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Vedalush. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const response = await client.transactionalEmails.sendTransacEmail(emailPayload);
    console.log(`OTP (${type}) email sent successfully to ${email}. MessageId:`, response?.messageId);
    return true;
  } catch (error) {
    console.error(`Error sending OTP email (${type}) via Brevo:`, error?.message || error);
    return false;
  }
};

