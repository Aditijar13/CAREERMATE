const { generateCareerRoadmap, getJobRecommendations } = require('../utils/aiAnalysis');
const Resume = require('../models/Resume');

// @desc    Generate custom career roadmap
// @route   POST /api/career/roadmap
const generateRoadmap = async (req, res) => {
  const { skills, targetRole, yearsOfExperience } = req.body;

  if (!targetRole) {
    return res.status(400).json({ success: false, message: 'Target role is required' });
  }

  const result = await generateCareerRoadmap(
    skills || [],
    targetRole,
    yearsOfExperience || 0
  );

  res.json({ success: true, ...result });
};

// @desc    Get job recommendations
// @route   POST /api/career/jobs
const getJobs = async (req, res) => {
  const { skills, targetRole, location } = req.body;

  const result = await getJobRecommendations(
    skills || [],
    targetRole || 'Software Engineer',
    location || 'Remote'
  );

  res.json({ success: true, ...result });
};

// @desc    Get career stats for dashboard
// @route   GET /api/career/stats
const getStats = async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id, analysisStatus: 'completed' });
  
  if (resumes.length === 0) {
    return res.json({
      success: true,
      stats: {
        totalResumes: 0,
        avgAtsScore: 0,
        topSkills: [],
        latestAnalysis: null
      }
    });
  }

  const avgAtsScore = Math.round(
    resumes.reduce((acc, r) => acc + (r.atsScore?.overall || 0), 0) / resumes.length
  );

  const allSkills = resumes.flatMap(r => r.skillsAnalysis?.extracted || []);
  const skillCounts = allSkills.reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {});
  const topSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));

  const latest = resumes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  res.json({
    success: true,
    stats: {
      totalResumes: resumes.length,
      avgAtsScore,
      topSkills,
      latestAnalysis: {
        id: latest._id,
        atsScore: latest.atsScore?.overall,
        targetRole: latest.targetRole,
        analyzedAt: latest.analyzedAt
      }
    }
  });
};

module.exports = { generateRoadmap, getJobs, getStats };
