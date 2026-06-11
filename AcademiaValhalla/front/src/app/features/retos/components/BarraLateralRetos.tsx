import { Icons } from '../../../components/Icons';
import { FiltrosRetos } from './FiltrosRetos';
import { ElementoListaReto } from './ElementoListaReto';
import type { Reto as Challenge } from '../types/types';

interface PropsBarraLateralRetos {
    isDark: boolean;
    collapsed: boolean;
    challenges: Challenge[];
    activeChallenge: Challenge | null;
    onSelect: (challenge: Challenge) => void;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    isFiltersOpen: boolean;
    onToggleFilters: () => void;
    selectedLang: string;
    onLangChange: (lang: string) => void;
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
    visibleTags: string[];
    tagPage: number;
    totalTagPages: number;
    onTagPageChange: (page: number) => void;
}

export const BarraLateralRetos = ({
    isDark,
    collapsed,
    challenges,
    activeChallenge,
    onSelect,
    searchQuery,
    onSearchChange,
    isFiltersOpen,
    onToggleFilters,
    selectedLang,
    onLangChange,
    selectedTags,
    onToggleTag,
    visibleTags,
    tagPage,
    totalTagPages,
    onTagPageChange,
}: PropsBarraLateralRetos) => (
    <aside className={`flex flex-col h-full border-r shrink-0 transition-all duration-300 overflow-hidden bg-white border-emerald-500/15 dark:bg-[#0a0b0e] dark:border-emerald-500/10
        ${collapsed ? 'w-0 border-transparent' : 'w-72'}`}
    >
        <div className="h-16 flex items-center justify-between px-6 border-b shrink-0 border-emerald-500/15 dark:border-emerald-500/10">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Misiones</span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{challenges.length}</span>
        </div>

        <div className="px-4 pt-4 pb-2">
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500">
                    {Icons.search}
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => onSearchChange(e.target.value)}
                    placeholder="Buscar misión..."
                    className="w-full py-2 pl-9 pr-3 text-xs border outline-none transition-colors bg-slate-50 border-emerald-500/20 text-slate-700 placeholder:text-slate-400 focus:border-emerald-500/50 dark:bg-[#16181d] dark:border-emerald-500/20 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-emerald-500/50"
                />
            </div>
        </div>

        <FiltrosRetos
            isDark={isDark}
            isOpen={isFiltersOpen}
            onToggle={onToggleFilters}
            selectedLang={selectedLang}
            onLangChange={onLangChange}
            selectedTags={selectedTags}
            onToggleTag={onToggleTag}
            visibleTags={visibleTags}
            tagPage={tagPage}
            totalTagPages={totalTagPages}
            onTagPageChange={onTagPageChange}
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 bg-slate-50/50 dark:bg-[#0a0b0e]">
            {challenges.length > 0 ? (
                challenges.map(challenge => (
                    <ElementoListaReto
                        key={challenge.id}
                        challenge={challenge}
                        isActive={activeChallenge?.id === challenge.id}
                        isDark={isDark}
                        onClick={() => onSelect(challenge)}
                    />
                ))
            ) : (
                <div className="p-8 text-center opacity-50">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Sin resultados</p>
                </div>
            )}
        </div>
    </aside>
);
