import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const TABS: { label: string; to: string }[] = [
    { label: 'Foro', to: '/dashboard/community' },
    { label: 'Salón de los Héroes', to: '/dashboard/community/showcase' },
    { label: 'Torneos', to: '/dashboard/community/torneos' },
    { label: 'Mecenazgo', to: '/dashboard/community/mecenazgo' },
];

// La barra de pestañas solo se muestra en las secciones principales de la comunidad,
// no en vistas de detalle (crear post, perfil de usuario, detalle de hilo).
const RUTAS_CON_TABS = new Set(TABS.map(t => t.to));

/**
 * Capa común de la sección Comunidad: agrupa Foro, Salón de los Héroes (showcase),
 * Torneos y Mecenazgo bajo una sub-navegación por pestañas.
 */
export const CommunityLayout = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const normalizado = pathname.replace(/\/$/, '');
    const mostrarTabs = RUTAS_CON_TABS.has(normalizado);

    return (
        <div className="min-h-screen">
            {mostrarTabs && (
                <nav className="z-40 backdrop-blur-md bg-white/70 dark:bg-[#050505]/70 border-b border-emerald-500/10 dark:border-emerald-500/[0.07]">
                    <div className="max-w-5xl mx-auto flex gap-1 px-4 overflow-x-auto scrollbar-hide">
                        {TABS.map(t => {
                            const activa = normalizado === t.to;
                            return (
                                <button
                                    key={t.to}
                                    onClick={() => navigate(t.to)}
                                    className={`shrink-0 font-mono text-[11px] uppercase tracking-[0.15em] px-3 py-3 border-b-2 transition-colors ${activa
                                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                        : 'border-transparent text-slate-400 hover:text-emerald-500'}`}
                                >
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                </nav>
            )}
            <Outlet />
        </div>
    );
};
