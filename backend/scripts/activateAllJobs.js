import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job.js';

// Load environment variables
dotenv.config();

async function activateAllJobs() {
  try {
    // Connect to MongoDB using the same connection as the app
    const connectionString = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobs-europa';
    await mongoose.connect(connectionString);
    console.log('✅ Connected to MongoDB');

    // Get current stats
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ isActive: true });
    const inactiveJobs = await Job.countDocuments({ isActive: false });
    const undefinedActiveJobs = await Job.countDocuments({ isActive: { $exists: false } });

    console.log(`📊 Current job status:`);
    console.log(`   Total jobs: ${totalJobs}`);
    console.log(`   Active jobs (isActive=true): ${activeJobs}`);
    console.log(`   Inactive jobs (isActive=false): ${inactiveJobs}`);
    console.log(`   Jobs without isActive field: ${undefinedActiveJobs}`);

    // Update all jobs to be active
    const result = await Job.updateMany(
      {},
      { 
        $set: { 
          isActive: true
        } 
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} jobs to be active`);

    // Verify the changes
    const finalActiveJobs = await Job.countDocuments({ isActive: true });
    console.log(`🎉 Final result: ${finalActiveJobs}/${totalJobs} jobs are now active`);

    // Show sample job data
    const sampleJob = await Job.findOne({}).populate('employer', 'companyName companyProfile').lean();
    if (sampleJob) {
      console.log(`\n📋 Sample job after update:`);
      console.log(`   Title: ${sampleJob.title}`);
      console.log(`   Company: ${sampleJob.employer?.companyName || sampleJob.employer?.companyProfile?.name || 'Unknown'}`);
      console.log(`   IsActive: ${sampleJob.isActive}`);
      console.log(`   Category: ${sampleJob.category}`);
      console.log(`   Location: ${sampleJob.location}`);
      console.log(`   Applications: ${sampleJob.applications?.length || 0}`);
      console.log(`   Views: ${sampleJob.views || 0}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

activateAllJobs(); 