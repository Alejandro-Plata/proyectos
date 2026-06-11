import React from 'react';
import { Link } from 'react-router-dom';
import { ValhallaLogo } from '../../../components/ValhallaLogo';
import { Icons } from '../../../components/Icons';

interface PropsNavbarLanding {
    menuMobileAbierto: boolean;
    alAlternarMenuMobile: () => void;
}

export const LandingNavbar: React.FC<PropsNavbarLanding> = ({ menuMobileAbierto, alAlternarMenuMobile }) => {
    return (
        <nav className={`fixed w-full z-50 top-0 left-0 border-b border-emerald-500/10 transition-all duration-300 ${
            menuMobileAbierto
                ? 'bg-white dark:bg-[#050505]'
                : 'bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md'
        }`}
        style={{ boxShadow: 'inset 0 -1px 0 rgba(16,185,129,0.08)' }}>

            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        onClick={() => menuMobileAbierto && alAlternarMenuMobile()}
                    >
                        <ValhallaLogo className="h-7 sm:h-9 w-auto" />
                    </Link>

                    {/* Desktop actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/login"
                            className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors px-4 py-2"
                        >
                            Iniciar sesión
                        </Link>

                        <Link
                            to="/register"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                            className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
                        >
                            Unirse
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={alAlternarMenuMobile}
                        className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors"
                        aria-label="Menú"
                    >
                        <div className="w-5 h-5">
                            {menuMobileAbierto ? Icons.close : Icons.hamburger}
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuMobileAbierto && (
                <div className="md:hidden fixed inset-0 top-16 z-40 bg-white dark:bg-[#050505]">
                    {/* Grid decorativo */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-40" />

                    <div className="relative h-full flex flex-col justify-center items-center px-8 gap-4">

                        {/* BB-17 ceremonial */}
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <span className="h-px w-10 bg-emerald-500/40" />
                            <svg width="14" height="16" viewBox="0 0 64 72" aria-hidden="true">
                                <polygon points="32,2 62,18 62,54 32,70 2,54 2,18" stroke="#10b981" strokeWidth="4" fill="none" />
                            </svg>
                            <span className="h-px w-10 bg-emerald-500/40" />
                        </div>

                        <Link
                            to="/login"
                            onClick={alAlternarMenuMobile}
                            className="w-full max-w-xs flex justify-center items-center h-12 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300 border border-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-500 transition-colors"
                        >
                            Iniciar sesión
                        </Link>

                        <Link
                            to="/register"
                            onClick={alAlternarMenuMobile}
                            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                            className="w-full max-w-xs flex justify-center items-center h-12 font-mono text-[11px] uppercase tracking-[0.2em] font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
                        >
                            Unirse ahora
                        </Link>

                        <p className="absolute bottom-8 font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-500/30">
                            v2.4.0 · ODIN
                        </p>
                    </div>
                </div>
            )}
        </nav>
    );
};
