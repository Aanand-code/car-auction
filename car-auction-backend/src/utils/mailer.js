const nodemailer = require('nodemailer');

// Create reusable transporter
function createTransporter(port, secure) {
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port, // 465 (SSL) or 587 (TLS)
    secure, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true, // connection pool
    maxConnections: 1, // avoid flooding
    rateDelta: 1000, // 1 second per message
    rateLimit: 5, // max 5 messages/sec
  });
}

let transporter = createTransporter(587, false); // Start with SSL

async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: `Car Auction <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code for Car Auction App',
    html: `
      <h2>Your One-Time Password (OTP)</h2>
      <p>Use the following code to verify your identity:</p>
      <h1 style="color: #007bff;">${otp}</h1>
      <p>This code will expire in <strong>10 minutes</strong>.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log('OTP email sent to:', email);
  } catch (error) {
    // console.error('Error sending email with port 587:', error.message);

    // Retry with port 465 if 587 fails
    // console.log('Retrying with port 465...');
    transporter = createTransporter(465, true);

    try {
      await transporter.sendMail(mailOptions);
      // console.log('OTP email sent via port 587 to:', email);
    } catch (retryError) {
      // console.error('Retry also failed:', retryError.message);
      throw new Error('Could not send OTP email after retry');
    }
  }
}

module.exports = { sendOTPEmail };
