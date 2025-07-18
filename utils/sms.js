// SMS utility functions
// Note: This is a mock implementation. In production, integrate with SMS providers like Twilio, MSG91, etc.

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendSMS = async (phone, message) => {
  try {
    // Mock SMS sending - replace with actual SMS service
    console.log(`SMS to ${phone}: ${message}`);
    
    // Example integration with SMS service:
    /*
    const response = await fetch('https://api.sms-provider.com/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SMS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: phone,
        message: message,
        sender_id: process.env.SMS_SENDER_ID
      })
    });
    
    if (!response.ok) {
      throw new Error('SMS sending failed');
    }
    
    return await response.json();
    */
    
    // Mock successful response
    return {
      success: true,
      messageId: 'mock_' + Date.now(),
      status: 'sent'
    };

  } catch (error) {
    console.error('SMS sending failed:', error);
    throw error;
  }
};

const sendOTP = async (phone, otp) => {
  const message = `Your HereForYou verification OTP is: ${otp}. Valid for 10 minutes. Do not share this OTP with anyone.`;
  return sendSMS(phone, message);
};

const sendBookingNotification = async (phone, bookingId, message) => {
  const smsText = `HereForYou: ${message} Booking ID: ${bookingId}. For support, call +91 9876543210`;
  return sendSMS(phone, smsText);
};

module.exports = {
  generateOTP,
  sendSMS,
  sendOTP,
  sendBookingNotification
};