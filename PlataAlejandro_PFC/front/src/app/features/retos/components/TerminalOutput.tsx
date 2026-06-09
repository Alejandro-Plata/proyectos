import type { ConsoleLog, TestRunResult } from '../types/types';
import { Icons } from '../../../components/Icons';

interface TerminalOutputProps {
    logs: ConsoleLog[];
    testResults?: TestRunResult[];
    isRunning: boolean;
    onClear: () => void;
    isDark: boolean;
    onBack?: () => void;
}

export const TerminalOutput = ({
    logs,
    testResults,
    isRunning,
    onClear,
    isDark,
    onBack,
}: TerminalOutputProps) => {
    const passed = testResults?.filter(r => r.passed).length ?? 0;
    const total = testResults?.length ?? 0;
    const allPassed = total > 0 && passed === total;

    return (
        <div
            className="flex flex-col h-full border-t flex-shrink-0 bg-white border-emerald-500/15 dark:bg-[#050505] dark:border-emerald-500/10"
            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-9 border-b flex-shrink-0 bg-slate-100 border-emerald-500/15 dark:bg-[#0a0b0e] dark:border-emerald-500/10">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 hover:text-emerald-500 transition-colors"
                            title="Volver al editor"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Código
                        </button>
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 flex items-center gap-2">
                        {Icons.terminal} Terminal
                        {isRunning && (
                            <span className="flex items-center gap-1.5">
                                <div className="w-3 h-3 border border-t-emerald-500 border-slate-600 animate-spin" />
                                <span className="text-emerald-500">Ejecutando...</span>
                            </span>
                        )}
                    </span>
                </div>
                <button
                    onClick={onClear}
                    className="text-slate-500 hover:text-emerald-500 transition-colors"
                    title="Limpiar terminal"
                >
                    {Icons.refresh}
                </button>
            </div>

            {/* Output */}
            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs custom-scrollbar space-y-1">
                {logs.length === 0 && !isRunning ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40 select-none">
                        <p className="text-slate-800 dark:text-slate-300">· Esperando ejecución...</p>
                    </div>
                ) : (
                    <>
                        {testResults && testResults.length > 0 && (
                            <div className="space-y-1 mb-2">
                                {testResults.map((result, i) => (
                                    <div key={i} className="space-y-0.5">
                                        <div className={`flex items-center gap-2 ${result.passed ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            <span className="shrink-0">{result.passed ? '✓' : '✗'}</span>
                                            <span>{result.name}</span>
                                        </div>
                                        {!result.passed && result.error && (
                                            <div className="pl-5 text-[10px] text-rose-600/70 dark:text-rose-400/70">
                                                └─ {result.error}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className={`mt-1 pt-1 border-t text-[10px] font-bold border-emerald-500/15 dark:border-emerald-500/10 ${allPassed ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    ── Resultado: {passed}/{total} tests pasados ──
                                </div>
                            </div>
                        )}

                        {logs.map((log, i) => (
                            <div
                                key={i}
                                className={`flex gap-2 animate-in fade-in slide-in-from-left-1 duration-200
                                    ${log.type === 'error' ? 'text-rose-500'
                                    : log.type === 'success' ? 'text-emerald-500'
                                    : isDark ? 'text-slate-300' : 'text-slate-700'}`}
                            >
                                <span className="opacity-30 select-none flex-shrink-0">&gt;</span>
                                <span className="whitespace-pre-wrap break-all">{log.message}</span>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};
