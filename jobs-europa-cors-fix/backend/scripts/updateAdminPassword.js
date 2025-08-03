import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config.js';

const updateAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find admin collection directly
    const AdminCollection = mongoose.connection.db.collection('admins');
    
    // Hash the password properly
    const plainPassword = 'Stimorol1'; // The password you want to use
    const hashedPassword = await bcrypt.hash(plainPassword, 12);
    
    console.log('📝 Plain password:', plainPassword);
    console.log('🔐 Hashed password:', hashedPassword);

    // Update the admin password
    const result = await AdminCollection.updateOne(
      { username: 'admin' },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Admin password updated successfully');
      console.log(`Username: admin`);
      console.log(`Password: ${plainPassword}`);
    } else {
      console.log('❌ Admin not found or password not updated');
    }

  } catch (error) {
    console.error('❌ Error updating admin password:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateAdminPassword(); 