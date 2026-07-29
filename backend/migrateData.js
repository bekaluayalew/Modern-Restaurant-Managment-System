const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Add new fields to existing products
const migrateProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update all products
    const result = await Product.updateMany(
      { rating: { $exists: false } },
      {
        $set: {
          rating: 4.5,
          reviews: Math.floor(Math.random() * 50) + 10,
          orders: Math.floor(Math.random() * 30)
        }
      }
    );

    console.log(`✅ Migrated ${result.modifiedCount} products`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

migrateProducts();