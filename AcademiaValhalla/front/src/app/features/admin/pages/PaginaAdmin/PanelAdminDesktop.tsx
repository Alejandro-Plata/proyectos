import { useState, useCallback } from 'react';
import type { ReviewRequestPayload } from '../../types/types';
import { useTheme } from '../../../../hooks/useTheme';
import { useUser } from '../../../../context/UserContext';
import { UserTable } from '../../components/UserManagement/UserTable';
import { ChallengeTable } from '../../components/ChallengeManagement/ChallengeTable';
import { TablaNotas } from '../../components/NoteManagement/NoteTable';
import { ReportedPostsTable } from '../../components/ForumModeration/ReportedPostsTable';
import { TablaForo } from '../../components/ForumManagement/TablaForo';
import { RequestsTable } from '../../components/ContentRequests/RequestsTable';
import { AchievementTable } from '../../components/AchievementManagement/AchievementTable';
import { useAdminStats } from '../../hooks/useAdminStats';
import { useUserManagement } from '../../hooks/useUserManagement';
import { useChallengeManagement } from '../../hooks/useChallengeManagement';
import { useNoteManagement } from '../../hooks/useNoteManagement';
import { useForumModeration } from '../../hooks/useForumModeration';
import { useContentRequests } from '../../hooks/useContentRequests';
import { useAchievementManagement } from '../../hooks/useAchievementManagement';
import { useForumPosts } from '../../hooks/useForumPosts';
import { NoteRevisionsTable } from '../../components/NoteRevisions/NoteRevisionsTable';

type SeccionAdmin = 'dashboard' | 'challenges' | 'requests' | 'revisiones' | 'moderation' | 'foro' | 'achievements';

const SECCIONES: { id: SeccionAdmin; label: string; badge?: 'pendingRequests' | 'reportedPosts' | 'pendingRevisions' }[] = [
    { id: 'dashboard',    label: 'Dashboard' },
    { id: 'challenges',   label: 'Retos' },
    { id: 'requests',     label: 'Solicitudes',  badge: 'pendingRequests' },
    { id: 'revisiones',   label: 'Revisiones',   badge: 'pendingRevisions' },
    { id: 'moderation',   label: 'Moderación',   badge: 'reportedPosts' },
    { id: 'foro',         label: 'Foro' },
    { id: 'achievements', label: 'Logros' },
];

const Spinner = () => (
    <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-[2px] border-emerald-500/20 border-t-emerald-500 animate-spin" />
    </div>
);

