import { useState } from 'react';
import { Icons } from '../../../components/Icons';
import { ProposeMissionModal } from './ProposeMissionModal';
import { ProposeMissionMobile } from './ProposeMissionMobile';
import type { Reto as Challenge } from '../types/types';

interface ChallengeBrowseViewProps {
    isLoading: boolean;
    filteredChallenges: Challenge[];
    searchQuery: string;
    onSearchChange: (q: string) => void;
    selectedLang: string;
    onLangChange: (lang: string) => void;
    availableLanguages: string[];
    visibleTags: string[];
    tagPage: number;
    totalTagPages: number;
    selectedTags: string[];
    onTagPageChange: (page: number) => void;
    onToggleTag: (tag: string) => void;
    onChallengeClick: (challenge: Challenge) => void;
    showPropose: boolean;
    onOpenPropose: () => void;
    onClosePropose: () => void;
    onDeleteChallenge?: (challenge: Challenge) => void;
}

const LANG_STYLES: Record<string, string> = {
    javascript: 'bg-orange-500/[0.08] text-orange-600 border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400',
    typescript: 'bg-blue-500/[0.08] text-blue-600 border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400',
    python:     'bg-sky-500/[0.08] text-sky-600 border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400',
    java:       'bg-red-500/[0.08] text-red-600 border-red-500/30 dark:bg-red-500/10 dark:text-red-400',
    go:         'bg-cyan-500/[0.08] text-cyan-600 border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-400',
    csharp:     'bg-violet-500/[0.08] text-violet-600 border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400',
};
const LANG_SHORT: Record<string, string> = {
    javascript: 'JS', typescript: 'TS', python: 'PY', java: 'JV', go: 'GO', csharp: 'C#',
};
const getLangStyle = (lang: string) => LANG_STYLES[lang.toLowerCase()] ?? 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10';
const getLangShort = (lang: string) => LANG_SHORT[lang.toLowerCase()] ?? lang.slice(0, 2).toUpperCase();

