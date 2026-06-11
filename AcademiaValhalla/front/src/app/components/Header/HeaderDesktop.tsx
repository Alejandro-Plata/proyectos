import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useHeader } from '../../hooks/useNavbar';
import { getAvatarUrl } from '../../utils/getAvatarUrl';
import { DiscordButton } from '../DiscordButton';
import { DISCORD_INVITE_CODE } from '../../config/discord';

export const EncabezadoDesktop = () => {
    const { user, logout } = useUser();
    const { currentTitle: tituloPagina } = useHeader();
    const [menuDesplegableAbierto, setMenuDesplegableAbierto] = useState(false);
    const refMenuDesplegable = useRef(null);
    const navigate = useNavigate();

    // Efecto para que se cierre el desplegable cuando se clicke fuera
    useEffect(() => {
        const manejarClicFuera = (event: MouseEvent | TouchEvent) => {
            if (refMenuDesplegable.current && !(refMenuDesplegable.current as HTMLElement).contains(event.target as Node)) {
                setMenuDesplegableAbierto(false);
            }
        };

        if (menuDesplegableAbierto) {
            document.addEventListener('mousedown', manejarClicFuera);
        }

        return () => {
            document.removeEventListener('mousedown', manejarClicFuera);
        };
    }, [menuDesplegableAbierto]);

    const manejarCierreSesion = () => {
        setMenuDesplegableAbierto(false);
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <header className="
            sticky top-0 z-[60] w-full h-20
            px-10
            flex items-center justify-between shrink-0
            bg-white/90 dark:bg-[#020202]/90 backdrop-blur-md
            border-b border-emerald-500/10
            transition-colors duration-300
        ">

            <div className="w-20" />

            {/* Título Central */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                    {tituloPagina}
                </h1>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-500 font-mono uppercase tracking-[0.2em] mt-0.5">
                    Valhalla 
                </span>
            </div>

            <div className="flex items-center gap-6 z-20">

                <DiscordButton inviteCode={DISCORD_INVITE_CODE} variant="icon" />

                <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />

                {/* Asignamos la referencia al contenedor padre del botón y del menú */}
                <div className="relative" ref={refMenuDesplegable}>
                    <button
                        onClick={() => setMenuDesplegableAbierto(!menuDesplegableAbierto)}
                        className="flex items-center gap-3 group focus:outline-none"
                    >
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-700 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {user.username}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-500 font-mono">
                                LVL {user.current_level || 1}
                            </p>
                        </div>

                        <div className="relative">
                            <div className={`w-10 h-10 overflow-hidden border transition-all ${menuDesplegableAbierto ? 'border-emerald-500' : 'border-emerald-500/20 group-hover:border-emerald-500/50'}`}>
                                <img
                                    src={getAvatarUrl(user.username, user.avatar_url)}
                                    alt={user.username}
                                    className="w-full h-full hex-shield object-cover bg-slate-100 dark:bg-[#0a0b0e]"
                                />
                            </div>
                        </div>
                    </button>

                    {menuDesplegableAbierto && (
                        <div className="absolute right-0 top-full mt-3 w-48 bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-lg shadow-emerald-500/5 z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="py-1">
                                <Link
                                    to="/dashboard/settings"
                                    onClick={() => setMenuDesplegableAbierto(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-emerald-500/[0.05] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Ajustes
                                </Link>

                                <button
                                    onClick={manejarCierreSesion}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-500/[0.05] transition-colors border-t border-emerald-500/10"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};