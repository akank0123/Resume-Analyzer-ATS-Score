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

module.exports = { generateSuggestions };
