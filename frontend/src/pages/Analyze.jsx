import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resumeAPI } from '../services/api';
import AnalyzingOverlay from '../components/AnalyzingOverlay';

export default function Analyze() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|doc|docx)$/i)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }
    setFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a resume file'); return; }

    setLoading(true);
    setProgress(10);

    const ticker = setInterval(() => {
      setProgress((p) => (p < 85 ? p + Math.random() * 8 : p));
    }, 600);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobTitle', jobTitle);
      formData.append('jobDescription', jobDescription);

      const res = await resumeAPI.analyze(formData);

      clearInterval(ticker);
      setProgress(100);

      setTimeout(() => {
        navigate(`/results/${res.data._id}`);
      }, 400);
    } catch (err) {
      clearInterval(ticker);
      setLoading(false);
      setProgress(0);
      toast.error(err.message);
    }
  };

  return (
    <>
      {loading && <AnalyzingOverlay progress={progress} />}

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <span className="badge rounded-pill px-3 py-2 mb-2" style={{ background: 'rgba(79,70,229,0.1)', color: '#4f46e5', fontSize: '0.8rem' }}>
                <i className="bi bi-upload me-1" />Upload &amp; Analyze
              </span>
              <h2 className="fw-800 mb-2">Analyze Your Resume</h2>
              <p className="text-muted">Upload your resume and optionally paste a job description for targeted keyword analysis</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Upload Zone */}
              <div className="card-custom p-4 mb-4">
                <label className="fw-700 mb-2 d-block">
                  <i className="bi bi-file-earmark-text me-2 text-primary" />
                  Resume File <span className="text-danger">*</span>
                </label>
                <div
                  className={`upload-zone${dragOver ? ' drag-over' : ''}${file ? ' has-file' : ''}`}
                  onClick={() => fileInputRef.current.click()}
                  onDrop={onDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="d-none"
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                  {file ? (
                    <div>
                      <i className="bi bi-file-earmark-check-fill display-4 d-block mb-2" style={{ color: '#10b981' }} />
                      <p className="fw-700 mb-1" style={{ color: '#10b981' }}>{file.name}</p>
                      <p className="text-muted small mb-2">{(file.size / 1024).toFixed(0)} KB</p>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary rounded-pill"
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      >
                        <i className="bi bi-x me-1" />Change File
                      </button>
                    </div>
                  ) : (
                    <div>
                      <i className="bi bi-cloud-upload display-4 d-block mb-2 text-primary" />
                      <p className="fw-600 mb-1">Drag &amp; drop your resume here</p>
                      <p className="text-muted small mb-3">or click to browse</p>
                      <span className="badge bg-light text-muted border">PDF</span>{' '}
                      <span className="badge bg-light text-muted border">DOC</span>{' '}
                      <span className="badge bg-light text-muted border">DOCX</span>
                      <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.75rem' }}>Maximum 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Info */}
              <div className="card-custom p-4 mb-4">
                <h6 className="fw-700 mb-3">
                  <i className="bi bi-briefcase me-2 text-primary" />Job Information
                  <span className="badge ms-2 rounded-pill" style={{ fontSize: '0.7rem', background: 'rgba(79,70,229,0.1)', color: '#4f46e5' }}>Optional but recommended</span>
                </h6>
                <div className="mb-3">
                  <label className="form-label fw-600 small">Job Title</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. Senior Frontend Developer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>
                <div>
                  <label className="form-label fw-600 small">Job Description</label>
                  <textarea
                    className="form-control rounded-3"
                    rows={7}
                    placeholder="Paste the full job description here for accurate keyword matching and targeted AI suggestions..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    style={{ borderColor: '#e2e8f0', resize: 'vertical' }}
                  />
                  <div className="d-flex justify-content-between mt-1">
                    <small className="text-muted">Tip: Include the full job posting for best results</small>
                    <small className="text-muted">{jobDescription.length} chars</small>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-lg w-100 rounded-pill fw-700 py-3"
                style={{ background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', color: 'white', border: 'none', fontSize: '1.05rem' }}
                disabled={loading || !file}
              >
                <i className="bi bi-lightning-fill me-2" />
                Analyze Resume Now
              </button>

              <p className="text-center text-muted small mt-3">
                <i className="bi bi-shield-check me-1" />Your resume is processed securely and not stored permanently
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
