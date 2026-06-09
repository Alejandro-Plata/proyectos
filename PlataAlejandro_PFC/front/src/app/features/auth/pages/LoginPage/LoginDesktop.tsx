import { Link } from 'react-router-dom';
import { InputField } from '../../components/InputField';
import { SocialButtons } from '../../components/SocialButtons';
import { Icons } from '../../../../components/Icons';
import { ValhallaLogo } from '../../../../components/ValhallaLogo';
import { useLoginForm } from '../../hooks/useLoginForm';

export const LoginDesktop = () => {

    const {
        register,
        authError,
        onSubmit,
        isPending,
        formState: { errors },
    } = useLoginForm();

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans bg-slate-100 dark:bg-[#020202] overflow-hidden relative">

            <div className="absolute inset-0 bg-slate-100 dark:bg-[#020202]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none opacity-20" />

            <div className="w-full max-w-[400px] relative z-20 mt-8">

                {/* Logo badge */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30">
                    <div className="relative px-6 py-2 bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5 flex items-center justify-center min-w-[140px]">
                        <div className="scale-75 origin-center">
                            <ValhallaLogo className="h-8 w-auto" />
                        </div>
                    </div>
                </div>

                {/* Main card */}
                <div
                    className="relative w-full bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-2xl shadow-emerald-500/10 overflow-hidden"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
                >
                    <div className="px-8 pb-8 pt-12 relative z-10">

                        {/* BB-17 Ceremonial Header */}
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <span className="h-px w-12 bg-emerald-500/40" />
                                <svg width="14" height="16" viewBox="0 0 64 72" aria-hidden="true">
                                    <polygon
                                        points="32,2 62,18 62,54 32,70 2,54 2,18"
                                        stroke="#10b981"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                </svg>
                                <span className="h-px w-12 bg-emerald-500/40" />
                            </div>
                            <h1 className="font-mono text-3xl uppercase tracking-[0.25em] font-bold text-slate-900 dark:text-white mb-2">
                                Inicia Sesión
                            </h1>
                        </div>

                        {authError && (
                            <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
                                <div className="flex-1">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-red-700 dark:text-red-200">{authError}</p>
                                </div>
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={onSubmit}>

                            <InputField
                                id="username"
                                label="Usuario"
                                type="text"
                                placeholder=" Valeria"
                                icon={Icons.user}
                                registration={register('username', { required: 'Requerido' })}
                                error={errors.username?.message as string}
                            />

                            <div className="space-y-1">
                                <InputField
                                    id="password"
                                    label="Contraseña"
                                    type="password"
                                    placeholder=" ••••••"
                                    icon={Icons.lock}
                                    registration={register('password', { required: 'Requerido' })}
                                    error={errors.password?.message as string}
                                />
                                <div className="flex justify-end">
                                    <Link
                                        to="/forgot-password"
                                        className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-500/50 hover:text-emerald-500 transition-colors mt-1"
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

                        <div className="my-6 flex items-center gap-4">
                            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, rgba(16,185,129,0.2), transparent)' }} />
                            <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-500/30">o continúa con</span>
                            <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, rgba(16,185,129,0.2), transparent)' }} />
                        </div>

                        <SocialButtons />
                    </div>

                    <div className="py-4 text-center border-t border-emerald-500/10 dark:border-emerald-500/[0.07]">
                        <Link to="/register" className="group font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 hover:text-emerald-400 transition-colors">
                            ¿Aún no tienes cuenta?
                            <span className="text-emerald-500 group-hover:text-emerald-300 ml-2">Regístrate</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
