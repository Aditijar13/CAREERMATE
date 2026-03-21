const express = require('express');
const router = express.Router();
const {
  upload, uploadResume, getResumes, getResume,
  deleteResume, updateRoadmapPhase
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResumes);
router.get('/:id', getResume);
router.delete('/:id', deleteResume);
router.put('/:id/roadmap/:phaseIndex', updateRoadmapPhase);

module.exports = router;
