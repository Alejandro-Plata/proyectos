export const CompassIcon = () => {
    return (
        <svg width="140" height="140" viewBox="0 0 100 100" className="text-slate-800 dark:text-teal-50 drop-shadow-2xl">
            <g className="origin-center animate-[spin_12s_linear_infinite]">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-20" />
            </g>
            <path d="M50 15 L50 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-teal-500 dark:text-teal-400" />
            <path d="M50 65 L50 85" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-teal-500 dark:text-teal-400 opacity-50" />
            <path d="M15 50 L35 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-teal-500 dark:text-teal-400 opacity-50" />
            <path d="M65 50 L85 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-teal-500 dark:text-teal-400" />
            <g className="origin-center animate-[pulse_4s_ease-in-out_infinite]">
                <polygon points="48,50 50,20 52,50" fill="currentColor" className="text-teal-600 dark:text-white" />
                <polygon points="48,52 50,75 52,52" fill="currentColor" className="text-slate-400 dark:text-slate-600 origin-top animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30" />
            </g>
            <circle cx="50" cy="50" r="3" fill="currentColor" className="text-teal-500" />
        </svg>
    );
};
