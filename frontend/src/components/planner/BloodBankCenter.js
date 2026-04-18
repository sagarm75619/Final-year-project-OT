import React, { useState, useEffect } from 'react';
import { Droplet, Phone, MapPin, Search } from 'lucide-react';
import API from '../../api';

function BloodBankCenter() {
    const [banks, setBanks] = useState([]);
    const [filterGroup, setFilterGroup] = useState('');

    const fetchBanks = (group = '') => {
        let endpoint = 'support/bloodbanks/';
        if (group) {
            endpoint += `?blood_group=${group}`;
        }
        API.get(endpoint)
            .then(res => setBanks(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchBanks(filterGroup);
    }, [filterGroup]);

    return (
        <div className="glass-card p-4 border-0 h-100 shadow-sm border-top border-danger border-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-danger mb-0 d-flex align-items-center">
                    <Droplet className="me-2" /> Blood Availability
                </h5>
                <div className="search-box position-relative">
                    <Search className="position-absolute ms-2 mt-2 text-muted" size={14} />
                    <select 
                        className="form-select form-select-sm rounded-pill ps-4 border-danger-subtle bg-light"
                        value={filterGroup}
                        onChange={(e) => setFilterGroup(e.target.value)}
                    >
                        <option value="">All Blood Groups</option>
                        <option value="A+">A Positive (A+)</option>
                        <option value="A-">A Negative (A-)</option>
                        <option value="B+">B Positive (B+)</option>
                        <option value="B-">B Negative (B-)</option>
                        <option value="O+">O Positive (O+)</option>
                        <option value="O-">O Negative (O-)</option>
                        <option value="AB+">AB Positive (AB+)</option>
                        <option value="AB-">AB Negative (AB-)</option>
                    </select>
                </div>
            </div>
            
            <div className="row g-3">
                {banks.map(bank => (
                    <div key={bank.id} className="col-12">
                        <div className="d-flex align-items-center p-3 border border-danger-subtle rounded-4 bg-white hover-shadow transition">
                            <div className="bg-danger bg-opacity-10 text-danger fw-bold rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px', fontSize: '1.2rem'}}>
                                {bank.blood_group}
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="fw-bold text-dark mb-1 d-flex justify-content-between">
                                    {bank.name}
                                    <span className="badge bg-danger rounded-pill">{bank.units_available} units</span>
                                </h6>
                                <div className="d-flex text-muted small gap-3">
                                    <span><MapPin size={12} className="me-1"/> {bank.location}</span>
                                    <span><Phone size={12} className="me-1"/> {bank.contact}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {banks.length === 0 && (
                    <div className="col-12 text-center py-4">
                        <Droplet size={32} className="text-danger opacity-25 mb-2" />
                        <p className="text-muted small">No blood units matching your request.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BloodBankCenter;
