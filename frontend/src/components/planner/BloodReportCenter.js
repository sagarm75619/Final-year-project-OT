import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, Download, Eye, AlertTriangle, Info } from 'lucide-react';
import API, { BASE_URL } from '../../api';

function BloodReportCenter({ patientId, isDoctor }) {
    const [reports, setReports] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [editingReport, setEditingReport] = useState(null);

    const getFileUrl = (path) => {
        if (!path) return '#';
        if (path.startsWith('http')) return path;
        return `${BASE_URL}${path}`;
    };

    useEffect(() => {
        if (patientId) {
            API.get(`planner/reports/?patient_id=${patientId}`)
                .then(res => setReports(res.data))
                .catch(err => console.error(err));
        }
    }, [patientId]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('report_file', file);
        formData.append('patient', patientId);
        formData.append('cbc_count', 'Pending');

        setUploading(true);
        API.post('planner/reports/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
            setReports([res.data, ...reports]);
            setUploading(false);
        }).catch(err => {
            alert("Upload failed");
            setUploading(false);
        });
    };

    const handleUpdateReport = (report) => {
        const payload = {
            cbc_count: report.cbc_count,
            platelets: report.platelets,
            is_reviewed: report.is_reviewed,
            review_status: report.review_status
        };
        
        API.patch(`planner/reports/${report.id}/`, payload).then(res => {
            alert("Report updated!");
            setReports(reports.map(r => r.id === report.id ? res.data : r));
            setEditingReport(null);
        }).catch(err => alert("Update failed"));
    };

    const getStatusBadge = (status, isReviewed) => {
        if (!isReviewed) return <span className="badge bg-warning-subtle text-warning rounded-pill">Pending Review</span>;
        
        if (status === 'Red Flag') return <span className="badge bg-danger-subtle text-danger rounded-pill"><AlertTriangle size={12} className="me-1" /> Red Flag</span>;
        if (status === 'Medium') return <span className="badge bg-info-subtle text-info rounded-pill"><Info size={12} className="me-1" /> Medium Concern</span>;
        return <span className="badge bg-success-subtle text-success rounded-pill"><CheckCircle2 size={12} className="me-1" /> Complete / Normal</span>;
    };

    return (
        <div className="glass-card p-4 border-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Blood Reports (CBC/PBS)</h5>
                {!isDoctor && (
                    <label className="btn btn-primary btn-sm rounded-pill px-3 mb-0 pointer">
                        <Upload size={16} className="me-2" />
                        {uploading ? 'Uploading...' : 'Upload New'}
                        <input type="file" hidden onChange={handleFileUpload} />
                    </label>
                )}
            </div>

            {editingReport && (
                <div className="mb-4 p-3 bg-light rounded-4 border">
                    <h6 className="fw-bold mb-3">Updating Report: {new Date(editingReport.uploaded_at).toLocaleDateString()}</h6>
                    <div className="row g-2">
                        <div className="col-md-3">
                            <input type="text" className="form-control form-control-sm" placeholder="CBC Count" value={editingReport.cbc_count || ''} onChange={e => setEditingReport({ ...editingReport, cbc_count: e.target.value })} />
                        </div>
                        <div className="col-md-3">
                            <input type="number" className="form-control form-control-sm" placeholder="Platelets" value={editingReport.platelets || ''} onChange={e => setEditingReport({ ...editingReport, platelets: e.target.value })} />
                        </div>
                        <div className="col-md-3">
                            <select className="form-select form-select-sm" value={editingReport.review_status || 'Complete'} onChange={e => setEditingReport({ ...editingReport, review_status: e.target.value })}>
                                <option value="Complete">Complete / Normal</option>
                                <option value="Medium">Medium Concern</option>
                                <option value="Red Flag">Red Flag</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-success btn-sm w-100 rounded-pill" onClick={() => handleUpdateReport({ ...editingReport, is_reviewed: true })}>Save & Verify</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr className="small text-uppercase">
                            <th>Date</th>
                            <th>CBC/Platelets</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report, idx) => (
                            <tr key={idx} className="small">
                                <td>{new Date(report.uploaded_at).toLocaleDateString()}</td>
                                <td>
                                    {report.cbc_count || 'Pending Results'}
                                    <div className="text-muted" style={{ fontSize: '10px' }}>Platelets: {report.platelets || 'N/A'}</div>
                                </td>
                                <td>
                                    {getStatusBadge(report.review_status, report.is_reviewed)}
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        {isDoctor && (
                                            <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => setEditingReport(report)}>Details/Edit</button>
                                        )}
                                        <a
                                            href={getFileUrl(report.report_file)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-sm btn-light btn-icon rounded-circle"
                                            title="Preview"
                                        >
                                            <Eye size={14} />
                                        </a>
                                        <a
                                            href={getFileUrl(report.report_file)}
                                            download
                                            className="btn btn-sm btn-light btn-icon rounded-circle"
                                            title="Download"
                                        >
                                            <Download size={14} />
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BloodReportCenter;
