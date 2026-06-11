import { useState, useCallback } from 'react';
import { useUser } from '../../../../context/UserContext';
import { fetchPostComments } from '../../services/adminService';
import type { PublicacionAdmin, ComentarioAdmin } from '../../types/types';
import { ModalConfirmacion } from '../shared/ModalConfirmacion';

const POST_TYPE_LABELS: Record<string, string> = {
    PREGUNTA:  'Pregunta',
    RECURSO:   'Recurso',
    DISCUSION: 'Discusión',
};

const POST_TYPE_STYLES: Record<string, string> = {
    PREGUNTA:  'bg-blue-500/10 text-blue-600 border-blue-400/30 dark:text-blue-400',
    RECURSO:   'bg-emerald-500/10 text-emerald-600 border-emerald-400/30 dark:text-emerald-400',
    DISCUSION: 'bg-amber-500/10 text-amber-600 border-amber-400/30 dark:text-amber-400',
};

interface Props {
    posts: PublicacionAdmin[];
    onDeletePost: (id: string) => Promise<void>;
    onDeleteComment: (commentId: string, postId: string) => Promise<void>;
}

interface RowExpandida {
    postId: string;
    comments: ComentarioAdmin[];
    loading: boolean;
}

interface PendienteEliminar {
    tipo: 'post' | 'comentario';
    id: string;
    postId?: string;
    titulo: string;
}

export const TablaForo = ({ posts, onDeletePost, onDeleteComment }: Props) => {
    const { user } = useUser();
    const [expandida, setExpandida] = useState<RowExpandida | null>(null);
    const [pendiente, setPendiente] = useState<PendienteEliminar | null>(null);

    const toggleExpandir = useCallback(async (postId: string) => {
        if (expandida?.postId === postId) { setExpandida(null); return; }
        if (!user?.token) return;
        setExpandida({ postId, comments: [], loading: true });
        try {
            const res = await fetchPostComments(user.token, postId);
            setExpandida({ postId, comments: res.data, loading: false });
        } catch {
            setExpandida({ postId, comments: [], loading: false });
        }
    }, [expandida, user?.token]);

    const handleDeleteComment = (commentId: string, postId: string, contenido: string) => {
        setPendiente({ tipo: 'comentario', id: commentId, postId, titulo: contenido });
    };

    const confirmar = async () => {
        if (!pendiente) return;
        if (pendiente.tipo === 'post') {
            await onDeletePost(pendiente.id);
        } else {
            await onDeleteComment(pendiente.id, pendiente.postId!);
            setExpandida((prev) => prev
                ? { ...prev, comments: prev.comments.filter((c) => c.id !== pendiente.id) }
                : null
            );
        }
        setPendiente(null);
    };

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/50 mb-2">· sin datos</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">No hay publicaciones.</p>
            </div>
        );
    }

    return (
        <>
        {pendiente && (
            <ModalConfirmacion
                titulo={pendiente.tipo === 'post'
                    ? `¿Eliminar "${pendiente.titulo}"?`
                    : '¿Eliminar este comentario?'}
                descripcion={pendiente.tipo === 'post'
                    ? 'Se eliminarán también todos sus comentarios. Esta acción no se puede deshacer.'
                    : 'Esta acción no se puede deshacer.'}
                onConfirmar={confirmar}
                onCancelar={() => setPendiente(null)}
            />
        )}
        <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-emerald-500/10 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                            <th className="py-3 px-5 font-medium w-8" />
                            <th className="py-3 px-5 font-medium">Título</th>
                            <th className="py-3 px-5 font-medium">Tipo</th>
                            <th className="py-3 px-5 font-medium">Autor</th>
                            <th className="py-3 px-5 font-medium text-center">Comentarios</th>
                            <th className="py-3 px-5 font-medium">Fecha</th>
                            <th className="py-3 px-5 font-medium text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700 dark:text-slate-300">
                        {posts.map((p) => {
                            const isOpen = expandida?.postId === p.id;
                            return (
                                <>
                                    <tr
                                        key={p.id}
                                        className="group border-b border-emerald-500/[0.06] hover:bg-emerald-500/[0.03] dark:hover:bg-emerald-500/[0.04] transition-colors"
                                    >
                                        {/* Toggle comentarios */}
                                        <td className="py-3 px-5">
                                            {p.comment_count > 0 && (
                                                <button
                                                    onClick={() => toggleExpandir(p.id)}
                                                    className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors font-mono text-xs"
                                                    title={isOpen ? 'Ocultar comentarios' : 'Ver comentarios'}
                                                >
                                                    {isOpen ? '▾' : '▸'}
                                                </button>
                                            )}
                                        </td>
                                        <td className="py-3 px-5 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-900 dark:text-white max-w-[240px] truncate" title={p.title}>
                                            {p.title}
                                        </td>
                                        <td className="py-3 px-5">
                                            <span className={`inline-flex px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] font-bold border ${POST_TYPE_STYLES[p.post_type] ?? 'bg-slate-500/10 text-slate-500 border-slate-400/30'}`}>
                                                {POST_TYPE_LABELS[p.post_type] ?? p.post_type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-5 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                            {p.author}
                                        </td>
                                        <td className="py-3 px-5 text-center font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                            {p.comment_count}
                                        </td>
                                        <td className="py-3 px-5 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                            {new Date(p.created_at).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="py-3 px-5 text-right">
                                            <button
                                                onClick={() => setPendiente({ tipo: 'post', id: p.id, titulo: p.title })}
                                                className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-rose-500/30 text-rose-600 hover:bg-rose-500/[0.06] dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Fila expandida: comentarios */}
                                    {isOpen && (
                                        <tr key={`${p.id}-comments`} className="bg-slate-50/50 dark:bg-white/[0.01] border-b border-emerald-500/[0.06]">
                                            <td colSpan={7} className="px-10 py-3">
                                                {expandida!.loading ? (
                                                    <div className="flex items-center gap-2 py-2">
                                                        <div className="w-3 h-3 border border-t-emerald-500 border-slate-300 animate-spin" />
                                                        <span className="font-mono text-[10px] text-slate-400">Cargando comentarios...</span>
                                                    </div>
                                                ) : expandida!.comments.length === 0 ? (
                                                    <p className="font-mono text-[10px] text-slate-400 py-1">· sin comentarios</p>
                                                ) : (
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400 border-b border-emerald-500/10">
                                                                <th className="py-1.5 pr-4 text-left font-medium">Autor</th>
                                                                <th className="py-1.5 pr-4 text-left font-medium">Comentario</th>
                                                                <th className="py-1.5 text-right font-medium">Acciones</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {expandida!.comments.map((c) => (
                                                                <tr key={c.id} className="border-b border-emerald-500/[0.04] last:border-0">
                                                                    <td className="py-2 pr-4 font-mono text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                                        {c.author}
                                                                        {c.is_solution && (
                                                                            <span className="ml-2 text-emerald-500 text-[9px]">✓ solución</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="py-2 pr-4 text-xs text-slate-600 dark:text-slate-300 max-w-[400px]">
                                                                        <span className="line-clamp-2">{c.content}</span>
                                                                    </td>
                                                                    <td className="py-2 text-right">
                                                                        <button
                                                                            onClick={() => handleDeleteComment(c.id, p.id, c.content)}
                                                                            className="font-mono text-[9px] uppercase tracking-wider px-2 py-1 border border-rose-500/20 text-rose-500 hover:bg-rose-500/[0.06] dark:text-rose-400 transition-colors"
                                                                        >
                                                                            Eliminar
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
};
