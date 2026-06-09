import { useNavigate } from 'react-router-dom';
import { Icons } from '../../../../components/Icons';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Badge } from '../../../../components/Badge';
import { Avatar } from '../../../../components/Avatar';
import { POST_TYPE_TO_CATEGORY } from '../../config/postTypeMap';
import { CATEGORY_CONFIG } from '../../config/categories';
import { getRankInfo, getLevelProgress, getRankColors } from '../../utils/rankHelper';
import { formatTimeAgo } from '../../utils/timeUtils';
import { useUserProfile } from '../../hooks/useUserProfile';
import { EncabezadoMobile } from '../../../../components/Header/HeaderMobile';

interface UserProfileMobileProps {
    userId: string | undefined;
}

export const UserProfileMobile = ({ userId }: UserProfileMobileProps) => {
    const navigate = useNavigate();
    const { profile, postsCount, recentPosts, isLoading, error } = useUserProfile(userId);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#050505]">
            <LoadingSpinner size="lg" />
        </div>
    );

    if (error || !profile) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f8fafc] dark:bg-[#050505] px-4 text-center">
            <p className="text-rose-500 font-mono text-xs">{error || 'Usuario no encontrado'}</p>
            <button
                onClick={() => navigate(-1)}
                className="font-mono text-[11px] uppercase tracking-[0.2em] px-4 py-2 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/[0.06] transition-colors active:scale-95"
            >
                ← Volver
            </button>
        </div>
    );

    const { rank, rankGradient } = getRankInfo(profile.current_level);
    const levelColors = getRankColors(profile.current_level);
    const levelProgress = getLevelProgress(profile.current_level);
    const circumference = 2 * Math.PI * 20;

    const xpFormatted = profile.experience_points >= 1000
        ? `${(profile.experience_points / 1000).toFixed(1)}k`
        : String(profile.experience_points);

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] font-sans">

            <EncabezadoMobile
                modo="subpagina"
                titulo={`@${profile.username}`}
                onBack={() => navigate(-1)}
            />

            <div className="px-4 py-5 space-y-4 pb-6">

                {/* Profile card */}
                <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden shadow-sm">

                    {/* Rank banner */}
                    <div className={`h-16 bg-gradient-to-r ${rankGradient} opacity-15 dark:opacity-10`} />

                    <div className="px-4 pb-5 -mt-8">

                        {/* Avatar row */}
                        <div className="flex items-end justify-between mb-4">
                            <div className="w-16 h-16 ring-2 ring-white dark:ring-[#0a0b0e] ring-offset-2 ring-offset-white dark:ring-offset-[#0a0b0e] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                <Avatar
                                    username={profile.username}
                                    url={profile.avatar_url}
                                    size="xl"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                onClick={() => navigate(`/dashboard/messages?startWith=${profile.user_id}`)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-[10px] uppercase tracking-[0.15em] active:scale-95 transition-all"
                            >
                                <div className="w-3.5 h-3.5 flex items-center justify-center">{Icons.message}</div>
                                Mensaje
                            </button>
                        </div>

                        {/* Name + rank */}
                        <div className="mb-4">
                            <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                {profile.username}
                            </h1>
                            <div className={`inline-flex items-center gap-1 mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] font-bold bg-gradient-to-r ${rankGradient} bg-clip-text text-transparent`}>
                                <span className="text-emerald-500/40">▸</span> {rank}
                            </div>
                            <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                Miembro desde {formatTimeAgo(profile.created_at)}
                            </p>
                        </div>

                        {/* Bio */}
                        {profile.bio && (
                            <div className="border-t border-emerald-500/10 pt-3 mb-3">
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {profile.bio}
                                </p>
                            </div>
                        )}

                        {/* Level progress */}
                        <div className="border-t border-emerald-500/10 pt-3 mb-3">
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 shrink-0">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                                        <circle cx="22" cy="22" r="20" fill="none" strokeWidth="3" stroke="currentColor" className="text-slate-100 dark:text-white/10" />
                                        <circle
                                            cx="22" cy="22" r="20" fill="none" strokeWidth="3"
                                            strokeLinecap="butt"
                                            stroke="url(#lvl-grad-m)"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={circumference * (1 - levelProgress / 100)}
                                        />
                                        <defs>
                                            <linearGradient id="lvl-grad-m" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor={levelColors.from} />
                                                <stop offset="100%" stopColor={levelColors.to} />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="font-mono text-[10px] font-black text-slate-900 dark:text-white">
                                            {profile.current_level}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="w-full h-1 bg-slate-100 dark:bg-white/10 overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${rankGradient} transition-all duration-700`}
                                            style={{ width: `${levelProgress}%` }}
                                        />
                                    </div>
                                    <p className="mt-1 font-mono text-[9px] text-slate-400 uppercase tracking-wider">
                                        nivel {profile.current_level} · {Math.round(levelProgress)}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            {[
                                { label: 'posts', value: postsCount },
                                { label: 'nivel', value: profile.current_level },
                                { label: 'xp', value: xpFormatted },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-slate-50 dark:bg-white/[0.03] border border-emerald-500/10 p-2 text-center">
                                    <p className="font-mono font-black text-sm text-slate-900 dark:text-white leading-none mb-1">
                                        {value}
                                    </p>
                                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-400">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Social links */}
                        {(profile.github_url || profile.linkedin_url) && (
                            <div className="border-t border-emerald-500/10 pt-3 flex gap-2">
                                {profile.github_url && (
                                    <a
                                        href={profile.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/20 text-slate-600 dark:text-slate-400 active:scale-95 transition-all"
                                    >
                                        <div className="w-4 h-4">{Icons.gitHub}</div>
                                        <span className="font-mono text-[10px] uppercase tracking-wider">GitHub</span>
                                    </a>
                                )}
                                {profile.linkedin_url && (
                                    <a
                                        href={profile.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/20 text-slate-600 dark:text-slate-400 active:scale-95 transition-all"
                                    >
                                        <div className="w-4 h-4">{Icons.briefcase}</div>
                                        <span className="font-mono text-[10px] uppercase tracking-wider">LinkedIn</span>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent posts */}
                <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-emerald-500/10 bg-emerald-500/[0.02]">
                        <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actividad en el foro</h2>
                        <span className="font-mono text-[10px] text-slate-400">{postsCount} post{postsCount !== 1 ? 's' : ''}</span>
                    </div>

                    {recentPosts.length > 0 ? (
                        <div className="divide-y divide-emerald-500/[0.06]">
                            {recentPosts.map(post => {
                                const category = POST_TYPE_TO_CATEGORY[post.post_type] ?? 'discussion';
                                const config = CATEGORY_CONFIG[category];
                                return (
                                    <button
                                        key={post.post_id}
                                        onClick={() => navigate(`/dashboard/community/${post.post_id}`)}
                                        className="w-full flex flex-col gap-2 px-4 py-4 text-left active:bg-emerald-500/[0.03] transition-colors"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <Badge variant="category" color={config.color} border={config.border} className="shrink-0">
                                                {config.label}
                                            </Badge>
                                            <span className="shrink-0 font-mono text-[10px] text-slate-400">
                                                {formatTimeAgo(post.created_at)}
                                            </span>
                                        </div>
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium line-clamp-2 leading-snug flex-1">
                                                {post.title}
                                            </span>
                                            <div className="shrink-0 flex items-center gap-1 border border-emerald-500/20 px-1.5 py-0.5">
                                                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{post.upvote_count}</span>
                                                <span className="text-[9px] text-emerald-500">▲</span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Aún no hay publicaciones.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
