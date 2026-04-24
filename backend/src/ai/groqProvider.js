const Groq = require('groq-sdk');
const { buildSuggestionPrompt, parseAIResponse } = require('./prompts');

let client = null;

function getClient() {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'your_groq_api_key_here') return null;
    client = new Groq({ apiKey });
  }
  return client;
}

function isAvailable() {
  return !!getClient();
}

async function generateSuggestions(resumeText, jobDescription, scores, matchedKeywords, missingKeywords) {
  const groq = getClient();
  if (!groq) throw new Error('Groq client not initialized');

  const prompt = buildSuggestionPrompt(resumeText, jobDescription, scores, matchedKeywords, missingKeywords);

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1024,
    temperature: 0.4,
  });

  const text = response.choices[0]?.message?.content || '';
  return { ...parseAIResponse(text), provider: 'groq-llama' };
}

module.exports = { isAvailable, generateSuggestions };
