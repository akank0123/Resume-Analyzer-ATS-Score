const groq = require('./groqProvider');
const claude = require('./claudeProvider');
const fallback = require('./fallbackProvider');

async function generateAISuggestions(resumeText, jobDescription, scores, matchedKeywords, missingKeywords) {
  // Priority: Groq (Llama) → Claude → Rule-based fallback
  if (groq.isAvailable()) {
    try {
      const result = await groq.generateSuggestions(resumeText, jobDescription, scores, matchedKeywords, missingKeywords);
      return { ...result, aiGenerated: true };
    } catch (err) {
      console.error('Groq provider failed, trying Claude:', err.message);
    }
  }

  if (claude.isAvailable()) {
    try {
      const result = await claude.generateSuggestions(resumeText, jobDescription, scores, matchedKeywords, missingKeywords);
      return { ...result, aiGenerated: true };
    } catch (err) {
      console.error('Claude provider failed, using fallback:', err.message);
    }
  }

  return { ...fallback.generateSuggestions(scores, missingKeywords), aiGenerated: false };
}

function getActiveProvider() {
  if (groq.isAvailable()) return 'groq-llama';
  if (claude.isAvailable()) return 'claude';
  return 'fallback';
}

module.exports = { generateAISuggestions, getActiveProvider };