export const PanelAdminDesktop = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { user } = useUser();
    const isModerator = user?.role === 'MODERADOR';
    const [seccionActiva, setSeccionActiva] = useState<SeccionAdmin>(isModerator ? 'moderation' : 'dashboard');
    const { stats, decrementPendingRequests, decrementPendingRevisions } = useAdminStats();
    const userMgmt       = useUserManagement();
    const challengeMgmt  = useChallengeManagement();
    const noteMgmt       = useNoteManagement();
    const moderationMgmt = useForumModeration();
    const requestsMgmt   = useContentRequests();
    const achievementMgmt = useAchievementManagement();
    const forumMgmt = useForumPosts();

    const seccionesVisibles = isModerator
        ? SECCIONES.filter((s) => s.id === 'dashboard' || s.id === 'moderation')
        : SECCIONES;

    const handleReview = useCallback(async (requestId: string, payload: ReviewRequestPayload) => {
        const result = await requestsMgmt.handleReview(requestId, payload);
        decrementPendingRequests();
        if (payload.action === 'approve') {
            if (result.resource?.type === 'challenge') challengeMgmt.reload();
        }
        return result;
    }, [requestsMgmt, challengeMgmt, decrementPendingRequests]);

    const seccionLabel = SECCIONES.find((s) => s.id === seccionActiva)?.label ?? '';

    return (
        <div className="flex h-full bg-white dark:bg-[#050505]">
            {/* Sidebar */}
            <nav className="w-56 shrink-0 border-r border-emerald-500/15 dark:border-emerald-500/10 bg-white dark:bg-[#0a0b0e] p-5 space-y-1">
                <div className="flex items-center gap-2 mb-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-500 font-bold">
                        Admin
                    </p>
                </div>
                {seccionesVisibles.map((s) => {
                    const badgeCount = s.badge ? (stats?.[s.badge] ?? 0) : 0;
                    const isActive = seccionActiva === s.id;
                    return (
                        <button
                            key={s.id}
                            onClick={() => setSeccionActiva(s.id)}
                            className={`
                                w-full text-left px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em]
                                flex items-center justify-between transition-colors border-l-2
                                ${isActive
                                    ? 'border-emerald-500 bg-emerald-500/[0.08] text-emerald-600 dark:bg-emerald-500/[0.10] dark:text-emerald-400'
                                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-emerald-500/[0.04] hover:text-emerald-600 dark:hover:text-emerald-400'
                                }
                            `}
                        >
                            {s.label}
                            {badgeCount > 0 && (
                                <span className="bg-rose-500 text-white font-mono text-[9px] font-bold min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                    {badgeCount > 99 ? '99+' : badgeCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Panel principal */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">

                    {/* Título de sección */}
                    <div>
                        <div className="mb-6">
                            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                {seccionLabel}
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Panel de administración</p>
                        </div>
                    </div>

                    {/* Dashboard & Usuarios */}
                    {seccionActiva === 'dashboard' && (
                        <div className="space-y-10">

                            <section className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Base de usuarios</h2>
                                        <p className="font-mono text-[10px] text-slate-400">
                                            {userMgmt.total} registros
                                        </p>
                                    </div>
                                    <InputBusqueda
                                        value={userMgmt.filters.search}
                                        onChange={(v) => userMgmt.setFilters((f) => ({ ...f, search: v, page: 1 }))}
                                        placeholder="buscar por nombre o email..."
                                    />
                                </div>
                                {userMgmt.isLoading ? <Spinner /> : (
                                    <>
                                        <UserTable users={userMgmt.users} onUpdateUser={userMgmt.handleUpdateUser} onDeleteUser={userMgmt.handleDeleteUser} />
                                        <Paginacion page={userMgmt.filters.page} total={userMgmt.total} limit={userMgmt.filters.limit} onChange={(p) => userMgmt.setFilters((f) => ({ ...f, page: p }))} />
                                    </>
                                )}
                            </section>
                        </div>
                    )}

                    {/* Retos */}
                    {seccionActiva === 'challenges' && (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <InputBusqueda
                                    value={challengeMgmt.filters.search}
                                    onChange={(v) => challengeMgmt.setFilters((f) => ({ ...f, search: v, page: 1 }))}
                                    placeholder="buscar reto..."
                                />
                                <span className="font-mono text-[10px] text-emerald-500/50">
                                    {challengeMgmt.total} resultado{challengeMgmt.total !== 1 ? 's' : ''}
                                </span>
                            </div>
                            {challengeMgmt.isLoading ? <Spinner /> : (
                                <>
                                    <ChallengeTable challenges={challengeMgmt.challenges} onDelete={challengeMgmt.handleDeleteChallenge} />
                                    <Paginacion page={challengeMgmt.filters.page} total={challengeMgmt.total} limit={challengeMgmt.filters.limit} onChange={(p) => challengeMgmt.setFilters((f) => ({ ...f, page: p }))} />
                                </>
                            )}
                        </div>
                    )}

                    {/* Revisiones de edición */}
                    {seccionActiva === 'revisiones' && (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Revisiones de edición</h2>
                                <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                                    Cambios propuestos en apuntes aprobados por la comunidad.
                                </p>
                            </div>
                            <NoteRevisionsTable onResolved={decrementPendingRevisions} />
                        </div>
                    )}

                    {/* Solicitudes + Apuntes */}
                    {seccionActiva === 'requests' && (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                {requestsMgmt.isLoading ? <Spinner /> : (
                                    <>
                                        <RequestsTable requests={requestsMgmt.requests} isDark={isDark} onReview={handleReview} filters={requestsMgmt.filters} onFiltersChange={requestsMgmt.setFilters} />
                                        <Paginacion page={requestsMgmt.filters.page} total={requestsMgmt.total} limit={requestsMgmt.filters.limit} onChange={(p) => requestsMgmt.setFilters((f) => ({ ...f, page: p }))} />
                                    </>
                                )}
                            </div>

                            <div className="border-t border-emerald-500/10 pt-6 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Apuntes de comunidad</h2>
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-[10px] text-emerald-500/50">
                                            {noteMgmt.total} pendiente{noteMgmt.total !== 1 ? 's' : ''}
                                        </span>
                                        <InputBusqueda
                                            value={noteMgmt.filters.search}
                                            onChange={(v) => noteMgmt.setFilters((f) => ({ ...f, search: v, page: 1 }))}
                                            placeholder="buscar apunte..."
                                        />
                                    </div>
                                </div>
                                {noteMgmt.isLoading ? <Spinner /> : (
                                    <>
                                        <TablaNotas notes={noteMgmt.notes} onDelete={noteMgmt.handleDeleteNote} onReview={noteMgmt.handleReviewNote} />
                                        <Paginacion page={noteMgmt.filters.page} total={noteMgmt.total} limit={noteMgmt.filters.limit} onChange={(p) => noteMgmt.setFilters((f) => ({ ...f, page: p }))} />
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Moderación */}
                    {seccionActiva === 'moderation' && (
                        <div className="space-y-4">
                            {moderationMgmt.isLoading ? <Spinner /> : (
                                <>
                                    <ReportedPostsTable posts={moderationMgmt.posts} onResolve={moderationMgmt.handleResolve} />
                                    <Paginacion page={moderationMgmt.filters.page} total={moderationMgmt.total} limit={moderationMgmt.filters.limit} onChange={(p) => moderationMgmt.setFilters((f) => ({ ...f, page: p }))} />
                                </>
                            )}
                        </div>
                    )}

                    {/* Foro */}
                    {seccionActiva === 'foro' && (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <InputBusqueda
                                    value={forumMgmt.filters.search}
                                    onChange={(v) => forumMgmt.setFilters((f) => ({ ...f, search: v, page: 1 }))}
                                    placeholder="buscar por título..."
                                />
                                <span className="font-mono text-[10px] text-emerald-500/50">
                                    {forumMgmt.total} publicación{forumMgmt.total !== 1 ? 'es' : ''}
                                </span>
                            </div>
                            {forumMgmt.isLoading ? <Spinner /> : (
                                <>
                                    <TablaForo
                                        posts={forumMgmt.posts}
                                        onDeletePost={forumMgmt.handleDeletePost}
                                        onDeleteComment={forumMgmt.handleDeleteComment}
                                    />
                                    <Paginacion page={forumMgmt.filters.page} total={forumMgmt.total} limit={forumMgmt.filters.limit} onChange={(p) => forumMgmt.setFilters((f) => ({ ...f, page: p }))} />
                                </>
                            )}
                        </div>
                    )}

                    {/* Logros */}
                    {seccionActiva === 'achievements' && (
                        <div className="space-y-4">
                            {achievementMgmt.isLoading ? <Spinner /> : (
                                <AchievementTable
                                    achievements={achievementMgmt.achievements}
                                    onCreate={achievementMgmt.handleCreate}
                                    onUpdate={achievementMgmt.handleUpdate}
                                    onDelete={achievementMgmt.handleDelete}
                                    onStatusChange={achievementMgmt.handleStatusChange}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Input de búsqueda BB-5 ── */
interface PropsInput {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
}
const InputBusqueda = ({ value, onChange, placeholder }: PropsInput) => (
    <div className="relative w-full max-w-sm">
        <span className="absolute -top-[1px] left-3 z-10 pointer-events-none select-none">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-500/50 bg-white dark:bg-[#050505] px-1">
                buscar
            </span>
        </span>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full text-sm px-3 pt-3 pb-2.5 outline-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400/60 dark:placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs border border-emerald-500/20 dark:border-emerald-500/15 focus:border-emerald-500/50 transition-colors"
        />
    </div>
);

/* ── Paginación ── */
interface PropsPaginacion {
    page: number;
    total: number;
    limit: number;
    onChange: (page: number) => void;
}
const Paginacion = ({ page, total, limit, onChange }: PropsPaginacion) => {
    const totalPaginas = Math.ceil(total / limit);
    if (totalPaginas <= 1) return null;

    return (
        <div className="flex items-center justify-between pt-4 border-t border-emerald-500/10 mt-6">
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500/50">
                Página {page} / {totalPaginas}
            </span>
            <div className="flex gap-2">
                <button
                    disabled={page <= 1}
                    onClick={() => onChange(page - 1)}
                    className="font-mono text-[10px] uppercase tracking-wider px-4 py-2 border border-emerald-500/20 dark:border-emerald-500/15 text-slate-500 dark:text-slate-400 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    ← Anterior
                </button>
                <button
                    disabled={page >= totalPaginas}
                    onClick={() => onChange(page + 1)}
                    className="font-mono text-[10px] uppercase tracking-wider px-4 py-2 border border-emerald-500/20 dark:border-emerald-500/15 text-slate-500 dark:text-slate-400 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    Siguiente →
                </button>
            </div>
        </div>
    );
};
