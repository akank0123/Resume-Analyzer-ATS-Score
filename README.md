# ResumeAI — Smart Resume Analyzer & ATS Scorer

An AI-powered resume analysis tool that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). Upload your resume, paste a job description, and get an instant score with actionable AI suggestions, a tailored cover letter, and AI-rewritten bullet points.

---

## Features

- **Resume Parsing** — Supports PDF and DOCX formats (up to 5 MB)
- **6-Dimension ATS Score** — Comprehensive scoring across keywords, skills, format, experience, education, and content quality
- **Keyword Analysis** — Matches resume against a job description; highlights matched and missing keywords with priority levels (high / medium / low)
- **AI Suggestions** — Powered by Llama 3.3 (via Groq) with Claude as fallback — generates strengths, improvements, keyword tips, and format tips
- **Cover Letter Generator** — AI writes a tailored, 4-paragraph cover letter using your resume and the target job description
- **Bullet Point Rewriter** — Paste any resume bullet and get 3 AI-rewritten variants: Technical, Impact, and Leadership
- **Score Visualization** — Radar chart, doughnut chart, and dimension score bars
- **Analysis History** — Track all past analyses with a score trend chart and pagination
- **Stats Dashboard** — Total analyses, average score, and score distribution
- **Offline Mode** — Works fully without any API key using the built-in rule-based suggestion engine

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Bootstrap 5, Chart.js, Axios, React Router |
| Backend | Node.js 18+, Express |
| Database | MongoDB (Mongoose) |
| File Upload | Multer |
| PDF Parsing | pdf-parse |
| DOCX Parsing | mammoth |
| Primary AI | Llama 3.3 via Groq API (free) |
| Fallback AI | Anthropic Claude API |
| Final Fallback | Built-in rule-based engine (no API key required) |

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
# Install all dependencies (root + backend + frontend)
npm run install:all
```

### Configuration

Create a `.env` file inside the `backend/` directory:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
```

### Running the App

```bash
# Start both frontend and backend together
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---