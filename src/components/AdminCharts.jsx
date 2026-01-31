
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AdminCharts = ({ complaints }) => {
    // Process data for Category Distribution (Doughnut)
    const categoryCounts = complaints.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
    }, {});

    const categoryData = {
        labels: Object.keys(categoryCounts),
        datasets: [
            {
                label: '# of Complaints',
                data: Object.values(categoryCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Process data for Monthly Trends (Line) - Mocking months for demo based on count
    const statusCounts = {
        Pending: complaints.filter(c => c.status === 'Pending').length,
        Resolved: complaints.filter(c => c.status === 'Resolved').length,
        Rejected: complaints.filter(c => c.status === 'Rejected').length,
    };

    const statusData = {
        labels: ['Pending', 'Resolved', 'Rejected'],
        datasets: [
            {
                label: 'Status Overview',
                data: [statusCounts.Pending, statusCounts.Resolved, statusCounts.Rejected],
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
            },
        ],
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Complaints by Category</h3>
                <div className="h-64 flex justify-center">
                    <Doughnut data={categoryData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Status Overview</h3>
                <div className="h-64">
                    <Bar
                        data={statusData}
                        options={{
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminCharts;
