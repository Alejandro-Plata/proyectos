import { useState, useCallback } from 'react';
import type { ReviewRequestPayload } from '../../types/types';
import { useTheme } from '../../../../hooks/useTheme';
import { useUser } from '../../../../context/UserContext';
import { UserTable } from '../../components/UserManagement/UserTable';
import { ChallengeTable } from '../../components/ChallengeManagement/ChallengeTable';
import { TablaNotas } from '../../components/NoteManagement/NoteTable';
import { ReportedPostsTable } from '../../components/ForumModeration/ReportedPostsTable';
import { RequestsTable } from '../../components/ContentRequests/RequestsTable';
import { AchievementTable } from '../../components/AchievementManagement/AchievementTable';
import { useAdminStats } from '../../hooks/useAdminStats';
import { useUserManagement } from '../../hooks/useUserManagement';
import { useChallengeManagement } from '../../hooks/useChallengeManagement';
import { useNoteManagement } from '../../hooks/useNoteManagement';
import { useForumModeration } from '../../hooks/useForumModeration';
import { useContentRequests } from '../../hooks/useContentRequests';
import { useAchievementManagement } from '../../hooks/useAchievementManagement';
import { TabBar } from '../../../../components/TabBar';
import type { TabItem } from '../../../../components/TabBar';
import { NoteRevisionsTable } from '../../components/NoteRevisions/NoteRevisionsTable';

type SeccionAdmin = 'dashboard' | 'challenges' | 'requests' | 'revisiones' | 'moderation' | 'achievements';

const SECCIONES: { id: SeccionAdmin; label: string; badge?: 'pendingRequests' | 'reportedPosts' | 'pendingRevisions' }[] = [
    { id: 'dashboard',    label: 'Resumen' },
    { id: 'challenges',   label: 'Retos' },
    { id: 'requests',     label: 'Solicitudes', badge: 'pendingRequests' },
    { id: 'revisiones',   label: 'Revisiones',  badge: 'pendingRevisions' },
    { id: 'moderation',   label: 'Foro',        badge: 'reportedPosts' },
    { id: 'achievements', label: 'Logros' },
];

const Spinner = () => (
    <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-[2px] border-emerald-500/20 border-t-emerald-500 animate-spin" />
    </div>
);

