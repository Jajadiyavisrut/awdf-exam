require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const requestLogger = require('./middleware/requestLogger');
const authGuard = require('./middleware/authGuard');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Model for auto-seeding verification
const Restaurant = require('./models/Restaurant');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB using connection string stored in .env (Task 5)
connectDB();

// Global Middlewares (Task 3)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger); // Global request logger: [METHOD] [PATH] [TIMESTAMP]

// Health check / root route
app.get('/', (req, res) => {
  res.json({
    message: 'QuickBite Food Ordering API is running',
    version: 'v1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      restaurants: '/api/v1/restaurants',
      orders: '/api/v1/orders',
    },
  });
});

// API Routes
// Public Routes:
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);

// Protected Routes: (Task 3 Hint: app.use('/api/v1/orders', authGuard, orderRouter))
app.use('/api/v1/orders', authGuard, orderRoutes);

// Centralized Global Error Handler (Last middleware in app)
app.use(errorHandler);

// Auto-seed default restaurants if empty on start
const checkAndSeedDefaults = async () => {
  try {
    const count = await Restaurant.countDocuments();
    if (count === 0) {
      console.log('No restaurants found in database. Seeding initial restaurants...');
      await Restaurant.insertMany([
        { name: 'Spicy Delight Bistro', cuisine: 'North Indian', rating: 4.6, isOpen: true },
        { name: 'Bella Italia Trattoria', cuisine: 'Italian & Pizza', rating: 4.8, isOpen: true },
        { name: 'Tokyo Wok Express', cuisine: 'Japanese & Pan-Asian', rating: 4.5, isOpen: true },
        { name: 'Green Leaf Vegan Café', cuisine: 'Healthy & Continental', rating: 4.3, isOpen: false },
        { name: 'Tandoori Junction', cuisine: 'Mughlai & Biryani', rating: 4.7, isOpen: true },
        { name: 'Sweet Tooth Dessert Lab', cuisine: 'Bakery & Desserts', rating: 4.9, isOpen: true },
      ]);
      console.log('Initial restaurants seeded successfully.');
    }
  } catch (err) {
    console.warn('Initial seeding check notice:', err.message);
  }
};

app.listen(PORT, async () => {
  console.log(`===========================================`);
  console.log(` QuickBite Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Base API URL: http://localhost:${PORT}/api/v1`);
  console.log(`===========================================`);
  await checkAndSeedDefaults();
});
