import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Employer from '../models/Employer.js';
import Job from '../models/Job.js';
import Cv from '../models/Cv.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Credențiale invalide' });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Credențiale invalide' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT
    const token = jwt.sign(
      { adminId: admin._id, role: admin.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Eroare server' });
  }
};

// Get dashboard analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    console.log('📊 Starting dashboard analytics...');
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Users analytics
    console.log('👥 Counting users...');
    const totalUsers = await User.countDocuments();
    console.log('Total users:', totalUsers);
    const usersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });
    const usersLastMonth = await User.countDocuments({ 
      createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } 
    });
    const verifiedEmailUsers = await User.countDocuments({ emailVerified: true });
    const verifiedPhoneUsers = await User.countDocuments({ phoneVerified: true });

    // Employers analytics
    const totalEmployers = await Employer.countDocuments();
    const employersThisMonth = await Employer.countDocuments({ createdAt: { $gte: startOfMonth } });
    const employersLastMonth = await Employer.countDocuments({ 
      createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } 
    });
    const employersWithProfile = await Employer.countDocuments({ hasProfileCompleted: true });
    const activeSubscriptions = await Employer.countDocuments({ subscriptionActive: true });
    const trialEmployers = await Employer.countDocuments({ 
      subscriptionType: 'trial',
      trialEnd: { $gte: now }
    });

    // Jobs analytics
    const totalJobs = await Job.countDocuments();
    const jobsThisMonth = await Job.countDocuments({ createdAt: { $gte: startOfMonth } });
    const activeJobs = await Job.countDocuments({ status: 'active' });
    
    // Get jobs by category
    const jobsByCategory = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // CVs analytics
    const totalCvs = await Cv.countDocuments();
    const cvsThisMonth = await Cv.countDocuments({ createdAt: { $gte: startOfMonth } });

    // Applications analytics
    const totalApplications = await Job.aggregate([
      { $project: { applicationCount: { $size: '$applications' } } },
      { $group: { _id: null, total: { $sum: '$applicationCount' } } }
    ]);

    // Revenue analytics (basic calculation)
    const basicSubscriptions = await Employer.countDocuments({ subscriptionType: 'basic' });
    const premiumSubscriptions = await Employer.countDocuments({ subscriptionType: 'premium' });
    const estimatedMonthlyRevenue = (basicSubscriptions * 9.99) + (premiumSubscriptions * 15.99);

    // Recent activity (last 7 days)
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: last7Days } });
    const recentEmployers = await Employer.countDocuments({ createdAt: { $gte: last7Days } });
    const recentJobs = await Job.countDocuments({ createdAt: { $gte: last7Days } });

    // Monthly growth rates
    const userGrowthRate = usersLastMonth > 0 ? ((usersThisMonth - usersLastMonth) / usersLastMonth * 100) : 0;
    const employerGrowthRate = employersThisMonth > 0 ? ((employersThisMonth - employersLastMonth) / employersLastMonth * 100) : 0;

    res.json({
      success: true,
      analytics: {
        overview: {
          totalUsers,
          totalEmployers,
          totalJobs,
          totalCvs,
          totalApplications: totalApplications[0]?.total || 0,
          estimatedMonthlyRevenue
        },
        thisMonth: {
          users: usersThisMonth,
          employers: employersThisMonth,
          jobs: jobsThisMonth,
          cvs: cvsThisMonth
        },
        growth: {
          userGrowthRate: Math.round(userGrowthRate * 100) / 100,
          employerGrowthRate: Math.round(employerGrowthRate * 100) / 100
        },
        users: {
          total: totalUsers,
          verifiedEmail: verifiedEmailUsers,
          verifiedPhone: verifiedPhoneUsers,
          verificationRate: Math.round((verifiedEmailUsers + verifiedPhoneUsers) / totalUsers * 100)
        },
        employers: {
          total: totalEmployers,
          withProfile: employersWithProfile,
          activeSubscriptions,
          trialEmployers,
          profileCompletionRate: Math.round(employersWithProfile / totalEmployers * 100)
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          byCategory: jobsByCategory
        },
        recentActivity: {
          users: recentUsers,
          employers: recentEmployers,
          jobs: recentJobs
        }
      }
    });
  } catch (error) {
    console.error('❌ Dashboard analytics error:', error);
    res.status(500).json({ success: false, message: 'Eroare la încărcarea datelor' });
  }
};

// Get detailed user analytics
const getUserAnalytics = async (req, res) => {
  try {
    console.log('👥 Fetching user analytics...');
    const users = await User.find()
      .select('firstName lastName name email phone emailVerified phoneVerified createdAt appliedJobs')
      .sort({ createdAt: -1 })
      .limit(100);
    
    console.log('👥 Found users:', users.length);

    // Registration trends (last 12 months)
    console.log('📊 Calculating registration trends...');
    const registrationTrends = await User.aggregate([
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    console.log('📊 Registration trends:', registrationTrends.length);
    console.log('✅ Returning user analytics data');

    res.json({
      success: true,
      data: {
        users,
        registrationTrends
      }
    });
  } catch (error) {
    console.error('❌ User analytics error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ success: false, message: 'Eroare la încărcarea datelor utilizatori' });
  }
};

// Get detailed employer analytics
const getEmployerAnalytics = async (req, res) => {
  try {
    const employers = await Employer.find()
      .select('companyProfile subscriptionType subscriptionActive trialEnd createdAt hasProfileCompleted')
      .sort({ createdAt: -1 })
      .limit(100);

    // Subscription trends
    const subscriptionTrends = await Employer.aggregate([
      {
        $group: {
          _id: '$subscriptionType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        employers,
        subscriptionTrends
      }
    });
  } catch (error) {
    console.error('Employer analytics error:', error);
    res.status(500).json({ success: false, message: 'Eroare la încărcarea datelor angajatori' });
  }
};

export {
  loginAdmin,
  getDashboardAnalytics,
  getUserAnalytics,
  getEmployerAnalytics
}; 