import React, { useState } from "react";
import API from "./api";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "parent",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("register/", formData);
      alert("Registration successful! Please login.");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
  <div className="container mt-4">
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="text-center mb-3">Register</h3>

            <form onSubmit={handleSubmit}>
              <input
                className="form-control mb-2"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                required
              />

              <input
                className="form-control mb-2"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />

              <input
                className="form-control mb-2"
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />

              <select
                className="form-control mb-3"
                name="role"
                onChange={handleChange}
              >
                <option value="parent">Parent</option>
                <option value="doctor">Doctor</option>
              </select>

              <button className="btn btn-success w-100" type="submit">
                Register
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  </div>
);

}

export default Register;
