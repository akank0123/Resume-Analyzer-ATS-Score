const fs = require('fs');
const Analysis = require('../models/Analysis');
const { parseResume, extractSections } = require('../services/resumeParser');
const {
  analyzeKeywords,
  extractSkillsFromResume,
  calculateSkillsScore,
  calculateFormatScore,
  calculateExperienceScore,
  calculateEducationScore,
  calculateContentQualityScore,
  computeOverallScore,
  getScoreLabel,
} = require('../services/atsScorer');
const { generateAISuggestions, generateCoverLetter, rewriteBullets, getActiveProvider } = require('../ai');

async function analyzeResume(req, res, next) {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No resume file uploaded' });
    }

    filePath = req.file.path;
    const { jobDescription = '', jobTitle = '' } = req.body;

    const resumeText = await parseResume(filePath);
    if (!resumeText || resumeText.length < 50) {
      return res.status(422).json({ success: false, message: 'Could not extract text from resume. Please ensure the file is not password protected.' });
    }

    const hasJobDescription = jobDescription && jobDescription.trim().length >= 10;

    const sections              = extractSections(resumeText);
    const { matched, missing, keywordScore } = analyzeKeywords(resumeText, jobDescription);
    const extractedSkills       = extractSkillsFromResume(resumeText);
    const skillsScore           = calculateSkillsScore(extractedSkills, keywordScore, hasJobDescription);
    const structureScore        = calculateFormatScore(resumeText, sections);
    const experienceScore       = calculateExperienceScore(resumeText);
    const educationScore        = calculateEducationScore(resumeText);
    const contentQualityScore   = calculateContentQualityScore(resumeText);

    const dimensionScores = {
      keyword:        keywordScore,
      skills:         skillsScore,
      structure:      structureScore,
      experience:     experienceScore,
      education:      educationScore,
      contentQuality: contentQualityScore,
    };

    const overallScore = computeOverallScore(dimensionScores, hasJobDescription);
    const scoreLabel   = getScoreLabel(overallScore);

    const sectionScores = [
      hasJobDescription
        ? { name: 'Keyword Matching',  score: keywordScore,        maxScore: 100, feedback: keywordScore >= 70        ? 'Strong keyword alignment with job description'         : 'Add more relevant keywords from the job description' }
        : { name: 'Keyword Matching',  score: null,                maxScore: 100, feedback: 'Add a job description to enable keyword matching' },
      { name: 'Skills Relevance',      score: skillsScore,         maxScore: 100, feedback: skillsScore >= 70         ? 'Good technical skills coverage'                        : 'Expand your skills section with more relevant technologies' },
      { name: 'Resume Structure',      score: structureScore,      maxScore: 100, feedback: structureScore >= 70      ? 'Well-structured and complete resume'                   : 'Add all key sections and complete contact information' },
      { name: 'Experience Quality',    score: experienceScore,     maxScore: 100, feedback: experienceScore >= 70     ? 'Strong experience with measurable achievements'        : 'Quantify achievements and use strong action verbs' },
      { name: 'Education',             score: educationScore,      maxScore: 100, feedback: educationScore >= 70      ? 'Education section is well documented'                  : 'Add degree, institution, and relevant certifications' },
      { name: 'Content Quality',       score: contentQualityScore, maxScore: 100, feedback: contentQualityScore >= 70 ? 'Content is clear, varied, and impactful'               : 'Use diverse action verbs and remove filler phrases' },
    ];

    const aiResult = await generateAISuggestions(
      resumeText,
      jobDescription,
      { overall: overallScore, keyword: keywordScore, format: structureScore, skills: skillsScore, experience: experienceScore },
      matched,
      missing
    );

    const aiProvider = aiResult.provider || getActiveProvider();

    const analysis = await Analysis.create({
      resumeFileName:   req.file.originalname,
      resumeFilePath:   req.file.filename,
      resumeText:       resumeText.slice(0, 10000),
      jobTitle,
      jobDescription:   jobDescription.slice(0, 5000),
      overallScore,
      atsScore:         overallScore,
      keywordScore,
      formatScore:      structureScore,
      skillsScore,
      experienceScore,
      educationScore,
      contentQualityScore,
      sectionScores,
      matchedKeywords:  matched.slice(0, 30),
      missingKeywords:  missing.slice(0, 20),
      extractedSkills,
      extractedExperience: sections.experience ? [sections.experience.slice(0, 500)] : [],
      extractedEducation:  sections.education  ? [sections.education.slice(0, 300)]  : [],
      aiSuggestions:    [...aiResult.improvements, ...aiResult.keywordTips, ...aiResult.formatTips],
      strengthPoints:   aiResult.strengths,
      improvementAreas: aiResult.improvements,
      aiProvider,
      scoreLabel,
      status: 'completed',
    });

    return res.status(201).json({ success: true, message: 'Resume analyzed successfully', data: analysis });
  } catch (err) {
    console.error('Analysis error:', err);
    next(err);
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, () => {});
    }
  }
}

async function getAnalysisHistory(req, res, next) {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const [analyses, total] = await Promise.all([
      Analysis.find({ status: 'completed' })
        .select('-resumeText -matchedKeywords -missingKeywords -aiSuggestions')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Analysis.countDocuments({ status: 'completed' }),
    ]);

    return res.json({
      success: true,
      data: analyses,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

async function getAnalysisById(req, res, next) {
  try {
    const analysis = await Analysis.findById(req.params.id).lean();
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }
    return res.json({ success: true, data: analysis });
  } catch (err) {
    next(err);
  }
}

async function deleteAnalysis(req, res, next) {
  try {
    const analysis = await Analysis.findByIdAndDelete(req.params.id);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }
    return res.json({ success: true, message: 'Analysis deleted successfully' });
  } catch (err) {
    next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const [totalAnalyses, avgScore, scoreDistribution] = await Promise.all([
      Analysis.countDocuments({ status: 'completed' }),
      Analysis.aggregate([{ $group: { _id: null, avg: { $avg: '$overallScore' } } }]),
      Analysis.aggregate([
        { $group: { _id: '$scoreLabel', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return res.json({
      success: true,
      data: {
        totalAnalyses,
        averageScore: avgScore[0] ? Math.round(avgScore[0].avg) : 0,
        scoreDistribution: scoreDistribution.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function coverLetter(req, res, next) {
  try {
    const analysis = await Analysis.findById(req.params.id).select('resumeText jobDescription jobTitle').lean();
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    const result = await generateCoverLetter(
      analysis.resumeText || '',
      analysis.jobDescription || '',
      analysis.jobTitle || ''
    );

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error('Cover letter error:', err);
    next(err);
  }
}

async function rewriteBulletsHandler(req, res, next) {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Please provide the bullet point text to rewrite' });
    }

    const analysis = await Analysis.findById(req.params.id).select('jobDescription jobTitle').lean();
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    const result = await rewriteBullets(
      text.trim(),
      analysis.jobDescription || '',
      analysis.jobTitle || ''
    );

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error('Rewrite error:', err);
    next(err);
  }
}

module.exports = { analyzeResume, getAnalysisHistory, getAnalysisById, deleteAnalysis, getStats, coverLetter, rewriteBulletsHandler };
