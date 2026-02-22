'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50 md:hidden">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
                            <path d="M12 2L15 8L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8L12 2Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#3b82f6" fillOpacity="0.2" />
                            <circle cx="12" cy="12" r="3" stroke="#3b82f6" strokeWidth="2" />
                            <path d="M12 7V9" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                            <path d="M12 15V17" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                            <path d="M7 12H9" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                            <path d="M15 12H17" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="text-lg font-black tracking-tight text-slate-900 uppercase tracking-widest">SignalHQ</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 -mr-2 text-slate-600 hover:text-blue-600 transition-colors"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Sidebar with Drawer Logic */}
            <div className={`fixed inset-0 z-50 md:sticky md:top-0 md:h-screen md:z-auto transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                {/* Backdrop for Mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="flex-1 p-4 md:p-8 mt-20 md:mt-20">
                    {children}
                </main>
            </div>
        </div>
    );
}
