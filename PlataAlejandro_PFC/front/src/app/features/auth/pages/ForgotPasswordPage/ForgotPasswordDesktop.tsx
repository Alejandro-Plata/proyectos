import { useRef } from 'react';
import { ValhallaLogo } from '../../../../components/ValhallaLogo';
import { usePasswordReset } from '../../hooks/usePasswordReset';

const CeremonialHeader = ({ titulo, subtitulo }: { titulo: string; subtitulo: string }) => (
    <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 bg-emerald-500/40" />
            <svg width="14" height="16" viewBox="0 0 64 72" aria-hidden="true">
                <polygon points="32,2 62,18 62,54 32,70 2,54 2,18" stroke="#10b981" strokeWidth="4" fill="none" />
            </svg>
            <span className="h-px w-12 bg-emerald-500/40" />
        </div>
        <h1 className="font-mono text-3xl uppercase tracking-[0.25em] font-bold text-slate-900 dark:text-white mb-2">
            {titulo}
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-500/60">
            {subtitulo}
        </p>
    </div>
);

export const ForgotPasswordDesktop = () => {
    const {
        step, email, setEmail, code, setCode,
        newPassword, setNewPassword, confirmPassword, setConfirmPassword,
        error, isLoading,
        handleRequestCode, handleVerifyCode, handleResetPassword, goToLogin,
    } = usePasswordReset();

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleCodeChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const digits = code.split('');
        digits[index] = value.slice(-1);
        const newCode = digits.join('').padEnd(6, '').slice(0, 6);
        setCode(newCode.trimEnd());

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const inputClass = 'w-full px-3 pt-3.5 pb-2.5 text-sm outline-none transition-colors bg-transparent border border-emerald-500/20 dark:border-emerald-500/15 text-slate-900 dark:text-white placeholder:text-slate-400/60 dark:placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs focus:border-emerald-500/50';
    const labelClass = 'font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/50 mb-1.5 block';

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans bg-slate-100 dark:bg-[#020202] overflow-hidden relative">
            <div className="absolute inset-0 bg-slate-100 dark:bg-[#020202]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none opacity-20" />

            <div className="w-full max-w-[400px] relative z-20">

                {/* Logo badge */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30">
                    <div className="relative px-6 py-2 bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5 flex items-center justify-center min-w-[140px]">
                        <div className="scale-75 origin-center">
                            <ValhallaLogo className="h-8 w-auto dark" />
                        </div>
                    </div>
                </div>

                {/* Main card */}
                <div
                    className="relative w-full bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-2xl shadow-emerald-500/10 overflow-hidden"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
                >
                    <div className="px-8 pb-8 pt-12">

                        {error && (
                            <div className="mb-5 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
                                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-red-700 dark:text-red-300">{error}</p>
                            </div>
                        )}

                        {/* STEP: email */}
                        {step === 'email' && (
                            <div className="space-y-5">
                                <CeremonialHeader titulo="Recuperar" subtitulo="Reclama tu sello · Valhalla" />
                                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 text-center">Introduce tu email y te enviaremos un código de 6 dígitos.</p>
                                <div>
                                    <label className={labelClass}>Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="tu@email.com"
                                        autoFocus
                                        onKeyDown={e => e.key === 'Enter' && handleRequestCode()}
                                        className={inputClass}
                                    />
                                </div>
                                <button
                                    onClick={handleRequestCode}
                                    disabled={!email.trim() || isLoading}
                                    style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                                    className="w-full h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors disabled:bg-emerald-500/[0.08] disabled:text-emerald-500/30 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Enviando...' : 'Enviar código'}
                                </button>
                                <button
                                    onClick={goToLogin}
                                    className="w-full font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/50 hover:text-emerald-500 transition-colors text-center"
                                >
                                    ← Volver al inicio de sesión
                                </button>
                            </div>
                        )}

                        {/* STEP: code */}
                        {step === 'code' && (
                            <div className="space-y-5">
                                <CeremonialHeader titulo="Código" subtitulo="6 dígitos · Email" />
                                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 text-center">Enviamos un código a <strong className="text-slate-700 dark:text-slate-300">{email}</strong>. Revisa tu bandeja de entrada.</p>
                                <div className="flex gap-2 justify-center">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <input
                                            key={i}
                                            ref={el => { inputRefs.current[i] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete={i === 0 ? 'one-time-code' : 'off'}
                                            maxLength={1}
                                            value={code[i] || ''}
                                            onChange={e => handleCodeChange(i, e.target.value)}
                                            onKeyDown={e => handleCodeKeyDown(i, e)}
                                            autoFocus={i === 0}
                                            className="w-12 h-14 text-center text-2xl font-mono font-bold outline-none transition-colors border border-emerald-500/20 dark:border-emerald-500/15 bg-transparent text-slate-900 dark:text-white focus:border-emerald-500/50"
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={handleVerifyCode}
                                    disabled={code.length < 6 || isLoading}
                                    style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                                    className="w-full h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors disabled:bg-emerald-500/[0.08] disabled:text-emerald-500/30 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Verificando...' : 'Verificar código'}
                                </button>
                            </div>
                        )}

                        {/* STEP: newPassword */}
                        {step === 'newPassword' && (
                            <div className="space-y-5">
                                <CeremonialHeader titulo="Renovar" subtitulo="Define tu nueva clave" />
                                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 text-center">Elige una contraseña segura de al menos 6 caracteres.</p>
                                <div>
                                    <label className={labelClass}>Nueva contraseña</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        autoFocus
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Confirmar contraseña</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        onKeyDown={e => e.key === 'Enter' && handleResetPassword()}
                                        className={inputClass}
                                    />
                                </div>
                                <button
                                    onClick={handleResetPassword}
                                    disabled={!newPassword || !confirmPassword || isLoading}
                                    style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                                    className="w-full h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors disabled:bg-emerald-500/[0.08] disabled:text-emerald-500/30 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Guardando...' : 'Restablecer contraseña'}
                                </button>
                            </div>
                        )}

                        {/* STEP: success */}
                        {step === 'success' && (
                            <div className="text-center space-y-5 py-4">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <span className="h-px w-12 bg-emerald-500/40" />
                                    <svg width="14" height="16" viewBox="0 0 64 72" aria-hidden="true">
                                        <polygon points="32,2 62,18 62,54 32,70 2,54 2,18" stroke="#10b981" strokeWidth="4" fill="rgba(16,185,129,0.1)" />
                                        <path stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M20 36 l9 9 l15-15" />
                                    </svg>
                                    <span className="h-px w-12 bg-emerald-500/40" />
                                </div>
                                <h1 className="font-mono text-3xl uppercase tracking-[0.25em] font-bold text-slate-900 dark:text-white">
                                    Restaurado
                                </h1>
                                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-500/60">
                                    Acceso recuperado · Valhalla
                                </p>
                                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 pt-2">Ya puedes iniciar sesión con tu nueva contraseña.</p>
                                <button
                                    onClick={goToLogin}
                                    style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                                    className="w-full h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors"
                                >
                                    Ir al inicio de sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
