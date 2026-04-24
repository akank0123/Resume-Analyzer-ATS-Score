const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by',
  'from','as','is','was','are','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','shall','must',
  'can','i','we','you','he','she','it','they','me','us','him','her','them',
  'my','our','your','his','its','their','this','that','these','those',
]);

const TECH_SKILLS = new Set([
  // Languages
  'javascript','typescript','python','java','php','ruby','go','rust','swift','kotlin',
  'scala','c++','c#','bash','solidity',
  // Frontend
  'react','angular','vue','html','css','sass','scss','bootstrap','jquery','webpack',
  'vite','nextjs','nuxtjs','tailwind','redux',
  // Backend
  'nodejs','express','django','flask','spring','laravel','fastapi','nestjs','graphql',
  'rest','api','websocket','socketio','webrtc','grpc','oauth','jwt','passport',
  // Databases
  'mongodb','postgresql','mysql','redis','elasticsearch','sqlite','cassandra',
  'dynamodb','firebase','supabase','sql','nosql','prisma','mongoose',
  // AI / ML
  'langchain','openai','llm','rag','faiss','chromadb','pinecone','huggingface',
  'tensorflow','pytorch','machine learning','deep learning','nlp','vector embeddings',
  'prompt engineering','gemini','llama',
  // Cloud & DevOps
  'aws','azure','gcp','docker','kubernetes','linux','nginx','ci/cd','devops',
  'terraform','ansible','github actions','jenkins','vercel','heroku',
  // Payments & Storage
  'stripe','braintree','paypal','razorpay','s3','blob storage',
  // Tools & Methods
  'git','github','gitlab','agile','scrum','jest','mocha','microservices',
  'event driven','rbac','webhooks','oauth2','ssl','dns',
]);

const ACTION_VERBS = new Set([
  'achieved','architected','automated','built','collaborated','consolidated','coordinated',
  'crafted','created','delivered','deployed','designed','developed','drove','embedded',
  'enabled','enforced','engineered','established','executed','generated','implemented',
  'improved','increased','integrated','launched','led','managed','mentored','migrated',
  'negotiated','optimized','orchestrated','oversaw','presented','reduced','resolved',
  'scaled','shipped','spearheaded','streamlined','structured','trained','transformed',
  'wired','configured','developed','monitored',
]);

const DEGREE_PATTERNS = [
  /\b(b\.?tech|b\.?e\.?|bachelor|b\.?sc|b\.?s\.?)\b/i,
  /\b(m\.?tech|m\.?e\.?|master|m\.?sc|m\.?s\.?|mba)\b/i,
  /\b(ph\.?d|doctorate|phd)\b/i,
  /\b(associate|diploma|a\.?s\.?|a\.?a\.?)\b/i,
  /\b(12th|hsc|intermediate|high school|secondary)\b/i,
];

const CERT_PATTERNS = [
  /\b(certified|certification|certificate)\b/i,
  /\b(aws certified|google certified|microsoft certified)\b/i,
  /\b(pmp|cpa|cfa|cissp|ccna|ccnp|rhce|ocp)\b/i,
];

// ── Tokenization ────────────────────────────────────────────────────────────

// Normalize common dotted/versioned tech names before tokenizing
const SKILL_ALIASES = {
  'node.js': 'nodejs',  'node js': 'nodejs',
  'express.js': 'express', 'express js': 'express',
  'socket.io': 'socketio', 'socket io': 'socketio',
  'next.js': 'nextjs',  'nuxt.js': 'nuxtjs',
  'nest.js': 'nestjs',
  'vue.js': 'vue',
  'html5': 'html', 'html 5': 'html',
  'css3': 'css',  'css 3': 'css',
  'es6': 'javascript', 'es6+': 'javascript', 'es2015': 'javascript',
  'oauth2': 'oauth', 'oauth 2': 'oauth',
  'restful': 'rest', 'restapi': 'rest',
  'web sockets': 'websocket', 'websockets': 'websocket',
  'web rtc': 'webrtc',
  'ci cd': 'ci/cd', 'cicd': 'ci/cd',
  'langchain': 'langchain',
  'chromadb': 'chromadb',
  'openai': 'openai',
  'aws s3': 's3',
  'azure blob': 'blob storage',
};

