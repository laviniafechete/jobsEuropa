import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job.js';

// Load environment variables
dotenv.config();

async function fixJobs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobs-europa');
    console.log('✅ Connected to MongoDB');

    // First, let's see what we have
    const allJobs = await Job.find({});
    console.log(`📊 Found ${allJobs.length} total jobs`);

    // Count active/inactive jobs
    const activeJobs = await Job.countDocuments({ isActive: true });
    const inactiveJobs = await Job.countDocuments({ isActive: false });
    const undefinedActiveJobs = await Job.countDocuments({ isActive: { $exists: false } });

    console.log(`📈 Current status:`);
    console.log(`   Active jobs (isActive=true): ${activeJobs}`);
    console.log(`   Inactive jobs (isActive=false): ${inactiveJobs}`);
    console.log(`   Jobs without isActive field: ${undefinedActiveJobs}`);

    // Update all jobs to be active
    const updateResult = await Job.updateMany(
      {},
      { $set: { isActive: true } }
    );

    console.log(`✅ Updated ${updateResult.modifiedCount} jobs to be active`);

    // Also ensure they have status = 'active' for admin panel
    const statusUpdateResult = await Job.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'active' } }
    );

    console.log(`✅ Updated ${statusUpdateResult.modifiedCount} jobs to have status 'active'`);

    // Verify the changes
    const finalActiveJobs = await Job.countDocuments({ isActive: true });
    const finalStatusActiveJobs = await Job.countDocuments({ status: 'active' });

    console.log(`\n🎉 Final results:`);
    console.log(`   Jobs with isActive=true: ${finalActiveJobs}`);
    console.log(`   Jobs with status='active': ${finalStatusActiveJobs}`);

    // Show a sample job
    const sampleJob = await Job.findOne({}).populate('employer', 'companyName');
    if (sampleJob) {
      console.log(`\n📋 Sample job:`);
      console.log(`   Title: ${sampleJob.title}`);
      console.log(`   Company: ${sampleJob.employer?.companyName || 'Unknown'}`);
      console.log(`   IsActive: ${sampleJob.isActive}`);
      console.log(`   Status: ${sampleJob.status}`);
      console.log(`   Category: ${sampleJob.category}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

fixJobs(); 