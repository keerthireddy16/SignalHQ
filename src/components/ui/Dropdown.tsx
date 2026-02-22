'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface DropdownProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    icon?: React.ReactNode;
}

export default function Dropdown({
    options,
    value,
    onChange,
    placeholder = 'Select option',
    label,
    icon
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = value === 'All' ? placeholder : value;

    return (
        <div className="flex-1 relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full h-[42px] bg-slate-50 border border-slate-200 rounded-2xl px-5 text-xs font-medium text-left transition-all duration-200 outline-none flex items-center gap-4 group cursor-pointer",
                    isOpen ? "ring-4 ring-blue-600/5 border-blue-600 bg-white" : "hover:border-slate-300 hover:bg-slate-100/50"
                )}
            >
                {icon && (
                    <div className="text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 pointer-events-none">
                        {icon}
                    </div>
                )}

                <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className={cn(
                        "truncate text-slate-500 group-hover:text-slate-900",
                        value === 'All' && "text-slate-400 group-hover:text-slate-500"
                    )}>
                        {selectedLabel}
                    </span>
                    <ChevronDown className={cn(
                        "w-4 h-4 text-slate-400 transition-transform duration-300 pointer-events-none group-hover:text-blue-600",
                        isOpen && "rotate-180 text-blue-600"
                    )} />
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[60] py-2 animate-in fade-in zoom-in-95 duration-200 origin-top">
                    <div className="max-h-60 overflow-y-auto scrollbar-thin">
                        {options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full text-left px-5 py-3 text-xs font-medium flex items-center justify-between transition-colors",
                                    value === option
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                {option}
                                {value === option && <Check className="w-3.5 h-3.5" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
