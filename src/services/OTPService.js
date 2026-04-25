// src/services/OTPService.js
// Placeholder OTP Service
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (phone, otp) => {
  console.log(`OTP for ${phone}: ${otp}`);
  // TODO: Implement actual SMS sending
  return true;
};

const verifyOTP = (storedOTP, providedOTP) => {
  return storedOTP === providedOTP;
};

module.exports = {
  generateOTP,
  sendOTP,
  verifyOTP
};
