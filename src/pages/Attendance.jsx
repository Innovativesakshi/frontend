import React, { useState, useEffect, useMemo } from 'react';
import { Filter, Calendar } from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';
import Notification from '../components/ui/Notification';

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [markDate, setMarkDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('Present');
    const [notification, setNotification] = useState(null);

    // Filter State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const showNotification = (type, message) => {
        setNotification({ type, message });
    };

    useEffect(() => {
        if (selectedEmployee) {
            const empObj = employees.find(e => e._id === selectedEmployee);
            if (empObj) {
                fetchAttendance(empObj.employee_id);
            }
        } else {
            setAttendanceRecords([]);
        }
    }, [selectedEmployee, employees]);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employees/');
            setEmployees(response.data);
        } catch (err) {
            showNotification('error', 'Failed to fetch employees');
        }
    };

    const fetchAttendance = async (empId) => {
        setLoading(true);
        try {
            const response = await api.get(`/attendance/${empId}`);
            // Sort by date desc
            const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setAttendanceRecords(sorted);
        } catch (err) {
            showNotification('error', 'Failed to fetch attendance');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        // Since we are using standard alerts previously, user might trigger without selected employee
        // but now form validation or UI should prevent confusion.
        if (!selectedEmployee) {
            showNotification('error', 'Please select an employee');
            return;
        }

        try {
            const empObj = employees.find(e => e._id === selectedEmployee);
            if (!empObj) return;

            const payload = {
                employee_id: empObj.employee_id,
                date: markDate,
                status: status
            };

            await api.post('/attendance/', payload);
            fetchAttendance(payload.employee_id); // Refresh with string ID
            showNotification('success', 'Attendance marked successfully');
        } catch (err) {
            const msg = err.response?.data?.detail || 'Failed to mark attendance';
            showNotification('error', msg);
        }
    };

    // Computed Logic
    const filteredRecords = useMemo(() => {
        return attendanceRecords.filter(record => {
            if (startDate && new Date(record.date) < new Date(startDate)) return false;
            if (endDate && new Date(record.date) > new Date(endDate)) return false;
            return true;
        });
    }, [attendanceRecords, startDate, endDate]);

    const stats = useMemo(() => {
        const total = filteredRecords.length;
        const present = filteredRecords.filter(r => r.status === 'Present').length;
        const absent = total - present;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
        return { total, present, absent, percentage };
    }, [filteredRecords]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Attendance Marking Form */}
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 sticky top-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar className="text-indigo-600 dark:text-indigo-400" size={20} />
                        Mark Attendance
                    </h2>
                    <form onSubmit={handleMarkAttendance} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Employee</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                required
                            >
                                <option value="">-- Choose Employee --</option>
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>{emp.full_name} ({emp.employee_id})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={markDate}
                                onChange={(e) => setMarkDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <div className="flex gap-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Present"
                                        checked={status === 'Present'}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Present</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Absent"
                                        checked={status === 'Absent'}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="h-4 w-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Absent</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                        >
                            Submit Attendance
                        </button>
                    </form>
                </div>
            </div>

            {/* Attendance History & Stats */}
            <div className="lg:col-span-2 space-y-6">

                {/* Stats Card - Only show when employee selected */}
                {selectedEmployee && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4 text-center animate-fade-in">
                        <div className="p-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Present</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.present}</p>
                        </div>
                        <div className="p-2 border-l border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Absent</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.absent}</p>
                        </div>
                        <div className="p-2 border-l border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Attendance %</p>
                            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.percentage}%</p>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Attendance History
                        </h2>

                        {/* Date Filters */}
                        <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1">
                                <Filter size={16} className="text-gray-400" />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border rounded px-2 py-1 text-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Start Date"
                                />
                            </div>
                            <span className="text-gray-400">-</span>
                            <div className="flex items-center gap-1">
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border rounded px-2 py-1 text-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="End Date"
                                />
                            </div>
                            {(startDate || endDate) && (
                                <button
                                    onClick={() => { setStartDate(''); setEndDate(''); }}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {!selectedEmployee ? (
                        <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 transition-colors">
                            <Calendar size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Employee Selected</h3>
                            <p className="text-sm mt-1">Select an employee to view their attendance record.</p>
                        </div>
                    ) : loading ? (
                        <div className="py-12 flex justify-center">
                            <Spinner />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Logged At</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredRecords.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                No records found for the selected range.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRecords.map((record) => (
                                            <tr key={record._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {record.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Present' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                                        }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(record.timestamp).toLocaleTimeString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Attendance;
