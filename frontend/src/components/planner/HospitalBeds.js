import React, { useState, useEffect } from 'react';
import { Bed, MapPin, Activity } from 'lucide-react';
import API from '../../api';

function HospitalBeds() {
    const [hospitals, setHospitals] = useState([]);

    useEffect(() => {
        API.get('support/hospitalbeds/')
            .then(res => setHospitals(res.data))
            .catch(err => console.error(err));
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Available': return 'bg-success';
            case 'Limited': return 'bg-warning text-dark';
            case 'Full': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className="glass-card p-4 border-0 h-100 shadow-sm border-top border-info border-4 bg-info bg-opacity-10">
            <h5 className="fw-bold mb-4 text-info-emphasis d-flex align-items-center">
                <Activity className="me-2" /> Live Hospital Bed Availability
            </h5>
            <div className="row g-3">
                {hospitals.map(h => {
                    const totalAvailable = h.available_ICU + h.available_NICU + h.available_general;
                    const totalBeds = h.ICU_beds + h.NICU_beds + h.general_beds;
                    const progressVal = totalBeds > 0 ? (totalAvailable / totalBeds) * 100 : 0;
                    
                    return (
                        <div key={h.id} className="col-12">
                            <div className="p-3 border border-info-subtle rounded-4 bg-white hover-shadow transition">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div className="flex-grow-1 border-end me-3 pe-3">
                                        <h6 className="fw-bold text-dark mb-1 d-flex align-items-center">
                                            <Bed size={16} className="me-2 text-info" /> {h.hospital_name}
                                        </h6>
                                        <p className="small text-muted mb-0"><MapPin size={12} /> {h.location}</p>
                                    </div>
                                    <div className="text-end" style={{minWidth: '85px'}}>
                                        <span className={`badge ${getStatusBadge(h.status)} px-3 py-2 w-100 rounded-pill`}>
                                            {h.status}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-between small text-muted mb-1 mt-3 px-1">
                                    <span>General: <b className="text-dark">{h.available_general}/{h.general_beds}</b></span>
                                    <span>ICU: <b className="text-dark">{h.available_ICU}/{h.ICU_beds}</b></span>
                                    <span>NICU: <b className="text-dark">{h.available_NICU}/{h.NICU_beds}</b></span>
                                </div>

                                <div className="progress rounded-pill bg-light shadow-inner mt-2" style={{ height: '6px' }}>
                                    <div
                                        className={`progress-bar ${getStatusBadge(h.status).split(' ')[0]}`}
                                        style={{ width: `${progressVal}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {hospitals.length === 0 && (
                    <div className="col-12 text-center py-4">
                        <Activity size={32} className="text-info opacity-25 mb-2" />
                        <p className="text-muted small">No hospital bed data linked.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HospitalBeds;
