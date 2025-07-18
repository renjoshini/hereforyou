const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional',
    required: true
  },
  rating: {
    overall: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    punctuality: {
      type: Number,
      min: 1,
      max: 5
    },
    quality: {
      type: Number,
      min: 1,
      max: 5
    },
    behavior: {
      type: Number,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  review: {
    title: String,
    comment: {
      type: String,
      maxlength: [1000, 'Review cannot exceed 1000 characters']
    },
    pros: [String],
    cons: [String]
  },
  images: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  },
  response: {
    comment: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ professional: 1, createdAt: -1 });
reviewSchema.index({ customer: 1 });
reviewSchema.index({ booking: 1 });
reviewSchema.index({ 'rating.overall': -1 });
reviewSchema.index({ isPublic: 1, isVerified: 1 });

// Method to mark as helpful
reviewSchema.methods.markHelpful = function() {
  this.helpfulVotes++;
  return this.save();
};

// Method to report review
reviewSchema.methods.report = function() {
  this.reportCount++;
  if (this.reportCount >= 5) {
    this.isPublic = false;
  }
  return this.save();
};

module.exports = mongoose.model('Review', reviewSchema);