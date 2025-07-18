const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  icon: String,
  category: {
    type: String,
    enum: ['home-maintenance', 'cleaning', 'repair', 'care', 'automotive', 'other'],
    required: true
  },
  subcategories: [{
    id: String,
    name: String,
    description: String,
    basePrice: {
      min: Number,
      max: Number
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  requirements: [String],
  duration: {
    min: Number, // in hours
    max: Number
  },
  pricing: {
    baseRate: {
      min: Number,
      max: Number
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  availability: {
    cities: [String],
    isEmergencyService: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Indexes
serviceSchema.index({ id: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ 'availability.cities': 1 });

module.exports = mongoose.model('Service', serviceSchema);