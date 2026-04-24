const express = require('express');
const upload = require('../middleware/upload');
const {
  analyzeResume,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
  getStats,
  coverLetter,
  rewriteBulletsHandler,
} = require('../controllers/resumeController');

const router = express.Router();

router.post('/analyze', upload.single('resume'), analyzeResume);
router.get('/history', getAnalysisHistory);
router.get('/stats', getStats);
router.get('/:id', getAnalysisById);
router.delete('/:id', deleteAnalysis);
router.post('/:id/cover-letter', coverLetter);
router.post('/:id/rewrite', rewriteBulletsHandler);

module.exports = router;
