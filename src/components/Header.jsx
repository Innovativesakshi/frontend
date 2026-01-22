import React from 'react';
import { Bell, Moon, Sun, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard': return 'HRMS Lite Dashboard';
            case '/employees': return 'Employee Management';
            case '/attendance': return 'Attendance Management';
            default: return 'HRMS Lite';
        }
    };

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 px-6 flex items-center justify-between sticky top-0 z-10 w-full transition-colors duration-200">
            <div className="flex items-center gap-4">
                 {/* Mobile Menu Button is in Layout, here just title */}
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{getPageTitle()}</h1>
            </div>

            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleTheme}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Admin</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Administrator</span>
                    </div>
                    <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-gray-200 font-semibold">
                        A
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
