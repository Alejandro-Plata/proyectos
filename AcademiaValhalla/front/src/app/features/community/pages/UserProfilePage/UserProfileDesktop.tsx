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

interface UserProfileDesktopProps {
    userId: string | undefined;
}

export const UserProfileDesktop = ({ userId }: UserProfileDesktopProps) => {
    const navigate = useNavigate();
    const { profile, postsCount, recentPosts, isLoading, error } = useUserProfile(userId);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#050505]">
            <LoadingSpinner size="lg" />
        </div>
    );

    if (error || !profile) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f8fafc] dark:bg-[#050505]">
            <p className="text-rose-500 text-sm font-mono">{error || 'Usuario no encontrado'}</p>
            <button
                onClick={() => navigate(-1)}
                className="font-mono text-[11px] uppercase tracking-[0.2em] px-4 py-2 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/[0.06] transition-colors"
            >
                ← Volver
            </button>
        </div>
    );

    const { rank, rankGradient } = getRankInfo(profile.current_level);
    const levelColors = getRankColors(profile.current_level);
    const levelProgress = getLevelProgress(profile.current_level);
    const circumference = 2 * Math.PI * 22;

    const xpFormatted = profile.experience_points >= 1000
        ? `${(profile.experience_points / 1000).toFixed(1)}k`
        : String(profile.experience_points);

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] font-sans pb-12">

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0a0b0e]/80 backdrop-blur-md border-b border-emerald-500/15 dark:border-emerald-500/10 h-14 flex items-center px-6 gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-1.5 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                    <div className="w-5 h-5 flex items-center justify-center">{Icons.back}</div>
                </button>
                <span className="font-mono text-xs text-slate-900 dark:text-white font-bold">
                    @{profile.username}
                </span>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="flex gap-6 items-start">

                    {/* Left sidebar — profile card */}
                    <aside className="w-72 shrink-0 sticky top-24 space-y-4">

                        {/* Main profile card */}
                        <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden shadow-sm shadow-emerald-500/5">

                            {/* Rank banner */}
                            <div className={`h-20 bg-gradient-to-r ${rankGradient} opacity-15 dark:opacity-10`} />

                            <div className="px-5 pb-5 -mt-10">
                                {/* Avatar */}
                                <div className="w-20 h-20 ring-2 ring-white dark:ring-[#0a0b0e] ring-offset-2 ring-offset-white dark:ring-offset-[#0a0b0e] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 mb-3">
                                    <Avatar
                                        username={profile.username}
                                        url={profile.avatar_url}
                                        size="xl"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Name + rank */}
                                <div className="mb-4">
                                    <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                        {profile.username}
                                    </h1>
                                    <div className={`inline-flex items-center gap-1 mt-1 font-mono text-[10px] uppercase tracking-[0.15em] font-bold bg-gradient-to-r ${rankGradient} bg-clip-text text-transparent`}>
                                        <span className="text-emerald-500/40">▸</span> {rank}
                                    </div>
                                    <p className="mt-1 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                                        Miembro desde {formatTimeAgo(profile.created_at)}
                                    </p>
                                </div>

                                {/* Bio */}
                                {profile.bio && (
                                    <div className="border-t border-emerald-500/10 pt-4 mb-4">
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {profile.bio}
                                        </p>
                                    </div>
                                )}

                                {/* Level & progress */}
                                <div className="border-t border-emerald-500/10 pt-4 mb-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">Nivel y progreso</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 shrink-0">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                                                <circle cx="24" cy="24" r="22" fill="none" strokeWidth="3" stroke="currentColor" className="text-slate-100 dark:text-white/10" />
                                                <circle
                                                    cx="24" cy="24" r="22" fill="none" strokeWidth="3"
                                                    strokeLinecap="butt"
                                                    stroke="url(#lvl-grad-d)"
                                                    strokeDasharray={circumference}
                                                    strokeDashoffset={circumference * (1 - levelProgress / 100)}
                                                />
                                                <defs>
                                                    <linearGradient id="lvl-grad-d" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor={levelColors.from} />
                                                        <stop offset="100%" stopColor={levelColors.to} />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="font-mono text-xs font-black text-slate-900 dark:text-white leading-none">
                                                    {profile.current_level}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="w-full h-1 bg-slate-100 dark:bg-white/10 overflow-hidden">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${rankGradient} transition-all duration-700`}
                                                    style={{ width: `${levelProgress}%` }}
                                                />
                                            </div>
                                            <p className="mt-1.5 font-mono text-[9px] text-slate-400 uppercase tracking-wider">
                                                nivel {profile.current_level} · {Math.round(levelProgress)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="border-t border-emerald-500/10 pt-4 mb-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">Estadísticas</h3>
                                    <div className="grid grid-cols-3 gap-2">
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
                                </div>

                                {/* Social links */}
                                {(profile.github_url || profile.linkedin_url) && (
                                    <div className="border-t border-emerald-500/10 pt-4">
                                        <h3 className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">Redes</h3>
                                        <div className="flex gap-2">
                                            {profile.github_url && (
                                                <a
                                                    href={profile.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-3 py-1.5 border border-emerald-500/20 hover:border-emerald-500/40 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                                                    title="GitHub"
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
                                                    className="flex items-center gap-2 px-3 py-1.5 border border-emerald-500/20 hover:border-emerald-500/40 text-slate-600 dark:text-slate-400 hover:text-[#0A66C2] dark:hover:text-[#4790d9] transition-all"
                                                    title="LinkedIn"
                                                >
                                                    <div className="w-4 h-4">{Icons.briefcase}</div>
                                                    <span className="font-mono text-[10px] uppercase tracking-wider">LinkedIn</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Message button */}
                        <button
                            onClick={() => navigate(`/dashboard/messages?startWith=${profile.user_id}`)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-mono text-[11px] uppercase tracking-[0.2em] transition-colors"
                        >
                            <div className="w-4 h-4 flex items-center justify-center">{Icons.message}</div>
                            Enviar mensaje
                        </button>
                    </aside>

                    {/* Main content — posts */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden shadow-sm shadow-emerald-500/5">

                            {/* Section header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-500/10 bg-emerald-500/[0.02]">
                                <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actividad en el foro</h2>
                                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                    {postsCount} publicación{postsCount !== 1 ? 'es' : ''}
                                </span>
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
                                                className="w-full group flex items-center gap-4 px-5 py-4 text-left hover:bg-emerald-500/[0.03] transition-colors"
                                            >
                                                <Badge variant="category" color={config.color} border={config.border} className="shrink-0">
                                                    {config.label}
                                                </Badge>
                                                <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                    {post.title}
                                                </span>
                                                <div className="flex items-center gap-4 shrink-0">
                                                    <span className="font-mono text-[10px] text-slate-400">
                                                        {formatTimeAgo(post.created_at)}
                                                    </span>
                                                    <div className="flex items-center gap-1 border border-emerald-500/20 px-2 py-0.5">
                                                        <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{post.upvote_count}</span>
                                                        <span className="text-[9px] text-emerald-500">▲</span>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-16 flex flex-col items-center justify-center text-center px-8">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Este usuario aún no ha publicado en el foro.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
