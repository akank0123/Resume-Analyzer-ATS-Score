# ResumeAI — Smart Resume Analyzer & ATS Scorer

An AI-powered resume analysis tool that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). Upload your resume, paste a job description, and get an instant score with actionable AI suggestions.

---

## Features

- **Resume Parsing** — Supports PDF and DOCX formats
- **ATS Score** — Comprehensive scoring based on keywords, format, skills, and experience quality
- **Keyword Analysis** — Matches your resume against a job description and highlights missing keywords with priority levels
- **AI Suggestions** — Powered by Llama 3.3 (via Groq) with Claude as fallback — generates specific, actionable improvement recommendations
- **Score Visualization** — Radar chart, doughnut chart, and progress bars to visualize resume strength across categories
- **Analysis History** — Track all past analyses with score trend chart and pagination
- **Stats Dashboard** — View total analyses, average score, and score distribution

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Bootstrap 5, Chart.js |
| Backend | Node.js, Express |
| Database | MongoDB |
| Primary AI | Llama 3.3 via Groq API (free) |
| Fallback AI | Anthropic Claude API |
| File Parsing | pdf-parse (PDF), mammoth (DOCX) |

---

## AI Provider Priority

The system automatically selects the best available AI provider:

```
Groq (Llama 3.3)  →  Claude (Anthropic)  →  Rule-based fallback
```

The app works fully without any API key using the built-in rule-based suggestion engine.

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Groq API key — free at [console.groq.com](https://console.groq.com) *(optional)*
- Anthropic API key — optional secondary fallback

### Installation

```bash
# Install all dependencies (root + server + client)
npm run install:all
```

### Configuration

Create a `.env` file inside the `backend/` directory based on the `.env.example` file provided:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
CLIENT_URL=http://localhost:5173
```

### Running the App

```bash
# Start both frontend and backend together
npm run dev
```

- Frontend runs on `http://localhost:5173`
- Backend API runs on `http://localhost:5000`

---

## How It Works

1. **Upload** your resume (PDF or DOCX)
2. **Paste** the job description you are targeting *(optional but recommended)*
3. **Analyze** — the system parses your resume, scores it, and matches keywords
4. **Review** your ATS score breakdown, matched/missing keywords, and AI suggestions
5. **Improve** your resume based on the recommendations and re-analyze

---

## ATS Scoring Breakdown

| Category | Weight | What it measures |
|---|---|---|
| Keyword Match | 40% | How many job description keywords appear in your resume |
| Skills Coverage | 25% | Technical skills detected vs expected for the role |
| Resume Format | 20% | Sections present, contact info, word count, quantified achievements |
| Experience Quality | 15% | Years of experience, action verbs, measurable results |

---

## Score Labels

| Score | Label |
|---|---|
| 85 – 100 | Excellent |
| 70 – 84 | Good |
| 55 – 69 | Average |
| 40 – 54 | Below Average |
| 0 – 39 | Poor |

---