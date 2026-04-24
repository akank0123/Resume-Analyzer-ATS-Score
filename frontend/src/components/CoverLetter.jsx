import { useState } from 'react';
import { toast } from 'react-toastify';
import { resumeAPI } from '../services/api';

export default function CoverLetter({ analysisId, jobTitle, hasJobDescription }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await resumeAPI.generateCoverLetter(analysisId);
      setResult(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!result?.coverLetter) return;
    await navigator.clipboard.writeText(result.coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAI = result?.aiGenerated && result?.provider !== 'fallback';

  return (
    <div>
      {!result && !loading && (
        <div className="text-center py-5">
          <div className="mb-4">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{ width: 72, height: 72, background: 'rgba(79,70,229,0.1)' }}>
              <i className="bi bi-envelope-paper" style={{ fontSize: 32, color: '#4f46e5' }} />
            </div>
            <h5 className="fw-700 mb-2">Generate Your Cover Letter</h5>
            <p className="text-muted mb-1">
              AI will write a tailored cover letter using your resume{hasJobDescription ? ' and the job description' : ''}.
            </p>
            {!hasJobDescription && (
              <p className="small mb-0" style={{ color: '#f59e0b' }}>
                <i className="bi bi-lightbulb me-1" />
                Tip: A job description produces a more targeted letter.
              </p>
            )}
          </div>
          <button
            className="btn btn-lg rounded-pill px-5 fw-700"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', color: 'white', border: 'none' }}
            onClick={generate}
          >
            <i className="bi bi-magic me-2" />
            Generate Cover Letter
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border mb-3" style={{ width: 48, height: 48, color: '#4f46e5' }} />
          <p className="fw-600 text-muted mb-1">Writing your cover letter...</p>
          <p className="small text-muted">This takes 5–15 seconds</p>
        </div>
      )}

      {result && (
        <div className="fade-in-up">
          {/* Provider badge + actions */}
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
              style={{
                background: isAI ? 'rgba(79,70,229,0.08)' : 'rgba(100,116,139,0.08)',
                border: `1px solid ${isAI ? 'rgba(79,70,229,0.25)' : 'rgba(100,116,139,0.25)'}`,
              }}>
              <i className={`bi ${isAI ? 'bi-stars' : 'bi-gear-fill'}`}
                style={{ color: isAI ? '#4f46e5' : '#64748b' }} />
              <small className="fw-600" style={{ color: isAI ? '#4f46e5' : '#64748b' }}>
                {isAI ? 'AI-Generated Cover Letter' : 'Template Cover Letter'}
              </small>
              {isAI && (
                <span className="badge rounded-pill px-2"
                  style={{ background: 'rgba(79,70,229,0.12)', color: '#4f46e5', fontSize: '0.7rem' }}>
                  {result.provider.toUpperCase()}
                </span>
              )}
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm rounded-pill px-3 fw-600"
                style={{ background: copied ? '#10b981' : '#f0f4ff', color: copied ? 'white' : '#4f46e5', border: 'none' }}
                onClick={copy}
              >
                <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'} me-1`} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                className="btn btn-sm rounded-pill px-3 fw-600"
                style={{ background: '#f0f4ff', color: '#4f46e5', border: 'none' }}
                onClick={generate}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1" />
                Regenerate
              </button>
            </div>
          </div>

          {/* Highlights */}
          {result.highlights?.length > 0 && (
            <div className="mb-3 p-3 rounded-3"
              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <p className="small fw-700 mb-2 text-uppercase"
                style={{ color: '#047857', letterSpacing: 0.5, fontSize: '0.7rem' }}>
                Key Strengths Used
              </p>
              <div className="d-flex flex-wrap gap-2">
                {result.highlights.map((h, i) => (
                  <span key={i} className="badge rounded-pill px-3 py-1 fw-500"
                    style={{ background: 'rgba(16,185,129,0.12)', color: '#047857', fontSize: '0.75rem' }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Letter text */}
          <textarea
            className="form-control rounded-3 font-monospace"
            rows={14}
            readOnly
            value={result.coverLetter}
            style={{ fontSize: '0.85rem', lineHeight: 1.7, borderColor: '#e2e8f0', background: '#fafbff', resize: 'vertical' }}
          />
          <p className="small text-muted mt-2">
            <i className="bi bi-pencil me-1" />
            Personalize before sending — add the hiring manager name, company details, and your real numbers.
          </p>
        </div>
      )}
    </div>
  );
}
