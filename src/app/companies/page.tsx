'use client';

import React, { useState, useMemo, useEffect } from 'react';
import CompanyTable from '@/components/companies/CompanyTable';
import mockCompanies from '@/data/mock-companies.json';
import { Company, Stage } from '@/types';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, Bookmark, X } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Modal from '@/components/ui/Modal';
import Dropdown from '@/components/ui/Dropdown';
export const dynamic = 'force-dynamic'

const stages: Stage[] = ['Seed', 'Series A', 'Series B', 'Series C', 'Growth', 'Late Stage'];
const industries = Array.from(new Set(mockCompanies.map(c => c.industry)));

function CompaniesContent() {
    const searchParams = useSearchParams();
    const queryParam = searchParams.get('q') || '';
    const stageParam = searchParams.get('stage') || 'All';
    const industryParam = searchParams.get('industry') || 'All';

    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [selectedStage, setSelectedStage] = useState<string>(stageParam);
    const [selectedIndustry, setSelectedIndustry] = useState<string>(industryParam);
    const [sortBy, setSortBy] = useState<string>('Name');
    const [savedSearches, setSavedSearches] = useLocalStorage<any[]>('vc_scout_saved_searches', []);

    // Modal State
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [saveName, setSaveName] = useState('');

    const hasActiveFilters = searchQuery !== '' || selectedStage !== 'All' || selectedIndustry !== 'All';

    const handleClearAll = () => {
        setSearchQuery('');
        setSelectedStage('All');
        setSelectedIndustry('All');
        setSortBy('Name');
        toast.success('Filters cleared');
    };

    useEffect(() => {
        if (queryParam !== undefined) setSearchQuery(queryParam);
        if (stageParam !== undefined) setSelectedStage(stageParam);
        if (industryParam !== undefined) setSelectedIndustry(industryParam);
    }, [queryParam, stageParam, industryParam]);

    const handleSaveSearch = () => {
        setIsSaveModalOpen(true);
    };

    const handleConfirmSave = () => {
        if (!saveName.trim()) {
            toast.error('Please enter a name for the view');
            return;
        }

        const newSearch = {
            id: Date.now().toString(),
            name: saveName.trim(),
            query: searchQuery,
            filters: { selectedStage, selectedIndustry },
            createdAt: new Date().toLocaleDateString()
        };

        setSavedSearches([...savedSearches, newSearch]);
        toast.success(`View "${saveName}" saved to library`);
        setIsSaveModalOpen(false);
        setSaveName('');
    };

    const filteredCompanies = useMemo(() => {
        return (mockCompanies as Company[]).filter(company => {
            const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                company.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStage = selectedStage === 'All' || company.stage === selectedStage;
            const matchesIndustry = selectedIndustry === 'All' || company.industry === selectedIndustry;

            return matchesSearch && matchesStage && matchesIndustry;
        }).sort((a, b) => {
            if (sortBy === 'Name') return a.name.localeCompare(b.name);
            if (sortBy === 'Funding') {
                const getVal = (s: string) => {
                    const num = parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
                    if (s.includes('B')) return num * 1000;
                    return num;
                };
                return getVal(b.fundingAmount) - getVal(a.fundingAmount);
            }
            return 0;
        });
    }, [searchQuery, selectedStage, selectedIndustry, sortBy]);

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            {/* Header & Stats */}
            <div className="flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse-slow"></div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Deep Sourcing</span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Market Intelligence</h2>
                    <p className="text-slate-500 mt-2 text-sm font-medium max-w-md leading-relaxed">Discover, analyze, and track the next generation of industry-defining companies.</p>
                </div>
                <div className="flex gap-6">
                    <button
                        onClick={() => setIsSaveModalOpen(true)}
                        className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center gap-2 shadow-sm active:scale-95"
                    >
                        <Bookmark className="w-4 h-4" /> Save View
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100/50 px-5 py-2.5 rounded-2xl border border-slate-200/50 flex flex-col items-center justify-center min-w-[100px] shadow-inner">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Database</span>
                            <span className="text-lg font-black text-slate-900">{mockCompanies.length}</span>
                        </div>
                        <div className="bg-blue-50 px-5 py-2.5 rounded-2xl border border-blue-100/50 flex flex-col items-center justify-center min-w-[100px] shadow-inner">
                            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">In Range</span>
                            <span className="text-lg font-black text-blue-600">{filteredCompanies.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="space-y-4">
                {/* Row 1: Search */}
                <div className="relative group/input w-full bg-white p-2 rounded-2xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Filter by name or domain..."
                        className="w-full bg-transparent border-none py-4 pl-14 pr-6 text-sm font-semibold focus:ring-0 outline-none placeholder:text-slate-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Row 2: Dropdowns */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="w-64">
                        <Dropdown
                            options={['All', ...stages]}
                            value={selectedStage}
                            onChange={setSelectedStage}
                            placeholder="All Investment Stages"
                            icon={<Filter className="w-4 h-4" />}
                        />
                    </div>

                    <div className="w-64">
                        <Dropdown
                            options={['All', ...industries]}
                            value={selectedIndustry}
                            onChange={setSelectedIndustry}
                            placeholder="Sector Focus"
                            icon={<SlidersHorizontal className="w-4 h-4" />}
                        />
                    </div>

                    <div className="w-64">
                        <Dropdown
                            options={['Name', 'Funding']}
                            value={sortBy}
                            onChange={setSortBy}
                            placeholder="Sort By"
                            icon={<ArrowUpDown className="w-4 h-4" />}
                        />
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 hover:text-red-500 transition-all group animate-in fade-in slide-in-from-left-2 duration-300"
                        >
                            <X className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="w-full overflow-x-auto pb-4 scrollbar-thin">
                <CompanyTable companies={filteredCompanies} />
            </div>

            <Modal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                title="Save Context View"
            >
                <div className="space-y-6">
                    <p className="text-xs text-slate-500 font-medium">Persist your current filters and search query into your intelligence library.</p>
                    <input
                        autoFocus
                        type="text"
                        placeholder="e.g. Series A Fintech Labs"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                        value={saveName}
                        onChange={(e) => setSaveName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleConfirmSave()}
                    />
                    <button
                        onClick={handleConfirmSave}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                    >
                        Commit to Library
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default function CompaniesPage() {
    return (
        <React.Suspense fallback={<div className="p-10 text-center font-bold">Loading Intelligence Engine...</div>}>
            <CompaniesContent />
        </React.Suspense>
    );
}
