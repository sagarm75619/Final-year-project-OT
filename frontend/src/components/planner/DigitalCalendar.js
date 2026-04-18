import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import API from '../../api';

function DigitalCalendar({ patientId }) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const url = patientId ? `planner/events/?patient_id=${patientId}` : 'planner/events/';
        API.get(url)
            .then(res => {
                const mappedEvents = res.data.map(e => ({
                    id: e.id,
                    title: e.title,
                    start: e.start_time,
                    end: e.end_time || e.start_time,
                    backgroundColor: e.color,
                    borderColor: e.color,
                    extendedProps: { ...e }
                }));
                setEvents(mappedEvents);
            })
            .catch(err => console.error("Error loading events", err));
    }, [patientId]);

    const handleEventClick = (info) => {
        alert(`Event: ${info.event.title}\nDescription: ${info.event.extendedProps.description}`);
    };

    return (
        <div className="bg-white rounded-4 p-4 h-100 shadow-sm border-0 hover-lift transition">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <h5 className="fw-bold mb-0 text-dark font-poppins d-flex align-items-center">
                    <i className="bi bi-calendar-heart fs-4 me-2 text-primary"></i> 
                    Treatment Schedule
                </h5>
                <div className="d-flex gap-2">
                    <span className="badge rounded-pill shadow-sm px-3 py-2 fw-medium font-inter" style={{ backgroundColor: '#EF4444', color: 'white' }}>Chemo</span>
                    <span className="badge rounded-pill shadow-sm px-3 py-2 fw-medium font-inter" style={{ backgroundColor: '#3B82F6', color: 'white' }}>Medicine</span>
                    <span className="badge rounded-pill shadow-sm px-3 py-2 fw-medium font-inter" style={{ backgroundColor: '#F59E0B', color: 'white' }}>Test</span>
                </div>
            </div>
            <div className="calendar-container" style={{ minHeight: '500px' }}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    eventClick={handleEventClick}
                    height="auto"
                    themeSystem="bootstrap5"
                />
            </div>
        </div>
    );
}

export default DigitalCalendar;
