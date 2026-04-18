import React, { useState, useEffect } from "react";
import SidebarLayout from "./SidebarLayout";
import DigitalCalendar from "./planner/DigitalCalendar";
import MedicineTracker from "./planner/MedicineTracker";
import BloodReportCenter from "./planner/BloodReportCenter";
import ProgressCharts from "./planner/ProgressCharts";
import AdvancedCareEcosystem from "./planner/AdvancedCareEcosystem";
import API from "../api";
import { Info, Utensils, ClipboardCheck, MessageCircle, Heart } from 'lucide-react';

import AIChatBot from "./planner/AIChatBot";
import NotificationCenter from "./planner/NotificationCenter";

function ParentPatientDashboard({ user, onLogout }) {
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [reports, setReports] = useState([]);
    const [nutrition, setNutrition] = useState(null);
    const [notes, setNotes] = useState([]);
    const [activeTab, setActiveTab] = useState("My Care View");

    const fetchData = (childId) => {
        API.get(`planner/reports/?patient_id=${childId}`).then(res => setReports(res.data)).catch(e => console.error(e));
        API.get(`planner/nutrition/?patient_id=${childId}`).then(res => {
            if (res.data.length > 0) setNutrition(res.data[0]);
            else setNutrition(null);
        }).catch(e => console.error(e));
        API.get(`planner/notes/?patient_id=${childId}`).then(res => setNotes(res.data)).catch(e => console.error(e));
    };

    useEffect(() => {
        API.get('planner/patients/').then(res => {
            setChildren(res.data);
            if (res.data.length > 0) {
                setSelectedChild(res.data[0]);
                fetchData(res.data[0].id);
            }
        }).catch(err => {
            console.error("Critical error fetching patients", err);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChildSelect = (child) => {
        setSelectedChild(child);
        fetchData(child.id);
    };

    const navItems = [
        { label: "My Care View", icon: "bi bi-grid-1x2-fill", isActive: activeTab === "My Care View", onClick: () => setActiveTab("My Care View") },
        { label: "Calendar", icon: "bi bi-calendar-event", isActive: activeTab === "Calendar", onClick: () => setActiveTab("Calendar") },
        { label: "Med Tracker", icon: "bi bi-capsule", isActive: activeTab === "Med Tracker", onClick: () => setActiveTab("Med Tracker") },
        { label: "Reports", icon: "bi bi-file-earmark-medical", isActive: activeTab === "Reports", onClick: () => setActiveTab("Reports") },
        { label: "Community & Care", icon: "bi bi-heart-pulse", isActive: activeTab === "Community & Care", onClick: () => setActiveTab("Community & Care") },
    ];

    if (!selectedChild) {
        return (
            <SidebarLayout user={user} onLogout={onLogout} navItems={navItems} topRight={null}>
                <div className="text-center p-5 bg-white rounded-4 shadow-sm border-0 mt-5 mx-auto" style={{maxWidth: "700px"}}>
                    <div className="bg-primary-subtle text-primary d-inline-flex p-4 rounded-circle mb-4">
                        <Heart size={48} />
                    </div>
                    <h3 className="fw-bold font-poppins text-dark mb-3">Welcome to OncoPlanner</h3>
                    <p className="text-muted font-inter fw-medium mb-4 fs-5 p-3 bg-light rounded-4">
                        You are currently logged in as a Parent/Patient, but no clinical profiles are linked to your account yet.
                    </p>
                    <div className="alert alert-info rounded-4 d-inline-block px-5 shadow-sm border-info-subtle text-start w-100">
                        <h6 className="fw-bold text-info-emphasis mb-2 d-flex align-items-center"><Info className="me-2" size={18}/> Next Steps</h6>
                        <p className="mb-0 text-dark font-inter">Please securely provide your registered email address (<strong>{user.email}</strong>) to your pediatric oncologist to instantly link your clinical profile and treatment timeline.</p>
                    </div>
                </div>
            </SidebarLayout>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case "Calendar":
                return (
                    <div className="glass-card p-4">
                        <h4 className="fw-bold mb-4">Treatment Calendar: {selectedChild.name}</h4>
                        <DigitalCalendar patientId={selectedChild.id} />
                    </div>
                );
            case "Med Tracker":
                return (
                    <div className="glass-card p-4">
                        <h4 className="fw-bold mb-4">Medication & Supplies Tracker</h4>
                        <MedicineTracker patientId={selectedChild.id} />
                    </div>
                );
            case "Reports":
                return (
                    <div className="glass-card p-4">
                        <h4 className="fw-bold mb-4">Clinical Blood Reports</h4>
                        <BloodReportCenter patientId={selectedChild.id} />
                        <div className="mt-4">
                            <ProgressCharts reports={reports} />
                        </div>
                    </div>
                );
            case "Community & Care":
                return (
                    <AdvancedCareEcosystem patientId={selectedChild.id} />
                );
            default:
                return (
                    <div className="row g-4 mb-4">
                        <div className="col-lg-8">
                            <div className="d-flex align-items-center mb-4 p-4 rounded-4 shadow-sm border-0 bg-white hover-lift transition">
                                <div className="position-relative me-4">
                                    <img src={`https://ui-avatars.com/api/?name=${selectedChild.name}&background=eff6ff&color=2563EB&bold=true`} className="rounded-circle shadow-sm" width="85" alt="patient avatar" />
                                    <span className="position-absolute bottom-0 end-0 p-2 bg-success border border-white border-2 rounded-circle" title="Active Account"></span>
                                </div>
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h2 className="fw-bold mb-1 font-poppins text-dark" style={{ letterSpacing: "-0.5px" }}>{selectedChild.name}</h2>
                                            <div className="d-flex align-items-center gap-2 mt-2">
                                                <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill font-inter shadow-sm">
                                                    ID: <strong>ONCO-{selectedChild.id}</strong>
                                                </span>
                                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill font-inter shadow-sm">
                                                    Diagnosis: <strong>{selectedChild.diagnosis}</strong>
                                                </span>
                                            </div>
                                        </div>
                                        {children.length > 1 && (
                                            <select className="form-select w-auto rounded-pill shadow-sm bg-light font-inter border-0 pe-4" value={selectedChild.id} onChange={(e) => handleChildSelect(children.find(c => c.id === parseInt(e.target.value)))}>
                                                {children.map(c => <option key={c.id} value={c.id}>Switch to {c.name}</option>)}
                                            </select>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <DigitalCalendar patientId={selectedChild.id} />
                            </div>

                            <div className="row g-4">
                                <div className="col-md-6">
                                    <BloodReportCenter patientId={selectedChild.id} />
                                </div>
                                <div className="col-md-6">
                                    <ProgressCharts reports={reports} />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="mb-4">
                                <MedicineTracker patientId={selectedChild.id} />
                            </div>

                            <div className="bg-white rounded-4 shadow-sm p-4 mb-4 border-0 hover-lift transition">
                                <h6 className="fw-bold mb-3 font-poppins text-dark d-flex align-items-center">
                                    <div className="bg-primary-subtle p-2 rounded-3 me-3 text-primary">
                                        <Utensils size={18} />
                                    </div>
                                    Clinical Nutrition Plan
                                </h6>
                                {nutrition ? (
                                    <div className="p-3 bg-light border rounded-4 mb-0">
                                        <p className="small mb-0 text-dark font-inter fw-medium" style={{lineHeight: "1.6"}}>{nutrition.plan_details}</p>
                                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill font-inter shadow-sm">Active Plan</span>
                                            <small className="text-muted d-block font-inter"><i className="bi bi-clock-history me-1"></i> Updated {new Date(nutrition.updated_at).toLocaleDateString()}</small>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="small text-muted mb-0 font-inter italic text-center p-3 bg-light rounded-4">No specific nutrition plan assigned.</p>
                                )}
                            </div>

                            <div className="bg-white rounded-4 shadow-sm p-4 mb-4 border-0 hover-lift transition">
                                <h6 className="fw-bold mb-3 font-poppins text-dark d-flex align-items-center">
                                    <div className="bg-primary-subtle p-2 rounded-3 me-3 text-primary">
                                        <MessageCircle size={18} />
                                    </div>
                                    Clinical Advice History
                                </h6>
                                <div className="history-scroll pe-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {notes.length > 0 ? notes.map((note, idx) => (
                                        <div key={idx} className="bg-light border-0 shadow-sm rounded-4 p-3 mb-3 hover-lift transition">
                                            <p className="mb-2 fw-medium text-dark font-inter" style={{fontSize: "14px"}}>"{note.content}"</p>
                                            <div className="d-flex justify-content-between align-items-center small text-muted pt-2 mt-2 border-top">
                                                <span className="font-poppins fw-bold text-primary"><i className="bi bi-person-badge"></i> Dr. {note.doctor_name}</span>
                                                <span className="font-inter bg-white px-2 py-1 rounded shadow-sm">{new Date(note.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="small text-muted mb-0 font-inter italic text-center p-3 bg-light rounded-4">No clinical notes found on record.</p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                {/* Component moved to AdvancedCareEcosystem */}
                            </div>

                            <div className="bg-white rounded-4 shadow-sm p-4 border-0 hover-lift transition">
                                <h6 className="fw-bold mb-3 font-poppins text-dark d-flex align-items-center">
                                    <div className="bg-primary-subtle p-2 rounded-3 me-3 text-primary">
                                        <ClipboardCheck size={18} />
                                    </div>
                                    Pre-Appointment Checklist
                                </h6>
                                <div className="bg-light p-3 rounded-4">
                                    <div className="form-check mb-3 custom-checkbox">
                                        <input className="form-check-input shadow-sm" type="checkbox" id="l1" />
                                        <label className="form-check-label small font-inter text-dark fw-medium mt-1 ms-1" htmlFor="l1">Fasting Instructions Followed</label>
                                    </div>
                                    <div className="form-check mb-3 custom-checkbox">
                                        <input className="form-check-input shadow-sm" type="checkbox" id="l2" />
                                        <label className="form-check-label small font-inter text-dark fw-medium mt-1 ms-1" htmlFor="l2">Previous Clinical Reports</label>
                                    </div>
                                    <div className="form-check mb-0 custom-checkbox">
                                        <input className="form-check-input shadow-sm bg-primary border-primary" type="checkbox" id="l3" defaultChecked />
                                        <label className="form-check-label small font-inter text-dark fw-medium mt-1 ms-1" htmlFor="l3">Insurance & Hospital ID Ready</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <SidebarLayout
            user={user}
            onLogout={onLogout}
            navItems={navItems}
            topRight={<NotificationCenter patientId={selectedChild.id} />}
        >
            {renderContent()}
            <AIChatBot patientId={selectedChild.id} />
        </SidebarLayout>
    );
}

export default ParentPatientDashboard;
