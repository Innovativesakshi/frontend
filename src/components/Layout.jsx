import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            <div className="flex-1 flex flex-col min-w-0"> {/* min-w-0 to prevent flex child overflow */}
                {/* Mobile Header Bar - Only visible on small screens when we need the hamburger */}
                <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-4">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-600 hover:bg-gray-100 p-2 rounded-md"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-semibold text-gray-900">HRMS Lite</span>
                </div>

                <Header />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
