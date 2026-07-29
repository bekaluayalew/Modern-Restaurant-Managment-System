const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const testData = {
  product: {
    name: 'Integration Test Coffee',
    description: 'This is a test product for integration testing',
    price: 5.99,
    category: 'Coffee',
    stock: 20
  },
  user: {
    username: 'testuser',
    email: 'test@example.com',
    password: 'testpassword123',
    role: 'customer'
  },
  admin: {
    username: 'testadmin',
    email: 'admin@test.com',
    password: 'adminpassword123',
    role: 'admin'
  }
};

const createTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create test user
    const user = await User.create(testData.user);
    console.log('✅ Test user created');

    // Create test admin
    const admin = await User.create(testData.admin);
    console.log('✅ Test admin created');

    // Create test product
    const product = await Product.create(testData.product);
    console.log('✅ Test product created');

    console.log('\n📋 Test Data Created:');
    console.log(`   Product ID: ${product._id}`);
    console.log(`   User ID: ${user._id}`);
    console.log(`   Admin ID: ${admin._id}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test data:', error);
    process.exit(1);
  }
};

createTestData();