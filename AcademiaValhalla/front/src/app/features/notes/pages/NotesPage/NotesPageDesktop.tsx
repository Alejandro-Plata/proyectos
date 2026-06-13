import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icons } from '../../../../components/Icons';
import { NoteCardDesktop } from '../../components/NoteCard/NoteCardDesktop';
import { SearchInput } from '../../../../components/SearchInput';
import { useNotes, etiquetaLenguaje } from '../../hooks/useNotes';
import { Toast } from '../../../../components/Toast';
import type { LanguageType, FiltroLenguaje, Difficulty, NoteSource, Note } from '../../types/types';

interface Props { onStartTour?: () => void; }

export const NotesPageDesktop = ({ onStartTour = () => {} }: Props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState<NoteSource>('personal');
    const [showSavedToast, setShowSavedToast] = useState(false);

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

    const displayedNotes = filteredNotes.filter((note: Note) => (note.source || 'personal') === activeTab);

    return (
        <div className="p-8 lg:p-12 min-h-full">
            <Toast
                show={showSavedToast}
                type="success"
                message="Nota guardada correctamente"
                onDismiss={() => setShowSavedToast(false)}
            />
            <div className="max-w-[1400px] mx-auto space-y-8">

                {/* BB-4 Page title */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="mb-2">
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Conocimiento</h1>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                            {activeTab === 'personal'
                                ? 'Crea, experimenta, organiza tus apuntes y notas.'
                                : 'Recursos compartidos por la comunidad.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            data-tour="notes-help"
                            onClick={onStartTour}
                            className="w-9 h-9 flex items-center justify-center border border-slate-200 dark:border-white/10 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-500 transition-colors font-mono text-xs font-bold"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}
                            title="Tutorial de apuntes"
                        >
                            ?
                        </button>
                        <button
                            data-tour="notes-new"
                            onClick={() => navigate('/dashboard/notes/create')}
                            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                            className="flex items-center gap-2 px-5 h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors"
                        >
                            <div className="w-4 h-4 flex items-center justify-center">{Icons.plus}</div>
                            Nuevo
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-5">

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                        {/* Tabs Mis Apuntes / Comunidad */}
                        <div data-tour="notes-tabs" className="flex p-1 border bg-slate-100 dark:bg-[#111214] border-emerald-500/15 dark:border-emerald-500/10 w-full md:w-auto">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`flex-1 md:flex-none px-5 py-1.5 text-xs font-bold font-mono uppercase tracking-[0.15em] transition-colors ${
                                    activeTab === 'personal'
                                        ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                Mis Apuntes
                            </button>
                            <button
                                onClick={() => setActiveTab('community')}
                                className={`flex-1 md:flex-none px-5 py-1.5 text-xs font-bold font-mono uppercase tracking-[0.15em] transition-colors ${
                                    activeTab === 'community'
                                        ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                Comunidad
                            </button>
                        </div>

                        {/* Buscador */}
                        <div data-tour="notes-search" className="w-full md:w-80">
                            <SearchInput
                                placeholder="Buscar apuntes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10"
                            />
                        </div>
                    </div>

                    {/* Filtros desplegables: lenguaje + dificultad */}
                    <div data-tour="notes-filters" className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-500">
                                Apuntes
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value as FiltroLenguaje)}
                                    className="appearance-none h-9 w-52 pl-3 pr-8 text-[11px] font-bold font-mono uppercase tracking-[0.15em] bg-white dark:bg-[#111214] text-slate-700 dark:text-slate-300 border border-emerald-500/15 dark:border-emerald-500/10 focus:outline-none focus:border-emerald-500/40 transition-colors cursor-pointer"
                                >
                                    {languages.map((lang) => (
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

                        <div className="flex flex-col gap-1">
                            <label className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-500">
                                Dificultad
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedDifficulty}
                                    onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty)}
                                    className="appearance-none h-9 w-44 pl-3 pr-8 text-[11px] font-bold font-mono uppercase tracking-[0.15em] bg-white dark:bg-[#111214] text-slate-700 dark:text-slate-300 border border-emerald-500/15 dark:border-emerald-500/10 focus:outline-none focus:border-emerald-500/40 transition-colors cursor-pointer"
                                >
                                    {difficulties.map((diff) => (
                                        <option key={diff} value={diff} className="bg-white dark:bg-[#0b1015]">
                                            {diff === 'Todas' ? 'Todas' : diff}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-slate-500">
                                    <div className="w-3.5 h-3.5">{Icons.arrowDown}</div>
                                </div>
                            </div>
                        </div>

                        {(selectedLanguage !== 'todos' || selectedDifficulty !== 'Todas') && (
                            <button
                                onClick={() => { setSelectedLanguage('todos'); setSelectedDifficulty('Todas'); }}
                                className="self-end h-9 px-3 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 hover:text-emerald-500 border border-transparent hover:border-emerald-500/20 transition-colors"
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* Grid de notas */}
                {displayedNotes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {displayedNotes.map((note) => (
                            <NoteCardDesktop key={note.id} note={{ ...note, language: note.language as LanguageType }} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 border border-dashed border-emerald-500/15 dark:border-emerald-500/10 bg-emerald-500/[0.01] text-center">
                        {/* BB-14 Empty state: hexagon SVG */}
                        <svg className="w-12 h-12 mb-4 text-emerald-500/20" viewBox="0 0 48 48" fill="none">
                            <polygon points="24,2 44,13 44,35 24,46 4,35 4,13" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <polygon points="24,10 36,17 36,31 24,38 12,31 12,17" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.05" />
                        </svg>
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-1">
                            {activeTab === 'personal' ? 'Sin apuntes' : 'Sin resultados'}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6 text-xs leading-relaxed">
                            {activeTab === 'personal'
                                ? 'Documenta lo que aprendes hoy. ¡Empieza creando tu primer apunte!'
                                : 'No hay apuntes de la comunidad que coincidan con tu búsqueda.'}
                        </p>
                        {activeTab === 'personal' && (
                            <button
                                onClick={() => navigate('/dashboard/notes/create')}
                                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                                className="inline-flex items-center gap-2 px-5 h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors"
                            >
                                <div className="w-4 h-4 flex items-center justify-center">{Icons.plus}</div>
                                Crear nota
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
