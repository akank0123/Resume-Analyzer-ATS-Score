const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function parseResume(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    return parsePDF(filePath);
  } else if (ext === '.docx' || ext === '.doc') {
    return parseDOCX(filePath);
  }
  throw new Error('Unsupported file format');
}

async function parsePDF(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return cleanText(data.text);
}

async function parseDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return cleanText(result.value);
}

function cleanText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .trim();
}

function extractSections(text) {
  const sections = {
    summary: '',
    experience: '',
    education: '',
    skills: '',
    projects: '',
    certifications: '',
    contact: '',
  };

  const patterns = {
    summary: /(?:summary|objective|profile|about)\s*[:\-]?\s*\n([\s\S]*?)(?=\n(?:experience|work|education|skills|projects|certification|contact|\Z))/i,
    experience: /(?:experience|work history|employment|work experience)\s*[:\-]?\s*\n([\s\S]*?)(?=\n(?:education|skills|projects|certification|contact|summary|\Z))/i,
    education: /(?:education|academic|qualification)\s*[:\-]?\s*\n([\s\S]*?)(?=\n(?:skills|projects|certification|experience|contact|summary|\Z))/i,
    skills: /(?:skills|technical skills|core competencies|technologies)\s*[:\-]?\s*\n([\s\S]*?)(?=\n(?:education|projects|certification|experience|contact|summary|\Z))/i,
    projects: /(?:projects|personal projects|key projects)\s*[:\-]?\s*\n([\s\S]*?)(?=\n(?:education|skills|certification|experience|contact|summary|\Z))/i,
    certifications: /(?:certifications?|certificates?|courses)\s*[:\-]?\s*\n([\s\S]*?)(?=\n(?:education|skills|projects|experience|contact|summary|\Z))/i,
  };

  for (const [section, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match) sections[section] = match[1].trim();
  }

  return sections;
}

function detectContactInfo(text) {
  const emailMatch = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[\s\-.]?)?\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4}/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w\-]+/i);
  const githubMatch = text.match(/github\.com\/[\w\-]+/i);

  return {
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    linkedin: linkedinMatch ? linkedinMatch[0] : null,
    github: githubMatch ? githubMatch[0] : null,
  };
}

function calculateFormatScore(text, sections) {
  let score = 0;
  const maxScore = 100;

  const contactInfo = detectContactInfo(text);
  if (contactInfo.email) score += 15;
  if (contactInfo.phone) score += 10;
  if (contactInfo.linkedin) score += 5;

  const presentSections = Object.entries(sections).filter(([, v]) => v.length > 20);
  score += Math.min(presentSections.length * 8, 40);

  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 300 && wordCount <= 800) score += 15;
  else if (wordCount >= 200 && wordCount < 300) score += 8;
  else if (wordCount > 800 && wordCount <= 1200) score += 10;

  const hasQuantifiedAchievements = /\d+%|\$\d+|\d+\+\s*(?:years?|projects?|clients?)/i.test(text);
  if (hasQuantifiedAchievements) score += 15;

  return Math.min(Math.round(score), maxScore);
}

module.exports = { parseResume, extractSections, detectContactInfo, calculateFormatScore };
