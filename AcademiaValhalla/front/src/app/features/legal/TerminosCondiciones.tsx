import { useNavigate } from 'react-router-dom';

const SECCIONES = [
    {
        id: '01',
        titulo: 'Aceptación de los términos',
        icono: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        puntos: [
            'Al registrarte en Valhalla Academy aceptas íntegramente estos Términos y Condiciones.',
            'Si no estás de acuerdo con alguno de los términos, debes abstenerte de usar la plataforma.',
            'Nos reservamos el derecho de actualizar estos términos en cualquier momento, notificándote con antelación razonable.',
        ],
    },
    {
        id: '02',
        titulo: 'Uso de la plataforma',
        icono: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
            </svg>
        ),
        puntos: [
            'Valhalla Academy es una plataforma educativa de programación de uso personal y no comercial.',
            'Está prohibido usar la plataforma para actividades ilegales, fraudulentas o que perjudiquen a terceros.',
            'No está permitido el acceso automatizado (bots, scrapers) sin autorización expresa por escrito.',
        ],
    },
    {
        id: '03',
        titulo: 'Cuentas de usuario',
        icono: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        ),
        puntos: [
            'Cada usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.',
            'No se permite crear cuentas falsas ni suplantar la identidad de otras personas.',
            'Podemos suspender o eliminar cuentas que incumplan estos términos o el Código de Conducta.',
        ],
    },
    {
        id: '04',
        titulo: 'Contenido generado por el usuario',
        icono: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
        ),
        puntos: [
            'Al publicar contenido en la plataforma (notas, posts, comentarios), conservas la autoría pero nos otorgas licencia para mostrarlo dentro del servicio.',
            'Eres responsable de que el contenido que publiques no infrinja derechos de terceros.',
            'Podemos eliminar cualquier contenido que vulnere estos términos sin previo aviso.',
        ],
    },
    {
        id: '05',
        titulo: 'Propiedad intelectual',
        icono: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
        ),
        puntos: [
            'El diseño, la marca, los retos y los materiales pedagógicos de Valhalla Academy son propiedad intelectual de sus creadores.',
            'Queda prohibida la reproducción o distribución de dichos materiales sin autorización expresa.',
            'El código de los retos está disponible solo para uso educativo dentro de la plataforma.',
        ],
    },
    {
        id: '06',
        titulo: 'Limitación de responsabilidad',
        icono: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        ),
        puntos: [
            'Valhalla Academy se proporciona "tal cual", sin garantías de disponibilidad ininterrumpida.',
            'No nos hacemos responsables de pérdidas de datos, daños indirectos o lucro cesante derivados del uso de la plataforma.',
            'El uso de herramientas de ejecución de código (como el sandbox de retos) es bajo tu propio riesgo.',
        ],
    },
    {
        id: '07',
        titulo: 'Legislación aplicable',
        icono: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
        ),
        puntos: [
            'Estos términos se rigen por la legislación española y la normativa europea aplicable (RGPD, LSSI).',
            'Cualquier disputa se someterá a los juzgados y tribunales competentes de España.',
            'Si alguna cláusula fuera declarada nula, el resto de los términos seguirán siendo válidos.',
        ],
    },
];

export const TerminosCondiciones = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020202] font-sans">

            <div className="fixed inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none opacity-40" />

            <header className="relative z-10 border-b border-emerald-500/15 dark:border-emerald-500/10 bg-white/80 dark:bg-[#0a0b0e]/80 backdrop-blur-md"
                style={{ boxShadow: 'inset 0 -1px 0 rgba(16,185,129,0.08)' }}>
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                        aria-label="Volver"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="w-px h-5 bg-emerald-500/20" />

                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="inline-block w-1 h-3.5 bg-emerald-500" />
                            <h1 className="font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-500/80">
                                Valhalla · Condiciones legales
                            </h1>
                        </div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                            Actualizado · Mayo 2025
                        </p>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-3xl mx-auto px-6 py-12 space-y-8">

                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="h-px w-12 bg-emerald-500/40" />
                        <svg width="16" height="18" viewBox="0 0 64 72" aria-hidden="true">
                            <polygon points="32,2 62,18 62,54 32,70 2,54 2,18" stroke="#10b981" strokeWidth="4" fill="none" />
                        </svg>
                        <span className="h-px w-12 bg-emerald-500/40" />
                    </div>
                    <h2 className="font-mono text-3xl uppercase tracking-[0.25em] font-bold text-slate-900 dark:text-white mb-2">
                        Términos y condiciones
                    </h2>
                    <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-500/60">
                        Acuerdo de uso · Valhalla
                    </p>
                </div>

                <div
                    className="p-5 border border-emerald-500/20 dark:border-emerald-500/15 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.05]"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
                >
                    <div className="flex items-start gap-3">
                        <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-mono text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-300 uppercase tracking-[0.08em]">
                            El uso de Valhalla Academy implica la aceptación de los presentes Términos y Condiciones.
                            Lee atentamente cada sección antes de continuar usando la plataforma.
                        </p>
                    </div>
                </div>

                {SECCIONES.map((seccion) => (
                    <section
                        key={seccion.id}
                        className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                    >
                        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-emerald-500/10 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.03]">
                            <span className="font-mono text-[9px] text-emerald-500/40 tracking-widest shrink-0">{seccion.id}</span>
                            <span className="text-emerald-500/60">{seccion.icono}</span>
                            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-900 dark:text-white font-bold">
                                {seccion.titulo}
                            </h3>
                        </div>

                        <ul className="px-5 py-4 space-y-3">
                            {seccion.puntos.map((punto, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="mt-1.5 shrink-0 w-1 h-1 bg-emerald-500" />
                                    <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {punto}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}

                <div className="pt-4 border-t border-emerald-500/10 flex items-center justify-between flex-wrap gap-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        Consultas legales:{' '}
                        <span className="text-emerald-500">soporte@valhalla.dev</span>
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                        className="font-mono text-[10px] uppercase tracking-[0.15em] px-4 py-2 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/[0.06] transition-colors"
                    >
                        ← Volver
                    </button>
                </div>
            </main>
        </div>
    );
};
