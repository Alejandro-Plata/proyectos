import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../../../components/Icons';
import { CATEGORY_CONFIG } from '../../config/categories';
import { MobilePill } from '../../components/MobilePill';
import { ThreadCardMobile } from '../../components/ThreadCard';
import type { ThreadCategory } from '../../types/types';
import { useForumPosts } from '../../hooks/useForumPosts';

export const ForumMobile = () => {
    const navigate = useNavigate();
    const {
        posts,
        isLoading,
        error,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        votePost,
    } = useForumPosts();

    const [filtersOpen, setFiltersOpen] = useState(false);

    const hasActiveFilter = selectedCategory !== 'all';

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-[#020202] pb-24 font-sans relative">

            <div
                className="sticky top-0 z-40 bg-slate-100/95 dark:bg-[#020202]/95 backdrop-blur-md border-b border-slate-200 dark:border-emerald-500/[0.07] px-4 py-2"
            >
                <div className="flex items-center gap-2">
                    {/* Search Bar */}
                    <div className="flex-1 flex items-center bg-white dark:bg-white/5 border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden focus-within:border-emerald-500/40 transition-colors">
                        <div className="pl-3 pr-2 text-slate-500">
                            {Icons.search}
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar discusiones..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none py-2.5 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 w-full"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors active:bg-emerald-500/[0.05] shrink-0"
                            >
                                {Icons.close}
                            </button>
                        )}
                    </div>

                    {/* Botón Filtros */}
                    <button
                        onClick={() => setFiltersOpen(v => !v)}
                        className={`
                            flex items-center justify-center w-11 h-11 border transition-colors shrink-0
                            ${hasActiveFilter || filtersOpen
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                : 'bg-white dark:bg-white/5 border-emerald-500/15 dark:border-emerald-500/10 text-slate-400 hover:border-emerald-500/25'
                            }
                        `}
                    >
                        {Icons.filter}
                    </button>
                </div>

                {/* Filtros */}
                {filtersOpen && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide animate-fade-in-down">
                        <MobilePill
                            active={selectedCategory === 'all'}
                            onClick={() => { setSelectedCategory('all'); setFiltersOpen(false); }}
                            label="Todo"
                        />
                        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                            <MobilePill
                                key={key}
                                active={selectedCategory === key}
                                onClick={() => { setSelectedCategory(key as ThreadCategory); setFiltersOpen(false); }}
                                label={config.label}
                                dotColor={config.color.replace('text-', 'bg-')}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Hilos */}
            <div className="flex flex-col">
                {isLoading ? (
                    <div className="flex flex-col">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-24 border-b border-emerald-500/10 dark:border-emerald-500/[0.07] animate-pulse bg-slate-100/50 dark:bg-white/[0.02]" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="py-20 text-center text-rose-500 text-sm">{error}</div>
                ) : posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <svg className="w-10 h-10 text-emerald-500/20" viewBox="0 0 48 48" fill="none">
                            <polygon points="24,2 44,13 44,35 24,46 4,35 4,13" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Sin publicaciones aún.</p>
                    </div>
                ) : (
                    posts.map((thread) => (
                        <ThreadCardMobile key={thread.id} data={thread} onVote={votePost} />
                    ))
                )}
            </div>

            {/* FAB */}
            <button
                onClick={() => navigate('./createpost')}
                aria-label="Crear nuevo hilo"
                className="fixed right-5 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center z-50 transition-colors shadow-lg shadow-emerald-500/30"
                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)', bottom: 'var(--fab-bottom)' }}
            >
                <div className="w-6 h-6 flex items-center justify-center">{Icons.plus}</div>
            </button>
        </div>
    );
};
