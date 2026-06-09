import { Link } from 'react-router-dom';

export const NotFoundDesktop = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#050505] font-sans">

            <div className="flex flex-col items-center px-4 max-w-3xl w-full text-center gap-6">

                {/* Hexagon compass icon */}
                <svg width="48" height="56" viewBox="0 0 64 72" className="text-emerald-500">
                    <polygon points="32,2 62,18 62,54 32,70 2,54 2,18" stroke="#10b981" strokeWidth="2" fill="rgba(16,185,129,0.06)" />
                    <circle cx="32" cy="36" r="10" stroke="#10b981" strokeWidth="1.5" fill="none" strokeOpacity="0.5" />
                    <polygon points="32,28 35,36 32,44 29,36" fill="#10b981" fillOpacity="0.6" />
                    <circle cx="32" cy="36" r="2" fill="#10b981" />
                </svg>

                {/* 404 */}
                <p className="font-mono text-6xl uppercase tracking-[0.2em] text-emerald-500/30">
                    404
                </p>

                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                    Página no encontrada
                </p>

                <div className="h-px w-48" style={{ background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.4), transparent)' }} />

                {/* Message */}
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    La página que buscas no existe en este sector.
                </p>

                {/* Back button BB-7 */}
                <Link to="/dashboard">
                    <button className="px-4 h-9 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/[0.06] font-mono text-[11px] uppercase tracking-[0.15em] transition-colors">
                        Volver a la Academia
                    </button>
                </Link>
            </div>
        </div>
    );
};
