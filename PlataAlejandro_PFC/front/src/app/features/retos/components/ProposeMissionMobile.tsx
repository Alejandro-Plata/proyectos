import { useState } from 'react';
import { Icons } from '../../../components/Icons';
import { MonacoEditorMobile } from '../../../components/MonacoEditor/MonacoEditorMobile';
import { KeyboardAccessoryBar } from '../../../components/KeyboardAccessoryBar';
import { useProposeMission } from '../hooks/useProposeMission';
import { TestHelpModal } from './TestHelpModal';
import { useTheme } from '../../../hooks/useTheme';

interface ProposeMissionMobileProps {
    isOpen: boolean;
    onClose: () => void;
}

const TOTAL_STEPS = 4;

const STEP_TITLES = [
    'Datos básicos',
    'Código inicial',
    'Solución',
    'Tests de validación',
];

export const ProposeMissionMobile = ({ isOpen, onClose }: ProposeMissionMobileProps) => {
    const { fields, setField, isSubmitting, submitted, canSubmit, handleSubmit, reset } = useProposeMission();
    const [step, setStep] = useState(1);
    const [showTestHelp, setShowTestHelp] = useState(false);
    const { isDarkMode: isDark } = useTheme();

    if (!isOpen) return null;

    const handleClose = () => {
        reset();
        setStep(1);
        onClose();
    };

    const canAdvanceStep1 = fields.title.trim().length > 0 && fields.description.trim().length > 0;

    const handleNext = () => { if (step < TOTAL_STEPS) setStep(s => s + 1); };
    const handleBack = () => { if (step > 1) setStep(s => s - 1); };
    const handleFinish = async () => { await handleSubmit(); };

    return (
        <>
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Proponer misión"
            className="fixed inset-0 z-[100] bg-white dark:bg-[#050505] flex flex-col animate-in slide-in-from-bottom duration-200"
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-2 h-14 bg-slate-50 dark:bg-[#0a0b0e] border-b border-slate-200 dark:border-white/[0.06] shrink-0">
                <button
                    onClick={handleClose}
                    className="w-11 h-11 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors active:scale-95"
                    aria-label="Cerrar"
                >
                    <div className="w-5 h-5">{Icons.close}</div>
                </button>
                <div className="flex-1">
                    <p className="font-mono text-[11px] uppercase tracking-[0.15em] font-bold text-slate-900 dark:text-white">Proponer misión</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                        Paso {step} de {TOTAL_STEPS} · {STEP_TITLES[step - 1]}
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-slate-100 dark:bg-white/[0.05] shrink-0">
                <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                />
            </div>

            {/* Content — flex-1 min-h-0 allows children to fill remaining space correctly */}
            <div className="flex-1 min-h-0 flex flex-col">

                {submitted ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
                        <div
                            className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                        >
                            <div className="w-7 h-7">{Icons.check}</div>
                        </div>
                        <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] font-bold text-slate-900 dark:text-white">¡Propuesta enviada!</h2>
                        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 leading-relaxed">
                            Un administrador revisará tu propuesta antes de publicarla.
                        </p>
                        <button
                            onClick={handleClose}
                            style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                            className="h-12 px-8 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[10px] uppercase tracking-[0.2em] font-bold transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                ) : (
                    <>
                        {/* PASO 1 — Datos básicos: scroll libre */}
                        {step === 1 && (
                            <div className="flex-1 overflow-y-auto p-4 space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                        Título de la misión *
                                    </label>
                                    <input
                                        value={fields.title}
                                        onChange={e => setField('title', e.target.value)}
                                        placeholder="Ej: Invertir una lista enlazada"
                                        maxLength={100}
                                        className="w-full h-11 px-3 text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-emerald-500/50"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                        Descripción *
                                    </label>
                                    <textarea
                                        value={fields.description}
                                        onChange={e => setField('description', e.target.value)}
                                        placeholder="Describe el reto, qué debe resolver el usuario, ejemplos de entrada/salida..."
                                        rows={4}
                                        maxLength={1000}
                                        className="w-full p-3 text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none resize-none focus:border-emerald-500/50"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                        Instrucciones detalladas <span className="font-normal normal-case">(opcional)</span>
                                    </label>
                                    <textarea
                                        value={fields.instructions}
                                        onChange={e => setField('instructions', e.target.value)}
                                        placeholder="Explicación paso a paso, restricciones, ejemplos detallados, casos límite..."
                                        rows={4}
                                        maxLength={3000}
                                        className="w-full p-3 text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none resize-none focus:border-emerald-500/50"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                        Output esperado <span className="font-normal normal-case">(opcional)</span>
                                    </label>
                                    <textarea
                                        value={fields.expectedOutput}
                                        onChange={e => setField('expectedOutput', e.target.value)}
                                        placeholder={'Salida que debería imprimir el programa.\nEj: [1, 2, 3]\n>> true'}
                                        rows={3}
                                        maxLength={1000}
                                        className="w-full p-3 text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none resize-none focus:border-emerald-500/50 font-mono"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                            Lenguaje
                                        </label>
                                        <select
                                            value={fields.language}
                                            onChange={e => setField('language', e.target.value)}
                                            className="w-full h-11 px-3 text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none appearance-none rounded-none"
                                        >
                                            <option value="javascript">JavaScript</option>
                                            <option value="python">Python</option>
                                            <option value="typescript">TypeScript</option>
                                            <option value="java">Java</option>
                                            <option value="go">Go</option>
                                            <option value="csharp">C#</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                            Dificultad
                                        </label>
                                        <select
                                            value={fields.difficulty}
                                            onChange={e => setField('difficulty', e.target.value as typeof fields.difficulty)}
                                            className="w-full h-11 px-3 text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none appearance-none rounded-none"
                                        >
                                            <option value="Fácil">Fácil</option>
                                            <option value="Intermedio">Intermedio</option>
                                            <option value="Difícil">Difícil</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PASO 2 — Código inicial */}
                        {step === 2 && (
                            <div className="flex-1 min-h-0 flex flex-col">
                                <div className="px-4 py-3 bg-slate-50 dark:bg-[#0a0b0e] border-b border-slate-200 dark:border-white/[0.06] shrink-0">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-0.5">
                                        Código inicial
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Opcional. El código que verá el usuario al empezar el reto.
                                    </p>
                                </div>
                                <div className="flex-1 min-h-0">
                                    <MonacoEditorMobile
                                        code={fields.initialCode}
                                        language={fields.language}
                                        onChange={val => setField('initialCode', val || '')}
                                        editable={true}
                                        theme={isDark}
                                    />
                                </div>
                                <KeyboardAccessoryBar onInsert={char => setField('initialCode', fields.initialCode + char)} />
                            </div>
                        )}

                        {/* PASO 3 — Solución */}
                        {step === 3 && (
                            <div className="flex-1 min-h-0 flex flex-col">
                                <div className="px-4 py-3 bg-slate-50 dark:bg-[#0a0b0e] border-b border-slate-200 dark:border-white/[0.06] shrink-0">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-0.5">
                                        Solución completa
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Escribe una solución correcta que pase todos los tests.
                                    </p>
                                </div>
                                <div className="flex-1 min-h-0">
                                    <MonacoEditorMobile
                                        code={fields.solutionCode}
                                        language={fields.language}
                                        onChange={val => setField('solutionCode', val || '')}
                                        editable={true}
                                        theme={isDark}
                                    />
                                </div>
                                <KeyboardAccessoryBar onInsert={char => setField('solutionCode', fields.solutionCode + char)} />
                            </div>
                        )}

                        {/* PASO 4 — Tests */}
                        {step === 4 && (
                            <div className="flex-1 min-h-0 flex flex-col">
                                <div className="px-4 py-3 bg-slate-50 dark:bg-[#0a0b0e] border-b border-slate-200 dark:border-white/[0.06] shrink-0 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-0.5">
                                            Tests de validación
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Los tests que debe pasar la solución del usuario.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowTestHelp(true)}
                                        className="h-9 px-3 text-xs font-semibold border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
                                    >
                                        ¿Cómo?
                                    </button>
                                </div>
                                <div className="flex-1 min-h-0">
                                    <MonacoEditorMobile
                                        code={fields.validationCode}
                                        language={fields.language}
                                        onChange={val => setField('validationCode', val || '')}
                                        editable={true}
                                        theme={isDark}
                                    />
                                </div>
                                <KeyboardAccessoryBar onInsert={char => setField('validationCode', fields.validationCode + char)} />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Footer navegación */}
            {!submitted && (
                <div className="shrink-0 p-4 border-t border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0a0b0e] flex gap-3">
                    {step > 1 && (
                        <button
                            onClick={handleBack}
                            className="flex-1 h-12 border border-slate-200 dark:border-emerald-500/15 text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase tracking-[0.15em] font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                            ← Atrás
                        </button>
                    )}

                    {step < TOTAL_STEPS ? (
                        <button
                            onClick={handleNext}
                            disabled={step === 1 && !canAdvanceStep1}
                            style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                            className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[10px] uppercase tracking-[0.15em] font-bold transition-colors disabled:opacity-40 disabled:pointer-events-none"
                        >
                            Siguiente →
                        </button>
                    ) : (
                        <button
                            onClick={handleFinish}
                            disabled={!canSubmit || isSubmitting}
                            style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                            className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[10px] uppercase tracking-[0.15em] font-bold transition-colors disabled:opacity-40 disabled:pointer-events-none"
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar propuesta'}
                        </button>
                    )}
                </div>
            )}
        </div>

        {showTestHelp && (
            <TestHelpModal
                onClose={() => setShowTestHelp(false)}
                initialLanguage={fields.language}
            />
        )}
        </>
    );
};
