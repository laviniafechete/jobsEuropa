import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    employer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Employer", 
      required: true 
    },
    title: { 
      type: String, 
      required: true, 
      trim: true,
      maxlength: 100 
    },
    description: { 
      type: String, 
      required: true,
      maxlength: 2000 
    },
    requirements: { 
      type: String,
      maxlength: 1000 
    },
    location: { 
      type: String, 
      required: true,
      trim: true 
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'RON' }
    },
    type: { 
      type: String, 
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      default: 'full-time'
    },
    experience: { 
      type: String, 
      enum: ['entry', 'junior', 'mid', 'senior', 'lead'],
      default: 'entry'
    },
    category: { 
      type: String, 
      required: true,
      trim: true 
    },
    skills: [{ 
      type: String, 
      trim: true 
    }],
    benefits: [{ 
      type: String, 
      trim: true 
    }],
    isActive: { 
      type: Boolean, 
      default: true 
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending', 'expired'],
      default: 'active'
    },
    applications: [{
      user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
      },
      appliedAt: { 
        type: Date, 
        default: Date.now 
      },
      status: { 
        type: String, 
        enum: ['pending', 'reviewed', 'accepted', 'rejected'],
        default: 'pending'
      }
    }],
    views: { 
      type: Number, 
      default: 0 
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
jobSchema.index({ employer: 1, isActive: 1 });
jobSchema.index({ location: 1, isActive: 1 });
jobSchema.index({ category: 1, isActive: 1 });
jobSchema.index({ type: 1, isActive: 1 });
jobSchema.index({ experience: 1, isActive: 1 });
jobSchema.index({ createdAt: -1 });

// Virtual for application count
jobSchema.virtual('applicationCount').get(function() {
  return this.applications.length;
});

// Pre-save middleware to ensure salary consistency
jobSchema.pre('save', function(next) {
  if (this.salary && this.salary.min && this.salary.max) {
    if (this.salary.min > this.salary.max) {
      const temp = this.salary.min;
      this.salary.min = this.salary.max;
      this.salary.max = temp;
    }
  }
  next();
});

export default mongoose.model("Job", jobSchema); 