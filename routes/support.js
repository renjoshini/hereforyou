const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// Support ticket schema (you can create a separate model if needed)
const supportTickets = []; // In-memory storage for demo

// Submit support request
router.post('/ticket', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('category').isIn(['booking', 'payment', 'service', 'account', 'technical', 'other']).withMessage('Valid category is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const ticketId = 'TK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    const ticket = {
      id: ticketId,
      ...req.body,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store ticket (in a real app, save to database)
    supportTickets.push(ticket);

    // Send confirmation email
    await sendEmail(
      req.body.email,
      `Support Ticket Created - ${ticketId}`,
      `Your support ticket has been created successfully. Ticket ID: ${ticketId}. We'll respond within 24 hours.`
    );

    // Send notification to support team
    await sendEmail(
      process.env.SUPPORT_EMAIL || 'support@hereforyou.in',
      `New Support Ticket - ${ticketId}`,
      `New support ticket received:
      
      Ticket ID: ${ticketId}
      Category: ${req.body.category}
      Priority: ${req.body.priority || 'medium'}
      Subject: ${req.body.subject}
      
      From: ${req.body.name} (${req.body.email})
      
      Description:
      ${req.body.description}`
    );

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      ticketId,
      data: {
        id: ticketId,
        status: 'open',
        estimatedResponse: '24 hours'
      }
    });

  } catch (error) {
    console.error('Create support ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create support ticket',
      error: error.message
    });
  }
});

// Get support ticket status
router.get('/ticket/:id', async (req, res) => {
  try {
    const ticket = supportTickets.find(t => t.id === req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: ticket.id,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
      }
    });

  } catch (error) {
    console.error('Get support ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support ticket',
      error: error.message
    });
  }
});

// FAQ endpoints
router.get('/faq', async (req, res) => {
  try {
    const faqs = [
      {
        id: 1,
        category: 'booking',
        question: 'How do I book a service on HereForYou?',
        answer: 'You can book a service by searching for the service you need, selecting a professional, choosing a date and time, and confirming your booking with payment details.'
      },
      {
        id: 2,
        category: 'booking',
        question: 'Can I cancel or reschedule my booking?',
        answer: 'Yes, you can cancel or reschedule your booking up to 2 hours before the scheduled time without charges. Late cancellations may incur fees.'
      },
      {
        id: 3,
        category: 'payment',
        question: 'What payment methods do you accept?',
        answer: 'We accept UPI, credit/debit cards, digital wallets, and cash payments after service completion.'
      },
      {
        id: 4,
        category: 'service',
        question: 'Are all professionals verified?',
        answer: 'Yes, all professionals undergo thorough background verification, document checks, and skill assessments before joining our platform.'
      },
      {
        id: 5,
        category: 'safety',
        question: 'How do you ensure my safety during service visits?',
        answer: 'We ensure safety through professional verification, real-time tracking, emergency support, insurance coverage, and a community-driven rating system.'
      }
    ];

    const { category } = req.query;
    let filteredFaqs = faqs;

    if (category) {
      filteredFaqs = faqs.filter(faq => faq.category === category);
    }

    res.json({
      success: true,
      data: filteredFaqs
    });

  } catch (error) {
    console.error('Get FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ',
      error: error.message
    });
  }
});

// Contact form submission
router.post('/contact', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, phone, subject, message } = req.body;

    // Send email to support team
    await sendEmail(
      process.env.SUPPORT_EMAIL || 'support@hereforyou.in',
      `Contact Form Submission - ${subject}`,
      `New contact form submission:
      
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Subject: ${subject}
      
      Message:
      ${message}`
    );

    // Send confirmation to user
    await sendEmail(
      email,
      'Thank you for contacting HereForYou',
      `Dear ${firstName},
      
      Thank you for reaching out to us. We have received your message and will get back to you within 24 hours.
      
      Subject: ${subject}
      
      Best regards,
      HereForYou Support Team`
    );

    res.json({
      success: true,
      message: 'Message sent successfully. We will get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// Emergency support
router.post('/emergency', auth, [
  body('type').isIn(['safety', 'medical', 'service', 'other']).withMessage('Valid emergency type is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const emergencyId = 'EM' + Date.now();
    
    // In a real app, this would trigger immediate alerts to support team
    console.log('EMERGENCY ALERT:', {
      id: emergencyId,
      userId: req.user.userId,
      type: req.body.type,
      description: req.body.description,
      location: req.body.location,
      timestamp: new Date()
    });

    // Send immediate notification to emergency team
    await sendEmail(
      process.env.EMERGENCY_EMAIL || 'emergency@hereforyou.in',
      `EMERGENCY ALERT - ${emergencyId}`,
      `EMERGENCY SUPPORT REQUIRED
      
      Emergency ID: ${emergencyId}
      User ID: ${req.user.userId}
      Type: ${req.body.type}
      Location: ${req.body.location || 'Not provided'}
      
      Description:
      ${req.body.description}
      
      Timestamp: ${new Date().toISOString()}`
    );

    res.json({
      success: true,
      message: 'Emergency alert sent. Support team will contact you immediately.',
      emergencyId,
      supportNumber: '+91 9876543210'
    });

  } catch (error) {
    console.error('Emergency support error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send emergency alert',
      error: error.message
    });
  }
});

module.exports = router;