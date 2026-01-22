import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, CalendarCheck, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-600';
    };

    return (
        <nav className="bg-indigo-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-white font-bold text-xl flex items-center gap-2">
                                <Users className="h-8 w-8" />
                                HRMS Lite
                            </span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link
                                    to="/"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/')}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <LayoutDashboard size={18} />
                                        Employees
                                    </div>
                                </Link>
                                <Link
                                    to="/attendance"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/attendance')}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <CalendarCheck size={18} />
                                        Attendance
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
