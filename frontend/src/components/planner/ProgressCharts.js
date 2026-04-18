import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function ProgressCharts({ reports }) {
    const data = {
        labels: reports.map(r => new Date(r.uploaded_at).toLocaleDateString()),
        datasets: [
            {
                label: 'Platelets Count',
                data: reports.map(r => r.platelets || 0),
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Risk Threshold',
                data: reports.map(() => 150),
                borderColor: '#e63946',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: false }
        }
    };

    return (
        <div className="glass-card p-4 border-0">
            <h5 className="fw-bold mb-4 text-primary">Health Progress Graph</h5>
            <div style={{ height: '300px' }}>
                <Line options={options} data={data} />
            </div>
            <div className="mt-3 p-3 bg-primary-subtle rounded-4 small">
                <i className="bi bi-info-circle-fill me-2"></i>
                Platelets below 150k may indicate risk sign. Please contact your oncologist if the line stays low.
            </div>
        </div>
    );
}

export default ProgressCharts;
