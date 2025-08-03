import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import config from '../config.js';

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new Admin({
      username: 'admin',
      password: 'AdminJobs2024!', // Change this password!
      email: 'admin@jobs-europa.com',
      role: 'super_admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('Username: admin');
    console.log('Password: AdminJobs2024!');
    console.log('⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin(); 