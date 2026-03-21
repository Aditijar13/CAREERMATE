const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  platform: String,
  url: String,
  duration: String,
  level: String,
  skill: String
});

const jobRoleSchema = new mongoose.Schema({
  title: String,
  company: String,
  matchScore: Number,
  requiredSkills: [String],
  missingSkills: [String],
  applyUrl: String,
  salary: String,
  location: String,
  type: String
});

const roadmapPhaseSchema = new mongoose.Schema({
  phase: Number,
  title: String,
  duration: String,
  description: String,
  skills: [String],
  milestones: [String],
  resources: [String],
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  }
});

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: String,
  fileSize: Number,
  rawText: String,

  // ATS Analysis
  atsScore: {
    overall: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 },
    keywords: { type: Number, default: 0 },
    sections: { type: Number, default: 0 },
    readability: { type: Number, default: 0 },
    breakdown: {
      strengths: [String],
      improvements: [String],
      critical: [String]
    }
  },

  // Skills Analysis
  skillsAnalysis: {
    extracted: [String],
    missing: [String],
    recommended: [String],
    trending: [String],
    proficiencyMap: [{
      skill: String,
      level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
      inDemand: Boolean
    }]
  },

  // Personal Info (extracted)
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    location: String,
    summary: String
  },

  // Experience & Education (extracted)
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],
  education: [{
    degree: String,
    institution: String,
    year: String
  }],

  // AI Recommendations
  courseRecommendations: [courseSchema],
  jobRoles: [jobRoleSchema],
  careerRoadmap: [roadmapPhaseSchema],

  // Target role for this analysis
  targetRole: String,

  // Analysis metadata
  analysisStatus: {
    type: String,
    enum: ['pending', 'analyzing', 'completed', 'failed'],
    default: 'pending'
  },
  analysisError: String,
  analyzedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
