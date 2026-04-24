export default function ScoreGauge({ score, label, size = 'lg' }) {
  const pct = `${(score / 100) * 360}deg`;

  const colorMap = {
    Excellent: '#10b981',
    Good: '#22c55e',
    Average: '#f59e0b',
    'Below Average': '#f97316',
    Poor: '#ef4444',
  };

  const color = colorMap[label] || '#4f46e5';

  const isLg = size === 'lg';
  const outerSize = isLg ? 160 : 110;
  const innerSize = isLg ? 120 : 80;
  const fontSize = isLg ? '2rem' : '1.4rem';

  return (
    <div
      style={{
        width: outerSize,
        height: outerSize,
        borderRadius: '50%',
        background: `conic-gradient(${color} ${pct}, #e2e8f0 0)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        margin: '0 auto',
        boxShadow: `0 4px 20px ${color}33`,
      }}
    >
      <div
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: '50%',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          position: 'absolute',
        }}
      >
        <span style={{ fontSize, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, marginTop: 2 }}>/100</span>
      </div>
    </div>
  );
}
