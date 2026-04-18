import { useEffect, useState } from "react";
import API from "../api";
import ParentPatientDashboard from "../components/ParentPatientDashboard";
import DoctorDashboard from "../components/Doctordashboard";
import AdminDashboard from "../components/AdminDashboard";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  useEffect(() => {
    API.get("profile/")
      .then((res) => setUser(res.data))
      .catch(() => {
        const local = JSON.parse(localStorage.getItem("currentUser") || "null");
        if (local) {
          setUser(local);
        } else {
          handleLogout();
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (user.role === "doctor") {
    return <DoctorDashboard user={user} onLogout={handleLogout} />;
  }

  if (user.role === "admin") {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return <ParentPatientDashboard user={user} onLogout={handleLogout} />;
}

export default Dashboard;
