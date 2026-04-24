import { Link } from 'react-router-dom';

const features = [
  { icon: 'bi-file-earmark-text-fill', color: '#4f46e5', bg: 'rgba(79,70,229,0.1)', title: 'Smart Parsing', desc: 'Supports PDF & DOCX. Extracts text, sections, and contact info automatically.' },
  { icon: 'bi-search', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', title: 'Keyword Matching', desc: 'Compares your resume against job descriptions to find matched and missing keywords.' },
  { icon: 'bi-stars', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', title: 'AI Suggestions', desc: 'AI generates specific, actionable recommendations to improve your ATS score.' },
  { icon: 'bi-speedometer2', color: '#10b981', bg: 'rgba(16,185,129,0.1)', title: 'ATS Score', desc: 'Get a comprehensive score based on keywords, format, skills, and experience quality.' },
  { icon: 'bi-graph-up', color: '#ec4899', bg: 'rgba(236,72,153,0.1)', title: 'Visual Analytics', desc: 'Interactive radar charts and progress bars to visualize your resume strength.' },
  { icon: 'bi-clock-history', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: 'Analysis History', desc: 'Track all your past analyses and monitor improvement over time.' },
];

const steps = [
  { num: '01', title: 'Upload Resume', desc: 'Upload your PDF or DOCX resume file', icon: 'bi-cloud-upload-fill' },
  { num: '02', title: 'Add Job Description', desc: 'Paste the job description to match against', icon: 'bi-briefcase-fill' },
  { num: '03', title: 'Get Your Score', desc: 'Receive ATS score and AI suggestions instantly', icon: 'bi-lightning-fill' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-section text-white py-5">
        <div className="container py-4 py-md-5 position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center gy-5">
            <div className="col-lg-6">
              <span className="badge rounded-pill mb-3 px-3 py-2" style={{ background: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', backdropFilter: 'blur(8px)' }}>
                <i className="bi bi-stars me-1" />AI-Powered Resume Analysis
              </span>
              <h1 className="display-4 fw-800 mb-3" style={{ lineHeight: 1.15 }}>
                Beat the ATS &<br />Land More Interviews
              </h1>
              <p className="lead mb-4 opacity-90">
                Upload your resume, get an instant ATS score, and receive AI-powered suggestions to make your resume stand out to recruiters and applicant tracking systems.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/analyze" className="btn btn-light btn-lg px-4 rounded-pill fw-600" style={{ color: '#4f46e5' }}>
                  <i className="bi bi-upload me-2" />Analyze My Resume
                </Link>
                <Link to="/history" className="btn btn-outline-light btn-lg px-4 rounded-pill fw-600">
                  <i className="bi bi-clock-history me-2" />View History
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="row g-3">
                {[
                  { label: 'ATS Score', value: '94', color: '#10b981', icon: 'bi-speedometer2' },
                  { label: 'Keywords Matched', value: '87%', color: '#06b6d4', icon: 'bi-search' },
                  { label: 'AI Suggestions', value: '12', color: '#f59e0b', icon: 'bi-lightbulb-fill' },
                ].map((stat) => (
                  <div key={stat.label} className="col-4">
                    <div className="text-center p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
                      <i className={`bi ${stat.icon} mb-2 d-block`} style={{ fontSize: 28, color: stat.color }} />
                      <div className="fw-800 fs-3" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="small opacity-80">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="badge rounded-pill px-3 py-2 mb-2" style={{ background: 'rgba(79,70,229,0.1)', color: '#4f46e5', fontSize: '0.8rem' }}>
              Simple Process
            </span>
            <h2 className="fw-800">How It Works</h2>
            <p className="text-muted">Three simple steps to optimize your resume</p>
          </div>
          <div className="row g-4 justify-content-center">
            {steps.map((step, i) => (
              <div key={i} className="col-md-4 text-center">
                <div className="card-custom p-4">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', color: 'white', fontSize: 24 }}
                  >
                    <i className={`bi ${step.icon}`} />
                  </div>
                  <div className="fw-800 gradient-text mb-1" style={{ fontSize: '0.85rem', letterSpacing: 1 }}>{step.num}</div>
                  <h5 className="fw-700">{step.title}</h5>
                  <p className="text-muted small mb-0">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5" style={{ background: '#f0f4ff' }}>
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="badge rounded-pill px-3 py-2 mb-2" style={{ background: 'rgba(79,70,229,0.1)', color: '#4f46e5', fontSize: '0.8rem' }}>
              Everything You Need
            </span>
            <h2 className="fw-800">Powerful Features</h2>
            <p className="text-muted">Built for job seekers who want to maximize their interview chances</p>
          </div>
          <div className="row g-4">
            {features.map((f) => (
              <div key={f.title} className="col-md-6 col-lg-4">
                <div className="card-custom p-4 h-100">
                  <div className="feature-icon" style={{ background: f.bg, color: f.color, width: 48, height: 48, borderRadius: 12, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`bi ${f.icon}`} />
                  </div>
                  <h6 className="fw-700 mb-2">{f.title}</h6>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 text-center" style={{ background: 'linear-gradient(135deg,#4f46e5,#06b6d4)' }}>
        <div className="container py-3">
          <h2 className="fw-800 text-white mb-3">Ready to Optimize Your Resume?</h2>
          <p className="text-white opacity-90 mb-4 lead">Join thousands of job seekers who improved their ATS score</p>
          <Link to="/analyze" className="btn btn-light btn-lg px-5 rounded-pill fw-700" style={{ color: '#4f46e5' }}>
            <i className="bi bi-lightning-fill me-2" />Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-white border-top text-center text-muted">
        <small>© 2024 ResumeAI — Smart ATS Resume Analyzer. Powered by AI.</small>
      </footer>
    </div>
  );
}
