const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Professional = require('../models/Professional');
const User = require('../models/User');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all professionals with filters
router.get('/', [
  query('service').optional().isString(),
  query('city').optional().isString(),
  query('minRating').optional().isFloat({ min: 0, max: 5 }),
  query('maxPrice').optional().isNumeric(),
  query('sortBy').optional().isIn(['rating', 'price', 'experience', 'distance']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
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

    const {
      service,
      city,
      minRating = 0,
      maxPrice,
      sortBy = 'rating',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter query
    const filter = {
      isActive: true,
      'verification.status': 'verified'
    };

    if (service) {
      filter.services = service;
    }

    if (city) {
      filter['location.city'] = new RegExp(city, 'i');
    }

    if (minRating > 0) {
      filter['ratings.average'] = { $gte: parseFloat(minRating) };
    }

    if (maxPrice) {
      filter['pricing.hourlyRate'] = { $lte: parseInt(maxPrice) };
    }

    // Build sort query
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort = { 'ratings.average': -1, 'ratings.count': -1 };
        break;
      case 'price':
        sort = { 'pricing.hourlyRate': 1 };
        break;
      case 'experience':
        sort = { 'experience.years': -1 };
        break;
      default:
        sort = { 'ratings.average': -1 };
    }

    const skip = (page - 1) * limit;

    const professionals = await Professional.find(filter)
      .populate('user', 'name profile.avatar')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Professional.countDocuments(filter);

    res.json({
      success: true,
      data: professionals,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get professionals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch professionals',
      error: error.message
    });
  }
});

// Get professional by ID
router.get('/:id', async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id)
      .populate('user', 'name email phone profile');

    if (!professional) {
      return res.status(404).json({
        success: false,
        message: 'Professional not found'
      });
    }

    res.json({
      success: true,
      data: professional
    });

  } catch (error) {
    console.error('Get professional error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch professional',
      error: error.message
    });
  }
});

// Register as professional
router.post('/register', auth, [
  body('services').isArray({ min: 1 }).withMessage('At least one service is required'),
  body('experience.years').isInt({ min: 0, max: 50 }).withMessage('Experience must be between 0-50 years'),
  body('pricing.hourlyRate').isInt({ min: 50, max: 5000 }).withMessage('Hourly rate must be between ₹50-5000'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('verification.documents.aadhar.number').matches(/^\d{12}$/).withMessage('Valid Aadhar number is required')
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

    // Check if user is already a professional
    const existingProfessional = await Professional.findOne({ user: req.user.userId });
    if (existingProfessional) {
      return res.status(400).json({
        success: false,
        message: 'User is already registered as a professional'
      });
    }

    const professionalData = {
      user: req.user.userId,
      ...req.body
    };

    const professional = new Professional(professionalData);
    await professional.save();

    // Update user role
    await User.findByIdAndUpdate(req.user.userId, { role: 'professional' });

    res.status(201).json({
      success: true,
      message: 'Professional registration submitted successfully',
      data: professional
    });

  } catch (error) {
    console.error('Professional registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register as professional',
      error: error.message
    });
  }
});

// Update professional profile
router.put('/profile', auth, async (req, res) => {
  try {
    const professional = await Professional.findOne({ user: req.user.userId });
    if (!professional) {
      return res.status(404).json({
        success: false,
        message: 'Professional profile not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'services', 'experience', 'skills', 'pricing', 
      'availability', 'location', 'portfolio'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    Object.assign(professional, updates);
    await professional.save();

    res.json({
      success: true,
      message: 'Professional profile updated successfully',
      data: professional
    });

  } catch (error) {
    console.error('Update professional profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update professional profile',
      error: error.message
    });
  }
});

// Upload professional documents
router.post('/documents', auth, upload.fields([
  { name: 'aadhar', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
  { name: 'certificates', maxCount: 5 }
]), async (req, res) => {
  try {
    const professional = await Professional.findOne({ user: req.user.userId });
    if (!professional) {
      return res.status(404).json({
        success: false,
        message: 'Professional profile not found'
      });
    }

    // Update document paths
    if (req.files.aadhar) {
      professional.verification.documents.aadhar.document = `/uploads/${req.files.aadhar[0].filename}`;
    }

    if (req.files.pan) {
      professional.verification.documents.pan.document = `/uploads/${req.files.pan[0].filename}`;
    }

    if (req.files.certificates) {
      const certificatePaths = req.files.certificates.map(file => `/uploads/${file.filename}`);
      professional.verification.certificates.push(...certificatePaths);
    }

    await professional.save();

    res.json({
      success: true,
      message: 'Documents uploaded successfully',
      documents: professional.verification.documents
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload documents',
      error: error.message
    });
  }
});

// Get professional availability
router.get('/:id/availability', async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    if (!professional) {
      return res.status(404).json({
        success: false,
        message: 'Professional not found'
      });
    }

    // Get bookings for the next 30 days
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const Booking = require('../models/Booking');
    const bookings = await Booking.find({
      professional: req.params.id,
      'schedule.date': {
        $gte: startDate,
        $lte: endDate
      },
      status: { $in: ['confirmed', 'in-progress'] }
    }).select('schedule.date schedule.timeSlot');

    // Generate availability calendar
    const availability = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayBookings = bookings.filter(booking => 
        booking.schedule.date.toDateString() === d.toDateString()
      );

      availability.push({
        date: new Date(d),
        isAvailable: dayBookings.length < 8, // Assuming max 8 slots per day
        bookedSlots: dayBookings.length,
        availableSlots: 8 - dayBookings.length
      });
    }

    res.json({
      success: true,
      data: {
        professional: {
          id: professional._id,
          availability: professional.availability,
          workingHours: professional.availability.workingHours
        },
        calendar: availability
      }
    });

  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch availability',
      error: error.message
    });
  }
});

// Update availability status
router.put('/availability', auth, async (req, res) => {
  try {
    const professional = await Professional.findOne({ user: req.user.userId });
    if (!professional) {
      return res.status(404).json({
        success: false,
        message: 'Professional profile not found'
      });
    }

    professional.availability = {
      ...professional.availability,
      ...req.body
    };

    await professional.save();

    res.json({
      success: true,
      message: 'Availability updated successfully',
      availability: professional.availability
    });

  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update availability',
      error: error.message
    });
  }
});

module.exports = router;