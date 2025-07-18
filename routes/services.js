const express = require('express');
const Service = require('../models/Service');
const Professional = require('../models/Professional');

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ name: 1 });

    res.json({
      success: true,
      data: services
    });

  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findOne({ 
      $or: [
        { id: req.params.id },
        { _id: req.params.id }
      ],
      isActive: true 
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Get professionals count for this service
    const professionalsCount = await Professional.countDocuments({
      services: service.id,
      isActive: true,
      'verification.status': 'verified'
    });

    res.json({
      success: true,
      data: {
        ...service.toObject(),
        professionalsCount
      }
    });

  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
      error: error.message
    });
  }
});

// Get services by category
router.get('/category/:category', async (req, res) => {
  try {
    const services = await Service.find({ 
      category: req.params.category,
      isActive: true 
    }).sort({ name: 1 });

    res.json({
      success: true,
      data: services
    });

  } catch (error) {
    console.error('Get services by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
});

// Search services
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    
    const services = await Service.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { 'subcategories.name': { $regex: searchQuery, $options: 'i' } }
          ]
        }
      ]
    }).sort({ name: 1 });

    res.json({
      success: true,
      data: services,
      query: searchQuery
    });

  } catch (error) {
    console.error('Search services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search services',
      error: error.message
    });
  }
});

module.exports = router;