function normalizeSkillText(text) {
  let result = text.toLowerCase();
  for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
    result = result.replace(new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'), canonical);
  }
  return result;
}

function tokenize(text) {
  return normalizeSkillText(text)
    .replace(/[^\w\s/]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function extractBigrams(tokens) {
  const bigrams = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return bigrams;
}

function getKeywordImportance(keyword) {
  if (TECH_SKILLS.has(keyword.toLowerCase())) return 'high';
  if (keyword.length > 8) return 'medium';
  return 'low';
}

// ── 1. Keyword Matching (40% with JD) ───────────────────────────────────────

function analyzeKeywords(resumeText, jobDescription) {
  if (!jobDescription || jobDescription.trim().length < 10) {
    return { matched: [], missing: [], keywordScore: 0 };
  }

  const resumeTokens = tokenize(resumeText);
  const jobTokens    = tokenize(jobDescription);

  const resumeTokenSet = new Set(resumeTokens);
  const resumeBigrams  = new Set(extractBigrams(resumeTokens));
  const jobBigrams     = extractBigrams(jobTokens);
  const allJobPhrases  = [...new Set([...jobTokens, ...jobBigrams])];

  const jobKeywordFreq = {};
  for (const phrase of allJobPhrases) {
    jobKeywordFreq[phrase] = (jobKeywordFreq[phrase] || 0) + 1;
  }

  const sortedKeywords = Object.entries(jobKeywordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([word]) => word);

  const matched = [];
  const missing = [];

  for (const keyword of sortedKeywords) {
    const isPhrase = keyword.includes(' ');
    const found    = isPhrase ? resumeBigrams.has(keyword) : resumeTokenSet.has(keyword);
    const entry    = {
      word: keyword,
      found,
      frequency: resumeTokens.filter((t) => t === keyword).length,
      importance: getKeywordImportance(keyword),
    };
    if (found) matched.push(entry);
    else missing.push(entry);
  }

  const highMatched      = matched.filter((k) => k.importance === 'high').length;
  const highTotal        = [...matched, ...missing].filter((k) => k.importance === 'high').length;
  const basicScore       = sortedKeywords.length > 0 ? (matched.length / sortedKeywords.length) * 100 : 0;
  const highPriorityBonus = highTotal > 0 ? (highMatched / highTotal) * 20 : 0;
  const keywordScore     = Math.min(Math.round(basicScore * 0.8 + highPriorityBonus), 100);

  return { matched, missing, keywordScore };
}

// ── 2. Skills Relevance (20%) ────────────────────────────────────────────────

function extractSkillsFromResume(resumeText) {
  const tokens    = tokenize(resumeText);
  const bigrams   = extractBigrams(tokens);
  const found     = new Set();

  for (const phrase of [...tokens, ...bigrams]) {
    if (TECH_SKILLS.has(phrase.toLowerCase())) found.add(phrase.toLowerCase());
  }

  const skillPatterns = [
    /proficient\s+in\s+([\w\s,/+#]+)/gi,
    /experience\s+with\s+([\w\s,/+#]+)/gi,
    /skilled\s+in\s+([\w\s,/+#]+)/gi,
    /knowledge\s+of\s+([\w\s,/+#]+)/gi,
    /expertise\s+in\s+([\w\s,/+#]+)/gi,
  ];

  for (const pattern of skillPatterns) {
    let match;
    while ((match = pattern.exec(resumeText)) !== null) {
      match[1].split(/[,;|•]/).forEach((s) => {
        const cleaned = s.trim().toLowerCase().replace(/[^\w\s/#+]/g, '');
        if (cleaned.length > 1 && cleaned.length < 40) found.add(cleaned);
      });
    }
  }

  return [...found];
}

function calculateSkillsScore(extractedSkills, keywordScore, hasJobDescription) {
  // Tiered scoring — reward both breadth (many skills) and depth (JD match)
  const count = extractedSkills.length;
  let score = 0;
  if      (count >= 25) score = 85;
  else if (count >= 18) score = 75;
  else if (count >= 12) score = 65;
  else if (count >= 8)  score = 55;
  else if (count >= 4)  score = 40;
  else                  score = count * 5;

  if (hasJobDescription) score = Math.min(score + keywordScore * 0.15, 100);
  return Math.min(Math.round(score), 100);
}

// ── 3. Resume Structure (20%) ────────────────────────────────────────────────

function calculateFormatScore(resumeText, sections) {
  let score = 0;

  const emailMatch   = resumeText.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  const phoneMatch   = resumeText.match(/(?:\+?\d{1,3}[\s\-.]?)?\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4}/);
  const linkedinMatch = resumeText.match(/linkedin\.com\/in\/[\w\-]+/i);
  const githubMatch  = resumeText.match(/github\.com\/[\w\-]+/i);

  if (emailMatch)    score += 15;
  if (phoneMatch)    score += 10;
  if (linkedinMatch) score += 8;
  if (githubMatch)   score += 7;

  const presentSections = Object.entries(sections).filter(([, v]) => v.length > 20);
  score += Math.min(presentSections.length * 8, 40);

  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount >= 300 && wordCount <= 800)       score += 15;
  else if (wordCount >= 200 && wordCount < 300)   score += 8;
  else if (wordCount > 800 && wordCount <= 1200)  score += 10;

  const hasQuantifiedAchievements = /\d+%|\$\d+|\d+\+\s*(?:years?|projects?|clients?)/i.test(resumeText);
  if (hasQuantifiedAchievements) score += 5;

  return Math.min(Math.round(score), 100);
}

function detectContactInfo(resumeText) {
  return {
    email:    (resumeText.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/) || [])[0] || null,
    phone:    (resumeText.match(/(?:\+?\d{1,3}[\s\-.]?)?\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4}/) || [])[0] || null,
    linkedin: (resumeText.match(/linkedin\.com\/in\/[\w\-]+/i) || [])[0] || null,
    github:   (resumeText.match(/github\.com\/[\w\-]+/i) || [])[0] || null,
  };
}

// ── 4. Experience Quality (10%) ──────────────────────────────────────────────

function calculateExperienceScore(resumeText) {
  let score = 30;

  // Broad pattern: "4 years experience", "4 years building", "4+ years", "since 2020" etc.
  const yearsMatch = resumeText.match(/(\d+)\+?\s*years?/gi);
  if (yearsMatch) {
    const maxYears = Math.max(...yearsMatch.map((m) => parseInt(m)));
    if (maxYears >= 5)      score += 35;
    else if (maxYears >= 3) score += 25;
    else if (maxYears >= 1) score += 15;
    else                    score += 5;
  } else {
    // Infer from date range (e.g. Oct 2022 – Present = ~3 years)
    const yearNumbers = resumeText.match(/\b(20\d{2})\b/g);
    if (yearNumbers) {
      const years = yearNumbers.map(Number);
      const span  = Math.max(...years) - Math.min(...years);
      if (span >= 4)      score += 30;
      else if (span >= 2) score += 20;
      else if (span >= 1) score += 10;
    }
  }

  const tokens      = tokenize(resumeText);
  const verbMatches = tokens.filter((t) => ACTION_VERBS.has(t)).length;
  score += Math.min(verbMatches * 3, 25);

  const hasNumbers = /\d+\s*%|\$[\d,]+|\d+x\b|\d+\+?\s*(k|m|million|billion|thousand|users?|clients?|ms\b)\b/i.test(resumeText);
  if (hasNumbers) score += 10;

  return Math.min(score, 100);
}

// ── 5. Education (5%) ────────────────────────────────────────────────────────

function calculateEducationScore(resumeText) {
  let score = 0;

  // Degree detection — higher degree = higher base score
  if (DEGREE_PATTERNS[2].test(resumeText)) score += 55;       // PhD
  else if (DEGREE_PATTERNS[1].test(resumeText)) score += 50;  // Masters / MBA
  else if (DEGREE_PATTERNS[0].test(resumeText)) score += 40;  // Bachelors
  else if (DEGREE_PATTERNS[3].test(resumeText)) score += 25;  // Associate / Diploma
  else if (DEGREE_PATTERNS[4].test(resumeText)) score += 10;  // High school

  // University / institution name present
  const hasInstitution = /university|college|institute|school|iit|nit|bits/i.test(resumeText);
  if (hasInstitution) score += 15;

  // GPA or percentage
  const hasGrade = /\b(\d{1,2}\.\d{1,2}\s*(?:gpa|cgpa)|(\d{2,3})\s*%\s*(?:marks?|score|aggregate))/i.test(resumeText);
  if (hasGrade) score += 10;

  // Certifications
  const certCount = CERT_PATTERNS.filter((p) => p.test(resumeText)).length;
  score += Math.min(certCount * 10, 20);

  return Math.min(score, 100);
}

// ── 6. Content Quality (5%) ──────────────────────────────────────────────────

function calculateContentQualityScore(resumeText) {
  let score = 20;

  // Action verb variety
  const tokens      = tokenize(resumeText);
  const uniqueVerbs = new Set(tokens.filter((t) => ACTION_VERBS.has(t)));
  score += Math.min(uniqueVerbs.size * 5, 30);

  // Quantified impact statements — broader patterns
  const quantifiedLines = (resumeText.match(
    /\d+\s*%|\$[\d,]+|\d+x\b|\d+\+?\s*(k|m|million|billion|thousand)\b|\d+\+?\s*(users?|clients?|projects?|systems?|apis?|services?|ms\b|seconds?)/gi
  ) || []).length;
  score += Math.min(quantifiedLines * 8, 25);

  // No filler / generic phrases (penalty)
  const fillerPhrases = [
    'responsible for','team player','hard working','go-getter',
    'detail oriented','self-motivated','results driven','dynamic professional',
  ];
  const fillerCount = fillerPhrases.filter((p) => new RegExp(p, 'i').test(resumeText)).length;
  score -= fillerCount * 5;

  // Summary/objective section present
  const hasSummary = /\b(summary|objective|profile|about me)\b/i.test(resumeText);
  if (hasSummary) score += 10;

  // Reasonable sentence/bullet length (no walls of text)
  const avgLineLength = resumeText.split('\n')
    .filter((l) => l.trim().length > 0)
    .reduce((sum, l) => sum + l.length, 0) / (resumeText.split('\n').length || 1);
  if (avgLineLength < 120) score += 15;

  return Math.min(Math.max(score, 0), 100);
}

// ── Overall Score ────────────────────────────────────────────────────────────

function computeOverallScore(scores, hasJobDescription) {
  const { keyword, skills, structure, experience, education, contentQuality } = scores;

  if (!hasJobDescription) {
    // Keyword weight (40%) redistributed across remaining 5 dimensions
    return Math.round(
      skills        * 0.30 +
      structure     * 0.30 +
      experience    * 0.20 +
      education     * 0.12 +
      contentQuality * 0.08
    );
  }

  return Math.round(
    keyword        * 0.40 +
    skills         * 0.20 +
    structure      * 0.20 +
    experience     * 0.10 +
    education      * 0.05 +
    contentQuality * 0.05
  );
}

function getScoreLabel(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Average';
  if (score >= 40) return 'Below Average';
  return 'Poor';
}

module.exports = {
  analyzeKeywords,
  extractSkillsFromResume,
  calculateSkillsScore,
  calculateFormatScore,
  detectContactInfo,
  calculateExperienceScore,
  calculateEducationScore,
  calculateContentQualityScore,
  computeOverallScore,
  getScoreLabel,
};
