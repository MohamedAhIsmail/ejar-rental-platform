import { Link } from 'react-router-dom';
import './NotFound.css';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Not Found | EJAR';
  }, []);

  return (
    <div className="not-found-wrapper d-flex flex-column justify-content-center align-items-center text-center vh-100 w-100 px-3">
      <i className="fas fa-compass fa-5x mb-4 text-main-color subtle-icon"></i>

      <h1
        className="display-4 fw-bold mb-3 text-main-color "
        style={{ fontSize: '56px', fontWeight: '700' }}
      >
        Oops! Page Not Found (404)
      </h1>

      <p className="fs-5 text-muted mb-2">
        You've reached a page that doesn't exist, might've been moved, or is
        temporarily unavailable.
      </p>
      <p className="fs-6 text-muted mb-2">
        Check the URL for typos, or choose a helpful action below.
      </p>
      <p className="fs-6 text-muted mb-4">
        If the problem persists, contact support or return to a known section.
      </p>

      <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
        <Link to="/" className="btn btn-main">
          <i className="fas fa-home me-2"></i> Home
        </Link>

        <Link to="/product" className="btn btn-outline-dark">
          <i className="fas fa-box-open me-2"></i> All Products
        </Link>
      </div>

      <p className="text-muted small">
        Need help?{' '}
        <a href="mailto:support@Ejar.com" className="contact-link">
          Contact Support
        </a>
      </p>
    </div>
  );
}
