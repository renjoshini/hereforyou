const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  services: [{
    type: String,
    required: true,
    enum: [
      'plumbing', 'electrical', 'ac-repair', 'appliance-repair',
      'house-cleaning', 'car-repair', 'gardening', 'pest-control',
      'caretaker', 'cook', 'maid', 'laundry', 'healthcare',
      'babysitting', 'tailoring', 'other'
    ]
  }],
  experience: {
    years: {
      type: Number,
      required: true,
      min: 0,
      max: 50
    },
    description: String
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert'],
      default: 'intermediate'
    }
  }],
  pricing: {
    hourlyRate: {
      type: Number,
      required: true,
      min: 50,
      max: 5000
    },
    minimumCharge: {
      type: Number,
      default: 200
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  availability: {
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    workingHours: {
      start: {
        type: String,
        default: '09:00'
      },
      end: {
        type: String,
        default: '18:00'
      }
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  location: {
    city: {
      type: String,
      required: true
    },
    areas: [String],
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    serviceRadius: {
      type: Number,
      default: 10 // kilometers
    }
  },
  verification: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    documents: {
      aadhar: {
        number: String,
        verified: {
          type: Boolean,
          default: false
        },
        document: String
      },
      pan: {
        number: String,
        verified: {
          type: Boolean,
          default: false
        },
        document: String
      },
      bankAccount: {
        accountNumber: String,
        ifscCode: String,
        accountHolderName: String,
        verified: {
          type: Boolean,
          default: false
        }
      }
    },
    backgroundCheck: {
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
      },
      completedAt: Date
    },
    certificates: [String]
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    breakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  statistics: {
    totalBookings: {
      type: Number,
      default: 0
    },
    completedBookings: {
      type: Number,
      default: 0
    },
    cancelledBookings: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    responseTime: {
      type: Number,
      default: 0 // in minutes
    }
  },
  portfolio: {
    description: String,
    images: [String],
    workSamples: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
professionalSchema.index({ services: 1 });
professionalSchema.index({ 'location.city': 1 });
professionalSchema.index({ 'location.coordinates': '2dsphere' });
professionalSchema.index({ 'ratings.average': -1 });
professionalSchema.index({ 'pricing.hourlyRate': 1 });
professionalSchema.index({ 'verification.status': 1 });

// Method to calculate completion rate
professionalSchema.methods.getCompletionRate = function() {
  if (this.statistics.totalBookings === 0) return 0;
  return (this.statistics.completedBookings / this.statistics.totalBookings) * 100;
};

// Method to update ratings
professionalSchema.methods.updateRating = function(newRating) {
  this.ratings.breakdown[newRating]++;
  this.ratings.count++;
  
  const total = Object.keys(this.ratings.breakdown).reduce((sum, star) => {
    return sum + (parseInt(star) * this.ratings.breakdown[star]);
  }, 0);
  
  this.ratings.average = total / this.ratings.count;
  return this.save();
};

module.exports = mongoose.model('Professional', professionalSchema);