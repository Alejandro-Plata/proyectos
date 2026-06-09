import { Link } from 'react-router-dom';
import { InputField } from '../../components/InputField';
import { SocialButtons } from '../../components/SocialButtons';
import { Icons } from '../../../../components/Icons';
import { ValhallaLogo } from '../../../../components/ValhallaLogo';
import { useLoginForm } from '../../hooks/useLoginForm';

export const LoginMobile = () => {

    const {
        register,
        authError,
        onSubmit,
        isPending,
        formState: { errors },
    } = useLoginForm();

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-200 font-sans flex flex-col px-6 py-8 overflow-y-auto overflow-x-hidden relative">

            <div className="relative z-10 flex flex-col items-center mb-10 mt-6">
                <ValhallaLogo className="h-10 w-auto" />
            </div>

            {/* BB-17 Ceremonial Header (mobile) */}
            <div className="relative z-10 text-center mb-6">
                <div className="flex items-center justify-center gap-2.5 mb-3">
                    <span className="h-px w-8 bg-emerald-500/40" />
                    <svg width="12" height="14" viewBox="0 0 64 72" aria-hidden="true">
                        <polygon points="32,2 62,18 62,54 32,70 2,54 2,18" stroke="#10b981" strokeWidth="5" fill="none" />
                    </svg>
                    <span className="h-px w-8 bg-emerald-500/40" />
                </div>
                <h1 className="font-mono text-2xl uppercase tracking-[0.2em] font-bold text-slate-900 dark:text-white mb-1.5">
                    Inicia Sesión
                </h1>
            </div>

            <div className="relative z-10 flex-1 flex flex-col gap-6">

                {authError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
                        <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <div className="flex-1">
                            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-red-700 dark:text-red-200">Error de inicio de sesión</p>
                            <p className="font-mono text-[9px] text-red-600 dark:text-red-400">{authError}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={onSubmit} className="flex flex-col gap-6">

                    <InputField
                        id="username"
                        label="Usuario"
                        type="text"
                        placeholder=" Valeria"
                        icon={Icons.user}
                        registration={register('username', { required: 'Requerido' })}
                        error={errors.username?.message as string}
                        autoComplete="username"
                    />

                    <div className="space-y-2">
                        <InputField
                            id="password"
                            label="Contraseña"
                            type="password"
                            placeholder=" ••••••"
                            icon={Icons.lock}
                            registration={register('password', { required: 'Requerido' })}
                            error={errors.password?.message as string}
                            autoComplete="current-password"
                        />
                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
                            >
                                ¿Olvidaste la contraseña?
                            </Link>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isPending}
                            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                            className="w-full h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors disabled:bg-emerald-500/[0.08] disabled:text-emerald-500/30 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Cargando...' : 'Iniciar sesión'}
                        </button>
                    </div>

                </form>

                <div className="flex items-center gap-4 py-2">
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, rgba(16,185,129,0.2), transparent)' }} />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-500/30">o continúa con</span>
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, rgba(16,185,129,0.2), transparent)' }} />
                </div>

                <SocialButtons />

                <div className="mt-auto pt-8 pb-4 text-center">
                    <Link to="/register" className="group font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 hover:text-emerald-400 transition-colors">
                        ¿Aún no tienes cuenta?
                        <span className="text-emerald-500 group-hover:text-emerald-300 ml-2">Regístrate</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
