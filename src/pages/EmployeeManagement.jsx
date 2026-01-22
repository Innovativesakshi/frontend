import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Users, Pen } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import Notification from '../components/ui/Notification';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const showNotification = (type, message) => {
        setNotification({ type, message });
    };

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await api.get('/employees/');
            setEmployees(response.data);
        } catch (err) {
            showNotification('error', 'Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                 await api.put(`/employees/${currentEmployeeId}`, formData);
                 showNotification('success', 'Employee updated successfully');
            } else {
                 await api.post('/employees/', formData);
                 showNotification('success', 'Employee added successfully');
            }
            fetchEmployees();
            setIsAddModalOpen(false);
            resetForm();
        } catch (err) {
            const msg = err.response?.data?.detail || (isEditMode ? 'Failed to update employee' : 'Failed to add employee');
            showNotification('error', msg);
        }
    };

    const resetForm = () => {
        setFormData({ employee_id: '', full_name: '', email: '', department: '' });
        setIsEditMode(false);
        setCurrentEmployeeId(null);
    };

    const handleEditClick = (employee) => {
        setFormData({
            employee_id: employee.employee_id,
            full_name: employee.full_name,
            email: employee.email,
            department: employee.department
        });
        setCurrentEmployeeId(employee._id);
        setIsEditMode(true);
        setIsAddModalOpen(true);
    };

    const handleAddClick = () => {
        resetForm();
        setIsAddModalOpen(true);
    };

    const confirmDelete = (id) => {
        setEmployeeToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!employeeToDelete) return;
        try {
            await api.delete(`/employees/${employeeToDelete}`);
            setEmployees(employees.filter(emp => emp._id !== employeeToDelete));
            showNotification('success', 'Employee deleted successfully');
        } catch (err) {
            showNotification('error', 'Failed to delete employee');
        } finally {
            setIsDeleteModalOpen(false);
            setEmployeeToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="text-indigo-600 dark:text-indigo-400" />
                    Employees
                </h1>
                <button
                    onClick={handleAddClick}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
                >
                    <Plus size={20} />
                    Add Employee
                </button>
            </div>

            {/* Notification Toast */}
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner />
                </div>
            ) : employees.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No employees yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new employee.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {employees.map((employee) => (
                                    <tr key={employee._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{employee.employee_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{employee.full_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                                {employee.department}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{employee.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditClick(employee)}
                                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full transition-colors mr-2"
                                            >
                                                <Pen size={18} />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(employee._id)}
                                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Employee Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title={isEditMode ? "Edit Employee" : "Add New Employee"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                        <input
                            type="text"
                            name="employee_id"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                            value={formData.employee_id}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                            value={formData.full_name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <select
                            name="department"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                            value={formData.department}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Department</option>
                            <option value="HR">HR</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Sales">Sales</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Finance">Finance</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                        >
                            {isEditMode ? 'Update Employee' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Deletion"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete this employee? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EmployeeManagement;
