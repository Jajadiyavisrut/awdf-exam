require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const Restaurant = require('./models/Restaurant');
const Order = require('./models/Order');

const sampleRestaurants = [
  {
    name: 'Spicy Delight Bistro',
    cuisine: 'North Indian',
    rating: 4.6,
    isOpen: true,
  },
  {
    name: 'Bella Italia Trattoria',
    cuisine: 'Italian & Pizza',
    rating: 4.8,
    isOpen: true,
  },
  {
    name: 'Tokyo Wok Express',
    cuisine: 'Japanese & Pan-Asian',
    rating: 4.5,
    isOpen: true,
  },
  {
    name: 'Green Leaf Vegan Café',
    cuisine: 'Healthy & Continental',
    rating: 4.3,
    isOpen: false,
  },
  {
    name: 'Tandoori Junction',
    cuisine: 'Mughlai & Biryani',
    rating: 4.7,
    isOpen: true,
  },
  {
    name: 'Sweet Tooth Dessert Lab',
    cuisine: 'Bakery & Desserts',
    rating: 4.9,
    isOpen: true,
  },
];

const seedData = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      'mongodb://127.0.0.1:27017/awdf-exam';

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding...');

    await Restaurant.deleteMany({});
    await Customer.deleteMany({});
    await Order.deleteMany({});

    const insertedRestaurants = await Restaurant.insertMany(sampleRestaurants);
    console.log(`Seeded ${insertedRestaurants.length} restaurants.`);

    // 1. Seed Regular Customer
    const insertedCustomer = await Customer.create({
      name: 'Visrut Jajadiya',
      email: 'visrut@example.com',
      password: 'Visrut@12345',
      phone: '+91 98765 43210',
      address: 'Room 304, Campus Towers, Tech City',
      role: 'customer',
    });
    console.log(`Seeded test customer: ${insertedCustomer.email}`);

    // 2. Seed Admin User (qwerty@gmail.com / qwertyuiop@12345)
    const insertedAdmin = await Customer.create({
      name: 'System Admin',
      email: 'qwerty@gmail.com',
      password: 'qwertyuiop@12345',
      phone: '+91 99999 88888',
      address: 'QuickBite Central Headquarters',
      role: 'admin',
    });
    console.log(`Seeded admin user: ${insertedAdmin.email} (Role: admin)`);

    // 3. Seed Sample Order
    const sampleOrder = await Order.create({
      customerId: insertedCustomer._id,
      restaurantId: insertedRestaurants[0]._id,
      items: [
        { name: 'Paneer Butter Masala', quantity: 2, price: 240 },
        { name: 'Butter Naan (2 pcs)', quantity: 2, price: 80 },
      ],
      totalAmount: 640,
      status: 'preparing',
      deliveryAddress: insertedCustomer.address,
    });
    console.log(`Seeded sample order ID: ${sampleOrder._id}`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
