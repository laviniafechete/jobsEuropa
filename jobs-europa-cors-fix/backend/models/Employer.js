import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

const employerSchema = new mongoose.Schema(
  {
    userId: { 
      type: String, 
      unique: true, 
      default: () => uuidv4(),
      index: true
    },
    phone: { 
      type: String, 
      unique: true, 
      sparse: true,
      validate: {
        validator: function(v) {
          return /^(\+40|0)[0-9]{9}$/.test(v);
        },
        message: 'Phone number must be a valid Romanian number'
      }
    },
    password: { 
      type: String, 
      required: true,
      minlength: [6, 'Password must be at least 6 characters long']
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Email must be a valid email address'
      }
    },
    companyName: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    hasProfileCompleted: { type: Boolean, default: false },
    companyProfile: {
      name: { type: String, trim: true },
      cui: { type: String, trim: true },
      location: { type: String, trim: true },
      domain: { type: String, trim: true },
      description: { type: String, maxlength: 2000 },
      logoUrl: { type: String, trim: true },
      contactPerson: { type: String, trim: true },
      position: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      website: { type: String, trim: true }
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    subscriptionType: {
      type: String,
      enum: ['none', 'basic', 'premium'],
      default: 'none',
    },
    subscriptionActive: {
      type: Boolean,
      default: false,
    },
    trialStart: {
      type: Date,
      default: Date.now,
    },
    trialEnd: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 zile trial
    },
    jobsPostedThisMonth: {
      type: Number,
      default: 0,
    },
    employeesViewedThisMonth: {
      type: Number,
      default: 0,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
employerSchema.index({ userId: 1 });
employerSchema.index({ email: 1 });
employerSchema.index({ phone: 1 });
employerSchema.index({ companyName: 1 });
employerSchema.index({ isActive: 1 });
employerSchema.index({ resetPasswordToken: 1 });
employerSchema.index({ verificationToken: 1 });

// Hash password before saving
employerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
employerSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate reset token
employerSchema.methods.generateResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Method to verify email
employerSchema.methods.verifyEmail = function(token) {
  if (this.verificationToken !== crypto.createHash('sha256').update(token).digest('hex')) {
    return false;
  }
  
  if (this.verificationTokenExpires < Date.now()) {
    return false;
  }
  
  this.emailVerified = true;
  this.verificationToken = undefined;
  this.verificationTokenExpires = undefined;
  return true;
};

// Method to get public profile (without sensitive data)
employerSchema.methods.toPublicJSON = function() {
  const employer = this.toObject();
  delete employer.password;
  delete employer.resetPasswordToken;
  delete employer.resetPasswordExpires;
  delete employer.verificationToken;
  delete employer.verificationTokenExpires;
  delete employer.__v;
  return employer;
};

export default mongoose.model("Employer", employerSchema);
