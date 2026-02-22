'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Building2,
    ListOrdered,
    Bookmark,
    Settings,
    LayoutDashboard,
    Search,
    Users
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'Lists', href: '/lists', icon: ListOrdered },
    { name: 'Saved', href: '/saved', icon: Bookmark },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="h-screen w-64 glass-dark text-slate-200 z-50 transition-all duration-300 overflow-y-auto">
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className="p-8 flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center animate-float">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
                            <path d="M12 2L15 8L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8L12 2Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#3b82f6" fillOpacity="0.2" />
                            <circle cx="12" cy="12" r="3" stroke="#3b82f6" strokeWidth="2" />
                            <path d="M12 7V9" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                            <path d="M12 15V17" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                            <path d="M7 12H9" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                            <path d="M15 12H17" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="text-xl font-black tracking-tight text-white uppercase tracking-[0.15em]">SignalHQ</span>
                </div>

                {/* Quick Search Hint */}
                <div className="px-6 mb-8">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Quick search..."
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:bg-slate-800 transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2">
                    <p className="px-4 mb-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.25em]">Navigation</p>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group text-sm font-medium",
                                    isActive
                                        ? "bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-inner translate-x-1"
                                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 hover:translate-x-1 border border-transparent"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 transition-all duration-300",
                                    isActive ? "text-blue-400 scale-110" : "text-slate-500 group-hover:text-slate-100 group-hover:scale-110"
                                )} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Hook */}
                <div className="p-6 mt-auto">
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/30 border border-slate-700/30 group hover:border-slate-600/50 transition-all cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                            <Users className="w-5 h-5 text-slate-300" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">Keerthi Reddy</p>
                            <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Pro Member</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
