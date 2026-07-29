const mongoose = require('mongoose');
require('dotenv').config();

const monitorDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get database stats
    const db = mongoose.connection.db;
    const stats = await db.stats();

    console.log('\n📊 Database Statistics:');
    console.log(`   Database Name: ${stats.db}`);
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Objects: ${stats.objects}`);
    console.log(`   Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Indexes: ${stats.indexes}`);
    console.log(`   Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);

    // Get collection stats
    const collections = await db.listCollections().toArray();
    console.log('\n📁 Collections:');
    for (const collection of collections) {
      const collStats = await db.collection(collection.name).stats();
      console.log(`   ${collection.name}:`);
      console.log(`      Documents: ${collStats.count}`);
      console.log(`      Size: ${(collStats.size / 1024 / 1024).toFixed(2)} MB`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error monitoring database:', error);
    process.exit(1);
  }
};

monitorDB();