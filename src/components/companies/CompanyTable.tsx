'use client';

import React from 'react';
import Link from 'next/link';
import { Company } from '@/types';
import { ExternalLink, ChevronRight, MapPin, Layers, ArrowRight, Search } from 'lucide-react';

interface CompanyTableProps {
    companies: Company[];
}

export default function CompanyTable({ companies }: CompanyTableProps) {
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 8;

    // Reset to page 1 whenever results change (search/filter)
    React.useEffect(() => {
        setCurrentPage(1);
    }, [companies]);

    const paginatedCompanies = React.useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return companies.slice(start, start + itemsPerPage);
    }, [companies, currentPage]);

    const totalPages = Math.ceil(companies.length / itemsPerPage);

    return (
        <div className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-premium transition-all">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Asset Identity</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Lifecycle</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Vertical</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Territory</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Capital</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Discovery</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/60">
                        {paginatedCompanies.map((company) => (
                            <tr
                                key={company.id}
                                className="hover:bg-blue-50/40 transition-all group cursor-pointer"
                                onClick={() => window.location.href = `/companies/${company.id}`}
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                                            {company.name.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-900 group-hover:text-blue-600 block transition-colors tracking-tight">
                                                {company.name}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 group-hover:text-slate-500 transition-colors">
                                                {company.url.replace('https://', '')}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-white text-slate-700 border border-slate-200 shadow-sm uppercase tracking-wider">
                                        {company.stage}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600/40 animate-pulse"></div>
                                        {company.industry}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                        <MapPin className="w-3.5 h-3.5 text-slate-300" />
                                        {company.location}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="inline-block px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-black tracking-tighter shadow-sm">
                                        {company.fundingAmount}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm active:scale-95">
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {companies.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 animate-float shadow-inner">
                                            <Search className="w-8 h-8" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Zero Signal Identified</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Logic */}
            <div className="px-10 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Intelligence Stream</span>
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center gap-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                        Page {currentPage} <span className="text-slate-200 mx-1">/</span> {totalPages || 1}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200 active:scale-95 shadow-sm"
                        >
                            <ChevronRight className="w-5 h-5 rotate-180" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages}
                            className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200 active:scale-95 shadow-sm"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
