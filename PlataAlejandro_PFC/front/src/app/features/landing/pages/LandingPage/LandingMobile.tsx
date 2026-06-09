import { useState } from 'react';
import { API_BASE } from '../../../../services/apiClient';
import { Link } from 'react-router-dom';
import { Icons } from '../../../../components/Icons';
import { RunButton } from '../../../../components/RunButton';
import { useLanding, INITIAL_CODE } from '../../../../hooks/useLanding';
import { LandingFooter } from '../../components/LandingFooter';
import { LandingNavbar } from '../../components/LandingNavbar';
import { MockupAI, MockupCommunity, MockupGamification } from '../../components/MockUpsMobile';
import { MonacoEditorMobile } from '../../../../components/MonacoEditor/MonacoEditorMobile';
import { useTheme } from '../../../../hooks/useTheme';

export const LandingMobile = () => {
    const { isMobileMenuOpen: menuMobileAbierto, toggleMobileMenu: alternarMenuMobile, currentYear: anioActual } = useLanding();

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-[#020202] font-sans selection:bg-emerald-500/30 overflow-x-hidden">

            {/* Grid decorativo de fondo */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-40" />

            <LandingNavbar
                menuMobileAbierto={menuMobileAbierto}
                alAlternarMenuMobile={alternarMenuMobile}
            />

            <main className="relative z-10 flex flex-col items-center pt-28 pb-12 px-5 max-w-md mx-auto w-full">

                {/* HERO */}
                <div className="text-center mb-14 w-full">

                    {/* Ceremonial accent */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="h-px w-8 bg-emerald-500/40" />
                        <svg width="12" height="14" viewBox="0 0 64 72" aria-hidden="true">
                            <polygon points="32,2 62,18 62,54 32,70 2,54 2,18" stroke="#10b981" strokeWidth="4" fill="none" />
                        </svg>
                        <span className="h-px w-8 bg-emerald-500/40" />
                    </div>

                    {/* Badge */}
                    <div className="flex justify-center mb-5">
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1 border border-emerald-500/30 bg-emerald-500/[0.06]"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)' }}
                        >
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 bg-emerald-500" />
                            </span>
                            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-emerald-500/80">
                                Nuevo · React desde cero
                            </span>
                        </div>
                    </div>

                    <h1 className="font-mono text-3xl font-bold uppercase tracking-[0.06em] text-slate-900 dark:text-white mb-2 leading-[1.1]">
                        Domina el código.
                    </h1>
                    <h1 className="font-mono text-3xl font-bold uppercase tracking-[0.06em] text-emerald-500 mb-6 leading-[1.1]">
                        Conquista tu futuro.
                    </h1>

                    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 mb-8 leading-relaxed px-1">
                        Valhalla no es solo una academia. Es donde los mejores forjan su carrera
                        <span className="text-emerald-500 ml-1">en comunidad</span>.
                    </p>

                    <div className="flex justify-center">
                        <Link
                            to="/register"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                            className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold px-7 py-3 bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
                        >
                            Unirse ahora →
                        </Link>
                    </div>
                </div>

                {/* PLAYGROUND */}
                <div className="w-full mb-16 space-y-5">
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-1 h-4 bg-emerald-500 shrink-0" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">Editor · Cloud</span>
                    </div>
                    <h2 className="font-mono text-2xl font-bold uppercase tracking-[0.06em] text-slate-900 dark:text-white">
                        Programa en tiempo real
                    </h2>
                    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                        Monaco Editor con ejecución en la nube. Sin configurar nada.
                    </p>
                    <EditorInteractivoMobile />
                </div>

                {/* POR QUÉ VALHALLA */}
                <section className="space-y-5 pb-20 w-full">

                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block w-1 h-4 bg-emerald-500 shrink-0" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">¿Por qué Valhalla?</span>
                    </div>

                    {/* Entorno Cloud */}
                    <div
                        className="border border-emerald-500/15 dark:border-emerald-500/10 bg-white dark:bg-[#0a0b0e] p-5 overflow-hidden"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-block w-1 h-3.5 bg-emerald-500 shrink-0" />
                            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">Cloud_Engine</span>
                        </div>
                        <h3 className="font-mono text-base uppercase tracking-[0.1em] font-bold text-slate-900 dark:text-white mb-2">Entorno Cloud</h3>
                        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400 leading-relaxed">
                            Ejecuta JS, Java, C#, Python y Go directamente en el navegador.
                        </p>
                    </div>

                    {/* IA */}
                    <div
                        className="border border-emerald-500/15 dark:border-emerald-500/10 bg-white dark:bg-[#0a0b0e] h-[300px] overflow-hidden"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                    >
                        <div className="absolute top-0 left-0 w-full p-5 z-20 pointer-events-none">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="text-emerald-500 w-4 h-4">{Icons.chip}</div>
                                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">IA · Asistente</span>
                            </div>
                            <h3 className="font-mono text-base uppercase tracking-[0.1em] font-bold text-slate-900 dark:text-white">Mentoría IA</h3>
                            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400 mt-1">Un tutor personal que entiende tu código.</p>
                        </div>
                        <div className="absolute inset-0 top-24 z-10">
                            <MockupAI />
                        </div>
                    </div>

                    {/* Gamificación */}
                    <div
                        className="border border-emerald-500/15 dark:border-emerald-500/10 bg-white dark:bg-[#0a0b0e] h-[280px] overflow-hidden relative"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                    >
                        <div className="absolute top-0 left-0 w-full p-5 z-20 pointer-events-none">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="text-orange-500 dark:text-orange-400 w-4 h-4">{Icons.flame}</div>
                                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-orange-500/70">XP · Rango</span>
                            </div>
                            <h3 className="font-mono text-base uppercase tracking-[0.1em] font-bold text-slate-900 dark:text-white">Compite</h3>
                            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400 mt-1">Sube de rango y gana recompensas.</p>
                        </div>
                        <MockupGamification />
                    </div>

                    {/* Comunidad */}
                    <div
                        className="border border-emerald-500/15 dark:border-emerald-500/10 bg-white dark:bg-[#0a0b0e] h-[260px] overflow-hidden"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                    >
                        <MockupCommunity />
                    </div>

                </section>

            </main>

            <LandingFooter year={anioActual} />
        </div>
    );
};

const EditorInteractivoMobile = () => {
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
        <div
            className="w-full overflow-hidden border border-emerald-500/20 dark:border-emerald-500/15 bg-white dark:bg-[#0a0b0e]"
            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
        >
            {/* Titlebar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-[#0f1115] border-b border-emerald-500/10">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-1 h-3 bg-emerald-500 shrink-0" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">demo.js</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700" />
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700" />
                    <span className="w-1 h-1 bg-emerald-500" />
                </div>
            </div>

            {/* Monaco Editor */}
            <div className="h-[240px] w-full">
                <MonacoEditorMobile
                    code={codigoEditor}
                    language="javascript"
                    onChange={(val) => setCodigoEditor(val || '')}
                    editable={true}
                    theme={isDark}
                />
            </div>

            {/* Console bar */}
            <div className="border-t border-emerald-500/10 bg-slate-50 dark:bg-[#0d0e12]">
                <div className="flex items-center justify-between px-4 py-2 border-b border-emerald-500/10">
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3" />
                        </svg>
                        <span className="font-mono text-[9px] uppercase tracking-[0.25em]">Consola</span>
                    </div>
                    <RunButton
                        isRunning={estaEjecutando}
                        onClick={ejecutarCodigo}
                        label="Run"
                        loadingLabel="..."
                    />
                </div>
                <div className="h-14 px-4 py-2.5 font-mono text-[11px] overflow-y-auto">
                    {salida
                        ? <span className="text-emerald-600 dark:text-emerald-400/90 whitespace-pre-wrap">{salida}</span>
                        : <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-700">{'> Esperando output...'}</span>
                    }
                </div>
            </div>
        </div>
    );
};
