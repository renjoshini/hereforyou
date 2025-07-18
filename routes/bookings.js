const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const Professional = require('../models/Professional');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendEmail } = require('../utils/email');
const { sendSMS } = require('../utils/sms');

const router = express.Router();

// Create new booking
router.post('/', auth, [
  body('professional').isMongoId().withMessage('Valid professional ID is required'),
  body('service').notEmpty().withMessage('Service is required'),
  body('schedule.date').isISO8601().withMessage('Valid date is required'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('contact.name').notEmpty().withMessage('Contact name is required'),
  body('contact.phone').matches(/^[6-9]\d{9}$/).withMessage('Valid phone number is required'),
  body('payment.method').isIn(['cash', 'upi', 'card', 'wallet']).withMessage('Valid payment method is required')
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

    // Check if professional exists and is available
    const professional = await Professional.findById(req.body.professional)
      .populate('user', 'name email phone');

    if (!professional) {
      return res.status(404).json({
        success: false,
        message: 'Professional not found'
      });
    }

    if (!professional.isActive || !professional.availability.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Professional is not available'
      });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      professional: req.body.professional,
      'schedule.date': new Date(req.body.schedule.date),
      'schedule.timeSlot.start': req.body.schedule.timeSlot?.start,
      status: { $in: ['confirmed', 'in-progress'] }
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Time slot is already booked'
      });
    }

    // Create booking
    const bookingData = {
      customer: req.user.userId,
      professional: req.body.professional,
      service: req.body.service,
      serviceDetails: req.body.serviceDetails,
      schedule: req.body.schedule,
      location: req.body.location,
      contact: req.body.contact,
      payment: req.body.payment,
      pricing: {
        estimatedCost: {
          min: professional.pricing.hourlyRate,
          max: professional.pricing.hourlyRate * 3
        }
      }
    };

    const booking = new Booking(bookingData);
    await booking.save();

    // Add initial timeline entry
    await booking.addTimelineEntry('confirmed', 'Booking confirmed', req.user.userId);

    // Update professional statistics
    professional.statistics.totalBookings++;
    await professional.save();

    // Send notifications
    const customer = await User.findById(req.user.userId);
    
    // Email to customer
    await sendEmail(
      customer.email,
      'Booking Confirmed - HereForYou',
      `Your booking ${booking.bookingId} has been confirmed for ${new Date(booking.schedule.date).toLocaleDateString()}.`
    );

    // SMS to professional
    await sendSMS(
      professional.user.phone,
      `New booking received! Booking ID: ${booking.bookingId}. Date: ${new Date(booking.schedule.date).toLocaleDateString()}. Customer: ${customer.name}`
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
});

// Get user bookings
router.get('/my-bookings', auth, [
  query('status').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { customer: req.user.userId };
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate('professional', 'user services pricing ratings location')
      .populate({
        path: 'professional',
        populate: {
          path: 'user',
          select: 'name profile.avatar'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
});

// Get professional bookings
router.get('/professional-bookings', auth, [
  query('status').optional().isString(),
  query('date').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    // Find professional profile
    const professional = await Professional.findOne({ user: req.user.userId });
    if (!professional) {
      return res.status(404).json({
        success: false,
        message: 'Professional profile not found'
      });
    }

    const { status, date, page = 1, limit = 10 } = req.query;

    const filter = { professional: professional._id };
    if (status) {
      filter.status = status;
    }
    if (date) {
      const targetDate = new Date(date);
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);
      filter['schedule.date'] = {
        $gte: targetDate,
        $lt: nextDate
      };
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate('customer', 'name phone profile.avatar')
      .sort({ 'schedule.date': 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get professional bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      $or: [
        { bookingId: req.params.id },
        { _id: req.params.id }
      ]
    })
    .populate('customer', 'name phone profile')
    .populate('professional', 'user services pricing ratings location')
    .populate({
      path: 'professional',
      populate: {
        path: 'user',
        select: 'name phone profile'
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has access to this booking
    const professional = await Professional.findOne({ user: req.user.userId });
    const hasAccess = booking.customer.toString() === req.user.userId || 
                     (professional && booking.professional._id.toString() === professional._id.toString());

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message
    });
  }
});

// Update booking status
router.put('/:id/status', auth, [
  body('status').isIn(['confirmed', 'assigned', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('note').optional().isString()
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

    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('professional', 'user')
      .populate({
        path: 'professional',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const professional = await Professional.findOne({ user: req.user.userId });
    const isCustomer = booking.customer._id.toString() === req.user.userId;
    const isProfessional = professional && booking.professional._id.toString() === professional._id.toString();

    if (!isCustomer && !isProfessional) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { status, note } = req.body;

    // Update booking status
    await booking.addTimelineEntry(status, note, req.user.userId);

    // Update tracking timestamps
    const now = new Date();
    switch (status) {
      case 'in-progress':
        booking.tracking.workStarted = now;
        break;
      case 'completed':
        booking.tracking.workCompleted = now;
        if (professional) {
          professional.statistics.completedBookings++;
          await professional.save();
        }
        break;
      case 'cancelled':
        booking.cancellation = {
          reason: note,
          cancelledBy: req.user.userId,
          cancelledAt: now
        };
        break;
    }

    await booking.save();

    // Send notifications
    const notificationMessage = `Booking ${booking.bookingId} status updated to: ${status}`;
    
    if (isProfessional) {
      // Notify customer
      await sendSMS(booking.customer.phone, notificationMessage);
    } else if (isCustomer && status === 'cancelled') {
      // Notify professional about cancellation
      await sendSMS(booking.professional.user.phone, notificationMessage);
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, [
  body('reason').notEmpty().withMessage('Cancellation reason is required')
], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user can cancel
    if (booking.customer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Only customer can cancel booking'
      });
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed or already cancelled booking'
      });
    }

    // Calculate cancellation charges
    const now = new Date();
    const bookingTime = new Date(booking.schedule.date);
    const hoursUntilBooking = (bookingTime - now) / (1000 * 60 * 60);

    let refundEligible = false;
    if (hoursUntilBooking > 2) {
      refundEligible = true;
    }

    // Update booking
    booking.status = 'cancelled';
    booking.cancellation = {
      reason: req.body.reason,
      cancelledBy: req.user.userId,
      cancelledAt: now,
      refundEligible
    };

    await booking.addTimelineEntry('cancelled', req.body.reason, req.user.userId);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        bookingId: booking.bookingId,
        refundEligible,
        cancellationCharges: refundEligible ? 0 : booking.pricing.estimatedCost?.min || 0
      }
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
});

// Update location tracking
router.put('/:id/location', auth, [
  body('latitude').isFloat().withMessage('Valid latitude is required'),
  body('longitude').isFloat().withMessage('Valid longitude is required')
], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the assigned professional
    const professional = await Professional.findOne({ user: req.user.userId });
    if (!professional || booking.professional.toString() !== professional._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update location
    booking.tracking.professionalLocation = {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      lastUpdated: new Date()
    };

    await booking.save();

    res.json({
      success: true,
      message: 'Location updated successfully'
    });

  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location',
      error: error.message
    });
  }
});

module.exports = router;