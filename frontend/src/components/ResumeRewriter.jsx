import { useState } from 'react';
import { toast } from 'react-toastify';
import { resumeAPI } from '../services/api';

const VARIANT_STYLE = {
  Technical:  { bg: 'rgba(79,70,229,0.06)',  border: 'rgba(79,70,229,0.2)',  color: '#4f46e5', icon: 'bi-cpu' },
  Impact:     { bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)', color: '#059669', icon: 'bi-graph-up-arrow' },
  Leadership: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', color: '#d97706', icon: 'bi-people' },
};

function RewriteCard({ rewrite, index }) {
  const [copied, setCopied] = useState(false);
  const style = VARIANT_STYLE[rewrite.variant] || VARIANT_STYLE.Technical;

  const copy = async () => {
    await navigator.clipboard.writeText(rewrite.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-3 rounded-3 mb-3"
      style={{ background: style.bg, border: `1px solid ${style.border}` }}>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2">
          <span className="badge rounded-pill px-2 py-1"
            style={{ background: style.color, color: 'white', fontSize: '0.7rem' }}>
            <i className={`bi ${style.icon} me-1`} />{rewrite.variant}
          </span>
          <small className="text-muted fw-500">Variant {index + 1}</small>
        </div>
        <button
          className="btn btn-sm rounded-pill px-3"
          style={{
            background: copied ? style.color : 'white',
            color: copied ? 'white' : style.color,
            border: `1px solid ${style.border}`,
            fontSize: '0.75rem',
          }}
          onClick={copy}
        >
          <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'} me-1`} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="mb-0 small" style={{ lineHeight: 1.65, color: '#1e293b' }}>{rewrite.text}</p>
    </div>
  );
}

export default function ResumeRewriter({ analysisId, jobTitle }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const rewrite = async () => {
    if (!text.trim()) { toast.error('Please paste a bullet point to rewrite'); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await resumeAPI.rewriteBullets(analysisId, text.trim());
      setResult(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to rewrite bullet');
    } finally {
      setLoading(false);
    }
  };

  const isAI = result?.aiGenerated && result?.provider !== 'fallback';

  return (
    <div>
      <div className="mb-4 p-3 rounded-3"
        style={{ background: 'rgba(79,70,229,0.04)', border: '1px solid rgba(79,70,229,0.15)' }}>
        <div className="d-flex gap-2 align-items-start">
          <i className="bi bi-info-circle text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="small fw-600 mb-1" style={{ color: '#312e81' }}>How to use</p>
            <p className="small mb-0 text-muted">
              Paste any weak bullet point or job duty. AI rewrites it into 3 stronger versions:
              <strong> Technical</strong> (tech stack), <strong> Impact</strong> (business results),
              <strong> Leadership</strong> (team scope).
              {jobTitle && <span> Tailored for <strong>{jobTitle}</strong>.</span>}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-700 small">
          <i className="bi bi-pencil-square me-1 text-primary" />
          Paste your bullet point or job duty here
        </label>
        <textarea
          className="form-control rounded-3"
          rows={3}
          placeholder={`e.g. "Responsible for developing APIs for the backend"`}
          value={text}
          onChange={(e) => { setText(e.target.value); if (result) setResult(null); }}
          style={{ borderColor: '#e2e8f0', fontSize: '0.9rem', resize: 'vertical' }}
          disabled={loading}
        />
        <div className="d-flex justify-content-between align-items-center mt-1">
          <small className="text-muted">{text.length} characters</small>
          {text.length > 0 && (
            <button className="btn btn-sm btn-link text-muted p-0"
              onClick={() => { setText(''); setResult(null); }}>
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="d-flex gap-2 mb-4">
        <button
          className="btn rounded-pill px-4 fw-700"
          style={{ background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', color: 'white', border: 'none' }}
          onClick={rewrite}
          disabled={loading || !text.trim()}
        >
          {loading
            ? <><span className="spinner-border spinner-border-sm me-2" />Rewriting...</>
            : <><i className="bi bi-magic me-2" />Rewrite Bullet</>
          }
        </button>
        {result && (
          <button className="btn btn-outline-secondary rounded-pill px-4 fw-600"
            onClick={() => { setResult(null); setText(''); }}>
            <i className="bi bi-plus me-1" />Try Another
          </button>
        )}
      </div>

      {result && (
        <div className="fade-in-up">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-3"
              style={{
                background: isAI ? 'rgba(79,70,229,0.08)' : 'rgba(100,116,139,0.08)',
                border: `1px solid ${isAI ? 'rgba(79,70,229,0.25)' : 'rgba(100,116,139,0.25)'}`,
              }}>
              <i className={`bi ${isAI ? 'bi-stars' : 'bi-gear-fill'}`}
                style={{ color: isAI ? '#4f46e5' : '#64748b', fontSize: '0.85rem' }} />
              <small className="fw-600" style={{ color: isAI ? '#4f46e5' : '#64748b', fontSize: '0.8rem' }}>
                {isAI ? 'AI-Powered Rewrite' : 'Template Rewrite'}
              </small>
              {isAI && (
                <span className="badge rounded-pill px-2"
                  style={{ background: 'rgba(79,70,229,0.12)', color: '#4f46e5', fontSize: '0.68rem' }}>
                  {result.provider.toUpperCase()}
                </span>
              )}
            </div>
            {result.tip && (
              <div className="d-flex align-items-center gap-1 px-3 py-1 rounded-3"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                <i className="bi bi-lightbulb-fill text-warning" style={{ fontSize: '0.8rem' }} />
                <small className="fw-500" style={{ color: '#92400e', fontSize: '0.78rem' }}>{result.tip}</small>
              </div>
            )}
          </div>

          <h6 className="fw-700 mb-3">3 Stronger Versions</h6>
          {result.rewrites?.map((r, i) => (
            <RewriteCard key={i} rewrite={r} index={i} />
          ))}
          <p className="small text-muted mt-1">
            <i className="bi bi-info-circle me-1" />
            Replace placeholder values like [X]%, [$Y] with your actual numbers before using.
          </p>
        </div>
      )}
    </div>
  );
}
