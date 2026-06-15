import { useState } from 'react';
import { cazaTrollService, type CazaIniciada, type ResultadoCaza } from '../services/cazaTrollService';

/**
 * Caza al bichillo — el usuario debe encontrar el bug que Freya escondió.
 * Componente autocontenido (sin Monaco) reutilizable tanto en la página propia
 * como dentro del panel de herramientas de Freya.
 */
export const CazaBichillo = () => {
    const [caza, setCaza] = useState<CazaIniciada | null>(null);
    const [tema, setTema] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [lineaSeleccionada, setLineaSeleccionada] = useState<number | null>(null);
    const [temperatura, setTemperatura] = useState<string | null>(null);
    const [explicacion, setExplicacion] = useState('');
    const [resultado, setResultado] = useState<ResultadoCaza | null>(null);
    const [inicio, setInicio] = useState<number>(0);

    const iniciar = async () => {
        setCargando(true); setError(null); setResultado(null); setTemperatura(null);
        setLineaSeleccionada(null); setExplicacion('');
        try {
            const c = await cazaTrollService.iniciar(tema.trim() || undefined);
            setCaza(c);
            setInicio(Date.now());
        } catch (e: any) {
            setError(e?.message ?? 'No se pudo iniciar la caza');
        } finally {
            setCargando(false);
        }
    };

    const pedirPista = async () => {
        if (!caza || lineaSeleccionada == null) return;
        try {
            const { temperatura } = await cazaTrollService.pista(caza.hunt_id, lineaSeleccionada);
            setTemperatura(temperatura);
        } catch (e: any) { setError(e?.message ?? 'Error'); }
    };

    const resolver = async () => {
        if (!caza || lineaSeleccionada == null) return;
        try {
            const r = await cazaTrollService.resolver(caza.hunt_id, lineaSeleccionada, explicacion);
            setResultado(r);
        } catch (e: any) { setError(e?.message ?? 'Error'); }
    };

    const lineas = caza?.buggy_code.split('\n') ?? [];
    const segundos = inicio ? Math.floor((Date.now() - inicio) / 1000) : 0;

    const colorTemp: Record<string, string> = {
        'ardiendo': 'text-red-500', 'caliente': 'text-orange-400', 'templado': 'text-amber-400', 'frío': 'text-sky-400',
    };

    return (
        <div className="space-y-4">
            {error && <p className="text-sm text-red-500">{error}</p>}

            {!caza ? (
                <div className="border border-emerald-500/20 p-5 space-y-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Freya esconde <strong>un bichillo (bug)</strong> en un fragmento de código. Encuéntralo: marca la línea sospechosa y explica el fallo.
                    </p>
                    <input
                        value={tema}
                        onChange={(e) => setTema(e.target.value)}
                        placeholder="Tema (opcional): recursión, arrays, async..."
                        className="w-full px-3 py-2 text-sm bg-transparent border-b-2 border-emerald-500/40 focus:border-emerald-400 outline-none text-slate-900 dark:text-white"
                    />
                    <button
                        onClick={iniciar}
                        disabled={cargando}
                        className="w-full py-2.5 font-mono text-[11px] uppercase tracking-widest bg-emerald-500 hover:bg-emerald-400 text-black transition-colors disabled:opacity-50"
                    >
                        {cargando ? 'Preparando la caza...' : 'Iniciar caza'}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>Lenguaje: {caza.language}</span>
                        <span>{segundos}s</span>
                    </div>

                    {/* Código con selección de línea */}
                    <div className="border border-emerald-500/20 bg-[#0a0b0e] overflow-x-auto font-mono text-[13px] leading-6">
                        {lineas.map((linea, i) => {
                            const num = i + 1;
                            const sel = lineaSeleccionada === num;
                            return (
                                <div
                                    key={i}
                                    onClick={() => !resultado && setLineaSeleccionada(num)}
                                    className={`flex cursor-pointer ${sel ? 'bg-emerald-500/20' : 'hover:bg-white/5'} ${resultado && num === resultado.bug_line ? 'bg-red-500/25' : ''}`}
                                >
                                    <span className="select-none w-10 shrink-0 text-right pr-3 text-slate-600">{num}</span>
                                    <pre className="text-slate-200 whitespace-pre">{linea || ' '}</pre>
                                </div>
                            );
                        })}
                    </div>

                    {!resultado && (
                        <>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400">
                                    {lineaSeleccionada ? `Línea sospechosa: ${lineaSeleccionada}` : 'Haz clic en una línea'}
                                </span>
                                <button
                                    onClick={pedirPista}
                                    disabled={lineaSeleccionada == null}
                                    className="ml-auto font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 disabled:opacity-40"
                                >
                                    Pista (frío/caliente)
                                </button>
                            </div>
                            {temperatura && (
                                <p className="text-sm font-mono">
                                    Temperatura: <span className={colorTemp[temperatura] ?? ''}>{temperatura.toUpperCase()}</span>
                                </p>
                            )}
                            <textarea
                                value={explicacion}
                                onChange={(e) => setExplicacion(e.target.value)}
                                rows={3}
                                placeholder="Explica brevemente cuál es el bug..."
                                className="w-full px-3 py-2 text-sm bg-transparent border border-emerald-500/20 focus:border-emerald-400 outline-none text-slate-900 dark:text-white"
                            />
                            <button
                                onClick={resolver}
                                disabled={lineaSeleccionada == null || explicacion.trim().length < 10}
                                className="w-full py-2.5 font-mono text-[11px] uppercase tracking-widest bg-emerald-500 hover:bg-emerald-400 text-black transition-colors disabled:opacity-50"
                            >
                                Acusar al bichillo
                            </button>
                        </>
                    )}

                    {resultado && (
                        <div className={`border p-4 ${resultado.correcto ? 'border-emerald-500/40 bg-emerald-500/[0.06]' : 'border-red-500/40 bg-red-500/[0.06]'}`}>
                            <p className="font-bold mb-2 text-slate-900 dark:text-white">
                                {resultado.correcto ? 'Bichillo cazado' : 'Se te escapó'}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                El bichillo estaba en la <strong>línea {resultado.bug_line}</strong>: {resultado.bug_explanation}
                            </p>
                            {resultado.xpReward && (
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
                                    +{resultado.xpReward.xpGained} XP
                                </p>
                            )}
                            <button
                                onClick={() => { setCaza(null); setResultado(null); }}
                                className="mt-3 font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                            >
                                Otra caza
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
