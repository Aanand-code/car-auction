const NodeCache = require('node-cache');
const speakeasy = require('speakeasy');
const { ApiError } = require('./ApiError');

const otpCache = new NodeCache({ stdTTL: 600 }); // 10 min TTL

// Generate and store OTP for a user
const generateOTP = (email) => {
  // generate secret
  const secret = speakeasy.generateSecret({ length: 20 }).base32;

  // generate OTP from secret
  const otp = speakeasy.totp({
    secret,
    encoding: 'base32',
    step: 600, // 10 min valid
    digits: 6,
  });

  // store secret (not only otp!)
  otpCache.set(email, otp, 600);

  console.log(`OTP for ${email}: ${otp}`);
  return otp;
};

// Verify OTP
const verifyOTP = (email, userOTP) => {
  const cachedOTP = otpCache.get(email);
  if (!cachedOTP) {
    throw new ApiError(400, 'OTP Expired');
  }

  const verified = userOTP === cachedOTP;

  if (!verified) {
    throw new ApiError(400, 'Invalid OTP');
  }

  if (verified) otpCache.del(email); // remove after success
  return verified;
};

module.exports = { generateOTP, verifyOTP };
