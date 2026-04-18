import React from 'react';

function PatientSelector({ patients, selectedId, onSelect }) {
    return (
        <div className="mb-4">
            <label className="form-label small fw-bold text-muted">Active Case Management</label>
            <select
                className="form-select rounded-pill px-4 border-primary shadow-sm"
                value={selectedId}
                onChange={(e) => onSelect(e.target.value)}
            >
                <option value="">Select a Child...</option>
                {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.diagnosis || 'Active Case'}</option>
                ))}
            </select>
        </div>
    );
}

export default PatientSelector;
