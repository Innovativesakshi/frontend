import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Activity } from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_employees: 0,
        present_today: 0,
        absent_today: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (err) {
                console.error("Error fetching stats:", err);
                setError("Failed to load dashboard statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="flex justify-center p-12"><Spinner /></div>;
    if (error) return <div className="text-red-500 p-8 text-center">{error}</div>;

    const cards = [
        {
            title: 'Total Employees',
            value: stats.total_employees,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-100'
        },
        {
            title: 'Present Today',
            value: stats.present_today,
            icon: UserCheck,
            color: 'text-green-600',
            bg: 'bg-green-100'
        },
        {
            title: 'Absent Today',
            value: stats.absent_today,
            icon: UserX,
            color: 'text-red-600',
            bg: 'bg-red-100'
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="text-indigo-600 dark:text-indigo-400" />
                Dashboard
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{card.title}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{card.value}</p>
                        </div>
                        <div className={`p-4 rounded-full ${card.bg}`}>
                            <card.icon className={card.color} size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center mt-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Welcome to HRMS Lite</h2>
                <p className="text-gray-500 dark:text-gray-400">Select a module from the sidebar to get started.</p>
            </div>
        </div>
    );
};

export default Dashboard;
