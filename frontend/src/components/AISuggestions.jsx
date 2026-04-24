const PROVIDER_LABEL = {
  'groq-llama': { label: 'Llama 3.3 via Groq', icon: 'bi-cpu-fill', color: '#f97316' },
  'claude':     { label: 'Claude by Anthropic', icon: 'bi-stars',    color: '#4f46e5' },
  'fallback':   { label: 'Rule-based Analysis', icon: 'bi-gear-fill', color: '#64748b' },
};

export default function AISuggestions({ strengths = [], improvements = [], aiGenerated = false, aiProvider = 'fallback' }) {
  const meta = PROVIDER_LABEL[aiProvider] || PROVIDER_LABEL.fallback;

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-3 p-2 rounded" style={{ background: `${meta.color}12`, border: `1px solid ${meta.color}30` }}>
        <i className={`bi ${meta.icon}`} style={{ color: meta.color }} />
        <small className="fw-600" style={{ color: meta.color }}>
          {aiGenerated ? `AI-Powered Analysis — ${meta.label}` : meta.label}
        </small>
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
