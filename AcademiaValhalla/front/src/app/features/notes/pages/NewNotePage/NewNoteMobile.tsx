import { useNoteDetail } from '../../hooks';
import { Link, useNavigate } from 'react-router-dom';
import { renderContent, getLanguageColor } from '../../utils';
import { MonacoEditorMobile } from '../../../../components/MonacoEditor/MonacoEditorMobile';
import { EncabezadoMobile } from '../../../../components/Header/HeaderMobile';
import { resolveAssetUrl } from '../../../../utils/getAvatarUrl';

export const NewNoteMobile = () => {
    const { note, navigation, noteId } = useNoteDetail();
    const navigate = useNavigate();

    if (!note) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-200">

            <EncabezadoMobile
                modo="subpagina"
                titulo={note.title}
                onBack={() => navigate(-1)}
            />

            <main className="px-4 py-5 space-y-6 pb-6">

                {/* Header del apunte */}
                <header className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest border ${getLanguageColor(note.language)}`}>
                            {note.language}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded-sm">
                            {note.difficulty}
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{note.title}</h1>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-2 flex-1">
                            {note.tags.map(tag => (
                                <span key={tag} className="text-[10px] font-mono text-slate-500">#{tag}</span>
                            ))}
                        </div>
                        {note.source === 'personal' && (
                            <button
                                onClick={() => window.open(`/dashboard/notes/${noteId}/print`, '_blank')}
                                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 active:bg-slate-100 dark:active:bg-white/[0.04] transition-colors"
                                style={{ clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)' }}
                                title="Exportar como PDF"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                PDF
                            </button>
                        )}
                    </div>
                </header>

                {/* Contenido */}
                <div className="space-y-6">
                    {note.content.map((item, index) => (
                        <div key={index}>
                            {item.type === 'text' && (
                                <div className="prose prose-sm prose-invert max-w-none prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-emerald-400 prose-code:text-emerald-300 prose-code:bg-emerald-900/20 prose-code:px-1 prose-code:rounded prose-code:font-normal">
                                    <p>{renderContent(item.value)}</p>
                                </div>
                            )}

                            {item.type === 'image' && item.value && (
                                <div className="rounded-sm overflow-hidden border border-slate-200 dark:border-white/10">
                                    <img
                                        src={resolveAssetUrl(item.value)}
                                        alt={item.title || ''}
                                        className="w-full max-h-72 object-contain bg-slate-50 dark:bg-[#0f1115]"
                                    />
                                </div>
                            )}

                            {item.type === 'definition' && (
                                <div className="border-l-2 border-emerald-500/60 pl-4 py-2 bg-emerald-500/[0.05] rounded-sm">
                                    {item.title && (
                                        <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-500 mb-1">
                                            {item.title}
                                        </h4>
                                    )}
                                    <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {renderContent(item.value)}
                                    </div>
                                </div>
                            )}

                            {item.type === 'code' && (
                                <div className="rounded-sm overflow-hidden border border-white/10 bg-[#1e1e1e]">
                                    <div className="bg-[#252526] px-3 py-2 flex items-center justify-between border-b border-white/5">
                                        <span className="text-[9px] text-slate-500 font-mono uppercase">
                                            {item.language || note.language}
                                        </span>
                                    </div>
                                    <div className="h-[240px] relative">
                                        <MonacoEditorMobile
                                            code={item.value}
                                            language={(item.language || note.language).toLowerCase()}
                                            editable={false}
                                            theme={true}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Navegación */}
                <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex justify-between gap-3">
                    {navigation.prev ? (
                        <Link to={`/dashboard/notes/${navigation.prev.id}`} className="flex-1 p-3 rounded-sm bg-slate-100 dark:bg-white/5 active:bg-slate-50 dark:active:bg-white/10 transition-colors border border-slate-200 dark:border-white/5">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Anterior</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{navigation.prev.title}</span>
                        </Link>
                    ) : <div className="flex-1" />}

                    {navigation.next ? (
                        <Link to={`/dashboard/notes/${navigation.next.id}`} className="flex-1 p-3 rounded-sm bg-slate-100 dark:bg-white/5 active:bg-slate-50 dark:active:bg-white/10 transition-colors text-right border border-slate-200 dark:border-white/5">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Siguiente</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{navigation.next.title}</span>
                        </Link>
                    ) : (
                        <Link to="/dashboard/notes" className="flex-1 p-3 rounded-sm bg-emerald-500/10 border border-emerald-500/20 active:bg-emerald-500/20 transition-colors text-right">
                            <span className="text-[10px] uppercase font-bold text-emerald-500 block mb-1">Finalizar</span>
                            <span className="text-xs font-bold text-emerald-400">Volver</span>
                        </Link>
                    )}
                </div>

            </main>
        </div>
    );
};


