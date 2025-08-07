import express from 'express';
import { 
  protect, 
  protectEmployer, 
  optionalAuth,
  rateLimit,
  checkEmployerSubscription
} from '../middlewares/authMiddleware.js';
import { asyncHandler, sendSuccess } from '../utils/errorHandler.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Employer from '../models/Employer.js';
import { 
  validateRequired, 
  validateLength, 
  validateEnum, 
  validateArray,
  validateSalary,
  sanitizeInput 
} from '../utils/validation.js';
import { sendJobApplicationNotification } from '../controllers/sendEmail.js';
import { sendApplicationEmail } from '../controllers/sendEmail.js';

const router = express.Router();

// Get all jobs with filtering and pagination
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    location,
    category,
    type,
    experience,
    minSalary,
    maxSalary,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = { isActive: true };
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { requirements: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (location) {
    filter.location = { $regex: location, $options: 'i' };
  }
  
  if (category) {
    filter.category = { $regex: category, $options: 'i' };
  }
  
  if (type) {
    filter.type = type;
  }
  
  if (experience) {
    filter.experience = experience;
  }
  
  if (minSalary || maxSalary) {
    filter.salary = {};
    if (minSalary) filter.salary.$gte = parseInt(minSalary);
    if (maxSalary) filter.salary.$lte = parseInt(maxSalary);
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Execute query
  const jobs = await Job.find(filter)
    .populate('employer', 'companyName companyProfile email phone')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  // Get total count for pagination
  const total = await Job.countDocuments(filter);

  // Increment views for each job
  if (jobs.length > 0) {
    const jobIds = jobs.map(job => job._id);
    await Job.updateMany(
      { _id: { $in: jobIds } },
      { $inc: { views: 1 } }
    );
  }

  // Check if user has applied to each job
  if (req.user && req.userType === 'user') {
    const user = await User.findById(req.user._id).populate('appliedJobs.job');
    const appliedJobIds = user.appliedJobs.map(app => app.job._id.toString());
    
    jobs.forEach(job => {
      job.hasApplied = appliedJobIds.includes(job._id.toString());
    });
  }

  sendSuccess(res, {
    jobs,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalJobs: total,
      hasNext: skip + jobs.length < total,
      hasPrev: parseInt(page) > 1
    }
  }, 'Jobs retrieved successfully');
}));

// Get job by ID
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('employer', 'companyName companyProfile')
    .populate('applications.user', 'name email')
    .lean();

  if (!job) {
    throw new NotFoundError('Job not found');
  }

  // Increment views
  await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

  // Check if user has applied
  if (req.user && req.userType === 'user') {
    const user = await User.findById(req.user._id);
    job.hasApplied = user.appliedJobs.some(app => 
      app.job.toString() === req.params.id
    );
  }

  sendSuccess(res, job, 'Job retrieved successfully');
}));

// Create new job (employer only)
router.post('/', protectEmployer, checkEmployerSubscription, rateLimit(10, 60 * 60 * 1000), asyncHandler(async (req, res) => {
  const {
    title,
    description,
    requirements,
    location,
    salary,
    type,
    experience,
    category,
    skills,
    benefits
  } = req.body;

  // Validation
  validateRequired(title, 'Title');
  validateRequired(description, 'Description');
  validateRequired(location, 'Location');
  validateRequired(category, 'Category');
  
  validateLength(title, 'Title', 1, 100);
  validateLength(description, 'Description', 1, 2000);
  validateLength(requirements, 'Requirements', 0, 1000);
  validateLength(location, 'Location', 1, 100);
  validateLength(category, 'Category', 1, 50);

  if (type) {
    validateEnum(type, 'Type', ['full-time', 'part-time', 'contract', 'internship']);
  }
  
  if (experience) {
    validateEnum(experience, 'Experience', ['entry', 'junior', 'mid', 'senior', 'lead']);
  }

  if (skills) {
    validateArray(skills, 'Competențe', 0, 20);
  }

  if (benefits) {
    validateArray(benefits, 'Benefits', 0, 10);
  }

  validateSalary(salary);

  // Create job
  const job = new Job({
    employer: req.user._id,
    title: sanitizeInput(title),
    description: sanitizeInput(description),
    requirements: requirements ? sanitizeInput(requirements) : undefined,
    location: sanitizeInput(location),
    salary: salary || undefined,
    type: type || 'full-time',
    experience: experience || 'entry',
    category: sanitizeInput(category),
    skills: skills ? skills.map(s => sanitizeInput(s)) : [],
    benefits: benefits ? benefits.map(b => sanitizeInput(b)) : []
  });

  await job.save();

  sendSuccess(res, job, 'Job created successfully', 201);
}));

