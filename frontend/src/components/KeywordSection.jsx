export default function KeywordSection({ matched = [], missing = [] }) {
  const highMatched = matched.filter((k) => k.importance === 'high');
  const restMatched = matched.filter((k) => k.importance !== 'high');
  const highMissing = missing.filter((k) => k.importance === 'high');
  const restMissing = missing.filter((k) => k.importance !== 'high');

  return (
    <div>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card-custom p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="feature-icon bg-success bg-opacity-10" style={{ width: 36, height: 36, borderRadius: 8, fontSize: 16 }}>
                <i className="bi bi-check-circle-fill text-success" />
              </div>
              <div>
                <h6 className="mb-0 fw-700">Matched Keywords</h6>
                <small className="text-muted">{matched.length} found in your resume</small>
              </div>
            </div>
            {matched.length === 0 ? (
              <p className="text-muted small">No keywords matched. Try adding relevant terms from the job description.</p>
            ) : (
              <div>
                {highMatched.length > 0 && (
                  <div className="mb-2">
                    <small className="text-muted fw-600 d-block mb-1">HIGH PRIORITY</small>
                    {highMatched.map((k) => (
                      <span key={k.word} className="keyword-badge keyword-badge-matched keyword-badge-high">
                        <i className="bi bi-star-fill" style={{ fontSize: 9, color: '#4f46e5' }} />
                        {k.word}
                      </span>
                    ))}
                  </div>
                )}
                {restMatched.length > 0 && (
                  <div>
                    {restMatched.map((k) => (
                      <span key={k.word} className="keyword-badge keyword-badge-matched">{k.word}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card-custom p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{ width: 36, height: 36, borderRadius: 8, fontSize: 16, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-x-circle-fill text-danger" />
              </div>
              <div>
                <h6 className="mb-0 fw-700">Missing Keywords</h6>
                <small className="text-muted">{missing.length} not found — add these!</small>
              </div>
            </div>
            {missing.length === 0 ? (
              <p className="text-muted small">
                {matched.length > 0 ? 'All detected keywords are present.' : 'Add a job description to see keyword analysis.'}
              </p>
            ) : (
              <div>
                {highMissing.length > 0 && (
                  <div className="mb-2">
                    <small className="text-muted fw-600 d-block mb-1">CRITICAL — MISSING</small>
                    {highMissing.map((k) => (
                      <span key={k.word} className="keyword-badge keyword-badge-missing keyword-badge-high">
                        <i className="bi bi-exclamation-circle-fill" style={{ fontSize: 9 }} />
                        {k.word}
                      </span>
                    ))}
                  </div>
                )}
                {restMissing.length > 0 && (
                  <div>
                    {restMissing.map((k) => (
                      <span key={k.word} className="keyword-badge keyword-badge-missing">{k.word}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
