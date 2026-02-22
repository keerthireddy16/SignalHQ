'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, RefreshCw, Bookmark, Zap } from 'lucide-react';
import { EnrichmentData } from '@/types';
import axios from 'axios';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface EnrichmentPanelProps {
    companyId: string;
    url: string;
}

export default function EnrichmentPanel({ companyId, url }: EnrichmentPanelProps) {
    const [loading, setLoading] = useState(false);
    const [cache, setCache] = useLocalStorage<Record<string, EnrichmentData>>('vc_scout_enrichment_cache', {});
    const [data, setData] = useState<EnrichmentData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isFromCache, setIsFromCache] = useState(false);

    useEffect(() => {
        // Load from cache on mount or when companyId changes
        if (cache[companyId]) {
            setData(cache[companyId]);
            setIsFromCache(true);
        } else {
            setData(null);
            setIsFromCache(false);
        }
    }, [companyId, cache]);

    const handleEnrich = async () => {
        setLoading(true);
        setError(null);
        setIsFromCache(false);
        try {
            const response = await axios.post('/api/enrich', { companyId, url });
            const newData = response.data;
            setData(newData);
            // Update cache
            setCache({
                ...cache,
                [companyId]: newData
            });
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Deep Scan failed. Please verify API configuration.';
            const details = err.response?.data?.details ? `: ${err.response.data.details}` : '';
            setError(`${errorMsg}${details}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass rounded-[2rem] border border-white/40 shadow-premium overflow-hidden group/panel transition-all hover:shadow-2xl">
            <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full -mr-16 -mt-16 animate-pulse"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30 group-hover/panel:scale-110 transition-transform duration-500">
                        <Sparkles className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-black text-xl tracking-tight">AI Signal Core</h3>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Autonomous Intelligence</p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {!data && !loading && !error && (
                    <div className="text-center space-y-6 py-6">
                        <div className="w-20 h-20 bg-blue-50/50 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner group-hover/panel:rotate-12 transition-transform duration-500">
                            <Sparkles className="w-10 h-10 text-blue-600" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">System Ready for Scan</p>
                            <p className="text-xs text-slate-500 px-6 font-medium leading-relaxed">Initiate real-time behavioral analysis and signal extraction from {url.replace('https://', '')}</p>
                        </div>
                        <button
                            onClick={handleEnrich}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 active:scale-95 flex items-center justify-center gap-3"
                        >
                            <RefreshCw className="w-4 h-4" /> Begin Scan
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-14 space-y-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-[2rem] border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] animate-pulse">Deep Scanning</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic overflow-hidden whitespace-nowrap border-r-2 border-blue-500 pr-1 animate-typing w-[20ch]">Parsing Web Objects...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 space-y-4">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            </div>
                            <p className="text-xs text-red-700 font-bold leading-relaxed">{error}</p>
                        </div>
                        <button
                            onClick={handleEnrich}
                            className="w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95"
                        >
                            Retry Core Scan
                        </button>
                    </div>
                )}

                {data && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            {isFromCache ? (
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Zap className="w-3 h-3 fill-blue-500" /> Signal Restored from Cache
                                </span>
                            ) : (
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div> Signal Lock
                                </span>
                            )}
                            <button
                                onClick={handleEnrich}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                title="Refresh Intelligence"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-6 overflow-x-auto scrollbar-thin">
                            <div className="group/item">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <div className="w-1 h-3 bg-blue-600 rounded-full group-hover/item:h-4 transition-all"></div> Executive Summary
                                </h4>
                                <p className="text-sm text-slate-800 leading-relaxed font-bold tracking-tight">
                                    {data.summary}
                                </p>
                            </div>

                            <div className="group/item">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Competencies</h4>
                                <ul className="space-y-3">
                                    {data.whatTheyDo.map((item, i) => (
                                        <li key={i} className="text-xs text-slate-600 font-bold flex gap-3 items-start group/li">
                                            <div className="w-5 h-5 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover/li:bg-blue-600 group-hover/li:text-white transition-all">
                                                <CheckCircle2 className="w-3 h-3" />
                                            </div>
                                            <span className="group-hover/li:text-slate-900 transition-colors pt-0.5">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="group/item">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                    Market Keywords
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {/* Defensive keywords mapping with exact fallback request */}
                                    {data?.keywords?.slice(0, 10).map((keyword, i) => (
                                        <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold border border-slate-200/50 hover:bg-slate-200 transition-colors cursor-default">
                                            {keyword}
                                        </span>
                                    )) || <p className="text-[10px] text-slate-400 italic">No keywords available</p>}
                                    {data?.keywords && data.keywords.length === 0 && (
                                        <span className="text-[10px] text-slate-400 italic">No keywords extracted</span>
                                    )}
                                </div>
                            </div>

                            <div className="group/item">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Differentiated Signals</h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.signals.map((signal, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-slate-900 text-white text-[9px] font-black rounded-lg border border-slate-800 uppercase tracking-widest shadow-lg active:scale-95 transition-transform">
                                            {signal}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 mt-6 relative overflow-hidden">
                                <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">
                                    <span className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded-md border border-slate-100">Sources <div className="w-1 h-1 bg-slate-200 rounded-full"></div> {data.sources.length}</span>
                                    <span className="flex items-center gap-1.5 text-blue-500"><Loader2 className="w-3 h-3 animate-spin" /> {data.sources[0].timestamp}</span>
                                </div>
                                <ul className="space-y-2">
                                    {data.sources.map((source, i) => (
                                        <li key={i} className="truncate group/link">
                                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2">
                                                <Bookmark className="w-3 h-3 group-hover/link:fill-blue-500 group-hover/link:text-blue-500 transition-all" /> {source.url.replace('https://', '')}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
