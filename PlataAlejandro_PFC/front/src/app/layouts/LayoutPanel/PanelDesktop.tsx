import { Outlet } from 'react-router-dom';
import { SidebarDesktop } from '../../components/NavBar/SideNavDesktop';
import { EncabezadoDesktop } from '../../components/Header/HeaderDesktop';
import { FloatingChat } from '../../features/messaging/components/FloatingChat/FloatingChat';

export const PanelDesktop = () => {
    return (
        <div className="flex h-screen w-full bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-slate-300 font-sans overflow-hidden transition-colors duration-300">

            <SidebarDesktop isOpen={false} />

            <div className="flex-1 flex flex-col h-full min-w-0 relative z-0 ml-20">

                <EncabezadoDesktop />

                <main className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide">
                    <Outlet />
                </main>
            </div>

            <FloatingChat />
        </div>
    );
};
