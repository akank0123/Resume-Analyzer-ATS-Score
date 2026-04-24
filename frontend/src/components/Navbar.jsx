import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top py-2">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="navbar-brand-logo">
            <i className="bi bi-file-earmark-text-fill" style={{ fontSize: 16 }} />
          </span>
          <span className="fw-700" style={{ fontSize: '1.15rem', color: '#0f172a' }}>
            Resume<span className="gradient-text">AI</span>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-custom${isActive ? ' active' : ''}`} to="/" end>
                <i className="bi bi-house me-1" />Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-custom${isActive ? ' active' : ''}`} to="/analyze">
                <i className="bi bi-search me-1" />Analyze
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-link-custom${isActive ? ' active' : ''}`} to="/history">
                <i className="bi bi-clock-history me-1" />History
              </NavLink>
            </li>
            <li className="nav-item ms-lg-2">
              <Link to="/analyze" className="btn btn-primary px-4 rounded-pill" style={{ background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', border: 'none' }}>
                <i className="bi bi-lightning-fill me-1" />Analyze Now
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
