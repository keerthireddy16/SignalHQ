'use client';

import React from 'react';
import { Settings, Shield, Key, Bell, CreditCard } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h2>
                <p className="text-slate-500 mt-1">Manage your account and discovery preferences.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100">
                    {[
                        { name: 'API Configuration', desc: 'Securely manage your enrichment keys.', icon: Key },
                        { name: 'Security & Auth', desc: 'Password, MFA, and active sessions.', icon: Shield },
                        { name: 'Notifications', desc: 'Control signal alerts and daily digests.', icon: Bell },
                        { name: 'Plan & Billing', desc: 'Current subscription and invoices.', icon: CreditCard }
                    ].map(item => (
                        <button key={item.name} className="w-full text-left p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-white border border-transparent group-hover:border-slate-200 transition-all">
                                    <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Settings className="w-4 h-4 text-slate-400" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-red-50/50 rounded-2xl border border-red-100 p-6 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-red-950">Danger Zone</h4>
                    <p className="text-sm text-red-700">Delete all data, lists, and saved searches from local storage.</p>
                </div>
                <button
                    onClick={() => {
                        if (confirm('Clear all local data?')) { window.localStorage.clear(); window.location.href = '/'; }
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/10"
                >
                    Purge Data
                </button>
            </div>
        </div>
    );
}
