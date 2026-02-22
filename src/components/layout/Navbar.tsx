'use client';

import React, { useState } from 'react';
import { Search, Bell, HelpCircle, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/companies?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="h-20 glass fixed top-0 right-0 left-0 md:left-64 z-40 transition-all duration-300 bg-white/80 md:bg-transparent border-b border-slate-200/50 hidden md:block">
            <div className="h-full px-6 md:px-10 flex items-center justify-between">
                {/* Left: Title */}
                <div className="flex items-center shrink-0">
                    <h1 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">SignalHQ Analytics Engine</h1>
                </div>

                {/* Center: Search */}
                <div className="flex-1 max-w-md mx-4 md:mx-0">
                    <form onSubmit={handleSearch} className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Global Asset Search (Press / )"
                            className="w-full bg-slate-100/50 border border-slate-200/60 rounded-xl py-2 pl-12 pr-4 text-xs font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                {/* Right: Utilities */}
                <div className="flex items-center gap-4">
                    <button className="text-slate-400 hover:text-blue-600 transition-all transform hover:scale-110 active:scale-95">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                    <button className="text-slate-400 hover:text-blue-600 transition-all transform hover:scale-110 active:scale-95 relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white animate-pulse"></span>
                    </button>
                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold hover:bg-blue-600 transition-all shadow-premium active:scale-95 flex items-center gap-2 uppercase tracking-widest ml-2">
                        <Plus className="w-4 h-4" /> New Collection
                    </button>
                </div>
            </div>
        </header>
    );
}
