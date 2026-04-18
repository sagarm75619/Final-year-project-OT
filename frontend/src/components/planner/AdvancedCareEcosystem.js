import React, { useState, useEffect } from 'react';
import { BookOpen, MessageCircle, CalendarHeart, PlusCircle } from 'lucide-react';
import API from '../../api';

import FundraiserCenter from './FundraiserCenter';
import BloodBankCenter from './BloodBankCenter';
import HospitalBeds from './HospitalBeds';

function AdvancedCareEcosystem({ patientId }) {
    const [journals, setJournals] = useState([]);
    const [wishes, setWishes] = useState([]);
    const [tasks, setTasks] = useState([]);
    
    // Forms
    const [showJournalForm, setShowJournalForm] = useState(false);
    const [newJournal, setNewJournal] = useState({ title: '', content: '' });
    
    const [showWishForm, setShowWishForm] = useState(false);
    const [newWish, setNewWish] = useState({ author_name: '', message: '' });
    
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', date: '', location: '', blood_bank: 1 });

    const fetchData = () => {
        if (!patientId) return;
        API.get(`planner/care-journals/?patient_id=${patientId}`).then(res => setJournals(res.data));
        API.get(`planner/well-wishes/?patient_id=${patientId}`).then(res => setWishes(res.data));
        // Fetch global blood donation programs instead of patient-specific tasks
        API.get(`planner/donation-programs/`).then(res => setTasks(res.data));
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [patientId]);

    const postJournal = () => {
        API.post('planner/care-journals/', { ...newJournal, patient: patientId }).then(() => {
            setShowJournalForm(false);
            setNewJournal({ title: '', content: '' });
            fetchData();
        });
    };

    const postWish = () => {
        API.post('planner/well-wishes/', { ...newWish, patient: patientId }).then(() => {
            setShowWishForm(false);
            setNewWish({ author_name: '', message: '', ngo_club_name: '' });
            fetchData();
        });
    };

    const postTask = () => {
        // Defaults blood_bank to ID 1 for demonstration if not provided dynamically
        API.post('planner/donation-programs/', { ...newTask, blood_bank: 1 }).then(() => {
            setShowTaskForm(false);
            setNewTask({ title: '', description: '', date: '', location: '', blood_bank: 1 });
            fetchData();
        });
    };

    return (
        <div className="mt-4">
            <h4 className="fw-bold mb-4 ms-2">Ecosystem of Care & Community</h4>
            
            <div className="row g-4 mb-4">
                {/* CARE JOURNAL SECTION */}
                <div className="col-lg-8">
                    <div className="glass-card p-4 border-0 h-100 shadow-sm border-top border-primary border-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold text-primary mb-0 d-flex align-items-center"><BookOpen className="me-2"/> Care Journal Updates</h5>
                            <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={() => setShowJournalForm(!showJournalForm)}>
                                <PlusCircle size={14} className="me-1"/> Post Update
                            </button>
                        </div>

                        {showJournalForm && (
                            <div className="bg-light p-3 rounded-4 mb-4 border">
                                <input type="text" placeholder="Update Title..." className="form-control mb-2" value={newJournal.title} onChange={e => setNewJournal({...newJournal, title: e.target.value})} />
                                <textarea placeholder="How's everything going? Share news, progress, or feelings..." className="form-control mb-2" rows="3" value={newJournal.content} onChange={e => setNewJournal({...newJournal, content: e.target.value})}></textarea>
                                <button className="btn btn-primary btn-sm rounded-pill px-4" onClick={postJournal}>Publish Update</button>
                            </div>
                        )}

                        <div className="journal-list">
                            {journals.map(j => (
                                <div key={j.id} className="mb-4 pb-3 border-bottom position-relative">
                                    <h6 className="fw-bold text-dark">{j.title}</h6>
                                    <p className="text-muted small mb-2">{j.content}</p>
                                    <span className="badge bg-light text-dark fs-8 border">Posted on {new Date(j.created_at).toLocaleDateString()}</span>
                                </div>
                            ))}
                            {journals.length === 0 && <p className="text-muted small fst-italic">No journal updates yet.</p>}
                        </div>
                    </div>
                </div>

                {/* LEAVE A HUG / WELL WISHES SECTION */}
                <div className="col-lg-4">
                    <div className="bg-warning bg-opacity-10 p-4 border-0 h-100 shadow-sm rounded-4 hover-lift transition">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold text-warning-emphasis mb-0 d-flex align-items-center font-poppins"><MessageCircle className="me-2"/> Leave a Hug</h5>
                            <button className="btn btn-warning btn-sm rounded-pill fw-bold text-dark shadow-sm" onClick={() => setShowWishForm(!showWishForm)}>Send Hug</button>
                        </div>

                        {showWishForm && (
                            <div className="bg-white p-3 rounded-4 mb-4 shadow-sm border border-warning-subtle">
                                <input type="text" placeholder="Your Name or Anonymous" className="form-control form-control-sm mb-2 bg-light border-0" value={newWish.author_name} onChange={e => setNewWish({...newWish, author_name: e.target.value})} />
                                <input type="text" placeholder="NGO or Club Name (Optional)" className="form-control form-control-sm mb-2 bg-light border-0" value={newWish.ngo_club_name || ''} onChange={e => setNewWish({...newWish, ngo_club_name: e.target.value})} />
                                <textarea placeholder="Send love, prayers, or encouragement..." className="form-control form-control-sm mb-2 bg-light border-0" rows="2" value={newWish.message} onChange={e => setNewWish({...newWish, message: e.target.value})}></textarea>
                                <button className="btn btn-warning fw-bold text-dark btn-sm w-100 rounded-pill shadow-sm" onClick={postWish}>Send Support</button>
                            </div>
                        )}

                        <div className="wishes-list pe-2" style={{maxHeight: '400px', overflowY: 'auto'}}>
                            {wishes.map(w => (
                                <div key={w.id} className="bg-white p-3 rounded-4 mb-3 shadow-sm border-start border-warning border-4 hover-lift transition">
                                    <p className="small mb-2 font-inter fw-medium text-dark lh-sm">"{w.message}"</p>
                                    <h6 className="small fw-bold text-end mb-1 text-warning-emphasis font-poppins">- {w.author_name}</h6>
                                    {w.ngo_club_name && (
                                        <p className="small text-end text-muted mb-0 font-inter fst-italic" style={{fontSize: '11px'}}><i className="bi bi-shield-heart me-1"></i>{w.ngo_club_name}</p>
                                    )}
                                </div>
                            ))}
                            {wishes.length === 0 && <p className="text-muted small font-inter fst-italic text-center mt-4 p-3 bg-white rounded-4 shadow-sm">Be the first to send a virtual hug!</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                {/* BLOOD DONATION PROGRAM */}
                <div className="col-lg-6">
                    <div className="bg-danger bg-opacity-10 p-4 border-0 h-100 shadow-sm rounded-4 hover-lift transition">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold text-danger mb-0 d-flex align-items-center font-poppins"><CalendarHeart className="me-2"/> Blood Donation Programs</h5>
                            <button className="btn btn-danger btn-sm rounded-pill shadow-sm fw-bold" onClick={() => setShowTaskForm(!showTaskForm)}><PlusCircle size={14} className="me-1"/>Add Drive</button>
                        </div>
                        <p className="small text-danger-emphasis mb-3 font-inter">Find and volunteer for upcoming blood donation drives to support the community.</p>

                        {showTaskForm && (
                            <div className="bg-white p-3 rounded-4 mb-4 shadow-sm border border-danger-subtle">
                                <input type="text" placeholder="Program Title (e.g. City Blood Drive)" className="form-control form-control-sm mb-2 bg-light border-0" value={newTask.title || ''} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                                <input type="text" placeholder="Location Name / Address" className="form-control form-control-sm mb-2 bg-light border-0" value={newTask.location || ''} onChange={e => setNewTask({...newTask, location: e.target.value})} />
                                <input type="datetime-local" className="form-control form-control-sm mb-2 bg-light border-0" value={newTask.date || ''} onChange={e => setNewTask({...newTask, date: e.target.value})} />
                                <textarea placeholder="Details and instructions..." className="form-control form-control-sm mb-2 bg-light border-0" rows="2" value={newTask.description || ''} onChange={e => setNewTask({...newTask, description: e.target.value})}></textarea>
                                <button className="btn btn-danger btn-sm w-100 rounded-pill fw-bold shadow-sm" onClick={postTask}>Schedule Driver</button>
                            </div>
                        )}

                        <div className="tasks-list pe-2" style={{maxHeight: '400px', overflowY: 'auto'}}>
                            {tasks.map(t => (
                                <div key={t.id} className="bg-white p-3 rounded-4 mb-3 shadow-sm border-start border-danger border-4 hover-lift transition">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h6 className="fw-bold mb-0 text-dark font-poppins">{t.title}</h6>
                                        <span className="badge bg-danger-subtle text-danger rounded-pill px-2 py-1 shadow-sm font-inter">
                                            {t.date ? new Date(t.date).toLocaleDateString() : 'Upcoming'}
                                        </span>
                                    </div>
                                    <p className="small text-dark fw-medium mb-1 font-inter"><i className="bi bi-geo-alt-fill text-danger me-1"></i>{t.location}</p>
                                    <p className="small text-muted mb-0 lh-sm font-inter">{t.description}</p>
                                </div>
                            ))}
                            {tasks.length === 0 && <p className="text-muted small fst-italic text-center mt-4 p-3 bg-white rounded-4 shadow-sm">No upcoming blood donation programs right now.</p>}
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <FundraiserCenter patientId={patientId} />
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-6">
                    <BloodBankCenter />
                </div>
                <div className="col-md-6">
                    <HospitalBeds />
                </div>
            </div>
        </div>
    );
}

export default AdvancedCareEcosystem;
