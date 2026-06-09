import type { ReactNode } from 'react';

export interface TabItem {
    key: string;
    label: string;
    icon?: ReactNode;
    badge?: number;
}

interface TabBarProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (key: string) => void;
    /** Si true, cada tab ocupa el mismo ancho (flex-1 justify-center) */
    fullWidth?: boolean;
    className?: string;
}

export const TabBar = ({ tabs, activeTab, onChange, fullWidth = false, className = '' }: TabBarProps) => (
    <div className={`flex border-b border-emerald-500/10 ${className}`}>
        {tabs.map(tab => {
            const isActive = tab.key === activeTab;
            return (
                <button
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-3 font-mono text-[11px] uppercase tracking-[0.15em] border-b-2 transition-colors duration-200
                        ${fullWidth ? 'flex-1 justify-center' : ''}
                        ${isActive
                            ? 'text-emerald-500 border-emerald-500'
                            : 'text-slate-400 border-transparent hover:text-emerald-500'
                        }`}
                >
                    {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
                    {tab.label}
                    {tab.badge != null && tab.badge > 0 && (
                        <span
                            style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
                            className="ml-1 bg-rose-500 text-white font-mono text-[9px] font-bold min-w-[18px] h-4 inline-flex items-center justify-center px-1"
                        >
                            {tab.badge > 9 ? '9+' : tab.badge}
                        </span>
                    )}
                </button>
            );
        })}
    </div>
);
