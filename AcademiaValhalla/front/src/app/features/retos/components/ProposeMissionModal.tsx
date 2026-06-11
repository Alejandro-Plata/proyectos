import { useState } from 'react';
import { Icons } from '../../../components/Icons';
import { MonacoEditorDesktop } from '../../../components/MonacoEditor/MonacoEditorDesktop';
import { useProposeMission } from '../hooks/useProposeMission';
import { TestHelpModal } from './TestHelpModal';

interface ProposeMissionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EDITOR_OPTIONS = {
    minimap: { enabled: false },
    lineNumbers: 'on' as const,
    fontSize: 13,
    padding: { top: 12 },
    scrollBeyondLastLine: false,
    fixedOverflowWidgets: true,
};

export const ProposeMissionModal = ({ isOpen, onClose }: ProposeMissionModalProps) => {
    const { fields, setField, isSubmitting, submitted, canSubmit, handleSubmit, reset } = useProposeMission();
    const [showTestHelp, setShowTestHelp] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        reset();
        onClose();
    };

    const inputClass = 'bg-slate-50 dark:bg-[#16181d] border-emerald-500/20 dark:border-emerald-500/20 text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-emerald-500/50';

    const labelClass = 'block font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 mb-2';

    return (
        <>
        <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center md:p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

            <div className="relative w-full md:max-w-xl shadow-2xl border
                h-full md:h-auto md:max-h-[80vh] overflow-y-auto flex flex-col
                bg-white border-emerald-500/15 text-slate-900 dark:bg-[#0f1115] dark:border-emerald-500/10 dark:text-white"
                style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)' }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-4 md:px-6 md:py-5 border-b border-emerald-500/15 dark:border-emerald-500/10 shrink-0">
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <div className="md:hidden w-5 h-5">{Icons.back}</div>
                        <div className="hidden md:block">{Icons.close}</div>
                    </button>
                    <h2 className="font-mono text-sm uppercase tracking-[0.15em]">Proponer Misión</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 md:pt-4">

                {submitted ? (
                    <div className="text-center py-8 space-y-3">
                        <div className="text-emerald-500 w-12 h-12 mx-auto">{Icons.check}</div>
                        <p className="font-mono text-sm uppercase tracking-[0.15em]">¡Propuesta enviada!</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Un administrador revisará tu propuesta.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <label className={labelClass}>Título de la misión</label>
                            <input
                                value={fields.title}
                                onChange={e => setField('title', e.target.value)}
                                placeholder="Ej: Invertir una lista enlazada"
                                maxLength={100}
                                className={`w-full p-3 text-sm border outline-none transition-colors ${inputClass}`}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className={labelClass}>Descripción</label>
                            <textarea
                                value={fields.description}
                                onChange={e => setField('description', e.target.value)}
                                placeholder="Describe el reto, qué debe resolver el usuario, ejemplos de entrada/salida..."
                                rows={4}
                                maxLength={1000}
                                className={`w-full p-3 text-sm border outline-none resize-none transition-colors ${inputClass}`}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className={labelClass}>Instrucciones detalladas <span className="text-slate-400 dark:text-slate-600 normal-case tracking-normal">(opcional)</span></label>
                            <textarea
                                value={fields.instructions}
                                onChange={e => setField('instructions', e.target.value)}
                                placeholder="Explicación paso a paso, restricciones, ejemplos detallados, casos límite a tener en cuenta..."
                                rows={4}
                                maxLength={3000}
                                className={`w-full p-3 text-sm border outline-none resize-none transition-colors ${inputClass}`}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className={labelClass}>Output esperado <span className="text-slate-400 dark:text-slate-600 normal-case tracking-normal">(opcional)</span></label>
                            <textarea
                                value={fields.expectedOutput}
                                onChange={e => setField('expectedOutput', e.target.value)}
                                placeholder={'Salida que debería imprimir el programa para el ejemplo.\nEj: [1, 2, 3]\n>> true'}
                                rows={3}
                                maxLength={1000}
                                className={`w-full p-3 text-sm border outline-none resize-none transition-colors font-mono ${inputClass}`}
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-1 relative">
                                <label className={labelClass}>Lenguaje</label>
                                <select
                                    value={fields.language}
                                    onChange={e => setField('language', e.target.value)}
                                    className={`w-full p-2.5 font-mono text-xs border outline-none cursor-pointer transition-colors appearance-none pr-8 ${inputClass}`}
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="typescript">TypeScript</option>
                                    <option value="java">Java</option>
                                    <option value="go">Go</option>
                                    <option value="csharp">C#</option>
                                </select>
                                <div className="absolute right-3 top-[32px] pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            <div className="flex-1 space-y-1 relative">
                                <label className={labelClass}>Dificultad</label>
                                <select
                                    value={fields.difficulty}
                                    onChange={e => setField('difficulty', e.target.value as typeof fields.difficulty)}
                                    className={`w-full p-2.5 font-mono text-xs border outline-none cursor-pointer transition-colors appearance-none pr-8 ${inputClass}`}
                                >
                                    <option value="Fácil">Fácil</option>
                                    <option value="Intermedio">Intermedio</option>
                                    <option value="Difícil">Difícil</option>
                                </select>
                                <div className="absolute right-3 top-[32px] pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className={labelClass}>Código inicial (opcional)</label>
                            <div className="overflow-hidden border border-emerald-500/15 dark:border-emerald-500/10 bg-[#1e1e1e]">
                                <div className="h-32">
                                    <MonacoEditorDesktop
                                        code={fields.initialCode}
                                        language={fields.language}
                                        onChange={val => setField('initialCode', val || '')}
                                        editable={true}
                                        theme={true}
                                        options={EDITOR_OPTIONS}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className={labelClass}>Solución</label>
                            <div className="overflow-hidden border border-emerald-500/15 dark:border-emerald-500/10 bg-[#1e1e1e]">
                                <div className="h-48">
                                    <MonacoEditorDesktop
                                        code={fields.solutionCode}
                                        language={fields.language}
                                        onChange={val => setField('solutionCode', val || '')}
                                        editable={true}
                                        theme={true}
                                        options={EDITOR_OPTIONS}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between mb-2">
                                <label className={`${labelClass} mb-0`}>Tests de validación</label>
                                <button
                                    type="button"
                                    onClick={() => setShowTestHelp(true)}
                                    className="flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] border border-emerald-500/20 text-slate-500 dark:text-slate-400 hover:border-emerald-500/50 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                                >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
                                    </svg>
                                    ¿Cómo escribir tests?
                                </button>
                            </div>
                            <div className="overflow-hidden border border-emerald-500/15 dark:border-emerald-500/10 bg-[#1e1e1e]">
                                <div className="h-48">
                                    <MonacoEditorDesktop
                                        code={fields.validationCode}
                                        language={fields.language}
                                        onChange={val => setField('validationCode', val || '')}
                                        editable={true}
                                        theme={true}
                                        options={EDITOR_OPTIONS}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* BB-6 Primary button */}
                        <button
                            onClick={handleSubmit}
                            disabled={!canSubmit || isSubmitting}
                            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                            className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors"
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar Propuesta'}
                        </button>
                    </div>
                )}
                </div>
            </div>
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
