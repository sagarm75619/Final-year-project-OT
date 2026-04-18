import React, { useState, useEffect } from 'react';
import API from '../api';

function ProfileModal({ isOpen, onClose }) {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [editData, setEditData] = useState({});

    useEffect(() => {
        if (isOpen) {
            fetchProfile();
        }
    }, [isOpen]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await API.get('profile/');
            setProfile(res.data);
            setEditData(res.data);
        } catch (error) {
            console.error("Error fetching profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await API.patch('profile/', editData);
            setProfile(editData);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Error updating profile.");
        }
    };

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    if (!isOpen) return null;

    if (loading) return (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow">
                    <div className="modal-body text-center p-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const isDoctor = profile?.role === 'doctor';

    return (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                    <div className="modal-header bg-primary text-white border-0 py-3">
                        <h5 className="modal-title fw-bold font-poppins d-flex align-items-center">
                            <i className="bi bi-person-circle me-2 fs-4"></i> My Account Profile
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4 bg-light">
                        <div className="d-flex align-items-center mb-4 bg-white p-4 rounded-4 shadow-sm">
                            <img src={`https://ui-avatars.com/api/?name=${profile.username}&background=eff6ff&color=2563EB&bold=true&size=100`} className="rounded-pill shadow-sm me-4" alt="profile" />
                            <div>
                                <h3 className="fw-bold text-dark font-poppins mb-1">{profile.username}</h3>
                                <p className="text-muted mb-0 font-inter">{profile.email}</p>
                                <span className="badge bg-primary mt-2 px-3 py-2 rounded-pill font-inter shadow-sm text-uppercase">
                                    {isDoctor ? 'Medical Provider' : 'Parent / Patient'}
                                </span>
                            </div>
                            <div className="ms-auto">
                                {!isEditing ? (
                                    <button className="btn btn-outline-primary rounded-pill px-4 fw-bold shadow-sm" onClick={() => setIsEditing(true)}>
                                        <i className="bi bi-pencil-square me-2"></i>Edit Profile
                                    </button>
                                ) : (
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-light border rounded-pill px-3" onClick={() => {setIsEditing(false); setEditData(profile);}}>Cancel</button>
                                        <button className="btn btn-success rounded-pill px-4 shadow-sm text-white fw-bold" onClick={handleSave}>Save</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-4 shadow-sm border-0">
                            <h6 className="fw-bold mb-3 font-poppins text-primary border-bottom pb-2">Personal Information</h6>
                            
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label small text-muted font-inter fw-bold">Username</label>
                                    <input type="text" className="form-control bg-light rounded-3" name="username" value={editData.username || ''} onChange={handleChange} disabled={!isEditing} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small text-muted font-inter fw-bold">Email</label>
                                    <input type="email" className="form-control bg-light rounded-3" name="email" value={editData.email || ''} onChange={handleChange} disabled={!isEditing} />
                                </div>
                                
                                <div className="col-md-6">
                                    <label className="form-label small text-muted font-inter fw-bold">Age</label>
                                    <input type="number" className="form-control bg-light rounded-3" name="age" value={editData.age || ''} onChange={handleChange} disabled={!isEditing} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small text-muted font-inter fw-bold">Gender</label>
                                    <select className="form-select bg-light rounded-3" name="gender" value={editData.gender || ''} onChange={handleChange} disabled={!isEditing}>
                                        <option value="">Select...</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {!isDoctor && (
                                    <>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted font-inter fw-bold">Weight (kg)</label>
                                            <input type="number" step="0.1" className="form-control bg-light rounded-3" name="weight" value={editData.weight || ''} onChange={handleChange} disabled={!isEditing} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted font-inter fw-bold">Height (cm)</label>
                                            <input type="number" step="0.1" className="form-control bg-light rounded-3" name="height" value={editData.height || ''} onChange={handleChange} disabled={!isEditing} />
                                        </div>
                                    </>
                                )}

                                {isDoctor && (
                                    <>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted font-inter fw-bold">Years of Experience</label>
                                            <input type="number" className="form-control bg-light rounded-3" name="experience" value={editData.experience || ''} onChange={handleChange} disabled={!isEditing} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted font-inter fw-bold">Medical Degree(s)</label>
                                            <input type="text" className="form-control bg-light rounded-3" name="degree" value={editData.degree || ''} placeholder="e.g. MD, PhD, FAAP" onChange={handleChange} disabled={!isEditing} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small text-muted font-inter fw-bold">Notable Achievements / Bio</label>
                                            <textarea className="form-control bg-light rounded-3" name="achievements" rows="3" value={editData.achievements || ''} onChange={handleChange} disabled={!isEditing} placeholder="Specialized fields, awards, published papers..."></textarea>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;
