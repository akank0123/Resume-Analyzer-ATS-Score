function generateSuggestions(scores, missingKeywords) {
  const improvements = [];
  const strengths = [];

  if (scores.keyword >= 70) strengths.push('Good keyword alignment with job requirements');
  else improvements.push(`Incorporate these missing keywords naturally: ${missingKeywords.slice(0, 5).map((k) => k.word).join(', ')}`);

  if (scores.format >= 70) strengths.push('Resume has a clear and readable structure');
  else improvements.push('Add clearly labeled sections: Summary, Experience, Education, Skills, Projects');

  if (scores.experience >= 70) strengths.push('Strong experience section with measurable achievements');
  else improvements.push('Quantify your achievements with numbers (e.g. "Increased performance by 40%", "Led team of 5 engineers")');

  if (scores.skills >= 70) strengths.push('Comprehensive technical skills section');
  else improvements.push('Add a dedicated Technical Skills section listing all relevant tools and technologies');

  improvements.push('Use strong action verbs: Developed, Architected, Optimized, Led, Delivered, Implemented');
  improvements.push('Ensure contact info includes email, phone, LinkedIn, and GitHub profile');
  improvements.push('Keep resume to 1-2 pages maximum for optimal ATS parsing');

  return {
    strengths: strengths.length > 0 ? strengths : ['Resume contains relevant experience and skills'],
    improvements,
    keywordTips: ['Add missing keywords in context of real experience, not just as a list'],
    formatTips: ['Use standard section headers', 'Avoid tables, columns, and graphics for ATS compatibility'],
    provider: 'fallback',
  };
}

function generateCoverLetter(jobTitle) {
  const role = jobTitle || 'this position';
  return {
    coverLetter: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${role} role. With my background in [your field] and a track record of delivering [key achievement], I am confident in my ability to make a meaningful contribution to your team.\n\nIn my previous roles, I have [describe 2-3 relevant experiences with results]. I am particularly drawn to your organization because of [specific reason — research the company].\n\nI would welcome the opportunity to discuss how my experience aligns with your needs. Thank you for your time and consideration.\n\nSincerely,\n[Your Name]`,
    highlights: [
      'Add a specific achievement with a number in the opening paragraph',
      'Research the company and mention something specific in paragraph 3',
      'Replace all bracketed placeholders with your actual details',
    ],
    provider: 'fallback',
  };
}

function rewriteBullets(bulletText) {
  return {
    rewrites: [
      {
        variant: 'Technical',
        text: `[Technical variant] ${bulletText} — Add specific technologies, tools, and architecture decisions used`,
      },
      {
        variant: 'Impact',
        text: `[Impact variant] ${bulletText} — Add quantified results: percentage improvement, users impacted, revenue or cost effect`,
      },
      {
        variant: 'Leadership',
        text: `[Leadership variant] ${bulletText} — Add team size led, cross-functional coordination, and strategic scope`,
      },
    ],
    tip: 'Add specific numbers, tools, and measurable outcomes to transform this from a duty into an achievement.',
    provider: 'fallback',
  };
}

module.exports = { generateSuggestions, generateCoverLetter, rewriteBullets };
