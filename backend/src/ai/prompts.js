function buildSuggestionPrompt(resumeText, jobDescription, scores, matchedKeywords, missingKeywords) {
  const missingList = missingKeywords.slice(0, 15).map((k) => k.word).join(', ');
  const matchedList = matchedKeywords.slice(0, 10).map((k) => k.word).join(', ');

  return `You are an expert ATS resume consultant and career coach with 10+ years of experience. Analyze this resume and provide highly specific, actionable suggestions.

RESUME TEXT:
${resumeText.slice(0, 3000)}

JOB DESCRIPTION:
${jobDescription ? jobDescription.slice(0, 1500) : 'Not provided'}

ATS ANALYSIS RESULTS:
- Overall Score: ${scores.overall}/100
- Keyword Match Score: ${scores.keyword}/100
- Format Score: ${scores.format}/100
- Skills Score: ${scores.skills}/100
- Experience Score: ${scores.experience}/100
- Matched Keywords: ${matchedList || 'None'}
- Missing Keywords: ${missingList || 'None'}

Based on this analysis, provide:
1. STRENGTHS (3-4 specific things the resume does well)
2. CRITICAL IMPROVEMENTS (4-5 specific, actionable suggestions to improve ATS score)
3. KEYWORD OPTIMIZATION (specific advice on incorporating missing keywords naturally)
4. FORMAT RECOMMENDATIONS (specific formatting improvements)

Respond ONLY with a JSON object in this exact format:
{
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3", "improvement 4", "improvement 5"],
  "keywordTips": ["tip 1", "tip 2", "tip 3"],
  "formatTips": ["tip 1", "tip 2"]
}`;
}

function parseAIResponse(responseText) {
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid AI response format');
  const parsed = JSON.parse(jsonMatch[0]);
  return {
    strengths: parsed.strengths || [],
    improvements: parsed.improvements || [],
    keywordTips: parsed.keywordTips || [],
    formatTips: parsed.formatTips || [],
  };
}

module.exports = { buildSuggestionPrompt, parseAIResponse };
