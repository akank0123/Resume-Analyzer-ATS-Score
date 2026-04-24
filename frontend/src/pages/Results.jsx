import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resumeAPI } from '../services/api';
import ScoreDoughnut from '../components/ScoreDoughnut';
import RadarChart from '../components/RadarChart';
import ScoreBar from '../components/ScoreBar';
import KeywordSection from '../components/KeywordSection';
import AISuggestions from '../components/AISuggestions';

const LABEL_BG    = { Excellent: '#d1fae5', Good: '#dcfce7', Average: '#fef3c7', 'Below Average': '#ffedd5', Poor: '#fee2e2' };
const LABEL_COLOR = { Excellent: '#047857', Good: '#16a34a', Average: '#d97706', 'Below Average': '#ea580c', Poor: '#dc2626' };

const WEIGHT_WITH_JD    = { 'Keyword Matching': 40, 'Skills Relevance': 20, 'Resume Structure': 20, 'Experience Quality': 10, 'Education': 5, 'Content Quality': 5 };
const WEIGHT_WITHOUT_JD = { 'Skills Relevance': 30, 'Resume Structure': 30, 'Experience Quality': 20, 'Education': 12, 'Content Quality': 8 };

const tabs = [
  { id: 'overview',     label: 'Overview',       icon: 'bi-speedometer2' },
  { id: 'keywords',     label: 'Keywords',        icon: 'bi-tags' },
  { id: 'suggestions',  label: 'AI Suggestions',  icon: 'bi-stars' },
  { id: 'skills',       label: 'Skills',          icon: 'bi-code-square' },
];