export const PanelAdminMobile = () => {
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

    const handleReview = useCallback(async (requestId: string, payload: ReviewRequestPayload) => {
        const result = await requestsMgmt.handleReview(requestId, payload);
        decrementPendingRequests();
        if (payload.action === 'approve') {
            if (result.resource?.type === 'challenge') challengeMgmt.reload();
        }
        return result;
    }, [requestsMgmt, challengeMgmt, decrementPendingRequests]);

    const seccionesVisibles = isModerator
        ? SECCIONES.filter((s) => s.id === 'dashboard' || s.id === 'moderation')
        : SECCIONES;

    const pestañasAdmin: TabItem[] = seccionesVisibles.map(s => ({
        key: s.id,
        label: s.label,
        badge: s.badge ? (stats?.[s.badge] ?? 0) : undefined,
    }));

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#050505]">
            <div className="overflow-x-auto scrollbar-hide shrink-0 bg-white dark:bg-[#0a0b0e] border-b border-emerald-500/15 dark:border-emerald-500/10">
                <TabBar
                    tabs={pestañasAdmin}
                    activeTab={seccionActiva}
                    onChange={(k) => setSeccionActiva(k as SeccionAdmin)}
                    className="min-w-max px-4"
                />
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-8 space-y-6 animate-in fade-in duration-300">

                {/* Dashboard & Usuarios */}
                {seccionActiva === 'dashboard' && (
                    <div className="space-y-8">

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Usuarios
                                    </h2>
                                </div>
                                <span className="font-mono text-[10px] text-emerald-500/50">
                                    {userMgmt.total} registros
                                </span>
                            </div>
                            <InputBusqueda
                                value={userMgmt.filters.search}
                                onChange={(v) => userMgmt.setFilters((f) => ({ ...f, search: v, page: 1 }))}
                                placeholder="buscar usuario o email..."
                            />
                            {userMgmt.isLoading ? <Spinner /> : (
                                <>
                                    <UserTable users={userMgmt.users} onUpdateUser={userMgmt.handleUpdateUser} onDeleteUser={userMgmt.handleDeleteUser} />
                                    <PaginacionMobile page={userMgmt.filters.page} total={userMgmt.total} limit={userMgmt.filters.limit} onChange={(p) => userMgmt.setFilters((f) => ({ ...f, page: p }))} />
                                </>
                            )}
                        </section>
                    </div>
                )}

                {/* Retos */}
                {seccionActiva === 'challenges' && (
                    <div className="space-y-4">
                        <InputBusqueda value={challengeMgmt.filters.search} onChange={(v) => challengeMgmt.setFilters((f) => ({ ...f, search: v, page: 1 }))} placeholder="buscar reto..." />
                        {challengeMgmt.isLoading ? <Spinner /> : (
                            <>
                                <ChallengeTable challenges={challengeMgmt.challenges} onDelete={challengeMgmt.handleDeleteChallenge} />
                                <PaginacionMobile page={challengeMgmt.filters.page} total={challengeMgmt.total} limit={challengeMgmt.filters.limit} onChange={(p) => challengeMgmt.setFilters((f) => ({ ...f, page: p }))} />
                            </>
                        )}
                    </div>
                )}

                {/* Solicitudes + Apuntes */}
                {seccionActiva === 'requests' && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {requestsMgmt.isLoading ? <Spinner /> : (
                                <>
                                    <RequestsTable requests={requestsMgmt.requests} isDark={isDark} onReview={handleReview} filters={requestsMgmt.filters} onFiltersChange={requestsMgmt.setFilters} />
                                    <PaginacionMobile page={requestsMgmt.filters.page} total={requestsMgmt.total} limit={requestsMgmt.filters.limit} onChange={(p) => requestsMgmt.setFilters((f) => ({ ...f, page: p }))} />
                                </>
                            )}
                        </div>

                        <div className="border-t border-emerald-500/10 pt-4 space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Apuntes de comunidad</h2>
                            <InputBusqueda value={noteMgmt.filters.search} onChange={(v) => noteMgmt.setFilters((f) => ({ ...f, search: v, page: 1 }))} placeholder="buscar apunte..." />
                            {noteMgmt.isLoading ? <Spinner /> : (
                                <>
                                    <TablaNotas notes={noteMgmt.notes} onDelete={noteMgmt.handleDeleteNote} onReview={noteMgmt.handleReviewNote} />
                                    <PaginacionMobile page={noteMgmt.filters.page} total={noteMgmt.total} limit={noteMgmt.filters.limit} onChange={(p) => noteMgmt.setFilters((f) => ({ ...f, page: p }))} />
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Revisiones de edición */}
                {seccionActiva === 'revisiones' && (
                    <div className="space-y-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                            Cambios propuestos en apuntes de comunidad
                        </p>
                        <NoteRevisionsTable onResolved={decrementPendingRevisions} />
                    </div>
                )}

                {/* Moderación */}
                {seccionActiva === 'moderation' && (
                    <div className="space-y-4">
                        {moderationMgmt.isLoading ? <Spinner /> : (
                            <>
                                <ReportedPostsTable posts={moderationMgmt.posts} onResolve={moderationMgmt.handleResolve} />
                                <PaginacionMobile page={moderationMgmt.filters.page} total={moderationMgmt.total} limit={moderationMgmt.filters.limit} onChange={(p) => moderationMgmt.setFilters((f) => ({ ...f, page: p }))} />
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
    );
};

/* ── Input de búsqueda ── */
interface PropsInput { value: string; onChange: (v: string) => void; placeholder: string; }
const InputBusqueda = ({ value, onChange, placeholder }: PropsInput) => (
    <div className="relative w-full">
        <span className="absolute -top-[1px] left-3 z-10 pointer-events-none select-none">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-500/50 bg-white dark:bg-[#050505] px-1">buscar</span>
        </span>
        <input
            type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
            className="w-full text-sm px-3 pt-3 pb-2.5 outline-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400/60 dark:placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs border border-emerald-500/20 dark:border-emerald-500/15 focus:border-emerald-500/50 transition-colors"
        />
    </div>
);

/* ── Paginación móvil ── */
interface PropsPaginacion { page: number; total: number; limit: number; onChange: (page: number) => void; }
const PaginacionMobile = ({ page, total, limit, onChange }: PropsPaginacion) => {
    const totalPaginas = Math.ceil(total / limit);
    if (totalPaginas <= 1) return null;

    return (
        <div className="flex items-center justify-between pt-4 mt-4">
            <button
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                className="font-mono text-[10px] uppercase tracking-wider px-4 py-2.5 border border-emerald-500/20 dark:border-emerald-500/15 text-slate-500 dark:text-slate-400 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-30 transition-colors"
            >
                ← Ant
            </button>
            <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {page} / {totalPaginas}
            </span>
            <button
                disabled={page >= totalPaginas}
                onClick={() => onChange(page + 1)}
                className="font-mono text-[10px] uppercase tracking-wider px-4 py-2.5 border border-emerald-500/20 dark:border-emerald-500/15 text-slate-500 dark:text-slate-400 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-30 transition-colors"
            >
                Sig →
            </button>
        </div>
    );
};
