const {
  ATS_SYSTEM_PROMPT,
  buildSuggestionUserMessage,
  buildCoverLetterUserMessage,
  buildRewriteUserMessage,
  parseAIResponse,
  parseCoverLetterResponse,
  parseRewriteResponse,
} = require('./prompts');
const fallback = require('./fallbackProvider');

// ── Provider config — change AI_PROVIDER in .env to switch providers ──────────
// Current supported values: groq
// To add a new provider: add a case below with the SDK call, set AI_PROVIDER=<name>
const AI_PROVIDER = (process.env.AI_PROVIDER || 'groq').toLowerCase();
const AI_MODEL    = process.env.AI_MODEL || 'llama-3.3-70b-versatile';

let _callAI = null; // set once on first use

function initClient() {
  if (_callAI) return true;

  switch (AI_PROVIDER) {
    case 'groq': {
      const key = process.env.GROQ_API_KEY;
      if (!key || key.startsWith('your_')) return false;
      const Groq = require('groq-sdk');
      const client = new Groq({ apiKey: key });
      _callAI = async (userMessage, maxTokens) => {
        const res = await client.chat.completions.create({
          model: AI_MODEL,
          messages: [
            { role: 'system', content: ATS_SYSTEM_PROMPT },
            { role: 'user', content: userMessage },
          ],
          max_tokens: maxTokens,
          temperature: 0.4,
        });
        return res.choices[0]?.message?.content || '';
      };
      return true;
    }

    // ── Add future providers here ──────────────────────────────────────────────
    // case 'openai': {
    //   const key = process.env.OPENAI_API_KEY;
    //   if (!key || key.startsWith('your_')) return false;
    //   const OpenAI = require('openai');
    //   const client = new OpenAI({ apiKey: key });
    //   _callAI = async (userMessage, maxTokens) => { ... };
    //   return true;
    // }
    // ──────────────────────────────────────────────────────────────────────────

    default:
      return false;
  }
}

// ── In-memory prompt cache (avoids duplicate API calls within TTL) ────────────
const _cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function fromCache(key) {
  const entry = _cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { _cache.delete(key); return null; }
  return entry.value;
}

function toCache(key, value) {
  _cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ── Cached AI call ────────────────────────────────────────────────────────────
async function callAI(userMessage, maxTokens = 1024) {
  const key = userMessage.slice(0, 300);
  const cached = fromCache(key);
  if (cached) return cached;

  const text = await _callAI(userMessage, maxTokens);
  toCache(key, text);
  return text;
}

// ── Public API ────────────────────────────────────────────────────────────────

async function generateAISuggestions(resumeText, jobDescription, scores, matchedKeywords, missingKeywords) {
  if (!initClient()) {
    return { ...fallback.generateSuggestions(scores, missingKeywords), aiGenerated: false };
  }
  try {
    const text = await callAI(
      buildSuggestionUserMessage(resumeText, jobDescription, scores, matchedKeywords, missingKeywords),
      1024
    );
    return { ...parseAIResponse(text), provider: AI_PROVIDER, aiGenerated: true };
  } catch (err) {
    console.error('AI suggestion failed:', err.message);
    return { ...fallback.generateSuggestions(scores, missingKeywords), aiGenerated: false };
  }
}

async function generateCoverLetter(resumeText, jobDescription, jobTitle) {
  if (!initClient()) {
    return { ...fallback.generateCoverLetter(jobTitle), aiGenerated: false };
  }
  try {
    const text = await callAI(buildCoverLetterUserMessage(resumeText, jobDescription, jobTitle), 1200);
    return { ...parseCoverLetterResponse(text), provider: AI_PROVIDER, aiGenerated: true };
  } catch (err) {
    console.error('Cover letter AI failed:', err.message);
    return { ...fallback.generateCoverLetter(jobTitle), aiGenerated: false };
  }
}

async function rewriteBullets(bulletText, jobDescription, jobTitle) {
  if (!initClient()) {
    return { ...fallback.rewriteBullets(bulletText), aiGenerated: false };
  }
  try {
    const text = await callAI(buildRewriteUserMessage(bulletText, jobDescription, jobTitle), 800);
    return { ...parseRewriteResponse(text), provider: AI_PROVIDER, aiGenerated: true };
  } catch (err) {
    console.error('Rewrite AI failed:', err.message);
    return { ...fallback.rewriteBullets(bulletText), aiGenerated: false };
  }
}

function getActiveProvider() {
  return initClient() ? AI_PROVIDER : 'fallback';
}

module.exports = { generateAISuggestions, generateCoverLetter, rewriteBullets, getActiveProvider };