export default function Results() {
  const { id } = useParams();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    resumeAPI.getById(id)
      .then((res) => setData(res.data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" style={{ width: 48, height: 48 }} />
        <p className="mt-3 text-muted">Loading results...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-triangle display-3 text-warning mb-3 d-block" />
        <h4>Analysis not found</h4>
        <Link to="/analyze" className="btn btn-primary rounded-pill mt-2">Analyze a New Resume</Link>
      </div>
    );
  }

  const hasJD     = !!data.jobDescription;
  const weights   = hasJD ? WEIGHT_WITH_JD : WEIGHT_WITHOUT_JD;

  const radarScores = {
    keyword:        data.keywordScore        || 0,
    skills:         data.skillsScore         || 0,
    structure:      data.formatScore         || 0,
    experience:     data.experienceScore     || 0,
    education:      data.educationScore      || 0,
    contentQuality: data.contentQualityScore || 0,
  };

  return (
    <div className="container py-4 py-md-5">

      {/* ── Header ── */}
      <div className="d-flex flex-wrap align-items-start gap-3 mb-4">
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
            <h2 className="fw-800 mb-0">Analysis Results</h2>
            <span className="badge rounded-pill px-3 py-1 fw-700"
              style={{ background: LABEL_BG[data.scoreLabel], color: LABEL_COLOR[data.scoreLabel], fontSize: '0.8rem' }}>
              {data.scoreLabel}
            </span>
          </div>
          <p className="text-muted mb-0 small">
            <i className="bi bi-file-earmark me-1" />{data.resumeFileName}
            {data.jobTitle && <span className="ms-2"><i className="bi bi-briefcase me-1" />{data.jobTitle}</span>}
            <span className="ms-2"><i className="bi bi-clock me-1" />{new Date(data.createdAt).toLocaleString()}</span>
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/analyze" className="btn btn-primary rounded-pill px-3"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', border: 'none' }}>
            <i className="bi bi-plus me-1" />New Analysis
          </Link>
          <Link to="/history" className="btn btn-outline-secondary rounded-pill px-3">
            <i className="bi bi-clock-history me-1" />History
          </Link>
        </div>
      </div>

      {/* ── Score Summary ── */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card-custom p-4 text-center h-100">
            <p className="text-muted small fw-600 mb-3 text-uppercase" style={{ letterSpacing: 1 }}>ATS Overall Score</p>
            <ScoreDoughnut score={data.overallScore} label={data.scoreLabel} />
            <p className="text-muted small mt-3 mb-2">
              {data.overallScore >= 70
                ? 'Your resume has strong ATS compatibility.'
                : data.overallScore >= 50
                ? 'Your resume needs some improvements.'
                : 'Significant improvements recommended.'}
            </p>
            {/* Weight legend */}
            <div className="text-start mt-3 pt-3 border-top">
              <p className="small fw-700 text-muted mb-2 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: 0.5 }}>
                {hasJD ? 'Score Weights (with JD)' : 'Score Weights (no JD)'}
              </p>
              {Object.entries(weights).map(([label, w]) => (
                <div key={label} className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{label}</span>
                  <span className="badge rounded-pill px-2" style={{ background: 'rgba(79,70,229,0.1)', color: '#4f46e5', fontSize: '0.68rem' }}>{w}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card-custom p-4 h-100">
            <h6 className="fw-700 mb-3">Score Breakdown — 6 Dimensions</h6>
            {data.sectionScores?.map((s) => (
              <ScoreBar key={s.name} label={s.name} score={s.score} feedback={s.feedback} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <ul className="nav nav-pills gap-1 mb-4 flex-wrap"
        style={{ padding: '4px', background: '#f0f4ff', borderRadius: 12, display: 'inline-flex' }}>
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link px-3 py-2 fw-600 small rounded-3 border-0 ${activeTab === tab.id ? 'active' : 'text-secondary'}`}
              style={activeTab === tab.id
                ? { background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', color: 'white' }
                : { background: 'transparent' }}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`bi ${tab.icon} me-1`} />{tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* ── Overview Tab ── */}
      {activeTab === 'overview' && (
        <div className="row g-4 fade-in-up">
          <div className="col-lg-6">
            <div className="card-custom p-4 h-100">
              <h6 className="fw-700 mb-3"><i className="bi bi-graph-up me-2 text-primary" />Score Radar — 6 Dimensions</h6>
              <RadarChart scores={radarScores} hasJobDescription={hasJD} />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card-custom p-4 h-100">
              <h6 className="fw-700 mb-3"><i className="bi bi-bar-chart me-2 text-primary" />Quick Stats</h6>
              <div className="row g-3 mb-3">
                {[
                  { label: 'Matched Keywords', value: data.matchedKeywords?.length  || 0, icon: 'bi-check-circle-fill', color: '#10b981' },
                  { label: 'Missing Keywords', value: data.missingKeywords?.length  || 0, icon: 'bi-x-circle-fill',     color: '#ef4444' },
                  { label: 'Skills Detected',  value: data.extractedSkills?.length  || 0, icon: 'bi-code-square',       color: '#4f46e5' },
                  { label: 'AI Suggestions',   value: data.aiSuggestions?.length    || 0, icon: 'bi-stars',             color: '#f59e0b' },
                ].map((stat) => (
                  <div key={stat.label} className="col-6">
                    <div className="p-3 rounded-3 text-center"
                      style={{ background: `${stat.color}12`, border: `1px solid ${stat.color}30` }}>
                      <i className={`bi ${stat.icon} d-block mb-1`} style={{ fontSize: 22, color: stat.color }} />
                      <div className="fw-800 fs-4" style={{ color: stat.color }}>{stat.value}</div>
                      <small className="text-muted fw-500">{stat.label}</small>
                    </div>
                  </div>
                ))}
              </div>

              {/* Per-dimension mini scores */}
              <div className="pt-3 border-top">
                <p className="small fw-700 text-muted mb-2 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: 0.5 }}>Dimension Scores</p>
                {[
                  { label: 'Keywords',   value: hasJD ? data.keywordScore        : null, na: !hasJD },
                  { label: 'Skills',     value: data.skillsScore         || 0 },
                  { label: 'Structure',  value: data.formatScore          || 0 },
                  { label: 'Experience', value: data.experienceScore      || 0 },
                  { label: 'Education',  value: data.educationScore       || 0 },
                  { label: 'Content',    value: data.contentQualityScore  || 0 },
                ].map((d) => {
                  const pct  = d.na ? 0 : d.value;
                  const color = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
                  return (
                    <div key={d.label} className="d-flex align-items-center gap-2 mb-1">
                      <span style={{ width: 72, fontSize: '0.75rem', color: '#64748b', flexShrink: 0 }}>{d.label}</span>
                      <div className="flex-grow-1 score-bar" style={{ height: 6 }}>
                        <div className="score-bar-fill" style={{ width: `${pct}%`, background: d.na ? '#e2e8f0' : color }} />
                      </div>
                      {d.na
                        ? <span style={{ width: 36, fontSize: '0.7rem', color: '#94a3b8', textAlign: 'right' }}>N/A</span>
                        : <span style={{ width: 36, fontSize: '0.72rem', fontWeight: 700, color, textAlign: 'right' }}>{d.value}</span>
                      }
                    </div>
                  );
                })}
              </div>

              {!hasJD && (
                <div className="mt-3 p-3 rounded-3"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <div className="d-flex gap-2 align-items-start">
                    <i className="bi bi-lightbulb-fill text-warning mt-1" />
                    <div>
                      <p className="small fw-600 mb-1" style={{ color: '#92400e' }}>Boost Your Score</p>
                      <p className="small mb-2 text-muted">Add a job description to unlock keyword matching (40% of score).</p>
                      <Link to="/analyze" className="btn btn-sm btn-warning rounded-pill px-3">Add Job Description</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Keywords Tab ── */}
      {activeTab === 'keywords' && (
        <div className="fade-in-up">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h5 className="fw-700 mb-0">Keyword Analysis</h5>
              <small className="text-muted">
                {data.matchedKeywords?.length || 0} matched · {data.missingKeywords?.length || 0} missing
              </small>
            </div>
            {hasJD && data.matchedKeywords?.length > 0 && (
              <div className="d-flex align-items-center gap-2">
                <span className="small fw-600 text-muted">Match Rate:</span>
                <span className="badge fs-6 rounded-pill px-3"
                  style={{ background: data.keywordScore >= 70 ? '#d1fae5' : '#fef3c7', color: data.keywordScore >= 70 ? '#047857' : '#92400e' }}>
                  {data.keywordScore}%
                </span>
              </div>
            )}
          </div>
          <KeywordSection matched={data.matchedKeywords || []} missing={data.missingKeywords || []} />
        </div>
      )}

      {/* ── AI Suggestions Tab ── */}
      {activeTab === 'suggestions' && (
        <div className="card-custom p-4 fade-in-up">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 className="fw-700 mb-0"><i className="bi bi-stars text-primary me-2" />AI-Powered Suggestions</h5>
            {data.aiSuggestions?.length > 0 && (
              <span className="badge rounded-pill px-3 py-1" style={{ background: 'rgba(79,70,229,0.1)', color: '#4f46e5' }}>
                {data.aiSuggestions.length} suggestions
              </span>
            )}
          </div>
          <AISuggestions
            strengths={data.strengthPoints || []}
            improvements={data.improvementAreas || data.aiSuggestions || []}
            aiGenerated={data.aiProvider !== 'fallback'}
            aiProvider={data.aiProvider || 'fallback'}
          />
        </div>
      )}

      {/* ── Skills Tab ── */}
      {activeTab === 'skills' && (
        <div className="card-custom p-4 fade-in-up">
          <h5 className="fw-700 mb-3"><i className="bi bi-code-square text-primary me-2" />Detected Technical Skills</h5>
          {data.extractedSkills?.length > 0 ? (
            <div>
              <p className="text-muted small mb-3">{data.extractedSkills.length} skills detected in your resume</p>
              <div>
                {data.extractedSkills.map((skill) => (
                  <span key={skill} className="badge rounded-pill me-2 mb-2 px-3 py-2 fw-600"
                    style={{ background: 'rgba(79,70,229,0.1)', color: '#4f46e5', border: '1px solid rgba(79,70,229,0.2)', fontSize: '0.8rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-code-square display-4 d-block mb-3" />
              <p>No specific technical skills were automatically detected.</p>
              <p className="small">Try adding a clear "Technical Skills" section to your resume.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
