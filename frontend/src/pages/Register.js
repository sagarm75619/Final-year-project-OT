import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "parent_patient",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("register/", formData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.find((u) => u.username === formData.username)) {
        alert("Username already exists (local)");
        return;
      }
      users.push(formData);
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registration successful (local). Please login.");
      navigate("/login");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#9cb6fc", position: "relative" }}>
      
      {/* Top Bar for Home button */}
      <div className="position-absolute top-0 start-0 w-100 p-4 d-flex justify-content-between align-items-center z-3">
         <div className="d-flex align-items-center">
            <div className="bg-white rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center me-2" style={{width: 40, height: 40}}>
                <i className="bi bi-activity text-primary fs-5"></i>
            </div>
            <span className="fw-bold text-white fs-5 tracking-wide text-shadow">ONCOPLANNER</span>
         </div>
         <a href="/" className="btn btn-light rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center">
            <i className="bi bi-house-door-fill me-2 text-dark"></i> Home
         </a>
      </div>

      <div className="container position-relative z-2" style={{ maxWidth: "1000px", marginTop: "40px" }}>
        <div className="bg-white rounded-5 shadow-lg overflow-hidden border-0">
          <div className="row g-0">
            
            {/* Left Side: Medical Illustration & Greeting */}
            <div className="col-md-5 d-none d-md-flex flex-column position-relative" style={{ backgroundColor: "#ffffff", minHeight: "550px" }}>
              
              {/* Background decorative curved shape */}
              <div 
                className="position-absolute bottom-0 start-0 w-100" 
                style={{
                  height: "70%",
                  backgroundColor: "#a0e0d1",
                  borderTopRightRadius: "100% 50%",
                  borderTopLeftRadius: "10%",
                  zIndex: 0
                }}
              ></div>

              {/* Little circle decorations */}
              <div className="position-absolute" style={{ top: '60px', left: '70px', width: '25px', height: '25px', borderRadius: '50%', border: '4px solid #fcf0ce', zIndex: 1 }}></div>

              {/* Text content */}
              <div className="p-5 position-relative z-2">
                <h1 className="fw-bold mb-2 text-dark" style={{ fontSize: "3.5rem", letterSpacing: "-1px" }}>
                  HELLO <span style={{ color: "#3dc5a5" }}>!</span>
                </h1>
                <p className="text-muted fs-5 lh-sm pe-4" style={{ fontWeight: "500" }}>
                  Please enter your details<br/>to continue
                </p>
              </div>

              {/* 3D Doctor Image */}
              <img 
                src="/register-doctor.png" 
                alt="3D Doctor" 
                className="position-absolute bottom-0 end-0"
                style={{ width: "85%", height: "auto", mixBlendMode: "multiply", zIndex: 2, marginRight: "-15px" }} 
              />
            </div>

            {/* Right Side: Register Form */}
            <div className="col-md-7 d-flex flex-column justify-content-center p-4 p-md-5 bg-white position-relative z-3 shadow-start">
              <div className="mx-auto w-100" style={{ maxWidth: "380px" }}>
                
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-dark">Registration</h3>
                  <p className="small text-muted">Empowering pediatric oncology care</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Username</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 rounded-start-3 py-2 px-3">
                        <i className="bi bi-person text-muted"></i>
                      </span>
                      <input
                        className="form-control bg-light border-0 rounded-end-3 py-2 px-3"
                        name="username"
                        type="text"
                        placeholder="Enter username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ fontSize: "14px" }}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 rounded-start-3 py-2 px-3">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        className="form-control bg-light border-0 rounded-end-3 py-2 px-3"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ fontSize: "14px" }}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 rounded-start-3 py-2 px-3">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        className="form-control bg-light border-0 rounded-end-3 py-2 px-3"
                        type="password"
                        name="password"
                        placeholder="Min 8 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ fontSize: "14px" }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-dark">I am a...</label>
                    <div className="input-group shadow-sm rounded-3">
                      <span className="input-group-text bg-white border-primary rounded-start-3 py-2 px-3">
                        <i className="bi bi-hospital text-primary"></i>
                      </span>
                      <select
                        className="form-select bg-white border-primary border-start-0 rounded-end-3 px-3 py-2 fw-medium text-primary"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        style={{ cursor: "pointer", fontSize: "14px" }}
                      >
                        <option value="parent_patient">Parent / Patient</option>
                        <option value="doctor">Medical Doctor</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary w-100 rounded-3 py-2 fw-bold shadow-sm" 
                    type="submit"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Create Account
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="small text-muted mb-0">
                    Already have an account? <a href="/login" className="text-primary text-decoration-none fw-bold">Login Here</a>
                  </p>
                </div>
                
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
