import { useState } from 'react';
import { API_BASE } from '../../../../services/apiClient';
import { LandingNavbar } from '../../components/LandingNavbar';
import { LandingFooter } from '../../components/LandingFooter';
import { Link } from 'react-router-dom';
import { MonacoEditorDesktop } from '../../../../components/MonacoEditor/MonacoEditorDesktop';
import { Icons } from '../../../../components/Icons';
import { useLanding, INITIAL_CODE } from '../../../../hooks/useLanding';
import { RunButton } from '../../../../components/RunButton';
import { BentoGrid } from '../../components/BentoGrid';
import { useTheme } from '../../../../hooks/useTheme';


export const LandingDesktop = () => {
    const { isMobileMenuOpen: menuMobileAbierto, toggleMobileMenu: alternarMenuMobile, currentYear: anioActual } = useLanding();

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-[#020202] font-sans selection:bg-emerald-500/30 overflow-x-hidden">

            {/* Grid decorativo de fondo */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none opacity-40" />

            <LandingNavbar
                menuMobileAbierto={menuMobileAbierto}
                alAlternarMenuMobile={alternarMenuMobile}
            />

            <main className="relative z-10 flex flex-col items-center pt-36 pb-20 px-6 max-w-7xl mx-auto">

                {/* HERO */}
                <div className="text-center mb-16">

                    {/* Badge */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <span className="h-px w-10 bg-emerald-500/40" />
                        <svg width="14" height="16" viewBox="0 0 64 72" aria-hidden="true">
                            <polygon points="32,2 62,18 62,54 32,70 2,54 2,18" stroke="#10b981" strokeWidth="4" fill="none" />
                        </svg>
                        <span className="h-px w-10 bg-emerald-500/40" />
                    </div>

                    {/* Etiqueta de novedad */}
                    <div className="flex justify-center mb-6">
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1 border border-emerald-500/30 bg-emerald-500/[0.06] dark:bg-emerald-500/[0.08]"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}
                        >
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 bg-emerald-500" />
                            </span>
                            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-500/80">
                                Nuevo · React desde cero
                            </span>
                        </div>
                    </div>

                    <h1 className="font-mono text-5xl md:text-7xl font-bold uppercase tracking-[0.05em] text-slate-900 dark:text-white mb-4 leading-[1.05]">
                        Domina el código.
                    </h1>
                    <h1 className="font-mono text-5xl md:text-7xl font-bold uppercase tracking-[0.05em] text-emerald-500 mb-8 leading-[1.05]">
                        Conquista tu futuro.
                    </h1>

                    <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
                        Valhalla no es solo una academia. Es donde los mejores forjan su carrera
                        <span className="text-emerald-500 ml-1">en comunidad</span>.
                    </p>

                    {/* CTA */}
                    <div className="flex justify-center">
                        <Link
                            to="/register"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
                            className="font-mono text-[12px] uppercase tracking-[0.2em] font-bold px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
                        >
                            Unirse ahora →
                        </Link>
                    </div>
                </div>

                {/* EDITOR SPLIT SECTION */}
                <div className="w-full max-w-6xl mx-auto mb-32 grid grid-cols-2 gap-16 items-center">

                    {/* TEXTO */}
                    <div className="space-y-6 text-left">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-block w-1 h-4 bg-emerald-500 shrink-0" />
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">Editor · Cloud</span>
                        </div>
                        <h2 className="font-mono text-3xl font-bold uppercase tracking-[0.08em] text-slate-900 dark:text-white leading-tight">
                            Programa en<br />tiempo real
                        </h2>
                        <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                            Monaco Editor con ejecución en la nube. Prueba, falla y aprende sin configurar nada.
                        </p>

                        <ul className="space-y-3 pt-2">
                            {[
                                'Soporte para JS, Python, Java, C# y Go',
                                'Feedback instantáneo en consola',
                                'Autocompletado inteligente',
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <span className="w-1 h-1 bg-emerald-500 shrink-0" />
                                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-600 dark:text-slate-400">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <EditorInteractivoDesktop />
                    </div>
                </div>

                <div className="w-full">
                    <BentoGrid />
                </div>

            </main>

            <LandingFooter year={anioActual} />
        </div>
    );
};

const EditorInteractivoDesktop = () => {
    const [codigoEditor, setCodigoEditor] = useState(INITIAL_CODE);
    const [salida, setSalida] = useState<string>('');
    const [estaEjecutando, setEstaEjecutando] = useState(false);
    const { isDarkMode: isDark } = useTheme();

    const ejecutarCodigo = async () => {
        setEstaEjecutando(true);
        setSalida('Ejecutando...');

        try {
            const respuesta = await fetch(`${API_BASE}/public/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language: 'javascript', code: codigoEditor }),
            });

            if (respuesta.status === 429) {
                const cuerpo = await respuesta.json().catch(() => ({}));
                setSalida(cuerpo.error ?? 'Has excedido el número de ejecuciones gratuitas. Crea una cuenta para continuar.');
                return;
            }

            const datos = await respuesta.json();
            setSalida(
                datos.stdout?.trim()
                || datos.stderr?.trim()
                || 'El código se ejecutó pero no hubo salida (¿Faltó un console.log?)',
            );
        } catch {
            setSalida('Error de conexión con el motor de ejecución.');
        } finally {
            setEstaEjecutando(false);
        }
    };

    return (
        <div className="w-full bg-white dark:bg-[#0a0b0e] border border-emerald-500/20 dark:border-emerald-500/15 overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.06)]"
            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
        >
            {/* Titlebar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-[#0f1115] border-b border-emerald-500/10">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-1 h-3.5 bg-emerald-500 shrink-0" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">script.js</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400/50">
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700" />
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700" />
                    <span className="w-1 h-1 bg-emerald-500" />
                </div>
            </div>

            {/* Monaco */}
            <div className="h-[340px] w-full bg-slate-50 dark:bg-[#0a0b0e]">
                <MonacoEditorDesktop
                    code={codigoEditor}
                    onChange={(val: string | undefined) => setCodigoEditor(val || '')}
                    editable={true}
                    theme={isDark}
                />
            </div>

            {/* Console bar */}
            <div className="bg-slate-50 dark:bg-[#0d0e12] border-t border-emerald-500/10 flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                    <span className="scale-100">{Icons.terminal}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em]">Console</span>
                </div>
                <div className="w-auto">
                    <RunButton
                        onClick={ejecutarCodigo}
                        isRunning={estaEjecutando}
                        label="Ejecutar"
                        loadingLabel="Ejecutando..."
                    />
                </div>
            </div>

            {/* Terminal output */}
            <div className="bg-white dark:bg-[#08090b] h-28 border-t border-emerald-500/10 font-mono text-xs overflow-hidden">
                <div className="h-full overflow-y-auto p-4">
                    {salida ? (
                        <div className="flex flex-col gap-1">
                            <div className="flex gap-2 items-center text-slate-400 dark:text-slate-600 mb-0.5 select-none">
                                <span>{'>'}</span>
                                <span>node script.js</span>
                            </div>
                            <span className="text-emerald-600 dark:text-emerald-400/90 whitespace-pre-wrap leading-relaxed break-words">
                                {salida}
                            </span>
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400 dark:text-slate-700 select-none">
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Salida por consola</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
