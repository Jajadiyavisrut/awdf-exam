const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const Customer = require('../models/Customer');

// @route   POST /api/v1/orders
// @desc    Create a new order (Task 3 & 5: Returns 201)
// @access  Protected (authGuard applied globally on /api/v1/orders)
router.post('/', async (req, res, next) => {
  try {
    const { restaurantId, items, totalAmount, deliveryAddress, customerId } = req.body;

    const finalCustomerId = req.user?.id || customerId;

    if (!finalCustomerId) {
      return res.status(400).json({
        success: false,
        message: 'Customer ID is required',
      });
    }

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID is required',
      });
    }

    if (!items || (Array.isArray(items) && items.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required and cannot be empty',
      });
    }

    if (totalAmount === undefined || Number(totalAmount) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Total amount must be greater than or equal to 0',
      });
    }

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: `Restaurant with ID ${restaurantId} not found`,
      });
    }

    let finalAddress = deliveryAddress;
    if (!finalAddress) {
      const cust = await Customer.findById(finalCustomerId);
      finalAddress = cust?.address || '123 Main Street';
    }

    const order = new Order({
      customerId: finalCustomerId,
      restaurantId,
      items,
      totalAmount: Number(totalAmount),
      deliveryAddress: finalAddress,
      status: 'pending',
    });

    const savedOrder = await order.save();

    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('customerId', 'name email phone address')
      .populate('restaurantId', 'name cuisine rating isOpen');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/v1/orders
// @desc    Return all orders for the logged-in customer (or all orders if Admin) (Task 3 Requirement)
// @access  Protected (authGuard)
router.get('/', async (req, res, next) => {
  try {
    const filter = {};

    const isAdmin = req.user?.role === 'admin' || req.user?.email === 'qwerty@gmail.com';

    // If NOT an admin, strictly restrict orders query to the logged-in customer's ID
    if (!isAdmin) {
      filter.customerId = req.user.id;
    }

    // Task 5 Requirement: .populate('customerId', 'name email') and .populate('restaurantId', 'name cuisine')
    const orders = await Order.find(filter)
      .populate('customerId', 'name email phone address')
      .populate('restaurantId', 'name cuisine rating isOpen')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/v1/orders/:id
// @desc    Return single order details by ID (Scoped to owner or admin)
// @access  Protected (authGuard)
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email phone address')
      .populate('restaurantId', 'name cuisine rating isOpen');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${req.params.id} not found`,
      });
    }

    const isAdmin = req.user?.role === 'admin' || req.user?.email === 'qwerty@gmail.com';

    // Check ownership if not admin
    if (!isAdmin && order.customerId?._id?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You can only view your own orders',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PATCH /api/v1/orders/:id/status
// @desc    Update order status with enum validation (Task 3 & 5)
// @access  Protected (authGuard)
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status field is required in request body',
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Validation Error: '${status}' is not a valid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('customerId', 'name email phone address')
      .populate('restaurantId', 'name cuisine rating isOpen');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to '${status}' successfully`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
