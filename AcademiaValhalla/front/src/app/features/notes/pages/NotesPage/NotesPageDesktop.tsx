import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icons } from '../../../../components/Icons';
import { NoteCardDesktop } from '../../components/NoteCard/NoteCardDesktop';
import { SearchInput } from '../../../../components/SearchInput';
import { useNotes } from '../../hooks/useNotes';
import { Toast } from '../../../../components/Toast';
import type { LanguageType, NoteSource, Note } from '../../types/types';

export const NotesPageDesktop = () => {
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
        selectedLanguage,
        setSelectedLanguage,
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
                    <button
                        onClick={() => navigate('/dashboard/notes/create')}
                        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                        className="flex items-center gap-2 px-5 h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors"
                    >
                        <div className="w-4 h-4 flex items-center justify-center">{Icons.plus}</div>
                        Nuevo
                    </button>
                </div>

                <div className="flex flex-col gap-5">

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                        {/* Tabs Mis Apuntes / Comunidad */}
                        <div className="flex p-1 border bg-slate-100 dark:bg-[#111214] border-emerald-500/15 dark:border-emerald-500/10 w-full md:w-auto">
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
                        <div className="w-full md:w-80">
                            <SearchInput
                                placeholder="Buscar apuntes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10"
                            />
                        </div>
                    </div>

                    {/* Filtros de Lenguaje */}
                    <nav className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar items-center p-1 bg-slate-100/80 dark:bg-[#111214] border border-emerald-500/15 dark:border-emerald-500/10">
                        {languages.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setSelectedLanguage(lang)}
                                className={`
                                    shrink-0 px-3.5 py-1.5 text-[11px] font-bold font-mono uppercase tracking-[0.15em] transition-colors
                                    ${selectedLanguage === lang
                                        ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }
                                `}
                            >
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </button>
                        ))}
                    </nav>
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
