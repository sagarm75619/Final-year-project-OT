import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import API from '../../api';

function MedicineTracker({ patientId }) {
    const [meds, setMeds] = useState([]);

    useEffect(() => {
        if (patientId) {
            API.get(`planner/events/?patient_id=${patientId}&type=medicine`)
                .then(res => setMeds(res.data))
                .catch(err => console.error(err));
        }
    }, [patientId]);

    const toggleComplete = (id, currentStatus) => {
        API.patch(`planner/events/${id}/`, { is_completed: !currentStatus })
            .then(() => {
                setMeds(meds.map(m => m.id === id ? { ...m, is_completed: !currentStatus } : m));
            })
            .catch(err => alert("Error updating status"));
    };

    const completedCount = meds.filter(m => m.is_completed).length;
    const progressVal = meds.length > 0 ? (completedCount / meds.length) * 100 : 0;

    return (
        <div className="bg-white rounded-4 shadow-sm p-4 h-100 border-0 hover-lift transition">
            <h5 className="fw-bold mb-3 font-poppins text-dark d-flex align-items-center">
                <div className="bg-primary-subtle p-2 rounded-3 me-3 text-primary">
                    <Clock size={20} />
                </div>
                Daily Medication Log
            </h5>
            
            {meds.length > 0 && (
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center small text-muted font-inter fw-bold mb-2">
                        <span>Progress</span>
                        <span className="text-primary">{completedCount}/{meds.length} Completed</span>
                    </div>
                    <div className="progress rounded-pill bg-light" style={{ height: '8px' }}>
                        <div className="progress-bar bg-success rounded-pill" style={{ width: `${progressVal}%` }}></div>
                    </div>
                </div>
            )}

            <div className="d-flex flex-column gap-3 mb-4">
                {meds.length === 0 ? <p className="text-muted small text-center p-4 bg-light rounded-4">No medications scheduled for today.</p> :
                    meds.map(med => (
                        <div key={med.id} className={`d-flex justify-content-between align-items-center p-3 rounded-4 shadow-sm border border-light transition ${med.is_completed ? 'bg-light' : 'bg-white'}`}>
                            <div className="d-flex align-items-center gap-3">
                                <button className={`btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center ${med.is_completed ? 'btn-success' : 'btn-outline-secondary'}`} style={{width: 30, height: 30}} onClick={() => toggleComplete(med.id, med.is_completed)}>
                                    {med.is_completed ? <CheckCircle size={16} /> : <div className="border border-secondary rounded-circle" style={{width: 14, height: 14}}></div>}
                                </button>
                                <div>
                                    <h6 className={`mb-1 fw-bold font-poppins ${med.is_completed ? 'text-decoration-line-through text-muted' : 'text-dark'}`} style={{fontSize: "15px"}}>
                                        {med.title}
                                    </h6>
                                    <p className="small text-muted mb-0 font-inter d-flex align-items-center">
                                        <Clock size={12} className="me-1"/> {new Date(med.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                            <div>
                                {med.is_completed ? (
                                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2 font-inter shadow-sm">Taken</span>
                                ) : (
                                    <span className="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-3 py-2 font-inter shadow-sm text-dark">Pending</span>
                                )}
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="mt-auto p-4 bg-light rounded-4 border">
                <small className="text-muted d-block mb-2 font-inter fw-bold text-uppercase" style={{letterSpacing: "1px", fontSize: "11px"}}>Stock Status Alert</small>
                <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold font-poppins text-dark">Chemo Tablets</span>
                    <span className="badge bg-danger shadow-sm px-3 py-2 rounded-pill font-inter d-flex align-items-center"><XCircle size={14} className="me-1"/> Low: 3 left</span>
                </div>
            </div>
        </div>
    );
}

export default MedicineTracker;
