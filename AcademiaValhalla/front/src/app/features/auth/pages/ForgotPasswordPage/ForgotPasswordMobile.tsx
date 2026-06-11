import { useRef } from 'react';
import { usePasswordReset } from '../../hooks/usePasswordReset';

const CeremonialHeader = ({ titulo, subtitulo }: { titulo: string; subtitulo: string }) => (
    <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-2.5 mb-3">
            <span className="h-px w-8 bg-emerald-500/50 dark:bg-emerald-500/40" />
            <svg width="20" height="22" viewBox="0 0 64 72" aria-hidden="true">
                <polygon points="32,2 62,18 62,54 32,70 2,54 2,18" stroke="#10b981" strokeWidth="5" fill="none" />
            </svg>
            <span className="h-px w-8 bg-emerald-500/50 dark:bg-emerald-500/40" />
        </div>
        <h1 className="font-mono text-2xl uppercase tracking-[0.2em] font-bold text-slate-900 dark:text-white mb-1.5">
            {titulo}
        </h1>
        <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-500/60">
            {subtitulo}
        </p>
    </div>
);

export const ForgotPasswordMobile = () => {
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
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const inputClass = 'w-full px-3 pt-3.5 pb-2.5 text-sm outline-none transition-colors bg-white dark:bg-transparent border border-slate-200 dark:border-emerald-500/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs focus:border-emerald-500 dark:focus:border-emerald-500/50';
    const labelClass = 'font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-emerald-500/60 mb-1.5 block';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-white flex flex-col px-5 pt-12 pb-8">

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}

            {/* STEP: email */}
            {step === 'email' && (
                <div className="space-y-5">
                    <button
                        onClick={goToLogin}
                        className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-500/60 hover:text-emerald-500 transition-colors mb-2"
                    >
                        ← Volver
                    </button>
                    <CeremonialHeader titulo="Recuperar" subtitulo="Reclama tu sello · Valhalla" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 text-center">Introduce tu email y te enviaremos un código de 6 dígitos.</p>
                    <div>
                        <label className={labelClass}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            autoFocus
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
                </div>
            )}

            {/* STEP: code */}
            {step === 'code' && (
                <div className="space-y-5">
                    <CeremonialHeader titulo="Código" subtitulo="6 dígitos · Email" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 text-center">Enviamos un código a <strong className="text-slate-800 dark:text-slate-300">{email}</strong>.</p>
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
                                className="flex-1 h-14 text-center text-xl font-mono font-bold outline-none transition-colors border border-emerald-500/20 dark:border-emerald-500/15 bg-transparent text-slate-900 dark:text-white focus:border-emerald-500/50"
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
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 text-center">Al menos 6 caracteres.</p>
                    <div>
                        <label className={labelClass}>Nueva contraseña</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" autoFocus className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Confirmar contraseña</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
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
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5">
                    <div className="flex items-center justify-center gap-2.5 mb-2">
                        <span className="h-px w-8 bg-emerald-500/50 dark:bg-emerald-500/40" />
                        <svg width="24" height="26" viewBox="0 0 64 72" aria-hidden="true">
                            <polygon points="32,2 62,18 62,54 32,70 2,54 2,18" stroke="#10b981" strokeWidth="5" fill="rgba(16,185,129,0.1)" />
                            <path stroke="#10b981" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M20 36 l9 9 l15-15" />
                        </svg>
                        <span className="h-px w-8 bg-emerald-500/50 dark:bg-emerald-500/40" />
                    </div>
                    <h1 className="font-mono text-2xl uppercase tracking-[0.2em] font-bold text-slate-900 dark:text-white">
                        Restaurado
                    </h1>
                    <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-500/60">
                        Acceso recuperado · Valhalla
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Ya puedes iniciar sesión con tu nueva contraseña.</p>
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
    );
};
