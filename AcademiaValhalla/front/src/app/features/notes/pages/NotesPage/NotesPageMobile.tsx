import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NoteCardMobile } from '../../components/NoteCard/NoteCardMobile';
import { useNotes, etiquetaLenguaje } from '../../hooks/useNotes';
import { Toast } from '../../../../components/Toast';
import type { LanguageType, FiltroLenguaje, Difficulty, NoteSource } from '../../types/types';
import { SearchInput } from '../../../../components/SearchInput';
import { Icons } from '../../../../components/Icons';

interface Props { onStartTour?: () => void; }

export const NotesPageMobile = ({ onStartTour = () => {} }: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<NoteSource>('personal');
    const [showSavedToast, setShowSavedToast] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        if ((location.state as any)?.noteSaved) {
            setShowSavedToast(true);
            window.history.replaceState({}, '');
            const timer = setTimeout(() => setShowSavedToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    const {
        languages,
        difficulties,
        selectedLanguage,
        setSelectedLanguage,
        selectedDifficulty,
        setSelectedDifficulty,
        searchQuery,
        setSearchQuery,
        filteredNotes
    } = useNotes();

    const displayedNotes = filteredNotes.filter(
        (note) => ((note as { source?: string }).source || 'personal') === activeTab
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-200 pb-24">
            <Toast
                show={showSavedToast}
                type="success"
                message="Nota guardada correctamente"
                onDismiss={() => setShowSavedToast(false)}
                position="fixed"
            />

            {/* Header sticky */}
            <div className="px-4 pt-5 pb-3 border-b border-slate-200 dark:border-emerald-500/10 bg-slate-50 dark:bg-[#050505] sticky top-0 z-20">
                <div className="mb-3 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-block w-1 h-4 bg-emerald-500 shrink-0" />
                            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">Apuntes</span>
                        </div>
                        <h1 className="font-mono text-xl font-bold uppercase tracking-[0.06em] text-slate-900 dark:text-white">Conocimiento</h1>
                    </div>
                    <button
                        data-tour="notes-help"
                        onClick={onStartTour}
                        className="mt-1 w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-white/10 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-500 transition-colors font-mono text-xs font-bold shrink-0"
                        title="Tutorial de apuntes"
                    >
                        ?
                    </button>
                </div>
                <div className="flex gap-2">
                    <div data-tour="notes-search" className="flex-1">
                        <SearchInput
                            placeholder="Buscar concepto..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white dark:bg-[#0a0b0e] border-emerald-500/15 dark:border-emerald-500/10 focus:border-emerald-500/50"
                        />
                    </div>
                    {/* Filter button */}
                    {(() => {
                        const activeCount = (selectedLanguage !== 'todos' ? 1 : 0) + (selectedDifficulty !== 'Todas' ? 1 : 0);
                        return (
                            <button
                                onClick={() => setFiltersOpen(o => !o)}
                                className={`relative shrink-0 w-[46px] self-stretch flex items-center justify-center border transition-colors ${
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
            </div>

            {/* Tabs + Filtros desplegable */}
            <div className="border-b border-emerald-500/15 dark:border-emerald-500/10 bg-slate-50 dark:bg-[#050505]">

                {/* Tabs Mis Apuntes / Comunidad */}
                <div className="px-4 py-2">
                    <div data-tour="notes-tabs" className="flex border border-emerald-500/15 dark:border-emerald-500/10">
                        {(['personal', 'community'] as NoteSource[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative flex-1 h-10 font-mono text-[10px] uppercase tracking-[0.2em] font-bold transition-colors ${
                                    activeTab === tab
                                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/[0.06]'
                                        : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                {activeTab === tab && (
                                    <span className="absolute top-0 left-0 right-0 h-px bg-emerald-500" />
                                )}
                                {tab === 'personal' ? 'Mis Apuntes' : 'Comunidad'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filtros desplegable */}
                {filtersOpen && (
                    <div className="px-4 pb-3 space-y-2 border-t border-emerald-500/10">
                        {/* Apuntes: todo tipo / temática general / lenguaje concreto */}
                        <div>
                            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-500 block mb-1.5 pt-2">Apuntes</span>
                            <div className="relative w-full">
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value as FiltroLenguaje)}
                                    className="w-full appearance-none h-9 pl-3 pr-8 text-[10px] font-bold font-mono uppercase tracking-[0.15em] bg-white dark:bg-[#0a0b0e] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-emerald-500/10 focus:outline-none focus:border-emerald-500/40 transition-colors"
                                >
                                    {languages.map((lang: FiltroLenguaje) => (
                                        <option key={lang} value={lang} className="bg-white dark:bg-[#0b1015]">
                                            {etiquetaLenguaje(lang)}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-slate-500">
                                    <div className="w-3.5 h-3.5">{Icons.arrowDown}</div>
                                </div>
                            </div>
                        </div>

                        {/* Dificultad */}
                        <div>
                            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-500 block mb-1.5">Dificultad</span>
                            <div className="relative w-full">
                                <select
                                    value={selectedDifficulty}
                                    onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty)}
                                    className="w-full appearance-none h-9 pl-3 pr-8 text-[10px] font-bold font-mono uppercase tracking-[0.15em] bg-white dark:bg-[#0a0b0e] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-emerald-500/10 focus:outline-none focus:border-emerald-500/40 transition-colors"
                                >
                                    {difficulties.map((diff: string) => (
                                        <option key={diff} value={diff} className="bg-white dark:bg-[#0b1015]">
                                            {diff === 'Todas' ? 'Nivel: Todos' : diff}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-slate-500">
                                    <div className="w-3.5 h-3.5">{Icons.arrowDown}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Lista de notas */}
            <div className="px-4 py-4 space-y-3">
                {displayedNotes.length > 0 ? (
                    displayedNotes.map((note) => (
                        <NoteCardMobile
                            key={note.id}
                            note={{ ...note, language: note.language as LanguageType }}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <svg className="w-10 h-10 text-emerald-500/20" viewBox="0 0 48 48" fill="none">
                            <polygon points="24,2 44,13 44,35 24,46 4,35 4,13" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">Sin resultados</p>
                    </div>
                )}
            </div>

            {/* FAB — Nuevo apunte */}
            {activeTab === 'personal' && (
                <button
                    data-tour="notes-new"
                    onClick={() => navigate('/dashboard/notes/create')}
                    className="fixed right-5 z-30 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 flex items-center justify-center transition-colors"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)', bottom: 'var(--fab-bottom)' }}
                    aria-label="Nuevo apunte"
                >
                    <div className="w-6 h-6 flex items-center justify-center">{Icons.plus}</div>
                </button>
            )}
        </div>
    );
};
