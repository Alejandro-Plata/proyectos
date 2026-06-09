interface MobilePageProps {
    children: React.ReactNode;
    bottomBar?: React.ReactNode;
    padded?: boolean;
}

export const MobilePage = ({ children, bottomBar, padded = true }: MobilePageProps) => (
    <div className="flex flex-col h-[100dvh] bg-slate-50 dark:bg-[#050505]">
        <div
            className={`flex-1 overflow-y-auto ${padded ? 'px-4' : ''}`}
            style={{ paddingBottom: bottomBar ? `calc(64px + var(--safe-pb))` : 'var(--safe-pb)' }}
        >
            {children}
        </div>
        {bottomBar && (
            <div
                className="shrink-0 border-t border-emerald-500/15 dark:border-emerald-500/10 bg-white dark:bg-[#0a0b0e]"
                style={{ paddingBottom: 'var(--safe-pb)' }}
            >
                {bottomBar}
            </div>
        )}
    </div>
);
