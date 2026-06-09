import { useNavigate } from 'react-router-dom';
import { Icons } from '../../../../components/Icons';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import { SearchInput } from '../../../../components/SearchInput';
import { CATEGORY_CONFIG, type ThreadCategory } from '../../config/categories';
import { MobilePill } from '../../components/MobilePill';
import { NavItem } from '../../components/NavItem';
import { ThreadCardDesktop } from '../../components/ThreadCard';
import { useForumPosts } from '../../hooks/useForumPosts';

export const ForumDesktop = () => {
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

    return (
        <div className="min-h-screen font-sans pb-20 lg:pb-0">

            {/* HEADER */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-md transition-all border-b border-emerald-500/10 dark:border-emerald-500/[0.07]" style={{ boxShadow: 'inset 0 -1px 0 rgba(16,185,129,0.08)' }}>
                <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-4 gap-4">
                    <div className="flex-1 flex items-center justify-center w-full max-w-2xl mx-auto">
                        <SearchInput
                            placeholder="Buscar en el foro..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            action={
                                <div className="w-auto">
                                    <PrimaryButton
                                        size="sm"
                                        icon={Icons.plus}
                                        onClick={() => navigate('./createpost')}
                                    >
                                        <span className="hidden sm:inline">Nuevo</span>
                                    </PrimaryButton>
                                </div>
                            }
                        />
                    </div>
                </div>
            </header>

            {/* CONTENEDOR PRINCIPAL */}
            <div className="w-full max-w-7xl mx-auto flex justify-center items-start pt-6 px-4 gap-8">

                {/* SIDEBAR IZQUIERDA */}
                <aside className="hidden lg:block w-56 shrink-0 sticky top-24">
                    <nav className="space-y-0.5">
                        <NavItem
                            active={selectedCategory === 'all'}
                            onClick={() => setSelectedCategory('all')}
                            label="Inicio"
                            icon={Icons.home}
                        />
                        <div className="h-px bg-emerald-500/10 dark:bg-emerald-500/[0.07] my-4 mx-3" />
                        <p className="px-3 pb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Temas</p>
                        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                            <NavItem
                                key={key}
                                active={selectedCategory === key}
                                onClick={() => setSelectedCategory(key as ThreadCategory)}
                                label={config.label}
                                icon={config.icon}
                                activeColor={config.color}
                            />
                        ))}
                    </nav>
                </aside>

                {/* FEED CENTRAL */}
                <main className="flex-1 max-w-2xl w-full min-w-0 flex flex-col gap-4">

                    {/* Page title */}
                    <div className="flex items-center gap-3 mb-2">
                        <span className="inline-block w-1 h-6 bg-emerald-500 shrink-0" />
                        <h1 className="font-mono text-xl font-bold uppercase tracking-[0.15em] text-slate-900 dark:text-white">Foro</h1>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Comunidad Valhalla</span>
                    </div>

                    <div className="lg:hidden -mx-4 px-4 pb-2 overflow-x-auto scrollbar-hide flex gap-2">
                        <MobilePill active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')} label="Todo" />
                        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                            <MobilePill
                                key={key}
                                active={selectedCategory === key}
                                onClick={() => setSelectedCategory(key as ThreadCategory)}
                                label={config.label}
                                dotColor={config.color.replace('text-', 'bg-')}
                            />
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-28 bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 animate-pulse" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="py-16 text-center text-rose-500 text-sm">{error}</div>
                    ) : posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-emerald-500/15 dark:border-emerald-500/10 bg-emerald-500/[0.01]">
                            <svg className="w-12 h-12 mb-4 text-emerald-500/20" viewBox="0 0 48 48" fill="none">
                                <polygon points="24,2 44,13 44,35 24,46 4,35 4,13" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            </svg>
                            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Sin publicaciones aún</p>
                        </div>
                    ) : (
                        posts.map((thread) => (
                            <ThreadCardDesktop key={thread.id} data={thread} onVote={votePost} />
                        ))
                    )}
                    <div className="h-16 lg:hidden" />
                </main>

                {/* SIDEBAR DERECHA — BB-2 Panel */}
                <aside className="hidden xl:block w-72 shrink-0 sticky top-24">
                    <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 p-5 shadow-sm shadow-emerald-500/5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 bg-emerald-500" />
                            </span>
                            <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Valhalla Status</h2>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-4">
                            <p>Foro oficial de la academia. Respeta el código y ayuda a tus compañeros.</p>
                            <div className="flex justify-between pt-3 border-t border-emerald-500/10 dark:border-emerald-500/[0.07]">
                                <div><span className="font-bold font-mono text-slate-900 dark:text-white">{posts.length}</span> <span className="font-mono text-[10px] uppercase tracking-[0.15em]">Posts</span></div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* FAB MOVIL */}
            <button
                onClick={() => navigate('./createpost')}
                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center z-50 transition-colors shadow-lg shadow-emerald-500/30"
            >
                {Icons.plus}
            </button>
        </div>
    );
};
