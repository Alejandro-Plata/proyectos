import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { useUser } from '../../../context/UserContext';

export const OAuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { refreshUser } = useUser();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams.get('token');
        const oauthError = searchParams.get('error');

        if (oauthError) {
            setError('No se pudo completar la autenticación. Inténtalo de nuevo.');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        if (!token) {
            setError('No se recibió un token válido.');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        authService.validateToken(token)
            .then(async () => {
                await refreshUser();
                navigate('/dashboard', { replace: true });
            })
            .catch(() => {
                setError('El token recibido no es válido. Inténtalo de nuevo.');
                setTimeout(() => navigate('/login'), 3000);
            });
    }, [searchParams, navigate, refreshUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0b0e]">
            <div className="text-center">
                {error ? (
                    <>
                        <p className="text-rose-500 text-lg font-semibold mb-2">{error}</p>
                        <p className="text-sm text-slate-400">Redirigiendo al login...</p>
                    </>
                ) : (
                    <>
                        <div className="w-10 h-10 mx-auto mb-4 rounded-full border-2 border-t-emerald-500 border-slate-200 dark:border-white/10 animate-spin" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">Completando autenticación...</p>
                    </>
                )}
            </div>
        </div>
    );
};
