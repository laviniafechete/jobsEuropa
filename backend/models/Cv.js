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
      nationality: { type: String, trim: true },
      gender: { 
        type: String, 
        enum: ['male', 'female', 'other'],
        trim: true
      }
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
      experience: { 
        type: String,
        trim: true,
        maxlength: [2000, 'Experience description cannot exceed 2000 characters']
      },
      education: { 
        type: String, 
        enum: [
          'fara-studii', 'scoala-primara', 'gimnaziu', 'liceu-profesional', 
          'liceu-bacalaureat', 'scoala-postliceala', 'facultate-licenta', 
          'studii-superioare'
        ],
        trim: true
      }
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
        currency: { type: String, default: 'EUR' }
      },
      salaryExpectation: { 
        type: String, 
        enum: ['sub-1000', '1000-2000', '2000-3000', 'peste-3000', 'negociabil'],
        trim: true
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
    documents: {
      drivingLicense: { type: Boolean, default: false },
      hasPassport: { type: Boolean, default: false },
      willingToRelocate: { type: Boolean, default: false }
    },
    additionalInfo: { 
      type: String, 
      trim: true,
      maxlength: [1000, 'Additional info cannot exceed 1000 characters']
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
cvSchema.index({ 'preferences.interestDomains': 1 });
cvSchema.index({ isPublic: 1 });
cvSchema.index({ lastUpdated: -1 });

// Virtual for years of experience
cvSchema.virtual('yearsOfExperience').get(function() {
  if (!this.professional?.experience) return 0;
  
  // For now, return 0 since experience is stored as a string
  // This can be enhanced later if we store structured experience data
  return 0;
});

// Pre-save middleware to update lastUpdated
cvSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

export default mongoose.model("Cv", cvSchema);
