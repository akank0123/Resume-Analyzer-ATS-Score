import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RadarChart({ scores, hasJobDescription = true }) {
  const {
    keyword        = 0,
    skills         = 0,
    structure      = 0,
    experience     = 0,
    education      = 0,
    contentQuality = 0,
  } = scores;

  const keywordLabel = hasJobDescription ? 'Keywords' : 'Keywords (N/A)';

  const data = {
    labels: [keywordLabel, 'Skills', 'Structure', 'Experience', 'Education', 'Content'],
    datasets: [
      {
        label: 'Your Resume',
        data: [
          hasJobDescription ? keyword : 0,
          skills,
          structure,
          experience,
          education,
          contentQuality,
        ],
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        borderColor: '#4f46e5',
        borderWidth: 2,
        pointBackgroundColor: (ctx) =>
          ctx.dataIndex === 0 && !hasJobDescription ? '#cbd5e1' : '#4f46e5',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          backdropColor: 'transparent',
          font: { size: 9 },
          color: '#94a3b8',
        },
        grid:       { color: 'rgba(0,0,0,0.06)' },
        angleLines: { color: 'rgba(0,0,0,0.08)' },
        pointLabels: {
          font: { size: 11, weight: '600' },
          color: (ctx) =>
            ctx.index === 0 && !hasJobDescription ? '#94a3b8' : '#0f172a',
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            if (ctx.dataIndex === 0 && !hasJobDescription)
              return ' Keywords: N/A — add a job description';
            return ` Score: ${ctx.raw}/100`;
          },
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
}
