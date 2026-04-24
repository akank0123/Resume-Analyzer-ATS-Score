import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ScoreDoughnut({ score, label }) {
  const colorMap = {
    Excellent: '#10b981',
    Good: '#22c55e',
    Average: '#f59e0b',
    'Below Average': '#f97316',
    Poor: '#ef4444',
  };
  const color = colorMap[label] || '#4f46e5';

  const data = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [color, '#e2e8f0'],
        borderWidth: 0,
        hoverBorderWidth: 0,
        cutout: '78%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 200, margin: '0 auto' }}>
      <Doughnut data={data} options={options} />
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <span style={{ fontSize: '2.2rem', fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>/100</span>
        <span style={{ fontSize: '0.65rem', color, fontWeight: 700, marginTop: 2 }}>{label}</span>
      </div>
    </div>
  );
}
