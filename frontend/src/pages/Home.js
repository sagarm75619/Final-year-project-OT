import Navbar from "../components/Navbar";
import heroImg from "../assests/bed.jpg";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Navbar />

      <div className="container-fluid min-vh-100 d-flex align-items-center" style={{
        background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
        color: 'white',
        padding: '5rem 0'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <span className="badge bg-white text-primary rounded-pill px-3 py-2 mb-3 fw-bold">Next-Gen Care Management</span>
              <h1 className="display-3 fw-bold mb-4">
                Moving Pediatric Oncology Forward
              </h1>
              <p className="lead mb-5 opacity-75" style={{ fontSize: '1.25rem' }}>
                A smart, patient-centric ecosystem connecting families, doctors, and survivors
                to navigate the journey of hope and healing.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-bold text-primary shadow">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg rounded-pill px-5 py-3 fw-bold border-2">
                  Sign In
                </Link>
              </div>

              <div className="mt-5 d-flex align-items-center gap-4 opacity-75">
                <div className="text-center">
                  <h4 className="fw-bold mb-0">12k+</h4>
                  <p className="small mb-0">Families Supported</p>
                </div>
                <div className="vr" style={{ height: '30px' }}></div>
                <div className="text-center">
                  <h4 className="fw-bold mb-0">500+</h4>
                  <p className="small mb-0">Top Care Specialists</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-block">
              <div className="position-relative">
                <div className="position-absolute top-50 start-50 translate-middle bg-white opacity-10 rounded-circle" style={{ width: '120%', paddingTop: '120%' }}></div>
                <img
                  src={heroImg}
                  alt="Healthcare"
                  className="img-fluid rounded-5 shadow-lg position-relative"
                  style={{ zIndex: 2, transform: 'rotate(2deg)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5 mt-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Designed for Every Role</h2>
          <p className="text-muted">A comprehensive platform tailored for clinical success and patient comfort.</p>
        </div>
        <div className="row g-4">
          {[
            { title: 'For Doctors', desc: 'Precision tools for treatment planning and patient monitoring.', icon: 'bi-person-badge' },
            { title: 'For Parents', desc: 'Unified view of progress, appointments, and care resources.', icon: 'bi-shield-heart' },
            { title: 'For Patients', desc: 'Interactive engagement and daily wellness tracking.', icon: 'bi-emoji-smile' }
          ].map((role, i) => (
            <div key={i} className="col-md-4">
              <div className="glass-card p-4 h-100 text-center hover-lift">
                <div className="bg-primary-subtle text-primary rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                  <i className={`bi ${role.icon} fs-3`}></i>
                </div>
                <h5 className="fw-bold">{role.title}</h5>
                <p className="text-muted small">{role.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
