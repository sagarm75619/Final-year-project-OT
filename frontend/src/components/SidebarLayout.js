import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileModal from "./ProfileModal";

function SidebarLayout({ user, onLogout, children, navItems, topRight }) {
    const location = useLocation();
    const [showProfile, setShowProfile] = useState(false);

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="p-4">
                    <h4 className="fw-bold text-primary">OncoPlanner</h4>
                </div>

                <nav className="mt-2">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path || "#"}
                            onClick={(e) => {
                                if (item.onClick) {
                                    e.preventDefault();
                                    item.onClick();
                                }
                            }}
                            className={`nav-link-custom ${item.isActive ? 'active' : ''}`}
                        >
                            <i className={`${item.icon} me-3`}></i>
                            {item.label}
                        </Link>
                    ))}

                    <div className="mt-5 pt-5 border-top mx-3">
                        <div className="px-3 mb-2 small text-muted">USER</div>
                        <div className="px-3 mb-4 fw-bold text-truncate">{user.username}</div>
                        <button className="btn btn-outline-danger w-100 rounded-pill" onClick={onLogout}>
                            <i className="bi bi-box-arrow-right me-2"></i> Logout
                        </button>
                    </div>
                </nav>
            </div>

            <div className="main-content">
                <header className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="dashboard-heading mb-0">
                            {user.role === 'parent_patient' ? 'Parent/Patient' : user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal
                        </h2>
                        <p className="text-muted">Welcome to your secure management workspace</p>
                    </div>
                    <div className="d-flex align-items-center">
                        {topRight}
                        <div 
                            className="ms-3 position-relative pointer hover-lift transition" 
                            style={{cursor: 'pointer'}} 
                            onClick={() => setShowProfile(true)}
                        >
                            <img src={`https://ui-avatars.com/api/?name=${user.username}&background=2563EB&color=fff&bold=true`} className="rounded-circle shadow-sm border border-2 border-white" width="45" alt="profile" />
                            <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-white border-2 rounded-circle"></span>
                        </div>
                    </div>
                </header>

                {children}
            </div>

            <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
        </div>
    );
}

export default SidebarLayout;
