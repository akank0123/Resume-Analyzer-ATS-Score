export default function ScoreBar({ label, score, feedback, color }) {
  const getColor = (s) => {
    if (s >= 80) return '#10b981';
    if (s >= 60) return '#22c55e';
    if (s >= 45) return '#f59e0b';
    if (s >= 30) return '#f97316';
    return '#ef4444';
  };

  const isNA = score === null || score === undefined;
  const barColor = isNA ? '#cbd5e1' : (color || getColor(score));

  return (
    <div className="section-score-row">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="fw-600 small">{label}</span>
        {isNA ? (
          <span
            className="badge rounded-pill px-2 py-1"
            style={{ background: 'rgba(245,158,11,0.12)', color: '#b45309', fontSize: '0.7rem' }}
          >
            N/A — No job description
          </span>
        ) : (
          <span className="fw-700 small" style={{ color: barColor }}>{score}/100</span>
        )}
      </div>
      <div className="score-bar mb-1">
        <div
          className="score-bar-fill"
          style={{
            width: isNA ? '100%' : `${score}%`,
            background: isNA
              ? 'repeating-linear-gradient(90deg,#e2e8f0 0px,#e2e8f0 8px,#f1f5f9 8px,#f1f5f9 16px)'
              : barColor,
          }}
        />
      </div>
      {feedback && (
        <p className="mb-0" style={{ fontSize: '0.75rem', color: isNA ? '#b45309' : '#64748b' }}>
          {isNA && <i className="bi bi-info-circle me-1" />}
          {feedback}
        </p>
      )}
    </div>
  );
}
