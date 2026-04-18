import React, { useState } from "react";
import API from "../api";

function Login({ onLogin }) {
  const [username, setUsername] = useState("Rabin");
  const [password, setPassword] = useState("12345678");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("login/", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("currentUser", JSON.stringify({ username }));
      if (onLogin) onLogin();
    } catch (err) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
      if (user) {
        localStorage.setItem("token", `local-${username}`);
        localStorage.setItem("currentUser", JSON.stringify(user));
        if (onLogin) onLogin();
      } else {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#e2f6f8" }}>
      
      {/* Top Bar for Home button */}
      <div className="position-absolute top-0 start-0 w-100 p-4 d-flex justify-content-between align-items-center">
         <div className="d-flex align-items-center">
            <div className="bg-white rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center me-2" style={{width: 40, height: 40}}>
                <i className="bi bi-activity text-success fs-5"></i>
            </div>
            <span className="fw-bold text-dark fs-5 tracking-wide">ONCOPLANNER</span>
         </div>
         <a href="/" className="btn btn-light rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center">
            <i className="bi bi-house-door-fill me-2 text-dark"></i> Home
         </a>
      </div>

      <div className="container" style={{ maxWidth: "1000px", marginTop: "60px" }}>
        <div className="bg-white rounded-5 shadow-lg overflow-hidden border-0">
          <div className="row g-0">
            
            {/* Left Side: Medical Illustration */}
            <div className="col-md-7 d-none d-md-flex align-items-center justify-content-center" style={{ backgroundColor: "#eafbfa", minHeight: "500px" }}>
              <img 
                src="/login-illustration.png" 
                alt="Medical Professionals" 
                style={{ width: "90%", height: "auto", mixBlendMode: "multiply" }} 
              />
            </div>

            {/* Right Side: Login Form */}
            <div className="col-md-5 d-flex align-items-center justify-content-center p-4 p-md-5 bg-white">
              <div className="w-100" style={{ maxWidth: "340px" }}>
                
                <div className="text-center mb-4">
                  <div className="d-flex justify-content-center mb-3">
                    <div className="d-flex align-items-center justify-content-center rounded-3 bg-opacity-10 bg-info" style={{ width: '60px', height: '60px' }}>
                        <i className="bi bi-heart-pulse-fill fs-1" style={{ color: '#00a8a8' }}></i>
                    </div>
                  </div>
                  <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
                  <p className="small text-muted mb-0">Please enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: "#f8fdfd" }}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold" style={{ color: '#00a8a8' }}>Hospital ID / Username</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 rounded-start-3 py-2 px-3">
                        <i className="bi bi-person-badge" style={{ color: '#00a8a8' }}></i>
                      </span>
                      <input
                        className="form-control border-start-0 rounded-end-3 py-2 px-3 fw-medium"
                        type="text"
                        name="username"
                        autoComplete="username"
                        placeholder="e.g. Rabin"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ fontSize: "14px", backgroundColor: "white" }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold" style={{ color: '#00a8a8' }}>Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 rounded-start-3 py-2 px-3">
                        <i className="bi bi-lock-fill" style={{ color: '#00a8a8' }}></i>
                      </span>
                      <input
                        className="form-control border-start-0 rounded-end-3 py-2 px-3 fw-medium"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ fontSize: "14px", backgroundColor: "white" }}
                      />
                    </div>
                  </div>

                  <button 
                    className="btn w-100 rounded-3 py-2 fw-bold text-white shadow-sm mt-2" 
                    type="submit"
                    style={{ backgroundColor: "#00a8a8", letterSpacing: "1px" }}
                  >
                    LOGIN
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="small text-muted mb-0">
                    Staff registration? <a href="/register" className="text-decoration-none fw-bold" style={{ color: '#00a8a8' }}>Create Profile</a>
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

export default Login;
