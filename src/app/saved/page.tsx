'use client';

import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SavedSearch } from '@/types';
import {
    Bookmark,
    Search,
    Trash2,
    ArrowRight,
    Filter,
    Calendar,
    Layers
} from 'lucide-react';
import Link from 'next/link';

import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';

export default function SavedSearchesPage() {
    const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>('vc_scout_saved_searches', []);
    const [searchToDelete, setSearchToDelete] = useState<string | null>(null);

    const handleDeleteSearch = (id: string) => {
        setSearchToDelete(id);
    };

    const confirmDelete = () => {
        if (!searchToDelete) return;
        const searchName = savedSearches.find(s => s.id === searchToDelete)?.name;
        setSavedSearches(savedSearches.filter(s => s.id !== searchToDelete));
        setSearchToDelete(null);
        toast(`Search filter "${searchName}" removed from library`);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Saved Searches</h2>
                <p className="text-slate-500 mt-1">Quickly access your most frequent sourcing filters.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {savedSearches.map(search => (
                    <div key={search.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all group flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                                <Bookmark className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{search.name}</h4>
                                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-1">
                                    <span className="flex items-center gap-1"><Filter className="w-3 h-3" /> {search.query || 'Global Search'}</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Saved {search.createdAt}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleDeleteSearch(search.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <Link
                                href={`/companies?q=${search.query}&stage=${search.filters?.selectedStage || 'All'}&industry=${search.filters?.selectedIndustry || 'All'}`}
                                className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
                            >
                                Run Search <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ))}

                {savedSearches.length === 0 && (
                    <div className="py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                            <Bookmark className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="font-bold text-slate-900">No saved searches</h3>
                        <p className="text-sm text-slate-500 max-w-xs mt-2">
                            Save your filters on the discovery page to see them here for quick access.
                        </p>
                        <Link
                            href="/companies"
                            className="mt-6 font-bold text-blue-600 hover:underline"
                        >
                            Discover companies
                        </Link>
                    </div>
                )}
            </div>

            <Modal
                isOpen={!!searchToDelete}
                onClose={() => setSearchToDelete(null)}
                title="Remove Saved Configuration"
            >
                <div className="space-y-6">
                    <p className="text-xs text-slate-500 font-medium">Decommission this saved search configuration? This will not affect any lists, only the search shortcut.</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setSearchToDelete(null)}
                            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl active:scale-95"
                        >
                            Remove Shortcut
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
