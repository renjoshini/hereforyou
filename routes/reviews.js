const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Professional = require('../models/Professional');
const auth = require('../middleware/auth');

const router = express.Router();

// Create review
router.post('/', auth, [
  body('booking').isMongoId().withMessage('Valid booking ID is required'),
  body('professional').isMongoId().withMessage('Valid professional ID is required'),
  body('rating.overall').isInt({ min: 1, max: 5 }).withMessage('Overall rating must be between 1-5'),
  body('review.comment').optional().isLength({ max: 1000 }).withMessage('Review cannot exceed 1000 characters')
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

    // Check if booking exists and belongs to user
    const booking = await Booking.findOne({
      _id: req.body.booking,
      customer: req.user.userId,
      status: 'completed'
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Completed booking not found'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      booking: req.body.booking,
      customer: req.user.userId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already exists for this booking'
      });
    }

    // Create review
    const reviewData = {
      booking: req.body.booking,
      customer: req.user.userId,
      professional: req.body.professional,
      rating: req.body.rating,
      review: req.body.review,
      images: req.body.images || []
    };

    const review = new Review(reviewData);
    await review.save();

    // Update professional rating
    const professional = await Professional.findById(req.body.professional);
    if (professional) {
      await professional.updateRating(req.body.rating.overall);
    }

    // Update booking with feedback
    booking.feedback = {
      customerRating: req.body.rating.overall,
      customerReview: req.body.review.comment,
      images: req.body.images || []
    };
    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
});

// Get reviews for professional
router.get('/professional/:id', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('rating').optional().isInt({ min: 1, max: 5 })
], async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;

    const filter = {
      professional: req.params.id,
      isPublic: true
    };

    if (rating) {
      filter['rating.overall'] = parseInt(rating);
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find(filter)
      .populate('customer', 'name profile.avatar')
      .populate('booking', 'service schedule.date')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(filter);

    // Get rating statistics
    const ratingStats = await Review.aggregate([
      { $match: { professional: mongoose.Types.ObjectId(req.params.id), isPublic: true } },
      {
        $group: {
          _id: '$rating.overall',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      total,
      average: 0,
      breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };

    let totalRating = 0;
    ratingStats.forEach(stat => {
      stats.breakdown[stat._id] = stat.count;
      totalRating += stat._id * stat.count;
    });

    if (total > 0) {
      stats.average = (totalRating / total).toFixed(1);
    }

    res.json({
      success: true,
      data: reviews,
      statistics: stats,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Get user's reviews
router.get('/my-reviews', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ customer: req.user.userId })
      .populate('professional', 'user services')
      .populate({
        path: 'professional',
        populate: {
          path: 'user',
          select: 'name profile.avatar'
        }
      })
      .populate('booking', 'service schedule.date bookingId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ customer: req.user.userId });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Update review
router.put('/:id', auth, [
  body('rating.overall').optional().isInt({ min: 1, max: 5 }),
  body('review.comment').optional().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      customer: req.user.userId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update review
    Object.assign(review, req.body);
    await review.save();

    // Update professional rating if overall rating changed
    if (req.body.rating?.overall) {
      const professional = await Professional.findById(review.professional);
      if (professional) {
        // Recalculate average rating
        const allReviews = await Review.find({ 
          professional: review.professional,
          isPublic: true 
        });
        
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating.overall, 0);
        professional.ratings.average = totalRating / allReviews.length;
        professional.ratings.count = allReviews.length;
        
        await professional.save();
      }
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
});

// Delete review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      customer: req.user.userId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.deleteOne();

    // Update professional rating
    const professional = await Professional.findById(review.professional);
    if (professional) {
      const allReviews = await Review.find({ 
        professional: review.professional,
        isPublic: true 
      });
      
      if (allReviews.length > 0) {
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating.overall, 0);
        professional.ratings.average = totalRating / allReviews.length;
        professional.ratings.count = allReviews.length;
      } else {
        professional.ratings.average = 0;
        professional.ratings.count = 0;
      }
      
      await professional.save();
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
});

// Mark review as helpful
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.markHelpful();

    res.json({
      success: true,
      message: 'Review marked as helpful',
      helpfulVotes: review.helpfulVotes
    });

  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark review as helpful',
      error: error.message
    });
  }
});

// Report review
router.post('/:id/report', auth, [
  body('reason').notEmpty().withMessage('Report reason is required')
], async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.report();

    res.json({
      success: true,
      message: 'Review reported successfully'
    });

  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report review',
      error: error.message
    });
  }
});

module.exports = router;