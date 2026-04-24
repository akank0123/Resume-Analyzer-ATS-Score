import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resumeAPI } from '../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const LABEL_COLOR = {
  Excellent: '#047857', Good: '#16a34a', Average: '#d97706', 'Below Average': '#ea580c', Poor: '#dc2626',
};
const LABEL_BG = {
  Excellent: '#d1fae5', Good: '#dcfce7', Average: '#fef3c7', 'Below Average': '#ffedd5', Poor: '#fee2e2',
};

function ScoreBadge({ score, label }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <span className="fw-800" style={{ color: LABEL_COLOR[label] || '#4f46e5', fontSize: '1.1rem' }}>{score}</span>
      <span className="badge rounded-pill px-2 py-1" style={{ background: LABEL_BG[label], color: LABEL_COLOR[label], fontSize: '0.7rem' }}>{label}</span>
    </div>
  );
}

export default function History() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    Promise.all([resumeAPI.getHistory({ page, limit: 8 }), resumeAPI.getStats()])
      .then(([histRes, statsRes]) => {
        setAnalyses(histRes.data);
        setPagination(histRes.pagination);
        setStats(statsRes.data);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this analysis?')) return;
    setDeletingId(id);
    try {
      await resumeAPI.deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((a) => a._id !== id));
      toast.success('Analysis deleted');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const chartData = {
    labels: [...analyses].reverse().map((a, i) => `#${i + 1} ${a.resumeFileName.slice(0, 12)}...`),
    datasets: [{
      label: 'ATS Score',
      data: [...analyses].reverse().map((a) => a.overallScore),
      backgroundColor: [...analyses].reverse().map((a) => {
        if (a.overallScore >= 85) return '#10b981';
        if (a.overallScore >= 70) return '#22c55e';
        if (a.overallScore >= 55) return '#f59e0b';
        if (a.overallScore >= 40) return '#f97316';
        return '#ef4444';
      }),
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 30 } },
    },
  };

  if (loading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" style={{ width: 48, height: 48 }} />
    </div>
  );

  return (
    <div className="container py-4 py-md-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-800 mb-1">Analysis History</h2>
          <p className="text-muted mb-0 small">Track your resume improvements over time</p>
        </div>
        <Link to="/analyze" className="btn btn-primary rounded-pill px-4" style={{ background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', border: 'none' }}>
          <i className="bi bi-plus me-1" />New Analysis
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Analyses', value: stats.totalAnalyses, icon: 'bi-file-earmark-text', color: '#4f46e5', bg: 'rgba(79,70,229,0.1)' },
            { label: 'Average Score', value: stats.averageScore, icon: 'bi-graph-up', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
            { label: 'Excellent Scores', value: stats.scoreDistribution?.Excellent || 0, icon: 'bi-trophy-fill', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            { label: 'Needs Work', value: (stats.scoreDistribution?.Poor || 0) + (stats.scoreDistribution?.['Below Average'] || 0), icon: 'bi-tools', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
          ].map((s) => (
            <div key={s.label} className="col-6 col-md-3">
              <div className="card-custom p-3 text-center">
                <div className="mx-auto mb-2" style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`bi ${s.icon}`} style={{ fontSize: 20, color: s.color }} />
                </div>
                <div className="fw-800 fs-4" style={{ color: s.color }}>{s.value}</div>
                <small className="text-muted">{s.label}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {analyses.length > 1 && (
        <div className="card-custom p-4 mb-4">
          <h6 className="fw-700 mb-3"><i className="bi bi-bar-chart me-2 text-primary" />Score Trend</h6>
          <div style={{ height: 220 }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Table */}
      {analyses.length === 0 ? (
        <div className="card-custom p-5 text-center">
          <i className="bi bi-file-earmark-x display-3 text-muted mb-3 d-block" />
          <h5 className="fw-700">No analyses yet</h5>
          <p className="text-muted mb-3">Upload your resume to get started!</p>
          <Link to="/analyze" className="btn btn-primary rounded-pill px-4" style={{ background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', border: 'none' }}>
            <i className="bi bi-upload me-2" />Analyze My Resume
          </Link>
        </div>
      ) : (
        <div className="card-custom overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <tr>
                  <th className="px-4 py-3 fw-700 small text-uppercase" style={{ letterSpacing: 0.5, color: '#64748b' }}>Resume</th>
                  <th className="py-3 fw-700 small text-uppercase" style={{ letterSpacing: 0.5, color: '#64748b' }}>Job Title</th>
                  <th className="py-3 fw-700 small text-uppercase" style={{ letterSpacing: 0.5, color: '#64748b' }}>ATS Score</th>
                  <th className="py-3 fw-700 small text-uppercase d-none d-md-table-cell" style={{ letterSpacing: 0.5, color: '#64748b' }}>Keywords</th>
                  <th className="py-3 fw-700 small text-uppercase d-none d-lg-table-cell" style={{ letterSpacing: 0.5, color: '#64748b' }}>Date</th>
                  <th className="pe-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {analyses.map((a) => (
                  <tr
                    key={a._id}
                    className="history-row"
                    onClick={() => navigate(`/results/${a._id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className="bi bi-file-earmark-text text-primary" />
                        </div>
                        <div>
                          <p className="mb-0 fw-600 small" style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {a.resumeFileName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="small text-muted">{a.jobTitle || '—'}</span>
                    </td>
                    <td className="py-3">
                      <ScoreBadge score={a.overallScore} label={a.scoreLabel} />
                    </td>
                    <td className="py-3 d-none d-md-table-cell">
                      <span className="small text-muted">{a.keywordScore}% match</span>
                    </td>
                    <td className="py-3 d-none d-lg-table-cell">
                      <span className="small text-muted">{new Date(a.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="pe-4 py-3">
                      <div className="d-flex gap-1 justify-content-end" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn btn-sm btn-outline-primary rounded-pill px-2"
                          title="View"
                          onClick={() => navigate(`/results/${a._id}`)}
                        >
                          <i className="bi bi-eye" />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill px-2"
                          title="Delete"
                          disabled={deletingId === a._id}
                          onClick={(e) => handleDelete(e, a._id)}
                        >
                          {deletingId === a._id
                            ? <span className="spinner-border" style={{ width: 12, height: 12, borderWidth: 2 }} />
                            : <i className="bi bi-trash" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-2 py-3 border-top">
              <button
                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <i className="bi bi-chevron-left" />
              </button>
              <span className="small fw-600 text-muted">Page {page} of {pagination.pages}</span>
              <button
                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                disabled={page === pagination.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
