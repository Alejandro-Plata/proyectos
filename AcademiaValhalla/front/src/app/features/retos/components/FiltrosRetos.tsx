import { Icons } from '../../../components/Icons';
import { LANGUAGES } from '../data/languages';

interface ChallengeFiltersProps {
    isDark: boolean;
    isOpen: boolean;
    onToggle: () => void;
    selectedLang: string;
    onLangChange: (lang: string) => void;
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
    visibleTags: string[];
    tagPage: number;
    totalTagPages: number;
    onTagPageChange: (page: number) => void;
}

export const FiltrosRetos = ({
    isDark,
    isOpen,
    onToggle,
    selectedLang,
    onLangChange,
    selectedTags,
    onToggleTag,
    visibleTags,
    tagPage,
    totalTagPages,
    onTagPageChange,
}: ChallengeFiltersProps) => {
    const selectClass = `w-full p-2 text-xs font-mono border outline-none cursor-pointer transition-colors ${
        isDark
            ? 'bg-[#16181d] border-emerald-500/20 text-white focus:border-emerald-500/50'
            : 'bg-slate-50 border-emerald-500/20 text-slate-700 focus:border-emerald-500/50'
    }`;

    const tagBtnClass = (active: boolean) =>
        `px-2 py-1 text-[10px] font-mono border transition-all ${
            active
                ? 'bg-emerald-500/[0.08] text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400'
                : isDark
                    ? 'bg-transparent border-emerald-500/10 text-slate-400 hover:border-emerald-500/30'
                    : 'bg-white border-emerald-500/15 text-slate-500 hover:border-emerald-500/30'
        }`;

    return (
        <div className="border-b border-emerald-500/15 dark:border-emerald-500/10">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
            >
                <span className="flex items-center gap-2">{Icons.filter} Filtros</span>
                <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>{Icons.chevronDown}</span>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pb-4 space-y-3">
                    {/* Lenguaje */}
                    <div className="space-y-1.5">
                        <label className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 block">
                            Lenguaje
                        </label>
                        <select value={selectedLang} onChange={e => onLangChange(e.target.value)} className={selectClass}>
                            <option value="all">Todos</option>
                            {LANGUAGES.map(lang => (
                                <option key={lang.id} value={lang.id}>{lang.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tags paginados */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                                Etiquetas
                            </label>
                            {totalTagPages > 1 && (
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onTagPageChange(Math.max(0, tagPage - 1))}
                                        disabled={tagPage === 0}
                                        className={`w-5 h-5 flex items-center justify-center text-[10px] transition-colors ${
                                            tagPage === 0 ? 'opacity-30 cursor-default' : isDark ? 'hover:bg-white/10 text-slate-400 cursor-pointer' : 'hover:bg-slate-100 text-slate-500 cursor-pointer'
                                        }`}
                                    >‹</button>
                                    <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
                                        {tagPage + 1}/{totalTagPages}
                                    </span>
                                    <button
                                        onClick={() => onTagPageChange(Math.min(totalTagPages - 1, tagPage + 1))}
                                        disabled={tagPage >= totalTagPages - 1}
                                        className={`w-5 h-5 flex items-center justify-center text-[10px] transition-colors ${
                                            tagPage >= totalTagPages - 1 ? 'opacity-30 cursor-default' : isDark ? 'hover:bg-white/10 text-slate-400 cursor-pointer' : 'hover:bg-slate-100 text-slate-500 cursor-pointer'
                                        }`}
                                    >›</button>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {visibleTags.map(tag => (
                                <button key={tag} onClick={() => onToggleTag(tag)} className={tagBtnClass(selectedTags.includes(tag))}>
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
