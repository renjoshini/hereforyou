const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
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
  service: {
    type: String,
    required: true,
    enum: [
      'plumbing', 'electrical', 'ac-repair', 'appliance-repair',
      'house-cleaning', 'car-repair', 'gardening', 'pest-control',
      'caretaker', 'cook', 'maid', 'laundry', 'healthcare',
      'babysitting', 'tailoring', 'other'
    ]
  },
  serviceDetails: {
    type: String,
    description: String,
    urgency: {
      type: String,
      enum: ['normal', 'urgent', 'emergency'],
      default: 'normal'
    },
    estimatedDuration: Number, // in hours
    specialInstructions: String
  },
  schedule: {
    date: {
      type: Date,
      required: true
    },
    timeSlot: {
      start: String,
      end: String
    },
    isFlexible: {
      type: Boolean,
      default: false
    }
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    landmarks: String
  },
  contact: {
    name: String,
    phone: String,
    alternatePhone: String
  },
  pricing: {
    estimatedCost: {
      min: Number,
      max: Number
    },
    actualCost: Number,
    breakdown: [{
      item: String,
      cost: Number
    }],
    currency: {
      type: String,
      default: 'INR'
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'upi', 'card', 'wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    refundAmount: Number,
    refundReason: String
  },
  status: {
    type: String,
    enum: [
      'pending', 'confirmed', 'assigned', 'in-progress', 
      'completed', 'cancelled', 'rescheduled'
    ],
    default: 'pending'
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  tracking: {
    professionalLocation: {
      latitude: Number,
      longitude: Number,
      lastUpdated: Date
    },
    estimatedArrival: Date,
    actualArrival: Date,
    workStarted: Date,
    workCompleted: Date
  },
  cancellation: {
    reason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    refundEligible: {
      type: Boolean,
      default: false
    }
  },
  feedback: {
    customerRating: {
      type: Number,
      min: 1,
      max: 5
    },
    customerReview: String,
    professionalFeedback: String,
    images: [String]
  },
  commission: {
    rate: {
      type: Number,
      default: 15 // percentage
    },
    amount: Number
  }
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ professional: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'schedule.date': 1 });
bookingSchema.index({ 'location.pincode': 1 });

// Pre-save middleware to generate booking ID
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Method to add timeline entry
bookingSchema.methods.addTimelineEntry = function(status, note, updatedBy) {
  this.timeline.push({
    status,
    note,
    updatedBy,
    timestamp: new Date()
  });
  this.status = status;
  return this.save();
};

// Method to calculate commission
bookingSchema.methods.calculateCommission = function() {
  if (this.pricing.actualCost) {
    this.commission.amount = (this.pricing.actualCost * this.commission.rate) / 100;
  }
  return this.commission.amount;
};

module.exports = mongoose.model('Booking', bookingSchema);