export const VistaExplorarRetos = ({
    isLoading,
    filteredChallenges,
    searchQuery,
    onSearchChange,
    selectedLang,
    onLangChange,
    availableLanguages,
    visibleTags,
    tagPage,
    totalTagPages,
    selectedTags,
    onTagPageChange,
    onToggleTag,
    onChallengeClick,
    showPropose,
    onOpenPropose,
    onClosePropose,
    onDeleteChallenge,
}: ChallengeBrowseViewProps) => {
    const [filtersOpen, setFiltersOpen] = useState(false);

    const langBtnClass = (active: boolean) =>
        `whitespace-nowrap px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors
        ${active
            ? 'bg-emerald-500/[0.08] text-emerald-600 border border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400'
            : 'bg-slate-100 dark:bg-[#0f1115] text-slate-500 dark:text-slate-400 border border-emerald-500/15 dark:border-emerald-500/10'
        }`;

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white overflow-hidden">
            {/* BB-4 Page title */}
            <div className="shrink-0 px-4 pt-6 pb-2">
                <div className="mb-4">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Misiones</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Pon a prueba tus habilidades</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="shrink-0 px-4 pb-2 pt-1 bg-slate-50 dark:bg-[#050505] z-10 border-b border-emerald-500/15 dark:border-emerald-500/10 space-y-2">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5">
                            {Icons.search}
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => onSearchChange(e.target.value)}
                            placeholder="Buscar misión..."
                            className="w-full bg-slate-100 dark:bg-[#0f1115] border border-emerald-500/20 dark:border-emerald-500/15 py-3 pl-10 pr-4 font-mono text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                    </div>
                    {/* Filter toggle button */}
                    {(() => {
                        const activeCount = (selectedLang !== 'all' ? 1 : 0) + selectedTags.length;
                        return (
                            <button
                                onClick={() => setFiltersOpen(o => !o)}
                                className={`relative shrink-0 w-[46px] flex items-center justify-center border transition-colors ${
                                    filtersOpen || activeCount > 0
                                        ? 'bg-emerald-500/[0.08] border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-slate-100 dark:bg-[#0f1115] border-emerald-500/15 dark:border-emerald-500/10 text-slate-500 dark:text-slate-400'
                                }`}
                                aria-label="Filtros"
                            >
                                <div className="w-4 h-4">{Icons.filter}</div>
                                {activeCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
                                        {activeCount}
                                    </span>
                                )}
                            </button>
                        );
                    })()}
                </div>

                {/* Filtros desplegable */}
                {filtersOpen && (
                    <div className="space-y-3 pb-1">
                        {/* Lenguajes */}
                        <div>
                            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 block mb-1.5">Lenguaje</span>
                            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                <button onClick={() => onLangChange('all')} className={langBtnClass(selectedLang === 'all')}>
                                    Todo
                                </button>
                                {availableLanguages.map(lang => (
                                    <button key={lang} onClick={() => onLangChange(lang)} className={langBtnClass(selectedLang === lang)}>
                                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Etiquetas */}
                        {visibleTags.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Etiquetas</span>
                                    {totalTagPages > 1 && (
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => onTagPageChange(Math.max(0, tagPage - 1))}
                                                disabled={tagPage === 0}
                                                className={`w-5 h-5 flex items-center justify-center text-[10px] text-slate-400 ${tagPage === 0 ? 'opacity-30' : ''}`}
                                            >‹</button>
                                            <span className="text-[9px] text-slate-500 font-mono">{tagPage + 1}/{totalTagPages}</span>
                                            <button
                                                onClick={() => onTagPageChange(Math.min(totalTagPages - 1, tagPage + 1))}
                                                disabled={tagPage >= totalTagPages - 1}
                                                className={`w-5 h-5 flex items-center justify-center text-[10px] text-slate-400 ${tagPage >= totalTagPages - 1 ? 'opacity-30' : ''}`}
                                            >›</button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {visibleTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => onToggleTag(tag)}
                                            className={`px-2 py-1 font-mono text-[10px] border transition-all
                                                ${selectedTags.includes(tag)
                                                    ? 'bg-emerald-500/[0.08] text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                    : 'bg-transparent border-emerald-500/15 dark:border-emerald-500/10 text-slate-500 dark:text-slate-400'
                                                }`}
                                        >{tag}</button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Challenge List — BB-2 container */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 space-y-3 pt-3">
                <div className="flex justify-between items-center py-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                        {isLoading ? 'Cargando...' : `${filteredChallenges.length} misiones`}
                    </span>
                    <button className="text-slate-400 w-5 h-5">{Icons.sort}</button>
                </div>

                {filteredChallenges.map(challenge => (
                    <div
                        key={challenge.id}
                        onClick={() => onChallengeClick(challenge)}
                        className="relative bg-white dark:bg-[#0a0b0e] p-5 transition-colors overflow-hidden group border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5 cursor-pointer hover:border-emerald-500/30 dark:hover:border-emerald-500/20"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {challenge.available_languages.map(lang => (
                                    <span
                                        key={lang}
                                        className={`font-mono text-[10px] uppercase tracking-[0.08em] px-2 py-0.5 border ${getLangStyle(lang)}`}
                                    >
                                        {getLangShort(lang)}
                                    </span>
                                ))}
                            </div>
                            {onDeleteChallenge ? (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteChallenge(challenge); }}
                                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/[0.06] border border-transparent hover:border-rose-500/20 transition-colors shrink-0"
                                    title="Eliminar misión"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            ) : (
                                <div className="text-slate-600 w-5 h-5">{Icons.dots}</div>
                            )}
                        </div>

                        <h3 className="font-mono text-sm uppercase tracking-tight text-slate-900 dark:text-white mb-2 leading-tight pr-4">{challenge.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">{challenge.description}</p>

                        <div className="flex items-center justify-between mt-2">
                            <div className="flex gap-2">
                                {challenge.tags.slice(0, 2).map((tag: string) => (
                                    <span key={tag} className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500 bg-slate-100 dark:bg-[#16181d] px-2 py-1 border border-emerald-500/15 dark:border-emerald-500/10">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <div className="w-8 h-8 bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center border border-emerald-500/15 dark:border-emerald-500/10">
                                <div className="w-4 h-4">{Icons.arrowRight}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FAB — BB-6 notched */}
            <button
                onClick={onOpenPropose}
                aria-label="Proponer misión"
                className="fixed right-6 z-50 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-colors shadow-lg shadow-emerald-500/30"
                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)', bottom: 'var(--fab-bottom)' }}
            >
                <div className="w-6 h-6 flex items-center justify-center">{Icons.plus}</div>
            </button>

            {/* Mobile wizard / Desktop modal */}
            <div className="md:hidden">
                <ProposeMissionMobile isOpen={showPropose} onClose={onClosePropose} />
            </div>
            <div className="hidden md:block">
                <ProposeMissionModal isOpen={showPropose} onClose={onClosePropose} />
            </div>
        </div>
    );
};
