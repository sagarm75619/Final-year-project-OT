import React, { useState } from "react";
import API from "./api";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("login/", {
        username,
        password,
      });

      // SimpleJWT returns { access, refresh } — store the access token
      localStorage.setItem("token", res.data.access);
      onLogin(); // notify App
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
  <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-4">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="text-center mb-3">Login</h3>

            <form onSubmit={handleSubmit}>
              <input
                className="form-control mb-3"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <input
                className="form-control mb-3"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button className="btn btn-primary w-100" type="submit">
                Login
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  </div>
);

}

export default Login;
