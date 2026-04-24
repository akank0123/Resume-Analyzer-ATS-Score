export default function AISuggestions({ strengths = [], improvements = [], aiGenerated = false, aiProvider = 'fallback' }) {
  const isAI = aiGenerated && aiProvider !== 'fallback';

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-3 p-2 rounded"
        style={{
          background: isAI ? 'rgba(79,70,229,0.08)' : 'rgba(100,116,139,0.08)',
          border: `1px solid ${isAI ? 'rgba(79,70,229,0.25)' : 'rgba(100,116,139,0.25)'}`,
        }}>
        <i className={`bi ${isAI ? 'bi-stars' : 'bi-gear-fill'}`}
          style={{ color: isAI ? '#4f46e5' : '#64748b' }} />
        <small className="fw-600" style={{ color: isAI ? '#4f46e5' : '#64748b' }}>
          {isAI ? `AI-Powered Analysis` : 'Rule-based Analysis'}
        </small>
        {isAI && (
          <span className="badge rounded-pill ms-auto px-2"
            style={{ background: 'rgba(79,70,229,0.12)', color: '#4f46e5', fontSize: '0.7rem' }}>
            {aiProvider.toUpperCase()}
          </span>
        )}
      </div>

      {strengths.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-700 mb-2 d-flex align-items-center gap-2">
            <i className="bi bi-trophy-fill text-warning" />
            Strengths
          </h6>
          {strengths.map((s, i) => (
            <div key={i} className="suggestion-item strength-item">
              <i className="bi bi-check-circle-fill text-success mt-1 flex-shrink-0" />
              <span className="small">{s}</span>
            </div>
          ))}
        </div>
      )}

      {improvements.length > 0 && (
        <div>
          <h6 className="fw-700 mb-2 d-flex align-items-center gap-2">
            <i className="bi bi-lightbulb-fill text-warning" />
            Improvement Suggestions
          </h6>
          {improvements.map((s, i) => (
            <div key={i} className="suggestion-item">
              <i className="bi bi-arrow-right-circle-fill text-primary mt-1 flex-shrink-0" />
              <span className="small">{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
