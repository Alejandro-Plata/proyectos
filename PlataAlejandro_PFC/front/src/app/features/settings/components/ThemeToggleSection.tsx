import { useTheme } from '../../../hooks/useTheme';
import { Icons } from '../../../components/Icons';

export const ThemeToggleSection = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className="flex gap-3">
            {/* Light option */}
            <button
                onClick={() => isDarkMode && toggleTheme()}
                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                className={`flex-1 flex flex-col items-center gap-2 px-4 py-4 border transition-colors ${
                    !isDarkMode
                        ? 'border-emerald-500/40 bg-emerald-500/[0.06]'
                        : 'border-emerald-500/15 hover:border-emerald-500/30 hover:bg-emerald-500/[0.03]'
                }`}
            >
                <div className="text-slate-500 dark:text-slate-400">
                    {Icons.sun}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
                    Claro
                </span>
                {!isDarkMode && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">Activo</span>
                )}
            </button>

            {/* Dark option */}
            <button
                onClick={() => !isDarkMode && toggleTheme()}
                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                className={`flex-1 flex flex-col items-center gap-2 px-4 py-4 border transition-colors ${
                    isDarkMode
                        ? 'border-emerald-500/40 bg-emerald-500/[0.06]'
                        : 'border-emerald-500/15 hover:border-emerald-500/30 hover:bg-emerald-500/[0.03]'
                }`}
            >
                <div className="text-slate-500 dark:text-slate-400">
                    {Icons.moon}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
                    Oscuro
                </span>
                {isDarkMode && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">Activo</span>
                )}
            </button>
        </div>
    );
};
