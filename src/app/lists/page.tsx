'use client';

import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CompanyList, Company } from '@/types';
import mockCompanies from '@/data/mock-companies.json';
import {
    ListOrdered,
    Plus,
    Trash2,
    Search,
    Download,
    Users,
    Calendar,
    ChevronRight,
    ArrowLeft,
    X,
    ExternalLink,
    FileJson,
    FileSpreadsheet
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import Link from 'next/link';

export default function ListsPage() {
    const [lists, setLists] = useLocalStorage<CompanyList[]>('vc_scout_lists', []);
    const [newListLabel, setNewListLabel] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [selectedListId, setSelectedListId] = useState<string | null>(null);

    // Deletion Modal State
    const [listToDelete, setListToDelete] = useState<string | null>(null);

    const activeList = useMemo(() =>
        lists.find(l => l.id === selectedListId),
        [lists, selectedListId]);

    const listCompanies = useMemo(() => {
        if (!activeList) return [];
        return (mockCompanies as Company[]).filter(c => activeList.companyIds.includes(c.id));
    }, [activeList]);

    const handleCreateList = () => {
        if (!newListLabel.trim()) return;

        const newList: CompanyList = {
            id: Date.now().toString(),
            name: newListLabel,
            companyIds: [],
            createdAt: new Date().toLocaleDateString()
        };

        setLists([...lists, newList]);
        setNewListLabel('');
        setIsCreating(false);
        toast.success(`Collection "${newList.name}" initialized`);
    };

    const handleDeleteList = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setListToDelete(id);
    };

    const confirmDelete = () => {
        if (!listToDelete) return;
        const listName = lists.find(l => l.id === listToDelete)?.name;
        setLists(lists.filter(l => l.id !== listToDelete));
        if (selectedListId === listToDelete) setSelectedListId(null);
        setListToDelete(null);
        toast(`Collection "${listName}" purged from system`);
    };

    const handleRemoveCompany = (companyId: string) => {
        if (!selectedListId) return;
        const updatedLists = lists.map(l => {
            if (l.id === selectedListId) {
                return {
                    ...l,
                    companyIds: l.companyIds.filter(id => id !== companyId)
                };
            }
            return l;
        });
        setLists(updatedLists);
    };

    const exportListJSON = (e: React.MouseEvent, list: CompanyList) => {
        e.stopPropagation();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(list, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${list.name.replace(/\s+/g, '_')}_export.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const exportListCSV = (e: React.MouseEvent, list: CompanyList) => {
        e.stopPropagation();
        const companies = (mockCompanies as Company[]).filter(c => list.companyIds.includes(c.id));
        const headers = ["ID", "Name", "URL", "Industry", "Location", "Stage", "Funding"];
        const rows = companies.map(c => [
            c.id,
            c.name,
            c.url,
            c.industry,
            c.location,
            c.stage,
            c.fundingAmount
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${list.name.replace(/\s+/g, '_')}_export.csv`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    if (selectedListId && activeList) {
        return (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setSelectedListId(null)}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold">Back to All Lists</span>
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={(e) => exportListJSON(e, activeList)}
                            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 transition-all flex items-center gap-2"
                        >
                            <FileJson className="w-4 h-4" /> Export JSON
                        </button>
                        <button
                            onClick={(e) => exportListCSV(e, activeList)}
                            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-emerald-600 transition-all flex items-center gap-2"
                        >
                            <FileSpreadsheet className="w-4 h-4" /> Export CSV
                        </button>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-premium">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                            <ListOrdered className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{activeList.name}</h2>
                            <p className="text-slate-500 text-sm font-medium">Pipeline containing {activeList.companyIds.length} high-signal targets</p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-100">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sector</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stage</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Funding</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {listCompanies.map(company => (
                                    <tr key={company.id} className="hover:bg-slate-50/50 transition-colors group/row">
                                        <td className="px-6 py-4">
                                            <Link href={`/companies/${company.id}`} className="flex items-center gap-3 hover:text-blue-600 transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-[10px]">
                                                    {company.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-slate-900 group-hover/row:text-blue-600">{company.name}</span>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-slate-500">{company.industry}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-600 rounded-full uppercase tracking-wider">
                                                {company.stage}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-black text-slate-900">{company.fundingAmount}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleRemoveCompany(company.id)}
                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Remove from list"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {listCompanies.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <Users className="w-10 h-10 text-slate-200 mb-3" />
                                                <p className="text-sm font-bold text-slate-400">No companies in this pipeline yet</p>
                                                <Link href="/companies" className="text-xs font-black text-blue-600 uppercase tracking-widest mt-2 hover:underline">
                                                    Browse Companies
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase tracking-widest text-sm mb-2 opacity-50">Sourcing Hub</h2>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Pipelines</h1>
                    <p className="text-slate-500 mt-2 font-medium">Organize and track your high-potential investment targets.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center gap-3 shadow-premium active:scale-95"
                >
                    <Plus className="w-4 h-4" /> New Collection
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-8 rounded-[2rem] border-2 border-blue-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Collection Configuration</h3>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Collection Name (e.g. Series A Fintech Labs)..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                            value={newListLabel}
                            onChange={(e) => setNewListLabel(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
                        />
                        <button
                            onClick={handleCreateList}
                            className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                        >
                            Initialize
                        </button>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Discard
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {lists.map(list => (
                    <div
                        key={list.id}
                        onClick={() => setSelectedListId(list.id)}
                        className="bg-white rounded-[2rem] border border-slate-200/60 p-8 hover:border-blue-500 hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 group-hover:bg-blue-100/50 rounded-full -mr-16 -mt-16 transition-colors"></div>

                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <ListOrdered className="w-6 h-6" />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => exportListCSV(e, list)}
                                    className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                    title="Export to CSV"
                                >
                                    <FileSpreadsheet className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => handleDeleteList(e, list.id)}
                                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Delete Collection"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 relative z-10">
                            <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{list.name}</h4>
                            <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <span className="flex items-center gap-2"><Users className="w-3 h-3 text-blue-500" /> {list.companyIds.length} Assets</span>
                                <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {list.createdAt}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between group/more relative z-10">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">Inspect Collection</span>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                        </div>
                    </div>
                ))}

                {lists.length === 0 && !isCreating && (
                    <div className="col-span-full py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="p-6 bg-white rounded-full shadow-premium mb-6">
                            <ListOrdered className="w-12 h-12 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">No pipelines visualized</h3>
                        <p className="text-sm text-slate-500 max-w-xs mt-3 font-medium leading-relaxed">
                            Your sourcing engine is idle. Initialize your first target collection to begin analysis.
                        </p>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                        >
                            Initialize Collection
                        </button>
                    </div>
                )}
            </div>

            <Modal
                isOpen={!!listToDelete}
                onClose={() => setListToDelete(null)}
                title="Confirm Intelligence Purge"
            >
                <div className="space-y-6">
                    <p className="text-xs text-slate-500 font-medium">This action will permanently remove this collection and all associated company mappings from your local engine.</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setListToDelete(null)}
                            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Abort
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
                        >
                            Purge Collection
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
