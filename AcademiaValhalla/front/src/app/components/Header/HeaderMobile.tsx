import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHeader } from '../../hooks/useNavbar';
import { Icons } from '../../components/Icons';
import { getAvatarUrl } from '../../utils/getAvatarUrl';
import { DiscordButton } from '../DiscordButton';
import { DISCORD_INVITE_CODE } from '../../config/discord';
import { useMessaging } from '../../hooks/useMessaging';
import { useUser } from '../../context/UserContext';

type Modo = 'dashboard' | 'subpagina';

interface PropsEncabezadoMobile {
    modo?: Modo;
    titulo?: string;
    onBack?: () => void;
    accion?: React.ReactNode;
}

export const EncabezadoMobile: React.FC<PropsEncabezadoMobile> = ({
    modo = 'dashboard',
    titulo,
    onBack,
    accion,
}) => {
    const { user, currentTitle: tituloPagina } = useHeader();
    const navigate = useNavigate();
    const { logout } = useUser();
    const [menuDesplegableAbierto, setMenuDesplegableAbierto] = useState(false);
    const refMenuDesplegable = useRef<HTMLDivElement>(null);
    const urlAvatar = getAvatarUrl(user.username, user.avatar_url);
    const { totalUnread } = useMessaging();

    const modoFinal: Modo = onBack ? 'subpagina' : modo;

    useEffect(() => {
        const manejarClicFuera = (event: MouseEvent) => {
            if (refMenuDesplegable.current && !refMenuDesplegable.current.contains(event.target as Node)) {
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

    const tituloMostrado = titulo ?? tituloPagina ?? 'Dashboard';

    return (
        <>
            <header className="
                sticky top-0 z-50 w-full h-14
                px-4 md:hidden
                flex items-center justify-between shrink-0
                bg-white/90 dark:bg-[#0a0b0e]/90 backdrop-blur-md
                border-b border-slate-200/70 dark:border-white/[0.06]
            ">
                {modoFinal === 'subpagina' ? (
                    <>
                        <button
                            onClick={onBack}
                            className="w-11 h-11 flex items-center justify-center -ml-2 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors active:scale-95"
                            aria-label="Volver"
                        >
                            <div className="w-5 h-5">{Icons.back}</div>
                        </button>

                        <span className="flex-1 text-sm font-bold text-slate-900 dark:text-white truncate px-2">
                            {tituloMostrado}
                        </span>

                        {accion ? (
                            <div className="shrink-0">{accion}</div>
                        ) : (
                            <div className="w-11" />
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex flex-col justify-center">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-0.5">
                                {tituloMostrado}
                            </h1>
                            <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">
                                VALHALLA
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => navigate('/dashboard/assistant')}
                                aria-label="Asistente Freya"
                                className="relative w-11 h-11 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            >
                                <div className="w-5 h-5">{Icons.assistant}</div>
                            </button>

                            <DiscordButton inviteCode={DISCORD_INVITE_CODE} variant="icon" />

                            <div className="relative" ref={refMenuDesplegable}>
                                <button
                                    onClick={() => setMenuDesplegableAbierto(!menuDesplegableAbierto)}
                                    aria-haspopup="menu"
                                    aria-expanded={menuDesplegableAbierto}
                                    aria-label="Menú de usuario"
                                    className="relative group outline-none w-11 h-11 flex items-center justify-center"
                                >
                                    <img
                                        src={urlAvatar}
                                        alt={user.name}
                                        className={`
                                            w-9 h-9 rounded-full object-cover
                                            border transition-all duration-300
                                            ${menuDesplegableAbierto
                                                ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                                : 'border-slate-200 dark:border-white/10 group-active:border-emerald-500'}
                                        `}
                                    />
                                </button>

                                {menuDesplegableAbierto && (
                                    <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-lg shadow-emerald-500/5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

                                        <div className="px-4 py-3 border-b border-emerald-500/10 bg-emerald-500/[0.03]">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Nivel {user.level || 1}</p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setMenuDesplegableAbierto(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-emerald-500/[0.05] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                            >
                                                <div className="w-4 h-4 text-current">{Icons.profile}</div>
                                                Perfil
                                            </Link>

                                            <Link
                                                to="/dashboard/messages"
                                                onClick={() => setMenuDesplegableAbierto(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-emerald-500/[0.05] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border-t border-emerald-500/10"
                                            >
                                                <div className="w-4 h-4 text-current">{Icons.message}</div>
                                                <span className="flex-1">Mensajería</span>
                                                {totalUnread > 0 && (
                                                    <span className="font-mono text-[10px] bg-rose-500 text-white px-1.5 leading-5">{totalUnread > 99 ? '99+' : totalUnread}</span>
                                                )}
                                            </Link>

                                            <Link
                                                to="/dashboard/assistant"
                                                onClick={() => setMenuDesplegableAbierto(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-emerald-500/[0.05] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border-t border-emerald-500/10"
                                            >
                                                <div className="w-4 h-4 text-current">{Icons.assistant}</div>
                                                Asistente Freya
                                            </Link>

                                            <Link
                                                to="/dashboard/settings"
                                                onClick={() => setMenuDesplegableAbierto(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-emerald-500/[0.05] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border-t border-emerald-500/10"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                Ajustes
                                            </Link>

                                            {(user.role === 'ADMIN' || user.role === 'MODERADOR') && (
                                                <Link
                                                    to="/dashboard/admin"
                                                    onClick={() => setMenuDesplegableAbierto(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-emerald-500/[0.05] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border-t border-emerald-500/10"
                                                >
                                                    <div className="w-4 h-4 text-current">{Icons.admin}</div>
                                                    Administración
                                                </Link>
                                            )}

                                            <button
                                                onClick={() => {
                                                    setMenuDesplegableAbierto(false);
                                                    logout();
                                                    navigate('/login');
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/[0.05] transition-colors border-t border-emerald-500/10"
                                            >
                                                <div className="w-4 h-4">{Icons.signOut}</div>
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </header>
        </>
    );
};
