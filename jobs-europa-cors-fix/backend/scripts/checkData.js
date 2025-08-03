import mongoose from 'mongoose';
import config from '../config.js';

const checkData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📊 Available collections:');
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await db.collection(collectionName).countDocuments();
      console.log(`  ${collectionName}: ${count} documents`);
      
      // Show sample document for each collection
      if (count > 0) {
        const sample = await db.collection(collectionName).findOne();
        console.log(`    Sample: ${JSON.stringify(sample, null, 2).substring(0, 200)}...`);
      }
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkData(); 