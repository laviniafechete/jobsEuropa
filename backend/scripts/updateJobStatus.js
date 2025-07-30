import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job.js';

// Load environment variables
dotenv.config();

async function updateJobStatus() {
  try {
    // Connect to MongoDB using the same connection as the app
    const connectionString = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobs-europa';
    await mongoose.connect(connectionString);
    console.log('✅ Connected to MongoDB');

    // Update all jobs to have status = 'active'
    const result = await Job.updateMany(
      { status: { $exists: false } },
      { 
        $set: { 
          status: 'active'
        } 
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} jobs to have status 'active'`);

    // Also ensure they remain active
    const activeResult = await Job.updateMany(
      { isActive: true },
      { 
        $set: { 
          status: 'active'
        } 
      }
    );

    console.log(`✅ Updated ${activeResult.modifiedCount} active jobs to have status 'active'`);

    // Verify the changes
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ isActive: true });
    const statusActiveJobs = await Job.countDocuments({ status: 'active' });

    console.log(`\n🎉 Final results:`);
    console.log(`   Total jobs: ${totalJobs}`);
    console.log(`   Jobs with isActive=true: ${activeJobs}`);
    console.log(`   Jobs with status='active': ${statusActiveJobs}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

updateJobStatus(); 