const express = require('express');
const router = express.Router();
const { generateRoadmap, getJobs, getStats } = require('../controllers/careerController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/roadmap', generateRoadmap);
router.post('/jobs', getJobs);
router.get('/stats', getStats);

module.exports = router;
