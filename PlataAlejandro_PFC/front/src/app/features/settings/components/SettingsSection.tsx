interface SettingsSectionProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
}

export const SettingsSection = ({ title, subtitle, children, className = '' }: SettingsSectionProps) => (
    <div className={`bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5 overflow-hidden transition-colors ${className}`}>
        <div className="p-6 sm:p-8">
            <div className="mb-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
            </div>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{subtitle}</p>}
            {!subtitle && <div className="mb-2" />}
            {children}
        </div>
    </div>
);
