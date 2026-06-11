import { useNavigate } from 'react-router-dom';

const SECCIONES = [
    {
        id: '01',
        titulo: 'Respeto mutuo',
        icono: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
        puntos: [
            'Trata a todos los miembros con respeto, independientemente de su nivel de experiencia, origen o identidad.',
            'No se toleran comentarios despectivos, insultos ni actitudes condescendientes.',
            'Las críticas deben ser constructivas y orientadas al aprendizaje, nunca personales.',
        ],
    },
    {
        id: '02',
        titulo: 'Honestidad académica',
        icono: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
        ),
        puntos: [
            'Presenta siempre trabajo propio. Copiar soluciones sin comprenderlas va en contra del espíritu de la plataforma.',
            'Si usas código externo o referencias, cítalas correctamente en tus notas o comentarios.',
            'No compartas soluciones completas de retos públicamente; ofrece pistas que guíen el aprendizaje.',
        ],
    },
    {
        id: '03',
        titulo: 'Comunicación constructiva',
        icono: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
        ),
        puntos: [
            'Al pedir ayuda, incluye contexto: qué intentas hacer, qué has probado y cuál es el error.',
            'Al responder, explica el razonamiento detrás de tu solución para fomentar la comprensión.',
            'Evita respuestas de una sola línea que no aporten valor didáctico.',
        ],
    },
    {
        id: '04',
        titulo: 'Contenido apropiado',
        icono: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
        ),
        puntos: [
            'Solo se permite contenido relacionado con programación, tecnología y aprendizaje.',
            'Está prohibido publicar contenido ofensivo, spam, publicidad no autorizada o material ilegal.',
            'Los recursos compartidos deben ser pertinentes y de fuentes fiables.',
        ],
    },
    {
        id: '05',
        titulo: 'Privacidad y seguridad',
        icono: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        ),
        puntos: [
            'No compartas información personal propia ni de terceros sin consentimiento explícito.',
            'Está prohibido publicar código malicioso, exploits o cualquier material con intención dañina.',
            'Respeta las cuentas y el trabajo de otros miembros.',
        ],
    },
    {
        id: '06',
        titulo: 'Uso responsable',
        icono: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        ),
        puntos: [
            'No abuses de los sistemas de votación, notificaciones ni mensajería con fines malintencionados.',
            'Reporta comportamientos inadecuados usando los mecanismos disponibles en lugar de tomar represalias.',
            'Colabora con los moderadores cuando se requiera tu participación en la resolución de conflictos.',
        ],
    },
    {
        id: '07',
        titulo: 'Consecuencias del incumplimiento',
        icono: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
        ),
        puntos: [
            'El incumplimiento puede resultar en advertencias, restricciones temporales o suspensión permanente.',
            'Las decisiones de moderación se aplican con criterio y proporcionalidad al impacto de la conducta.',
            'Puedes apelar cualquier decisión contactando al equipo de administración.',
        ],
    },
];

export const CodigoComportamiento = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020202] font-sans">

            {/* Grid decorativo de fondo */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none opacity-40" />

            {/* Header */}
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
                                Valhalla · Normas de comunidad
                            </h1>
                        </div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                            Actualizado · Mayo 2025
                        </p>
                    </div>
                </div>
            </header>

            {/* Contenido */}
            <main className="relative z-10 max-w-3xl mx-auto px-6 py-12 space-y-8">

                {/* BB-17 Ceremonial Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="h-px w-12 bg-emerald-500/40" />
                        <svg width="16" height="18" viewBox="0 0 64 72" aria-hidden="true">
                            <polygon points="32,2 62,18 62,54 32,70 2,54 2,18" stroke="#10b981" strokeWidth="4" fill="none" />
                        </svg>
                        <span className="h-px w-12 bg-emerald-500/40" />
                    </div>
                    <h2 className="font-mono text-3xl uppercase tracking-[0.25em] font-bold text-slate-900 dark:text-white mb-2">
                        Código de conducta
                    </h2>
                    <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-500/60">
                        Normas del guerrero · Valhalla
                    </p>
                </div>

                {/* Bloque introductorio */}
                <div
                    className="p-5 border border-emerald-500/20 dark:border-emerald-500/15 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.05]"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
                >
                    <div className="flex items-start gap-3">
                        <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-mono text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-300 uppercase tracking-[0.08em]">
                            Valhalla es una comunidad de aprendizaje centrada en la programación. Para que el entorno sea
                            seguro, justo y productivo, todos los miembros deben comprometerse a respetar estas normas.
                            Al crear una cuenta, aceptas cumplirlas en su totalidad.
                        </p>
                    </div>
                </div>

                {/* Secciones */}
                {SECCIONES.map((seccion) => (
                    <section
                        key={seccion.id}
                        className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                    >
                        {/* Cabecera de sección */}
                        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-emerald-500/10 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.03]">
                            <span className="font-mono text-[9px] text-emerald-500/40 tracking-widest shrink-0">{seccion.id}</span>
                            <span className="text-emerald-500/60">{seccion.icono}</span>
                            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-900 dark:text-white font-bold">
                                {seccion.titulo}
                            </h3>
                        </div>

                        {/* Puntos */}
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

                {/* Footer de la página */}
                <div className="pt-4 border-t border-emerald-500/10 flex items-center justify-between flex-wrap gap-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        Dudas o infracciones:{' '}
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
