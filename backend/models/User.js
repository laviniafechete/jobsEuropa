import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
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
      required: function() {
        // Phone is required only if email is not provided
        return !this.email;
      },
      validate: {
        validator: function(v) {
          if (!v) return true; // Allow empty if email is provided
          return /^(\+40|0)[0-9]{9}$/.test(v);
        },
        message: 'Phone number must be a valid Romanian number'
      }
    },
    email: { 
      type: String, 
      unique: true, 
      sparse: true,
      required: function() {
        // Email is required only if phone is not provided
        return !this.phone;
      },
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Allow empty if phone is provided
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Email must be a valid email address'
      }
    },
    password: { 
      type: String, 
      required: true,
      minlength: [6, 'Password must be at least 6 characters long']
    },
    name: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    hasCompletedCv: { type: Boolean, default: false },
    appliedJobs: [{ 
      job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
      appliedAt: { type: Date, default: Date.now },
      status: { 
        type: String, 
        enum: ['pending', 'reviewed', 'accepted', 'rejected'],
        default: 'pending'
      }
    }],
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    smsVerificationCode: String,
    smsCodeExpiry: Date,
    cvImageUrl: String
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Custom validation to ensure at least one of email or phone is provided
userSchema.pre('validate', function(next) {
  if (!this.email && !this.phone) {
    this.invalidate('email', 'Either email or phone number is required');
    this.invalidate('phone', 'Either email or phone number is required');
  }
  next();
});

// Indexes for better query performance
userSchema.index({ userId: 1 });
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ resetPasswordToken: 1 });
userSchema.index({ verificationToken: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
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
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate reset token
userSchema.methods.generateResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Method to verify email
userSchema.methods.verifyEmail = function(token) {
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
userSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  delete user.verificationToken;
  delete user.verificationTokenExpires;
  delete user.__v;
  return user;
};

export default mongoose.model("User", userSchema);
