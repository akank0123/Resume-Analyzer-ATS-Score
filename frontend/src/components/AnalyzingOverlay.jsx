export default function AnalyzingOverlay({ progress }) {
  const steps = [
    { label: 'Parsing resume document', icon: 'bi-file-earmark-text' },
    { label: 'Extracting text & sections', icon: 'bi-layout-text-window' },
    { label: 'Matching keywords', icon: 'bi-search' },
    { label: 'Calculating ATS score', icon: 'bi-speedometer2' },
    { label: 'Generating AI suggestions', icon: 'bi-stars' },
  ];

  const activeStep = Math.floor((progress / 100) * steps.length);

  return (
    <div className="analyzing-overlay">
      <div className="analyzing-card fade-in-up">
        <div className="mb-3">
          <div
            className="spin-slow mx-auto mb-3"
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#4f46e5,#06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 28,
            }}
          >
            <i className="bi bi-cpu-fill" />
          </div>
          <h5 className="fw-700 mb-1">Analyzing Resume</h5>
          <p className="text-muted small mb-0">Please wait while we process your resume...</p>
        </div>

        <div className="score-bar mb-3" style={{ height: 6 }}>
          <div
            className="score-bar-fill"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg,#4f46e5,#06b6d4)',
              transition: 'width 0.5s ease',
            }}
          />
        </div>

        <div className="text-start">
          {steps.map((step, i) => (
            <div
              key={i}
              className="d-flex align-items-center gap-2 mb-2"
              style={{ opacity: i <= activeStep ? 1 : 0.35, transition: 'opacity 0.4s' }}
            >
              <i
                className={`bi ${i < activeStep ? 'bi-check-circle-fill text-success' : i === activeStep ? 'bi-arrow-right-circle-fill text-primary' : step.icon + ' text-muted'}`}
                style={{ fontSize: 16 }}
              />
              <span className="small fw-500">{step.label}</span>
              {i === activeStep && (
                <span className="spinner-border spinner-border-sm text-primary ms-auto" style={{ width: 14, height: 14 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
