import React, { useState, useEffect } from 'react';
import { HeartHandshake, TrendingUp } from 'lucide-react';
import API from '../../api';

function FundraiserCenter({ patientId }) {
    const [fundraisers, setFundraisers] = useState([]);

    const fetchFundraisers = () => {
        let endpoint = 'support/fundraisers/';
        // Usually, the support API might return all approved fundraisers globally.
        // We'll just fetch all or we can add ?patient_id= later if implemented.
        API.get(endpoint)
            .then(res => setFundraisers(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchFundraisers();
    }, [patientId]);

    const handleDonate = (fundId) => {
        const inputAmount = window.prompt("Enter donation amount ($):");
        if (!inputAmount || isNaN(inputAmount) || Number(inputAmount) <= 0) {
            if (inputAmount !== null) {
                alert("Please enter a valid amount.");
            }
            return;
        }

        API.post(`support/fundraisers/${fundId}/donate/`, { amount: inputAmount })
            .then(res => {
                alert(res.data.message || "Thank you for your donation!");
                fetchFundraisers(); // refresh amounts
            })
            .catch(err => {
                console.error(err);
                alert("Donation failed. Please try again.");
            });
    };

    return (
        <div className="glass-card p-4 border-0 h-100 bg-success bg-opacity-10 shadow-sm border-top border-success border-4">
            <h5 className="fw-bold mb-4 text-success d-flex align-items-center">
                <HeartHandshake className="me-2" /> Care Community Support
            </h5>
            
            <div className="row g-3">
                {fundraisers.map(fund => {
                    const raised = parseFloat(fund.collected_amount);
                    const target = parseFloat(fund.target_amount);
                    const percent = Math.min((raised / (target || 1)) * 100, 100);

                    return (
                        <div key={fund.id} className="col-12">
                            <div className="p-4 border border-success-subtle rounded-4 bg-white hover-shadow transition">
                                <h6 className="fw-bold text-dark mb-1 fs-5">{fund.title}</h6>
                                <p className="small text-muted mb-3 fst-italic">For {fund.patient_name}</p>
                                <p className="small text-dark mb-4 line-clamp-3 lh-sm">{fund.description}</p>
                                
                                <div className="mb-2 d-flex justify-content-between align-items-end">
                                    <span className="fw-bold text-success fs-4">${raised.toLocaleString()} <span className="small text-muted fs-6 fw-normal">raised</span></span>
                                    <span className="small text-muted fw-bold">Goal: ${target.toLocaleString()}</span>
                                </div>
                                <div className="progress rounded-pill mb-4 shadow-inner bg-light" style={{ height: '12px' }}>
                                    <div
                                        className="progress-bar bg-success progress-bar-striped progress-bar-animated"
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                                
                                <button 
                                    className="btn btn-success btn-lg w-100 rounded-pill fw-bold shadow-sm"
                                    onClick={() => handleDonate(fund.id)}
                                >
                                    <HeartHandshake size={18} className="me-2 mb-1"/>
                                    Donate Now
                                </button>
                            </div>
                        </div>
                    );
                })}

                {fundraisers.length === 0 && (
                    <div className="col-12 text-center py-5 bg-white rounded-4 border border-success-subtle opacity-75">
                        <TrendingUp size={40} className="text-success opacity-50 mb-3" />
                        <p className="text-muted small fw-bold mb-1">No active community fundraisers found.</p>
                        <p className="small text-muted fst-italic px-3">Ask clinical admins to set up a support drive if someone is in need.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FundraiserCenter;
