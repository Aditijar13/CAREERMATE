const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { analyzeResume } = require('../utils/aiAnalysis');

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `resume-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'text/plain'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and TXT files are supported'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Upload and analyze
const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded. Please select a PDF or TXT file.' });
  }

  const { targetRole } = req.body;
  const filePath = req.file.path;

  // Create initial record
  const resume = await Resume.create({
    user: req.user._id,
    fileName: req.file.filename,
    originalName: req.file.originalname,
    fileSize: req.file.size,
    targetRole: targetRole?.trim() || req.user.targetRole || '',
    analysisStatus: 'analyzing'
  });

  await User.findByIdAndUpdate(req.user._id, { $push: { resumes: resume._id } });

  try {
    // Extract text
    let rawText = '';
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      rawText = pdfData.text;
    } else {
      rawText = fs.readFileSync(filePath, 'utf8');
    }

    if (!rawText || rawText.trim().length < 50) {
      await Resume.findByIdAndUpdate(resume._id, { analysisStatus: 'failed', analysisError: 'Could not extract enough text from the file. Please ensure the PDF is not scanned/image-based.' });
      return res.status(400).json({ success: false, message: 'Could not extract text from your resume. Please ensure it\'s a text-based PDF, not a scanned image.' });
    }

    // Run AI analysis
    const analysis = await analyzeResume(rawText, targetRole?.trim() || req.user.targetRole);

    const updatedResume = await Resume.findByIdAndUpdate(resume._id, {
      rawText,
      personalInfo: analysis.personalInfo,
      experience: analysis.experience,
      education: analysis.education,
      atsScore: analysis.atsScore,
      skillsAnalysis: analysis.skillsAnalysis,
      courseRecommendations: analysis.courseRecommendations,
      jobRoles: analysis.jobRoles,
      careerRoadmap: analysis.careerRoadmap,
      analysisStatus: 'completed',
      analyzedAt: new Date()
    }, { new: true });

    res.status(201).json({ success: true, message: 'Resume analyzed successfully', resume: updatedResume });

  } catch (error) {
    console.error('Analysis error:', error.message);

    // Clean up failed record
    await Resume.findByIdAndUpdate(resume._id, {
      analysisStatus: 'failed',
      analysisError: error.message
    });

    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch {}
    }

    const userMsg = error.message.includes('rate limit') ? 'AI rate limit reached. Please wait a moment and try again.'
      : error.message.includes('API key') ? 'AI configuration error. Please check your GROQ_API_KEY.'
      : error.message.includes('JSON') ? 'AI returned an unexpected response. Please try again.'
      : 'Resume analysis failed. Please try again.';

    res.status(500).json({ success: false, message: userMsg });
  }
};

const getResumes = async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select('-rawText');
  res.json({ success: true, count: resumes.length, resumes });
};

const getResume = async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
  res.json({ success: true, resume });
};

const deleteResume = async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

  const filePath = path.join(__dirname, '../uploads', resume.fileName);
  if (fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); } catch {}
  }

  await resume.deleteOne();
  await User.findByIdAndUpdate(req.user._id, { $pull: { resumes: resume._id } });
  res.json({ success: true, message: 'Resume deleted successfully' });
};

const updateRoadmapPhase = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

  const phaseIndex = parseInt(req.params.phaseIndex);
  if (isNaN(phaseIndex) || !resume.careerRoadmap[phaseIndex]) {
    return res.status(400).json({ success: false, message: 'Invalid phase index' });
  }

  resume.careerRoadmap[phaseIndex].status = status;
  await resume.save();
  res.json({ success: true, resume });
};

module.exports = { upload, uploadResume, getResumes, getResume, deleteResume, updateRoadmapPhase };
