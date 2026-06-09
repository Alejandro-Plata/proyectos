import React from 'react';
import type { DefinitionBoxProps } from '../types/types';

export const DefinitionBoxDesktop: React.FC<DefinitionBoxProps> = ({ title = "Concepto Clave", children }) => {
    return (
        <div
            className="border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5"
            style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}
        >
            <div className="pl-4 pr-5 py-3">
                <div className="mb-2">
                    <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 select-none">
                        {title}
                    </h4>
                </div>
                <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {children}
                </div>
            </div>
        </div>
    );
};
