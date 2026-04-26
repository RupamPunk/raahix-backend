/**
 * OTP Service - Demo Implementation
 * In development/demo mode, we use a fixed OTP (123456) for ease of testing.
 */

// Fixed OTP for demo purposes
const DEMO_OTP = '123456';

/**
 * Generate a new OTP.
 * @returns {string} The generated OTP.
 */
const generateOTP = () => {
    // For demo mode, we always use the fixed OTP
    return DEMO_OTP;
};

/**
 * Send OTP via SMS.
 * @param {string} phone - The recipient's phone number.
 * @param {string} otp - The OTP to send.
 */
const sendOTP = async (phone, otp) => {
    console.log(`--- [DEMO OTP SENT] ---`);
    console.log(`To: ${phone}`);
    console.log(`Code: ${otp}`);
    console.log(`-----------------------`);
    // Skip real SMS sending in demo mode
    return true;
};

/**
 * Verify if the provided OTP is valid.
 * @param {string} phone - The phone number.
 * @param {string} providedOTP - The OTP provided by the user.
 * @param {string} type - The type of OTP (e.g., 'driver').
 * @param {boolean} devBypass - Whether to skip verification.
 * @returns {boolean} True if valid.
 */
const verifyOTP = (phone, providedOTP, type, devBypass = false) => {
    // If dev bypass is enabled, always return true
    if (devBypass === true || devBypass === 'true') {
        console.log(`[AUTH] Dev bypass enabled for ${phone}`);
        return true;
    }

    // Check against fixed demo OTP
    return providedOTP === DEMO_OTP;
};

module.exports = {
    generateOTP,
    sendOTP,
    verifyOTP
};

