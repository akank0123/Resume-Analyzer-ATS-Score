const Anthropic = require('@anthropic-ai/sdk');
const { buildSuggestionPrompt, parseAIResponse } = require('./prompts');

let client = null;

function getClient() {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'your_anthropic_api_key_here') return null;
    client = new Anthropic({ apiKey });
  }
  return client;
}

function isAvailable() {
  return !!getClient();
}

async function generateSuggestions(resumeText, jobDescription, scores, matchedKeywords, missingKeywords) {
  const anthropic = getClient();
  if (!anthropic) throw new Error('Claude client not initialized');

  const prompt = buildSuggestionPrompt(resumeText, jobDescription, scores, matchedKeywords, missingKeywords);

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].text;
  return { ...parseAIResponse(text), provider: 'claude' };
}

module.exports = { isAvailable, generateSuggestions };
