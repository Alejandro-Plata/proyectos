import type { ReportedPost } from '../../types/types';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { AdminListMobile } from '../shared/AdminListMobile';

interface Props {
    posts: ReportedPost[];
    onResolve: (reportId: string, action: 'dismissed' | 'removed') => Promise<void>;
}

const STATUS_STYLES: Record<string, string> = {
    pending:   'bg-amber-500/[0.08] text-amber-600 border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
    dismissed: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/[0.04] dark:text-slate-400 dark:border-white/10',
    removed:   'bg-rose-500/[0.08] text-rose-600 border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400',
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pendiente', dismissed: 'Descartado', removed: 'Eliminado',
};

export const ReportedPostsTable = ({ posts, onResolve }: Props) => {
    const isMobile = useIsMobile();

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/50 mb-2">· sin reportes</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">No hay posts reportados en este momento.</p>
            </div>
        );
    }

    if (isMobile) {
        return (
            <AdminListMobile
                items={posts}
                keyExtractor={(p) => p.id}
                renderHeader={(p) => (
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate font-mono uppercase tracking-wide">{p.post_title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500 font-mono">por {p.reporter_username}</span>
                            <span className={`inline-flex px-1.5 py-0 font-mono text-[10px] uppercase tracking-wider font-bold border ${STATUS_STYLES[p.status] ?? ''}`}>
                                {STATUS_LABELS[p.status] ?? p.status}
                            </span>
                        </div>
                    </div>
                )}
                renderBody={(p) => (
                    <dl className="grid grid-cols-1 gap-y-2 text-xs">
                        <dt className="text-slate-500 font-mono uppercase tracking-wider">Motivo</dt>
                        <dd className="text-slate-700 dark:text-slate-300 italic">"{p.reason}"</dd>
                        <dt className="text-slate-500 font-mono uppercase tracking-wider">Autor del post</dt>
                        <dd className="text-slate-500 font-mono">{p.post_author}</dd>
                        <dt className="text-slate-500 font-mono uppercase tracking-wider">Fecha</dt>
                        <dd className="text-slate-500 font-mono">{new Date(p.reported_at).toLocaleDateString('es-ES')}</dd>
                    </dl>
                )}
                renderActions={(p) => (
                    p.status === 'pending' ? (
                        <>
                            <button
                                onClick={() => onResolve(p.id, 'dismissed')}
                                className="flex-1 min-h-[44px] font-mono text-[11px] uppercase tracking-wider border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                            >
                                Descartar
                            </button>
                            <button
                                onClick={() => { if (confirm('¿Eliminar definitivamente este post del foro?')) onResolve(p.id, 'removed'); }}
                                className="flex-1 min-h-[44px] font-mono text-[11px] uppercase tracking-wider border border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
                            >
                                Eliminar Post
                            </button>
                        </>
                    ) : (
                        <span className="text-xs text-slate-400 font-mono">Resuelto</span>
                    )
                )}
                emptyMessage="No hay posts reportados"
            />
        );
    }

    return (
        <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-emerald-500/10 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                            <th className="py-3 px-5 font-medium">Post</th>
                            <th className="py-3 px-5 font-medium">Autor</th>
                            <th className="py-3 px-5 font-medium">Reportado por</th>
                            <th className="py-3 px-5 font-medium">Motivo</th>
                            <th className="py-3 px-5 font-medium">Estado</th>
                            <th className="py-3 px-5 font-medium">Fecha</th>
                            <th className="py-3 px-5 font-normal text-right">· acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700 dark:text-slate-300">
                        {posts.map((p) => (
                            <tr
                                key={p.id}
                                className="group border-b border-emerald-500/[0.06] hover:bg-emerald-500/[0.04] dark:hover:bg-emerald-500/[0.05] transition-colors"
                            >
                                <td className="py-3 px-5 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-900 dark:text-white max-w-[200px] truncate" title={p.post_title}>
                                    {p.post_title}
                                </td>
                                <td className="py-3 px-5 font-mono text-[10px] text-slate-600 dark:text-slate-400">{p.post_author}</td>
                                <td className="py-3 px-5 font-mono text-[10px] text-slate-500 dark:text-slate-400">{p.reporter_username}</td>
                                <td className="py-3 px-5 text-xs max-w-[160px] truncate italic text-slate-500 dark:text-slate-400" title={p.reason}>"{p.reason}"</td>
                                <td className="py-3 px-5">
                                    <span className={`inline-flex px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] font-bold border ${STATUS_STYLES[p.status] ?? ''}`}>
                                        {STATUS_LABELS[p.status] ?? p.status}
                                    </span>
                                </td>
                                <td className="py-3 px-5 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                    {new Date(p.reported_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </td>
                                <td className="py-3 px-5 text-right">
                                    {p.status === 'pending' && (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onResolve(p.id, 'dismissed')}
                                                className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/[0.06] dark:text-emerald-400 dark:hover:bg-emerald-500/10 transition-colors"
                                            >
                                                Descartar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('¿Eliminar definitivamente este post del foro?')) onResolve(p.id, 'removed');
                                                }}
                                                className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-rose-500/30 text-rose-600 hover:bg-rose-500/[0.06] dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                                            >
                                                Eliminar Post
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
