const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"HereForYou" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4CAF50, #2196F3); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">HereForYou</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #333;">${subject}</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="color: #666; line-height: 1.6;">${text.replace(/\n/g, '<br>')}</p>
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px;">
                This email was sent by HereForYou. If you have any questions, please contact us at support@hereforyou.in
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;

  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to HereForYou!';
  const text = `
    Dear ${user.name},
    
    Welcome to HereForYou! We're excited to have you join our community.
    
    With HereForYou, you can:
    • Find trusted professionals for all your home service needs
    • Book services with just a few clicks
    • Track your service requests in real-time
    • Rate and review service providers
    
    To get started, please verify your phone number and complete your profile.
    
    If you have any questions, our support team is here to help at support@hereforyou.in
    
    Best regards,
    The HereForYou Team
  `;
  
  return sendEmail(user.email, subject, text);
};

// Send booking confirmation email
const sendBookingConfirmationEmail = async (booking, customer, professional) => {
  const subject = `Booking Confirmed - ${booking.bookingId}`;
  const text = `
    Dear ${customer.name},
    
    Your booking has been confirmed!
    
    Booking Details:
    • Booking ID: ${booking.bookingId}
    • Service: ${booking.service}
    • Professional: ${professional.user.name}
    • Date: ${new Date(booking.schedule.date).toLocaleDateString()}
    • Time: ${booking.schedule.timeSlot?.start || 'To be confirmed'}
    • Address: ${booking.location.address}
    
    The professional will contact you shortly to confirm the appointment details.
    
    You can track your booking status in the app or website.
    
    For any assistance, contact us at support@hereforyou.in or call +91 9876543210
    
    Best regards,
    HereForYou Team
  `;
  
  return sendEmail(customer.email, subject, text);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendBookingConfirmationEmail
};