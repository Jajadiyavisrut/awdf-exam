const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// @route   GET /api/v1/restaurants
// @desc    Get all restaurants (with optional search query)
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { search, cuisine } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
      ];
    }

    if (cuisine) {
      filter.cuisine = { $regex: cuisine, $options: 'i' };
    }

    const restaurants = await Restaurant.find(filter).sort({ rating: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/v1/restaurants/:id
// @desc    Get single restaurant by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: `Restaurant with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/v1/restaurants
// @desc    Create a new restaurant (Helper for adding restaurants)
// @access  Public
router.post('/', async (req, res, next) => {
  try {
    const { name, cuisine, rating, isOpen } = req.body;

    if (!name || !cuisine) {
      return res.status(400).json({
        success: false,
        message: 'Name and cuisine are required',
      });
    }

    const restaurant = await Restaurant.create({
      name: name.trim(),
      cuisine: cuisine.trim(),
      rating: rating !== undefined ? Number(rating) : 4.0,
      isOpen: isOpen !== undefined ? Boolean(isOpen) : true,
    });

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
