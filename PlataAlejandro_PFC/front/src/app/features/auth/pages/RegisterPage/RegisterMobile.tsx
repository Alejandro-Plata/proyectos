import { Link } from 'react-router-dom';
import { InputField } from '../../components/InputField';
import { SocialButtons } from '../../components/SocialButtons';
import { Icons } from '../../../../components/Icons';
import { ValhallaLogo } from '../../../../components/ValhallaLogo';
import { useRegisterForm } from '../../hooks/useRegisterForm';

export const RegisterMobile = () => {

    const {
        register,
        onSubmit,
        formState: { errors },
        getValues,
        isPending,
        authError
    } = useRegisterForm();


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
                    Regístrate
                </h1>
            </div>

            <div className="relative z-10 flex-1 flex flex-col gap-6">

                {authError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
                        <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <div className="flex-1">
                            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-red-600 dark:text-red-400">{authError}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                    <InputField
                        id="username"
                        label="Nombre de usuario"
                        type="text"
                        placeholder="Valeria"
                        icon={Icons.user}
                        registration={register('username', { required: 'Requerido', minLength: 3 })}
                        error={errors.username?.message as string}
                    />

                    <InputField
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="valeria@gmail.com"
                        icon={Icons.email}
                        registration={register('email', { required: 'Requerido', pattern: /^\S+@\S+$/i })}
                        error={errors.email?.message as string}
                        inputMode="email"
                        autoComplete="email"
                    />

                    <InputField
                        id="password"
                        label="Contraseña"
                        type="password"
                        placeholder="••••••"
                        icon={Icons.lock}
                        registration={register('password', { required: 'Requerido', minLength: 6 })}
                        error={errors.password?.message as string}
                        autoComplete="new-password"
                    />

                    <InputField
                        id="passwordConfirmed"
                        label="Confirmar contraseña"
                        type="password"
                        placeholder="••••••"
                        icon={Icons.check}
                        registration={register('passwordConfirmed', {
                            required: '!',
                            validate: (value) => {
                                const currentPassword = getValues('password');
                                return value === currentPassword || "Las contraseñas no coinciden";
                            }
                        })}
                        error={errors.passwordConfirmed?.message as string}
                    />

                    <div className="pt-2">
                        <label className="flex items-start gap-3 cursor-pointer group select-none">
                            <div className="relative flex items-center h-5">
                                <input
                                    type="checkbox"
                                    {...register('termsAccepted', { required: true })}
                                    className="peer appearance-none w-5 h-5 border border-emerald-500/30 bg-transparent checked:bg-emerald-500 checked:border-emerald-500 transition-all"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none text-black">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </div>
                            </div>
                            <span className="font-mono text-[10px] text-slate-500 transition-colors leading-relaxed pt-0.5">
                                Acepto el <Link to="/codigo-comportamiento" target="_blank" className="text-emerald-500 hover:underline">código de comportamiento</Link> de la academia.
                            </span>
                        </label>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                            className="w-full h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors disabled:bg-emerald-500/[0.08] disabled:text-emerald-500/30 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Registrando...' : 'Registrarse'}
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
                    <Link to="/login" className="group font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 hover:text-emerald-400 transition-colors">
                        Ya tengo una cuenta
                        <span className="text-emerald-500 group-hover:text-emerald-300 ml-2">Acceder</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
