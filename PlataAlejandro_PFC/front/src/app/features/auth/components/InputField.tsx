import React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

export interface InputFieldProps {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    icon: React.ReactNode;
    registration: UseFormRegisterReturn;
    error?: string;
    labelRight?: React.ReactNode;
    className?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
    autoComplete?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
    id, label, type, placeholder, icon, registration, error, labelRight, className, inputMode, autoComplete
}) => {
    return (
        <div className={`group ${className || ''}`}>
            {/* Label above input */}
            <div className="flex items-center justify-between mb-2">
                <label
                    htmlFor={id}
                    className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 select-none"
                >
                    <span className="inline-block w-0.5 h-3 bg-emerald-500 shrink-0" />
                    {label}
                </label>
                {labelRight && (
                    <span className="font-mono text-[10px] text-slate-400/70">{labelRight}</span>
                )}
            </div>

            <div className="relative">
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                    error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-emerald-500'
                }`}>
                    {icon}
                </div>

                <input
                    {...registration}
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    inputMode={inputMode}
                    autoComplete={autoComplete}
                    className={`
                        w-full text-sm px-3 py-2.5 pl-9 outline-none bg-transparent
                        text-slate-900 dark:text-white
                        placeholder:text-slate-400/50 dark:placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs
                        border transition-colors
                        ${error
                            ? 'border-red-400 dark:border-red-500/50 focus:border-red-500'
                            : 'border-emerald-500/20 dark:border-emerald-500/15 focus:border-emerald-500/50'
                        }
                    `}
                />

                {error && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 group/error">
                        <svg className="w-4 h-4 text-red-500 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="absolute right-0 bottom-full mb-2 w-max max-w-[220px] bg-[#1a0505] border border-red-900/50 text-red-200 font-mono text-[10px] px-3 py-2 shadow-xl opacity-0 group-hover/error:opacity-100 transition-opacity pointer-events-none z-20">
                            {error}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
