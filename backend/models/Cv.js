import mongoose from "mongoose";

const cvSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      unique: true 
    },
    personalInfo: {
      name: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
      },
      email: { 
        type: String, 
        lowercase: true,
        trim: true
      },
      phone: { 
        type: String, 
        required: true,
        trim: true
      },
      location: { 
        type: String, 
        required: true,
        trim: true
      },
      profilePicture: { type: String }, // path to image
      dateOfBirth: { type: Date },
      nationality: { type: String, trim: true }
    },
    professional: {
      title: { 
        type: String, 
        trim: true,
        maxlength: [100, 'Professional title cannot exceed 100 characters']
      },
      summary: { 
        type: String,
        maxlength: [500, 'Summary cannot exceed 500 characters']
      },
      experience: [{ 
        company: { type: String, required: true, trim: true },
        position: { type: String, required: true, trim: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        description: { type: String, maxlength: 1000 },
        achievements: [{ type: String, trim: true }]
      }],
      education: [{
        institution: { type: String, required: true, trim: true },
        degree: { type: String, required: true, trim: true },
        field: { type: String, required: true, trim: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        gpa: { type: Number, min: 0, max: 10 }
      }]
    },
    skills: {
      technical: [{ type: String, trim: true }],
      soft: [{ type: String, trim: true }],
      languages: [{
        language: { type: String, required: true, trim: true },
        level: { 
          type: String, 
          enum: ['incepator', 'conversational', 'mediu', 'avansat', 'nativ'],
          default: 'mediu'
        }
      }]
    },
    preferences: {
      desiredSalary: {
        min: { type: Number },
        max: { type: Number },
        currency: { type: String, default: 'RON' }
      },
      workType: [{ 
        type: String, 
        enum: ['full-time', 'part-time', 'contract', 'remote', 'hybrid', 'flexible'],
        default: 'full-time'
      }],
      availability: { 
        type: String, 
        enum: ['immediate', '1week', '2weeks', '1month', 'flexible'],
        default: 'immediate'
      },
      preferredLocations: [{ type: String, trim: true }],
      industries: [{ type: String, trim: true }],
      interestDomains: [{ type: String, trim: true }]
    },
    certifications: [{
      name: { type: String, required: true, trim: true },
      issuer: { type: String, required: true, trim: true },
      date: { type: Date, required: true },
      expiryDate: { type: Date },
      credentialId: { type: String, trim: true }
    }],
    isPublic: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
cvSchema.index({ user: 1 });
cvSchema.index({ 'personalInfo.location': 1 });
cvSchema.index({ 'skills.technical': 1 });
cvSchema.index({ isPublic: 1 });
cvSchema.index({ lastUpdated: -1 });

// Virtual for years of experience
cvSchema.virtual('yearsOfExperience').get(function() {
  if (!this.professional?.experience?.length) return 0;
  
  const totalMonths = this.professional.experience.reduce((total, exp) => {
    const start = new Date(exp.startDate);
    const end = exp.current ? new Date() : new Date(exp.endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    return total + Math.max(0, months);
  }, 0);
  
  return Math.floor(totalMonths / 12);
});

// Pre-save middleware to update lastUpdated
cvSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

export default mongoose.model("Cv", cvSchema);
