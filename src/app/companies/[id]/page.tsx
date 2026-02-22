'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import mockCompanies from '@/data/mock-companies.json';
import { Company, Signal } from '@/types';
import {
    ArrowLeft,
    Globe,
    MapPin,
    Building2,
    Calendar,
    DollarSign,
    Plus,
    MessageSquare,
    History,
    Sparkles,
    ExternalLink,
    ChevronRight,
    Bookmark
} from 'lucide-react';
import Link from 'next/link';
import EnrichmentPanel from '@/components/companies/EnrichmentPanel';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CompanyList, SavedSearch } from '@/types';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';

const mockSignals: Signal[] = [
    {
        id: 's1',
        type: 'funding',
        title: 'Raised Series D',
        description: 'Secured $313M in Series D funding led by existing investors.',
        date: '2 months ago'
    },
    {
        id: 's2',
        type: 'hiring',
        title: 'New Head of Engineering',
        description: 'Hired former Stripe VP to lead global engineering efforts.',
        date: '3 months ago'
    },
    {
        id: 's3',
        type: 'product',
        title: 'Launched Vercel Ship',
        description: 'Introduced a new set of developer experience improvements.',
        date: '4 months ago'
    }
];

export default function CompanyProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const [company, setCompany] = useState<Company | null>(null);
    const [note, setNote] = useLocalStorage<string>(`vc_scout_notes_${id}`, '');
    const [lists, setLists] = useLocalStorage<CompanyList[]>('vc_scout_lists', []);
    const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>('vc_scout_saved_searches', []);

    // Modal States
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [saveName, setSaveName] = useState('');

    const handleSaveNote = () => {
        toast.success('Observation committed with local persistence.');
    };

    const handleConfirmSave = () => {
        if (!saveName.trim()) {
            toast.error('Please enter a name for the reference');
            return;
        }

        const newSearch: SavedSearch = {
            id: Date.now().toString(),
            name: saveName.trim(),
            query: company?.name || '',
            filters: { companyId: id },
            createdAt: new Date().toLocaleDateString()
        };

        setSavedSearches([...savedSearches, newSearch]);
        toast.success(`Reference "${saveName}" saved!`);
        setIsSaveModalOpen(false);
        setSaveName('');
    };

    const handleConfirmAddToList = (listIndex: number) => {
        const list = lists[listIndex];
        if (company && !list.companyIds.includes(company.id)) {
            const updatedLists = [...lists];
            updatedLists[listIndex].companyIds.push(company.id);
            setLists(updatedLists);
            toast.success(`Asset successfully added to ${list.name}`);
            setIsListModalOpen(false);
        } else {
            toast.error('Asset already exists in this collection.');
        }
    };

    useEffect(() => {
        const found = (mockCompanies as Company[]).find(c => c.id === id);
        if (found) {
            setCompany(found);
        }
    }, [id]);

    if (!company) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Breadcrumbs & Actions */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-50 transition-all shadow-sm">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">SignalHQ Alpha</span>
                </button>

                <div className="flex gap-4">
                    <button
                        onClick={() => setIsSaveModalOpen(true)}
                        className="px-6 py-3 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-95 shadow-sm"
                    >
                        <Bookmark className="w-4 h-4 text-slate-400" /> Save Reference
                    </button>
                    <button
                        onClick={() => {
                            if (lists.length === 0) {
                                toast.error('Initialize a collection first in the Sourcing Hub.');
                                router.push('/lists');
                            } else {
                                setIsListModalOpen(true);
                            }
                        }}
                        className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95 shadow-premium"
                    >
                        <Plus className="w-4 h-4" /> Add to Collection
                    </button>
                </div>
            </div>

            {/* Profile Header */}
            <div className="glass rounded-[2rem] border border-white/40 p-12 shadow-premium relative overflow-hidden group/header">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
                    <div className="w-32 h-32 rounded-3xl bg-slate-900 flex items-center justify-center text-5xl font-black text-white shadow-2xl shrink-0 scale-hover group-hover/header:rotate-3 transition-transform duration-500">
                        {company.name.charAt(0)}
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{company.name}</h1>
                                <span className="px-5 py-2 bg-blue-600 text-white text-[10px] font-black rounded-full shadow-lg shadow-blue-500/20 uppercase tracking-[0.2em]">
                                    {company.stage}
                                </span>
                            </div>
                            <p className="text-xl text-slate-500 max-w-2xl leading-relaxed font-medium">
                                {company.description}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-x-10 gap-y-6 items-center">
                            <a href={company.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-400 hover:text-blue-600 font-bold transition-all group/link">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center transition-all group-hover/link:bg-blue-50">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <span className="text-sm">{company.url.replace('https://', '')}</span>
                            </a>
                            <div className="flex items-center gap-3 text-slate-400 font-bold">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="text-sm">{company.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 font-bold">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <span className="text-sm">{company.industry}</span>
                            </div>
                            <div className="flex items-center gap-3 text-blue-600 font-black">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <DollarSign className="w-4 h-4" />
                                </div>
                                <span className="text-sm tracking-tight">{company.fundingAmount} Capital Raised</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Signals Timeline */}
                    <section className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-premium group/timeline">
                        <div className="px-10 py-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-black text-slate-900 flex items-center gap-3 uppercase tracking-widest text-xs">
                                <div className="p-2 bg-slate-100 rounded-lg group-hover/timeline:bg-blue-600 group-hover/timeline:text-white transition-all">
                                    <History className="w-4 h-4" />
                                </div>
                                Intelligence Feed
                            </h3>
                            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Full Archive</button>
                        </div>
                        <div className="p-10 space-y-10 relative">
                            <div className="absolute left-[47px] top-14 bottom-14 w-[1px] bg-slate-100"></div>
                            {mockSignals.map((signal) => (
                                <div key={signal.id} className="relative flex gap-8 group/sig">
                                    <div className="w-[14px] h-[14px] rounded-full border-2 border-white bg-slate-200 z-10 mt-2 group-hover/sig:bg-blue-600 group-hover/sig:scale-125 transition-all shadow-sm"></div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{signal.date}</span>
                                            <span className="h-0.5 w-4 bg-slate-100"></span>
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.1em]">{signal.type}</span>
                                        </div>
                                        <h4 className="font-black text-slate-900 text-lg tracking-tight group-hover/sig:text-blue-600 transition-colors">{signal.title}</h4>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl">{signal.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Notes Section with Premium UI */}
                    <section className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-premium group/notes">
                        <div className="px-10 py-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-black text-slate-900 flex items-center gap-3 uppercase tracking-widest text-xs">
                                <div className="p-2 bg-slate-100 rounded-lg group-hover/notes:bg-blue-600 group-hover/notes:text-white transition-all">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                Analyst Observation
                            </h3>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Internal Only</span>
                        </div>
                        <div className="p-10 space-y-6">
                            <div className="relative group/textarea">
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-6 text-sm font-bold text-slate-700 focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none resize-none h-40 placeholder:text-slate-300"
                                    placeholder="Annotate tactical insights or investment thesis..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                                <div className="absolute top-4 right-4 text-slate-200 pointer-events-none group-focus-within/textarea:text-blue-200 transition-colors">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveNote}
                                    className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                                >
                                    Commit Observation
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-10">
                    {/* Enrichment Action */}
                    <EnrichmentPanel companyId={company.id} url={company.url} />

                    {/* Related Data Points */}
                    <section className="bg-white rounded-[2rem] border border-slate-200/60 p-8 shadow-premium space-y-6">
                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Market Graph</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Crunchbase', icon: 'CB', color: 'bg-blue-50 text-blue-600' },
                                { name: 'LinkedIn', icon: 'LI', color: 'bg-indigo-50 text-indigo-600' },
                                { name: 'X / Twitter', icon: 'X', color: 'bg-slate-50 text-slate-900' },
                                { name: 'GitHub', icon: 'GH', color: 'bg-slate-100 text-slate-900' }
                            ].map(link => (
                                <button key={link.name} className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group/link-ext">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg ${link.color} flex items-center justify-center font-black text-[10px] group-hover/link-ext:scale-110 transition-transform`}>
                                            {link.icon}
                                        </div>
                                        <span className="text-xs font-black text-slate-600 group-hover/link-ext:text-blue-900 uppercase tracking-wider">{link.name}</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-200 group-hover/link-ext:text-blue-600 transform group-hover/link-ext:translate-x-1 group-hover/link-ext:-translate-y-1 transition-all" />
                                </button>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-slate-100 mt-6">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metadata</p>
                                    <p className="text-xs font-bold text-slate-700">Founded {company.foundedDate}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <Modal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                title="Save Context Reference"
            >
                <div className="space-y-6">
                    <p className="text-xs text-slate-500 font-medium tracking-tight">Save this company profile as a tactical reference point in your library.</p>
                    <input
                        autoFocus
                        type="text"
                        placeholder="e.g. AI Core Reference"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                        value={saveName}
                        onChange={(e) => setSaveName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleConfirmSave()}
                    />
                    <button
                        onClick={handleConfirmSave}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.1em] hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                    >
                        Commit to Library
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={isListModalOpen}
                onClose={() => setIsListModalOpen(false)}
                title="Sourcing Pipeline Selection"
            >
                <div className="space-y-4">
                    <p className="text-xs text-slate-500 font-medium mb-4">Select the target collection to integrate this asset into.</p>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {lists.map((list, index) => (
                            <button
                                key={list.id}
                                onClick={() => handleConfirmAddToList(index)}
                                className="w-full text-left p-4 rounded-2xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group flex items-center justify-between"
                            >
                                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-900">{list.name}</span>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
