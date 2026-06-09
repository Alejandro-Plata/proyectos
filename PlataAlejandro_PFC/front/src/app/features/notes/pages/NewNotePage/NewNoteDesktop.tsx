import { useNoteDetail } from '../../hooks';
import { Link } from 'react-router-dom';
import { renderContent } from '../../utils';
import { MonacoEditorDesktop } from '../../../../components/MonacoEditor/MonacoEditorDesktop';
import { resolveAssetUrl } from '../../../../utils/getAvatarUrl';

export const NewNoteDesktop = () => {
    const { note, navigation } = useNoteDetail();

    if (!note) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] text-slate-800 dark:text-slate-200">

            <div className="max-w-3xl mx-auto px-8 py-12 md:py-16 relative">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-slate-400 mb-10 font-medium">
                    <Link to="/dashboard/notes" className="hover:text-emerald-500 transition-colors">
                        Apuntes
                    </Link>
                    <span>/</span>
                    <span className="capitalize text-slate-500">{note.language}</span>
                </nav>

                {/* Header */}
                <header className="mb-10 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider border bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10">
                            {note.language}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider border bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20">
                            {note.difficulty}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                        {note.title}
                    </h1>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
                        {note.tags.map(tag => (
                            <span key={tag}>#{tag}</span>
                        ))}
                    </div>
                </header>

                <main className="space-y-8">
                    {/* Contenido */}
                    <div className="space-y-8">
                        {note.content.map((item, index) => (
                            <div key={index}>
                                {item.type === 'text' && (
                                    <div className="prose prose-slate dark:prose-invert max-w-none
                                        prose-p:leading-8 prose-p:text-slate-600 dark:prose-p:text-slate-300
                                        prose-a:text-emerald-600 dark:prose-a:text-emerald-400
                                        prose-code:text-emerald-600 dark:prose-code:text-emerald-400 prose-code:bg-slate-100 dark:prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                                    ">
                                        <p>{renderContent(item.value)}</p>
                                    </div>
                                )}

                                {item.type === 'image' && item.value && (
                                    <div className="rounded-sm overflow-hidden border border-slate-200 dark:border-white/10">
                                        <img
                                            src={resolveAssetUrl(item.value)}
                                            alt={item.title || ''}
                                            className="w-full max-h-[480px] object-contain bg-slate-50 dark:bg-[#0f1115]"
                                        />
                                    </div>
                                )}

                                {item.type === 'definition' && (
                                    <div className="border-l-2 border-emerald-500/60 pl-5 py-3 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06] rounded-sm">
                                        {item.title && (
                                            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-2">
                                                {item.title}
                                            </h4>
                                        )}
                                        <div className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                                            {renderContent(item.value)}
                                        </div>
                                    </div>
                                )}

                                {item.type === 'code' && (
                                    <div className="rounded-sm overflow-hidden border border-slate-200 dark:border-white/10 bg-[#1e1e1e]">
                                        <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-white/5">
                                            <span className="text-[10px] font-mono text-slate-500 uppercase">
                                                {item.language || note.language}
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-600">
                                                {item.filename || ''}
                                            </span>
                                        </div>
                                        <div className="h-[300px]">
                                            <MonacoEditorDesktop
                                                code={item.value}
                                                language={(item.language || note.language).toLowerCase()}
                                                theme={true}
                                                options={{
                                                    readOnly: true,
                                                    domReadOnly: true,
                                                    minimap: { enabled: false },
                                                    scrollBeyondLastLine: false,
                                                    lineNumbers: 'off',
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                    fontSize: 13,
                                                    padding: { top: 16, bottom: 16 },
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>

                {/* Footer de navegación */}
                <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10">
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                            {navigation.prev ? (
                                <Link to={`/dashboard/notes/${navigation.prev.id}`} className="group block text-left">
                                    <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 group-hover:text-emerald-500 transition-colors">
                                        ← Anterior
                                    </span>
                                    <span className="block text-sm font-medium text-slate-900 dark:text-white truncate">
                                        {navigation.prev.title}
                                    </span>
                                </Link>
                            ) : (
                                <span className="text-slate-300 dark:text-slate-700 text-xs select-none">Inicio</span>
                            )}
                        </div>

                        <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />

                        <div className="flex-1 text-right">
                            {navigation.next ? (
                                <Link to={`/dashboard/notes/${navigation.next.id}`} className="group block">
                                    <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 group-hover:text-emerald-500 transition-colors">
                                        Siguiente →
                                    </span>
                                    <span className="block text-sm font-medium text-slate-900 dark:text-white truncate">
                                        {navigation.next.title}
                                    </span>
                                </Link>
                            ) : (
                                <Link to="/dashboard/notes" className="group block">
                                    <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
                                        Finalizado
                                    </span>
                                    <span className="block text-sm font-medium text-slate-900 dark:text-white">
                                        Volver al Índice
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
};


