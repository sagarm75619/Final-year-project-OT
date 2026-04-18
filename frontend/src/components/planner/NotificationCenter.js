import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import API from '../../api';

const NotificationCenter = ({ patientId }) => {
    const [notifications, setNotifications] = useState([]);
    const [showList, setShowList] = useState(false);

    const fetchNotifications = () => {
        API.get(`planner/notifications/?patient_id=${patientId}`).then(res => {
            setNotifications(res.data);
        }).catch(err => console.error(err));
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, [patientId]);

    const markAsRead = (id) => {
        API.patch(`planner/notifications/${id}/`, { is_read: true }).then(() => {
            fetchNotifications();
        });
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="position-relative me-3">
            <button className="btn btn-light rounded-circle p-2 position-relative shadow-sm" onClick={() => setShowList(!showList)}>
                <Bell size={20} className={unreadCount > 0 ? "text-primary animate__animated animate__swing animate__infinite" : "text-muted"} />
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showList && (
                <div className="glass-card shadow-lg position-absolute end-0 mt-2 p-0 overflow-hidden" style={{ width: '320px', zIndex: 1100 }}>
                    <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-bold">Care Alerts</h6>
                        <span className="badge bg-primary-subtle text-primary rounded-pill">{unreadCount} New</span>
                    </div>
                    <div className="notification-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-muted small">
                                <Info size={24} className="mb-2 opacity-25" />
                                <p className="mb-0">All caught up! No active alerts.</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className={`p-3 border-bottom hover-bg-light ${!n.is_read ? 'bg-primary-subtle border-start border-primary border-4' : ''}`} style={{ transition: 'all 0.2s' }}>
                                    <div className="d-flex align-items-start">
                                        {n.type === 'reminder' ? <AlertCircle size={16} className="text-primary me-2 mt-1" /> : <CheckCircle2 size={16} className="text-success me-2 mt-1" />}
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between">
                                                <h6 className="small fw-bold mb-1">{n.title}</h6>
                                                <small className="text-muted x-small">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                            </div>
                                            <p className="mb-1 x-small text-muted">{n.message}</p>
                                            {!n.is_read && (
                                                <button className="btn btn-link p-0 x-small text-primary text-decoration-none fw-bold" onClick={() => markAsRead(n.id)}>Mark as read</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {notifications.length > 0 && (
                        <div className="p-2 text-center bg-light border-top">
                            <button className="btn btn-link btn-sm text-muted text-decoration-none" onClick={() => setShowList(false)}>Close View</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
