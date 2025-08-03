import mongoose from 'mongoose';
import config from '../config.js';
import Job from '../models/Job.js';

async function checkJobs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get all jobs and check their structure
    const jobs = await Job.find({}).limit(3);
    console.log(`📊 Found ${jobs.length} jobs (showing first 3):`);

    jobs.forEach((job, index) => {
      console.log(`\n${index + 1}. Job: ${job.title}`);
      console.log(`   ID: ${job._id}`);
      console.log(`   Employer: ${job.employer}`);
      console.log(`   Status: ${job.status}`);
      console.log(`   IsActive: ${job.isActive}`);
      console.log(`   Category: ${job.category}`);
      console.log(`   Created: ${job.createdAt}`);
    });

    // Check total count
    const totalJobs = await Job.countDocuments({});
    const activeJobs = await Job.countDocuments({ isActive: true });
    const statusActiveJobs = await Job.countDocuments({ status: 'active' });

    console.log(`\n📈 Statistics:`);
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

checkJobs(); 