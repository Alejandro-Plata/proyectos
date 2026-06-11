import type { SearchInputProps } from './types/types';
import { Icons } from './Icons';

export const SearchInput = ({ className = '', action, ...props }: SearchInputProps) => {
    return (
        <div className={`relative group w-full ${className}`}>
            <div className="relative flex items-center w-full bg-slate-50 dark:bg-[#0d0e11] border border-emerald-500/20 dark:border-emerald-500/15 transition-all duration-200
                focus-within:border-emerald-500/50 dark:focus-within:border-emerald-500/40
                focus-within:bg-white dark:focus-within:bg-[#0a0b0e]
            ">
                <div className="pl-3.5 text-emerald-500/40 group-focus-within:text-emerald-500 transition-colors pointer-events-none shrink-0">
                    {Icons.search}
                </div>

                <input
                    type="text"
                    className="flex-1 w-full px-3 py-2 bg-transparent border-none outline-none font-mono text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    {...props}
                />

                {action && (
                    <div className="pr-1.5 shrink-0">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
};