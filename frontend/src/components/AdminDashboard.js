import React, { useState, useEffect } from "react";
import SidebarLayout from "./SidebarLayout";
import API from "../api";
import { Users, Hospital, ShieldCheck, Settings, UserPlus, Trash2 } from 'lucide-react';

function AdminDashboard({ user, onLogout }) {
    const [stats, setStats] = useState({ totalUsers: 0, totalHospitals: 0, totalPatients: 0 });
    const [hospitals, setHospitals] = useState([]);
    const [systemLogs, setSystemLogs] = useState([
        { id: 1, action: 'User Logout', user: 'dr_smith', time: '2 mins ago' },
        { id: 2, action: 'New Patient Added', user: 'dr_smith', time: '1 hour ago' },
        { id: 3, action: 'System Backup', user: 'System', time: '4 hours ago' },
    ]);

    useEffect(() => {
        API.get('planner/hospitals/').then(res => {
            setHospitals(res.data);
            setStats(prev => ({ ...prev, totalHospitals: res.data.length }));
        });
        // In a production app, we would fetch global counts
    }, []);

    const handleDeleteHospital = (id) => {
        if (window.confirm("Are you sure you want to remove this hospital node?")) {
            API.delete(`planner/hospitals/${id}/`).then(() => {
                setHospitals(hospitals.filter(h => h.id !== id));
                setStats(prev => ({ ...prev, totalHospitals: prev.totalHospitals - 1 }));
            });
        }
    };

    const navItems = [
        { label: "Control Center", path: "/dashboard", icon: "bi bi-speedometer2" },
        { label: "User Management", path: "/users", icon: "bi bi-people" },
        { label: "Facility Nodes", path: "/facilities", icon: "bi bi-building" },
        { label: "Security Logs", path: "/logs", icon: "bi bi-shield-lock" },
    ];

    return (
        <SidebarLayout user={user} onLogout={onLogout} navItems={navItems}>
            <div className="row g-4 mb-4">
                {[
                    { label: 'Active Users', val: '142', icon: <Users size={20} />, color: 'primary' },
                    { label: 'Total Hospitals', val: stats.totalHospitals, icon: <Hospital size={20} />, color: 'info' },
                    { label: 'Security Level', val: 'Maximum', icon: <ShieldCheck size={20} />, color: 'success' }
                ].map((s, i) => (
                    <div key={i} className="col-md-4">
                        <div className="stat-card border-0 shadow-sm animate__animated animate__fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1 fw-bold text-uppercase">{s.label}</p>
                                    <h2 className="fw-bold mb-0">{s.val}</h2>
                                </div>
                                <div className={`bg-${s.color}-subtle text-${s.color} p-3 rounded-4`}>
                                    {s.icon}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="glass-card mb-4 p-4 border-0 shadow-sm">
                        <h5 className="fw-bold mb-4">Global Facility Management</h5>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr className="small text-muted">
                                        <th>Hospital Name</th>
                                        <th>Location</th>
                                        <th>Bed Occupancy</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hospitals.map(h => (
                                        <tr key={h.id}>
                                            <td className="fw-bold">{h.name}</td>
                                            <td>{h.location}</td>
                                            <td style={{ width: '200px' }}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="progress flex-grow-1 rounded-pill" style={{ height: '6px' }}>
                                                        <div className="progress-bar" style={{ width: `${(h.available_beds / h.total_beds) * 100}%` }}></div>
                                                    </div>
                                                    <span className="small text-muted">{h.available_beds}/{h.total_beds}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <button onClick={() => handleDeleteHospital(h.id)} className="btn btn-sm btn-outline-danger rounded-circle border-0"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="glass-card p-4 border-0 shadow-sm">
                        <h5 className="fw-bold mb-4">Real-time System Audit</h5>
                        <div className="list-group list-group-flush">
                            {systemLogs.map(log => (
                                <div key={log.id} className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 border-bottom">
                                    <div>
                                        <span className="fw-bold me-2">{log.action}</span>
                                        <span className="text-muted small">by {log.user}</span>
                                    </div>
                                    <span className="badge bg-light text-dark rounded-pill">{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="glass-card p-4 border-0 shadow-sm h-100">
                        <h6 className="fw-bold mb-4 d-flex align-items-center"><Settings className="me-2 text-primary" /> Master System Controls</h6>

                        <div className="d-grid gap-3">
                            <button className="btn btn-primary rounded-pill py-3 fw-bold shadow">
                                <UserPlus size={18} className="me-2" /> Provision New Specialist
                            </button>
                            <button className="btn btn-outline-primary rounded-pill py-3 fw-bold">
                                <Hospital size={18} className="me-2" /> Link New Cancer Center
                            </button>
                            <button className="btn btn-outline-dark rounded-pill py-3 fw-bold">
                                <ShieldCheck size={18} className="me-2" /> Backup Clinical Database
                            </button>
                        </div>

                        <div className="mt-5 pt-4 border-top">
                            <h6 className="fw-bold mb-3 small text-muted text-uppercase">Project Deployment Status</h6>
                            <ul className="list-unstyled">
                                <li className="d-flex align-items-center mb-2 small">
                                    <span className="bg-success rounded-circle p-1 me-2" style={{ width: '8px', height: '8px' }}></span>
                                    API Cluster: Online
                                </li>
                                <li className="d-flex align-items-center mb-2 small">
                                    <span className="bg-success rounded-circle p-1 me-2" style={{ width: '8px', height: '8px' }}></span>
                                    CDN Artifacts: Active
                                </li>
                                <li className="d-flex align-items-center mb-0 small">
                                    <span className="bg-warning rounded-circle p-1 me-2" style={{ width: '8px', height: '8px' }}></span>
                                    Reminders Queue: processing...
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}

export default AdminDashboard;
