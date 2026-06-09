import type { NavItemProps } from "../types/types";

export const NavItem = ({ active, onClick, label, icon, activeColor }: NavItemProps) => {
    const textClass = active ? "text-slate-900 dark:text-white font-bold" : "text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-700 dark:group-hover:text-slate-200";
    const bgClass = active ? "bg-slate-200 dark:bg-white/10" : "hover:bg-slate-100 dark:hover:bg-white/5";
    const iconClass = active ? (activeColor || "text-slate-900 dark:text-white") : "text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300";
    
    return (
        <button onClick={onClick} className={`group w-full flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-200 text-sm ${bgClass}`}>
            <span className={iconClass}>{icon}</span><span className={textClass}>{label}</span>{active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
        </button>
    );
};