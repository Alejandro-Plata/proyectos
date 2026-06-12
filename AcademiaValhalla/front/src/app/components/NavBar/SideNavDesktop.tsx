import { useState, useRef } from 'react';
import type { SidebarItemProps, SidebarProps } from '../types/types';
import { Link } from 'react-router-dom';
import { ToggleButton } from '../ToggleButton';
import { Icons } from '../Icons';
import { ValhallaLogo } from '../ValhallaLogo';
import { useSidebar } from '../../hooks/useNavbar';



export const SidebarItem: React.FC<SidebarItemProps> = ({ item, isExpanded, isActive, onClick }) => {
    return (
        <Link
            to={item.to}
            onClick={onClick}
            className={`
                group relative flex items-center min-h-[48px] transition-all duration-200
                ${isActive
                    ? 'bg-emerald-500/[0.08] text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-emerald-500/[0.04] hover:text-emerald-600 dark:hover:text-emerald-400 border-l-2 border-transparent'
                }
                ${isExpanded ? 'px-4 pl-[10px]' : 'justify-center px-2'}
            `}
        >
            <div className="w-5 h-5 flex-shrink-0">
                {item.icon}
            </div>

            <div className={`
                overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin-left] duration-300 ease-in-out
                ${isExpanded ? 'max-w-[180px] opacity-100 ml-3' : 'max-w-0 opacity-0 ml-0'}
            `}>
                <span className="font-mono text-[11px] uppercase tracking-[0.15em]">{item.label}</span>
            </div>

            {!isExpanded && isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-emerald-500" />
            )}

            {!isExpanded && (
                <div className="
                    absolute left-full top-1/2 -translate-y-1/2 ml-4 z-50
                    hidden group-hover:flex items-center
                    px-3 py-1.5
                    bg-slate-900 dark:bg-white text-white dark:text-slate-900
                    shadow-lg shadow-emerald-500/10 border border-emerald-500/20
                    whitespace-nowrap pointer-events-none
                    animate-in fade-in slide-in-from-left-2 duration-200
                ">
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-inherit transform rotate-45" />
                    <span className="text-xs font-bold uppercase tracking-wider relative z-10">{item.label}</span>
                </div>
            )}
        </Link>
    );
};

export const SidebarDesktop: React.FC<SidebarProps> = ({ isOpen }) => {
    const { menuItems, activeSection, setActiveSection, signOut } = useSidebar();
    const [isHovered, setIsHovered] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const openTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isExpanded = isPinned || isOpen || isHovered;

    const handleMouseEnter = () => {
        if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
        openTimer.current = setTimeout(() => setIsHovered(true), 250);
    };
    const handleMouseLeave = () => {
        if (isPinned) return;
        if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null; }
        closeTimer.current = setTimeout(() => setIsHovered(false), 180);
    };

    return (
        <aside
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`
                group/sidebar fixed inset-y-0 left-0 z-[100] flex flex-col h-full
                bg-white dark:bg-[#0a0b0e]
                border-r border-emerald-500/15 dark:border-emerald-500/10 shadow-lg shadow-emerald-500/5
                transition-[width] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isExpanded ? 'w-72' : 'w-20'}
            `}
        >
            {/* Indicador visual cuando está cerrada: aparece al pasar el ratón */}
            <div className={`
                absolute right-0 top-1/2 -translate-y-1/2 translate-x-[3px] flex flex-col items-center gap-1.5
                pointer-events-none transition-opacity duration-300 z-10
                ${!isExpanded ? 'opacity-0 group-hover/sidebar:opacity-100' : 'opacity-0'}
            `}>
                <div className="w-0.5 h-8 rounded-full bg-emerald-500/60" />
                <svg className="w-3 h-3 text-emerald-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <div className="w-0.5 h-8 rounded-full bg-emerald-500/60" />
            </div>

            <div className="h-20 flex items-center shrink-0 border-b border-emerald-500/10 relative overflow-hidden scanline-bottom">

                <div className={`
                    w-full h-full flex items-center transition-all duration-300
                    ${isExpanded ? 'px-4 justify-start' : 'justify-center px-0'}
                `}>
                    <div className="shrink-0 text-emerald-600 dark:text-emerald-400">
                        <ValhallaLogo className="h-8 w-8" iconOnly={true} />
                    </div>

                    <div className={`
                        flex-1 min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out flex flex-col justify-center
                        ${isExpanded ? 'opacity-100 max-w-[160px] ml-3' : 'opacity-0 max-w-0 ml-0'}
                    `}>
                        <span className="font-orbitron font-bold text-lg tracking-wider text-slate-900 dark:text-white leading-none">
                            VALHALLA
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 tracking-widest uppercase mt-0.5">
                            Academy
                        </span>
                    </div>

                    {/* Botón de pin — visible solo cuando está expandida */}
                    <button
                        onClick={() => setIsPinned(p => !p)}
                        title={isPinned ? 'Desfijar barra lateral' : 'Fijar barra lateral'}
                        className={`
                            ml-auto shrink-0 w-7 h-7 flex items-center justify-center rounded
                            transition-all duration-200
                            ${isPinned
                                ? 'text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20'
                                : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/[0.06]'
                            }
                            ${isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                        `}
                    >
                        {/* Icono thumbtack: rotado 45° cuando no fijado, vertical cuando fijado */}
                        <svg
                            className={`w-4 h-4 transition-transform duration-300 ${isPinned ? 'rotate-0' : 'rotate-45'}`}
                            viewBox="0 0 24 24"
                            fill={isPinned ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth={1.8}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="12" y1="17" x2="12" y2="22" />
                            <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                        </svg>
                    </button>
                </div>
            </div>

            <nav className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto overflow-x-hidden scrollbar-hide px-3">
                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.id}
                        item={item}
                        isExpanded={isExpanded}
                        isActive={activeSection === item.id}
                        onClick={() => setActiveSection(item.id)}
                    />
                ))}
            </nav>

            <div className="p-4 border-t border-emerald-500/10 bg-emerald-500/[0.02]">
                <div className="flex flex-col gap-3 items-center justify-center transition-all duration-300">

                    <div className={`transition-all duration-300 ${isExpanded ? 'w-full flex justify-start pl-2' : ''}`}>
                        <div className={`${!isExpanded ? 'scale-90' : 'scale-100'}`}>
                            <ToggleButton />
                        </div>
                    </div>

                    <div className="h-px w-full bg-emerald-500/10" />

                    <button
                        onClick={signOut}
                        className={`
                            group flex items-center transition-all duration-200
                            text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400
                            ${isExpanded
                                ? 'w-full px-3 py-2 gap-3 hover:bg-rose-500/[0.06] justify-start'
                                : 'w-10 h-10 justify-center hover:bg-emerald-500/[0.04]'
                            }
                        `}
                        title={!isExpanded ? "Cerrar Sesión" : ""}
                    >
                        <div className="w-5 h-5 shrink-0">{Icons.signOut}</div>

                        <div className={`
                            overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin-left] duration-300 ease-in-out
                            ${isExpanded ? 'max-w-[120px] opacity-100 ml-3' : 'max-w-0 opacity-0 ml-0'}
                        `}>
                            <span className="font-mono text-[11px] uppercase tracking-[0.15em]">Salir</span>
                        </div>
                    </button>
                </div>
            </div>
        </aside>
    );
};
