import React, { useState, useEffect } from "react";
import SidebarLayout from "./SidebarLayout";
import DigitalCalendar from "./planner/DigitalCalendar";
import API from "../api";
import PatientSelector from "./planner/PatientSelector";
import BloodReportCenter from "./planner/BloodReportCenter";
import { Users, FilePlus, MessageSquare, Clipboard, Utensils, Calendar, UserPlus, Bell } from 'lucide-react';

function DoctorDashboard({ user, onLogout }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [activePatient, setActivePatient] = useState(null);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showNutritionForm, setShowNutritionForm] = useState(false);

  const [activeTab, setActiveTab] = useState("My Patients");

  const [parents, setParents] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', diagnosis: '', parent: '' });
  const [newPlan, setNewPlan] = useState({ title: '', type: 'chemo', start_time: '', description: '' });
  const [nutritionPlan, setNutritionPlan] = useState("");
  const [doctorNote, setDoctorNote] = useState("");

  const refreshPatients = () => {
    API.get('planner/patients/').then(res => {
      setPatients(res.data);
      if (selectedPatientId) {
        setActivePatient(res.data.find(p => p.id === parseInt(selectedPatientId)));
      } else if (res.data.length > 0) {
        setSelectedPatientId(res.data[0].id);
        setActivePatient(res.data[0]);
      }
    }).catch(e => console.error(e));
  };

  useEffect(() => {
    refreshPatients();
    API.get('users/').then(res => setParents(res.data)).catch(err => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePatientSelect = (id) => {
    setSelectedPatientId(id);
    const p = patients.find(p => p.id === parseInt(id));
    setActivePatient(p);
    setShowPlanForm(false);
    setShowPatientForm(false);
    setShowNutritionForm(false);

    // Fetch current nutrition plan if any
    API.get(`planner/nutrition/?patient_id=${id}`).then(res => {
      if (res.data.length > 0) setNutritionPlan(res.data[0].plan_details);
      else setNutritionPlan("");
    }).catch(e => console.error(e));
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    API.post('planner/patients/', newPatient).then(res => {
      alert("Patient added and linked successfully!");
      setShowPatientForm(false);
      setNewPatient({ name: '', age: '', diagnosis: '', parent: '' });
      refreshPatients();
    }).catch(err => alert("Error adding patient. Ensure all fields are valid."));
  };

  const handleAddPlan = (e) => {
    e.preventDefault();
    const payload = { ...newPlan, patient: selectedPatientId };
    API.post('planner/events/', payload).then(res => {
      alert("Treatment step added!");
      setShowPlanForm(false);
      setNewPlan({ title: '', type: 'chemo', start_time: '', description: '' });
    }).catch(err => alert("Error adding plan"));
  };

  const handleUpdateNutrition = () => {
    API.post('planner/nutrition/', { patient: selectedPatientId, plan_details: nutritionPlan }).then(() => {
      alert("Nutrition plan updated!");
      setShowNutritionForm(false);
    }).catch(err => alert("Error updating nutrition plan"));
  };

  const handlePostNote = () => {
    API.post('planner/notes/', { patient: selectedPatientId, content: doctorNote }).then(() => {
      alert("Note sent to parent!");
      setDoctorNote("");
    }).catch(err => alert("Error sending note"));
  };

  const [editProfile, setEditProfile] = useState({ username: user.username, email: user.email });

  const handleUpdateProfile = () => {
    API.patch('profile/', editProfile).then(() => {
      alert("Profile updated successfully! Some changes may require re-login.");
    }).catch(err => alert("Error updating profile"));
  };

  const navItems = [
    { label: "My Patients", icon: "bi bi-people-fill", isActive: activeTab === "My Patients", onClick: () => setActiveTab("My Patients") },
    { label: "Schedules", icon: "bi bi-calendar3", isActive: activeTab === "Schedules", onClick: () => setActiveTab("Schedules") },
    { label: "Reports", icon: "bi bi-file-earmark-check", isActive: activeTab === "Reports", onClick: () => setActiveTab("Reports") },
    { label: "Settings", icon: "bi bi-gear", isActive: activeTab === "Settings", onClick: () => setActiveTab("Settings") },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Schedules":
        return (
          <div className="glass-card p-4">
            <h4 className="fw-bold mb-4">Master Treatment Schedule</h4>
            <DigitalCalendar />
            <div className="mt-4 alert alert-info rounded-4">
              <p className="mb-0 small">This view shows all scheduled treatments across your assigned patient base. Use the filters to drill down.</p>
            </div>
          </div>
        );
      case "Reports":
        return (
          <div className="glass-card p-4">
            <h4 className="fw-bold mb-4">All Patient Reports</h4>
            <div className="row">
              <div className="col-md-4">
                <PatientSelector patients={patients} selectedId={selectedPatientId} onSelect={handlePatientSelect} />
              </div>
              <div className="col-md-8">
                {selectedPatientId ? <BloodReportCenter patientId={selectedPatientId} isDoctor={true} /> : <p className="text-muted">Select a patient to view reports</p>}
              </div>
            </div>
          </div>
        );
      case "Settings":
        return (
          <div className="glass-card p-4">
            <h4 className="fw-bold mb-4">Account Settings</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-control" value={editProfile.username} onChange={e => setEditProfile({ ...editProfile, username: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" value={editProfile.email} onChange={e => setEditProfile({ ...editProfile, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Specialization</label>
                  <input type="text" className="form-control" value="Pediatric Oncology" disabled />
                </div>
                <button className="btn btn-primary rounded-pill px-4" onClick={handleUpdateProfile}>Save Changes</button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="row g-4 mb-4">
            <div className="col-lg-3">
              <div className="stat-card mb-4 bg-primary text-white border-0">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <p className="small mb-0 opacity-75">Active Patients</p>
                  <Users size={18} />
                </div>
                <h2 className="fw-bold mb-0">{patients.length}</h2>
              </div>

              <PatientSelector
                patients={patients}
                selectedId={selectedPatientId}
                onSelect={handlePatientSelect}
              />

              <div className="glass-card p-3 shadow-sm border-0">
                <h6 className="fw-bold mb-3 small text-uppercase text-muted">Workspace Tools</h6>
                <button onClick={() => { setShowPatientForm(!showPatientForm); setShowPlanForm(false); setShowNutritionForm(false); }} className="btn btn-primary w-100 rounded-pill btn-sm mb-2 text-start px-3 py-2">
                  <UserPlus size={14} className="me-2" /> Add New Patient
                </button>
                <button onClick={() => { setShowPlanForm(!showPlanForm); setShowPatientForm(false); setShowNutritionForm(false); }} className="btn btn-outline-primary w-100 rounded-pill btn-sm mb-2 text-start px-3 py-2">
                  <FilePlus size={14} className="me-2" /> Treatment Schedule
                </button>
                <button onClick={() => { setShowNutritionForm(!showNutritionForm); setShowPlanForm(false); setShowPatientForm(false); }} className="btn btn-outline-primary w-100 rounded-pill btn-sm mb-2 text-start px-3 py-2">
                  <Utensils size={14} className="me-2" /> Nutrition Expert
                </button>
                <button
                  onClick={() => {
                    API.post('planner/notifications/trigger_reminders/').then(res => {
                      alert(`Sent ${res.data.count} reminders!`);
                    });
                  }}
                  className="btn btn-outline-warning w-100 rounded-pill btn-sm mb-2 text-start px-3 py-2"
                >
                  <Bell size={14} className="me-2" /> Trigger Reminders
                </button>
              </div>
            </div>

            <div className="col-lg-9">
              {showPatientForm && (
                <div className="glass-card p-4 mb-4 animate__animated animate__fadeIn border-primary border-top border-4">
                  <h5 className="fw-bold mb-4">Register New Patient Case</h5>
                  <form onSubmit={handleAddPatient} className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small">Child's Name</label>
                      <input type="text" className="form-control" required value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small">Age</label>
                      <input type="number" className="form-control" required value={newPatient.age} onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">Link to Parent Account</label>
                      <select className="form-select" required value={newPatient.parent} onChange={e => setNewPatient({ ...newPatient, parent: e.target.value })}>
                        <option value="">Select Account...</option>
                        {parents.map(p => <option key={p.id} value={p.id}>{p.username} ({p.email})</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small">Primary Diagnosis</label>
                      <input type="text" className="form-control" required value={newPatient.diagnosis} onChange={e => setNewPatient({ ...newPatient, diagnosis: e.target.value })} placeholder="e.g. ALL, Osteosarcoma..." />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary rounded-pill px-5">Assign to My Care</button>
                      <button type="button" onClick={() => setShowPatientForm(false)} className="btn btn-link text-muted ms-3">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {activePatient ? (
                <>
                  <div className="bg-white p-4 mb-4 rounded-4 shadow-sm border-0 d-flex justify-content-between align-items-center hover-lift transition">
                    <div className="d-flex align-items-center gap-4">
                      <div className="position-relative">
                        <img src={`https://ui-avatars.com/api/?name=${activePatient.name}&background=eff6ff&color=2563EB&bold=true`} className="rounded-circle shadow-sm" width="65" alt="patient avatar" />
                        <span className="position-absolute bottom-0 end-0 p-2 bg-success border border-white border-2 rounded-circle" title="Active Patient"></span>
                      </div>
                      <div>
                        <h3 className="fw-bold mb-1 text-dark font-poppins">{activePatient.name}</h3>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <span className="badge bg-light text-secondary border px-2 py-1 rounded-pill font-inter shadow-sm small">
                            ID: <strong>ONCO-{activePatient.id}</strong>
                          </span>
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-pill font-inter shadow-sm small">
                            Diagnosis: <strong>{activePatient.diagnosis}</strong>
                          </span>
                          <span className="text-muted small ms-2 font-inter"><i className="bi bi-person-fill"></i> Parent: {activePatient.parent_username}</span>
                        </div>
                      </div>
                    </div>
                    <div className="badge bg-success text-white rounded-pill px-4 py-2 fw-bold font-inter shadow-sm d-none d-md-block">Active Patient</div>
                  </div>

                  {showPlanForm && (
                    <div className="glass-card p-4 mb-4 animate__animated animate__fadeIn">
                      <h5 className="fw-bold mb-3">Add Treatment Step for {activePatient.name}</h5>
                      <form onSubmit={handleAddPlan} className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label small">Event Title</label>
                          <input type="text" className="form-control" required value={newPlan.title} onChange={e => setNewPlan({ ...newPlan, title: e.target.value })} placeholder="e.g. Day 1 Chemo" />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label small">Event Type</label>
                          <select className="form-select" value={newPlan.type} onChange={e => setNewPlan({ ...newPlan, type: e.target.value })}>
                            <option value="chemo">Chemo</option>
                            <option value="medicine">Medicine</option>
                            <option value="test">Blood Test</option>
                            <option value="appointment">Appointment</option>
                          </select>
                        </div>
                        <div className="col-md-5">
                          <label className="form-label small">Schedule Time</label>
                          <input type="datetime-local" className="form-control" required value={newPlan.start_time} onChange={e => setNewPlan({ ...newPlan, start_time: e.target.value })} />
                        </div>
                        <div className="col-12">
                          <textarea className="form-control rounded-4" rows="2" placeholder="Specific instructions for this event..." value={newPlan.description} onChange={e => setNewPlan({ ...newPlan, description: e.target.value })}></textarea>
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-primary rounded-pill px-4">Add to Calendar</button>
                        </div>
                      </form>
                    </div>
                  )}

                  {showNutritionForm && (
                    <div className="glass-card p-4 mb-4 animate__animated animate__fadeIn bg-light">
                      <h5 className="fw-bold mb-3"><Utensils className="me-2 text-primary" /> Assign Nutrition Plan</h5>
                      <textarea
                        className="form-control rounded-4 mb-3 border-0 shadow-sm"
                        rows="4"
                        value={nutritionPlan}
                        onChange={e => setNutritionPlan(e.target.value)}
                        placeholder="Describe the daily diet, restricted foods, and protein requirements..."
                      ></textarea>
                      <button onClick={handleUpdateNutrition} className="btn btn-primary rounded-pill px-5">Save Diet Plan</button>
                    </div>
                  )}

                  <div className="mb-4">
                    <DigitalCalendar patientId={selectedPatientId} />
                  </div>

                  <div className="row g-4">
                    <div className="col-md-7">
                      <BloodReportCenter patientId={selectedPatientId} isDoctor={true} />
                    </div>
                    <div className="col-md-5">
                      <div className="glass-card p-4 shadow-sm h-100">
                        <h6 className="fw-bold mb-3 d-flex align-items-center"><MessageSquare className="me-2 text-primary" /> Direct Message to Family</h6>
                        <textarea
                          className="form-control rounded-4 mb-3"
                          rows="6"
                          value={doctorNote}
                          onChange={e => setDoctorNote(e.target.value)}
                          placeholder="Provide immediate health advice or feedback on reports..."
                        ></textarea>
                        <button onClick={handlePostNote} className="btn btn-primary btn-sm rounded-pill px-4 w-100 py-2 fw-bold">Send Notification</button>
                      </div>
                    </div>
                  </div>
                </>
              ) : !showPatientForm && (
                <div className="text-center p-5 glass-card">
                  <Users size={48} className="text-muted mb-3" />
                  <h4>No Patient Active</h4>
                  <p className="text-muted mb-4">Select a patient from the sidebar or add a new case to begin management.</p>
                  <button onClick={() => setShowPatientForm(true)} className="btn btn-primary btn-lg rounded-pill px-5"><UserPlus className="me-2" /> Start New Case</button>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarLayout user={user} onLogout={onLogout} navItems={navItems}>
      {renderContent()}
    </SidebarLayout>
  );
}

export default DoctorDashboard;
