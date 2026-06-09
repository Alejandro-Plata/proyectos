import { ProfileInfo } from "../../components/perfilInfo/ProfileInfo";
import { ProfileStatCard } from "../../components/profileStats/ProfileStatCard";
import { TrophyShowcase } from "../../components/TrophyShowcase";
import { SummaryRow } from "../../components/SummaryRow";
import { useProfile } from "../../hooks/useProfile";
import { DiscordButton } from "../../../../components/DiscordButton";
import { DISCORD_INVITE_CODE } from "../../../../config/discord";

export const PerfilDesktop = () => {
    const { user, stats, isLoading, xpPercentage } = useProfile();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 bg-slate-50/50 dark:bg-[#050505] min-h-screen">

            {/* BB-4 Page title */}
            <div>
                <div className="mb-6">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">@{user.username}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Tu perfil</p>
                </div>
            </div>

            <ProfileInfo user={user} xpPercentage={xpPercentage} />

            {/* Estadísticas Rápidas */}
            <div className="grid grid-cols-4 gap-4">
                <ProfileStatCard label="Retos" value={stats?.challengesCompleted ?? 0} subtitle={stats ? `de ${stats.totalChallenges}` : ''} isLoading={isLoading} />
                <ProfileStatCard label="Activos" value={stats?.challengesInProgress ?? 0} subtitle="en progreso" isLoading={isLoading} />
                <ProfileStatCard label="Apuntes" value={stats?.notesCount ?? 0} subtitle="publicados" isLoading={isLoading} />
                <ProfileStatCard label="Foro" value={stats?.postsCount ?? 0} subtitle="aportaciones" isLoading={isLoading} />
            </div>

            {/* Contenido Principal Grid */}
            <div className="grid grid-cols-3 gap-8 items-start">

                {/* Columna Izquierda (Insignias) */}
                <div className="col-span-2 space-y-8">
                    <TrophyShowcase />
                </div>

                {/* Columna Derecha (Métricas y Discord) */}
                <div className="col-span-1 space-y-8">

                    {/* Resumen Compacto — BB-2 */}
                    <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 p-6 shadow-sm shadow-emerald-500/5">
                        <div className="mb-4">
                            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Métricas globales</h3>
                        </div>
                        <div className="space-y-4">
                            <SummaryRow label="Puntos XP" value={user.experience_points.toLocaleString()} />
                            <SummaryRow label="Nivel Actual" value={String(user.current_level)} />
                            {stats && (
                                <>
                                    <div className="border-t border-emerald-500/10 my-2" />
                                    <SummaryRow
                                        label="Tasa de Completitud"
                                        value={stats.totalChallenges > 0 ? `${Math.round((stats.challengesCompleted / stats.totalChallenges) * 100)}%` : '0%'}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Discord Widget — BB-2 */}
                    <div className="bg-white dark:bg-[#0a0b0e] border border-indigo-100 dark:border-[#5865F2]/20 p-6 shadow-sm shadow-emerald-500/5 flex flex-col items-center text-center transition-colors hover:border-indigo-200 dark:hover:border-[#5865F2]/40">
                        <svg className="w-10 h-10 text-[#5865F2] mb-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                        </svg>
                        <h4 className="font-mono text-sm uppercase tracking-[0.1em] text-slate-900 dark:text-white mb-1">Comunidad Discord</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Resuelve dudas y colabora con otros desarrolladores.</p>
                        <DiscordButton inviteCode={DISCORD_INVITE_CODE} variant="full" className="w-full justify-center rounded-none" />
                    </div>
                </div>
            </div>
        </div>
    );
};
