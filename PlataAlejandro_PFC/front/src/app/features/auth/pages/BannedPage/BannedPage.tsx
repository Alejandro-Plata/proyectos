import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../../context/UserContext';

export const BannedPage = () => {
    const { logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-white dark:bg-[#050505] font-sans p-4">

            {/* BB-17 Ceremonial Header (rose variant) */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="h-px w-12 bg-rose-500/40" />
                    <svg width="18" height="20" viewBox="0 0 64 72" aria-hidden="true">
                        <polygon points="32,2 62,18 62,54 32,70 2,54 2,18" stroke="#f43f5e" strokeWidth="4" fill="rgba(244,63,94,0.08)" />
                        <line x1="22" y1="26" x2="42" y2="46" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
                        <line x1="42" y1="26" x2="22" y2="46" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
                    </svg>
                    <span className="h-px w-12 bg-rose-500/40" />
                </div>
                <h1 className="font-mono text-3xl uppercase tracking-[0.25em] font-bold text-slate-900 dark:text-white mb-2">
                    Vetado
                </h1>
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-rose-500/70">
                    Acceso denegado · Valhalla
                </p>
            </div>

            {/* Messages */}
            <div className="text-center max-w-sm space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Tu cuenta ha sido suspendida debido a un comportamiento inapropiado en la plataforma.
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 leading-relaxed">
                    Si crees que esto es un error, contacta con el equipo de soporte.
                </p>
            </div>

            {/* Logout button */}
            <button
                onClick={handleLogout}
                className="px-6 h-9 border border-rose-500/30 hover:border-rose-500/60 text-rose-500 hover:bg-rose-500/[0.06] font-mono text-[11px] uppercase tracking-[0.15em] transition-colors"
            >
                Cerrar sesión
            </button>

            {/* Footer ref code */}
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
                ref: <span className="text-rose-500/50">ERR_ACCOUNT_SUSPENDED</span>
            </p>
        </div>
    );
};
