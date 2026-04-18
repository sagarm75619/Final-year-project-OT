import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
          <i className="bi bi-heart-pulse-fill me-2"></i>
          OncoPlanner
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="btn btn-primary rounded-pill px-4 fw-bold" to="/register">
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
