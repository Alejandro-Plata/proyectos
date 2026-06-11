import { Link } from 'react-router-dom';
import { InputField } from '../../components/InputField';
import { SocialButtons } from '../../components/SocialButtons';
import { Icons } from '../../../../components/Icons';
import { ValhallaLogo } from '../../../../components/ValhallaLogo';
import { useRegisterForm } from '../../hooks/useRegisterForm';


export const RegisterDesktop = () => {

    const {
        register,
        onSubmit,
        formState: { errors },
        getValues,
        isPending,
        authError
    } = useRegisterForm();

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans bg-slate-100 dark:bg-[#020202] overflow-hidden relative">

            <div className="absolute inset-0 bg-slate-100 dark:bg-[#020202]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none opacity-20" />

            <div className="w-full max-w-[420px] relative z-20 mt-8">

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
                                Regístrate
                            </h1>
                        </div>

                        {/* Error Banner */}
                        {authError && (
                            <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <div className="flex-1">
                                    <p className="font-mono text-[12px] text-red-600 dark:text-red-400">{authError}</p>
                                </div>
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={onSubmit}>
                            <InputField
                                id="username"
                                label="Nombre de usuario"
                                type="text"
                                placeholder=" Valeria"
                                icon={Icons.user}
                                registration={register('username', { required: 'Requerido', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })}
                                error={errors.username?.message}
                            />

                            <InputField
                                id="email"
                                label="Email"
                                type="email"
                                placeholder=" valeriapcd@gmail.com"
                                icon={Icons.email}
                                registration={register('email', { required: 'Requerido', pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' } })}
                                error={errors.email?.message}
                            />

                            <InputField
                                id="password"
                                label="Contraseña"
                                type="password"
                                placeholder=" ••••••"
                                icon={Icons.lock}
                                registration={register('password', { required: 'Requerido', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                                error={errors.password?.message}
                            />

                            <InputField
                                id="passwordConfirmed"
                                label="Confirmar contraseña"
                                type="password"
                                placeholder=" ••••••"
                                icon={Icons.check}
                                registration={register('passwordConfirmed', {
                                    required: 'Requerido',
                                    validate: (value) => {
                                        const currentPassword = getValues('password');
                                        return value === currentPassword || "Las contraseñas no coinciden";
                                    }
                                })}
                                error={errors.passwordConfirmed?.message}
                            />

                            <div className="pt-2">
                                <label className="flex items-start gap-3 cursor-pointer group select-none">
                                    <div className="relative flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            {...register('termsAccepted', { required: true })}
                                            className="peer appearance-none w-4 h-4 border border-emerald-500/30 bg-transparent checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none text-black">
                                            {Icons.check}
                                        </div>
                                    </div>
                                    <span className={`font-mono text-[10px] transition-colors leading-relaxed ${errors.termsAccepted ? 'text-red-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                        Acepto el <Link to="/codigo-comportamiento" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">código de comportamiento</Link>.
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                                className="w-full h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors disabled:bg-emerald-500/[0.08] disabled:text-emerald-500/30 disabled:cursor-not-allowed"
                            >
                                {isPending ? 'Registrando...' : 'Registrarse'}
                            </button>

                        </form>

                        <div className="my-6 flex items-center gap-4">
                            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, rgba(16,185,129,0.2), transparent)' }} />
                            <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-500/30">o continúa con</span>
                            <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, rgba(16,185,129,0.2), transparent)' }} />
                        </div>

                        <SocialButtons />
                    </div>

                    <div className="py-4 text-center border-t border-emerald-500/10 dark:border-emerald-500/[0.07]">
                        <Link to="/login" className="group font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 hover:text-emerald-400 transition-colors">
                            Ya tengo una cuenta
                            <span className="text-emerald-500 group-hover:text-emerald-300 ml-2">Acceder</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
