import { Outlet } from 'react-router-dom';
import { EncabezadoMobile } from '../../components/Header/HeaderMobile';
import { BottomNavMobile } from '../../components/NavBar/BottomNavMobile';

export const PanelMobile = () => {
    return (
        <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-200 font-sans overflow-hidden transition-colors duration-300">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:bg-emerald-500 focus:text-black focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider"
            >
                Saltar al contenido
            </a>
            <EncabezadoMobile />
            <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto scrollbar-hide relative z-0 pb-[88px]">
                <Outlet />
            </main>
            <BottomNavMobile />
        </div>
    );
};
