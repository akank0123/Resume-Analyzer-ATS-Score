const mongoose = require('mongoose');

const KeywordSchema = new mongoose.Schema({
  word: String,
  found: Boolean,
  frequency: { type: Number, default: 0 },
  importance: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
});

const SectionScoreSchema = new mongoose.Schema({
  name: String,
  score: Number,
  maxScore: Number,
  feedback: String,
});

const AnalysisSchema = new mongoose.Schema(
  {
    resumeFileName: { type: String, required: true },
    resumeFilePath: { type: String },
    resumeText: { type: String, required: true },
    jobTitle: { type: String, default: '' },
    jobDescription: { type: String, default: '' },
    overallScore: { type: Number, min: 0, max: 100, default: 0 },
    atsScore: { type: Number, min: 0, max: 100, default: 0 },
    keywordScore: { type: Number, min: 0, max: 100, default: 0 },
    formatScore: { type: Number, min: 0, max: 100, default: 0 },
    skillsScore: { type: Number, min: 0, max: 100, default: 0 },
    experienceScore: { type: Number, min: 0, max: 100, default: 0 },
    educationScore: { type: Number, min: 0, max: 100, default: 0 },
    contentQualityScore: { type: Number, min: 0, max: 100, default: 0 },
    sectionScores: [SectionScoreSchema],
    matchedKeywords: [KeywordSchema],
    missingKeywords: [KeywordSchema],
    extractedSkills: [String],
    extractedExperience: [String],
    extractedEducation: [String],
    aiSuggestions: [String],
    strengthPoints: [String],
    improvementAreas: [String],
    aiProvider: { type: String, enum: ['groq-llama', 'claude', 'fallback'], default: 'fallback' },
    scoreLabel: {
      type: String,
      enum: ['Excellent', 'Good', 'Average', 'Below Average', 'Poor'],
      default: 'Average',
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
    },
    errorMessage: String,
  },
  { timestamps: true }
);

AnalysisSchema.index({ createdAt: -1 });
AnalysisSchema.index({ overallScore: -1 });

module.exports = mongoose.model('Analysis', AnalysisSchema);