// Update job (employer only)
router.put('/:id', protectEmployer, asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  
  if (!job) {
    throw new NotFoundError('Job not found');
  }

  // Check if employer owns this job
  if (job.employer.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You can only update your own jobs');
  }

  const {
    title,
    description,
    requirements,
    location,
    salary,
    type,
    experience,
    category,
    skills,
    benefits,
    isActive
  } = req.body;

  // Validation
  if (title) {
    validateLength(title, 'Title', 1, 100);
    job.title = sanitizeInput(title);
  }
  
  if (description) {
    validateLength(description, 'Description', 1, 2000);
    job.description = sanitizeInput(description);
  }
  
  if (requirements !== undefined) {
    validateLength(requirements, 'Requirements', 0, 1000);
    job.requirements = requirements ? sanitizeInput(requirements) : undefined;
  }
  
  if (location) {
    validateLength(location, 'Location', 1, 100);
    job.location = sanitizeInput(location);
  }
  
  if (category) {
    validateLength(category, 'Category', 1, 50);
    job.category = sanitizeInput(category);
  }

  if (type) {
    validateEnum(type, 'Type', ['full-time', 'part-time', 'contract', 'internship']);
    job.type = type;
  }
  
  if (experience) {
    validateEnum(experience, 'Experience', ['entry', 'junior', 'mid', 'senior', 'lead']);
    job.experience = experience;
  }

  if (skills !== undefined) {
    validateArray(skills, 'Competențe', 0, 20);
    job.skills = skills.map(s => sanitizeInput(s));
  }

  if (benefits !== undefined) {
    validateArray(benefits, 'Benefits', 0, 10);
    job.benefits = benefits.map(b => sanitizeInput(b));
  }

  if (salary !== undefined) {
    validateSalary(salary);
    job.salary = salary;
  }

  if (isActive !== undefined) {
    job.isActive = isActive;
  }

  await job.save();

  sendSuccess(res, job, 'Job updated successfully');
}));

// Delete job (employer only)
router.delete('/:id', protectEmployer, asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  
  if (!job) {
    throw new NotFoundError('Job not found');
  }

  // Check if employer owns this job
  if (job.employer.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You can only delete your own jobs');
  }

  await Job.findByIdAndDelete(req.params.id);

  sendSuccess(res, null, 'Job deleted successfully');
}));

// Apply to job (user only)
router.post('/:id/apply', protect, asyncHandler(async (req, res) => {
  if (req.userType !== 'user') {
    throw new AuthorizationError('Only users can apply to jobs');
  }

  const job = await Job.findById(req.params.id);
  
  if (!job) {
    throw new NotFoundError('Job not found');
  }

  if (!job.isActive) {
    throw new Error('This job is no longer active');
  }

  // Check if user already applied
  const hasApplied = job.applications.some(app => 
    app.user.toString() === req.user._id.toString()
  );

  if (hasApplied) {
    throw new Error('You have already applied to this job');
  }

  // Get user and employer details for email
  const user = await User.findById(req.user._id);
  const employer = await Employer.findById(job.employer);

  // Add application to job
  job.applications.push({
    user: req.user._id,
    appliedAt: new Date(),
    status: 'pending'
  });

  await job.save();

  // Add job to user's applied jobs
  await User.findByIdAndUpdate(req.user._id, {
    $push: {
      appliedJobs: {
        job: job._id,
        appliedAt: new Date(),
        status: 'pending'
      }
    }
  });

  // Send email notification to employer
  if (employer && employer.email) {
    const candidateContact = user.email || user.phone || 'Contact indisponibil';
    await sendJobApplicationNotification(
      employer.email,
      job.title,
      user.name,
      candidateContact,
      job.location
    );
    // Trimit și către contact@jobs-europa.com
    await sendApplicationEmail(
      'contact@jobs-europa.com',
      job.title,
      user.name,
      candidateContact,
      job.location
    );
  }

  sendSuccess(res, null, 'Application submitted successfully');
}));

// Get employer's jobs
router.get('/employer/my-jobs', protectEmployer, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  const filter = { employer: req.user._id };
  if (status === 'active') filter.isActive = true;
  if (status === 'inactive') filter.isActive = false;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const jobs = await Job.find(filter)
    .populate('applications.user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  const total = await Job.countDocuments(filter);

  sendSuccess(res, {
    jobs,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalJobs: total
    }
  }, 'Jobs retrieved successfully');
}));

// Update application status (employer only)
router.patch('/:jobId/applications/:applicationId', protectEmployer, asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
    throw new ValidationError('Invalid status');
  }

  const job = await Job.findById(req.params.jobId);
  
  if (!job) {
    throw new NotFoundError('Job not found');
  }

  if (job.employer.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('You can only update applications for your own jobs');
  }

  const application = job.applications.id(req.params.applicationId);
  
  if (!application) {
    throw new NotFoundError('Application not found');
  }

  application.status = status;
  await job.save();

  // Update user's application status
  await User.updateOne(
    { 
      _id: application.user,
      'appliedJobs.job': job._id 
    },
    { 
      $set: { 'appliedJobs.$.status': status } 
    }
  );

  sendSuccess(res, application, 'Application status updated successfully');
}));

export default router; 