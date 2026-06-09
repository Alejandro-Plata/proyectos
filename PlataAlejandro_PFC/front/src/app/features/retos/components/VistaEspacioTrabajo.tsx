import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icons } from '../../../components/Icons';
import { RunButton } from '../../../components/RunButton';
import { MonacoEditorMobile } from '../../../components/MonacoEditor/MonacoEditorMobile';
import { ChatAsistente } from '../../asistente/components/ChatAsistente';
import { ProposeMissionModal } from './ProposeMissionModal';
import { ProposeMissionMobile } from './ProposeMissionMobile';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useTheme } from '../../../hooks/useTheme';
import type { Reto as Challenge, VarianteReto as ChallengeVariant, LogConsola } from '../types/types';

type ConsoleState = 'collapsed' | 'half' | 'full';

const CONSOLE_HEIGHT: Record<ConsoleState, string> = {
    collapsed: 'h-12',
    half: 'h-[45dvh]',
    full: 'h-[80dvh]',
};

const CONSOLE_FAB_OFFSET: Record<ConsoleState, string> = {
    collapsed: 'calc(3rem + 16px)',
    half: 'calc(45dvh + 16px)',
    full: 'calc(80dvh + 16px)',
};

const CONSOLE_NEXT: Record<ConsoleState, ConsoleState> = {
    collapsed: 'half',
    half: 'full',
    full: 'collapsed',
};

const CONSOLE_ICON: Record<ConsoleState, string> = {
    collapsed: '▲',
    half: '▲▲',
    full: '▼',
};

interface PropsVistaEspacioTrabajo {
    activeChallenge: Challenge;
    activeVariant: ChallengeVariant;
    code: string;
    consoleOutput: LogConsola[];
    isRunning: boolean;
    isSolved: boolean;
    activeTab: 'mission' | 'code' | 'solution';
    isConsoleOpen: boolean;
    showFreya: boolean;
    showPropose: boolean;
    onBack: () => void;
    onVariantChange: (variant: ChallengeVariant) => void;
    onCodeChange: (val: string) => void;
    onRun: () => void;
    onTabChange: (tab: 'mission' | 'code' | 'solution') => void;
    onToggleConsole: () => void;
    onToggleFreya: () => void;
    onOpenPropose: () => void;
    onClosePropose: () => void;
}

export const VistaEspacioTrabajo = ({
    activeChallenge,
    activeVariant,
    code,
    consoleOutput,
    isRunning,
    isSolved,
    activeTab,
    showFreya,
    showPropose,
    onBack,
    onVariantChange,
    onCodeChange,
    onRun,
    onTabChange,
    onToggleFreya,
    onClosePropose,
}: PropsVistaEspacioTrabajo) => {
    const isMobile = useIsMobile();
    const { isDarkMode: isDark } = useTheme();
    const [consoleState, setConsoleState] = useState<ConsoleState>('collapsed');
    const cycleConsole = () => setConsoleState(s => CONSOLE_NEXT[s]);

    // Auto-expand de la terminal cuando empieza la ejecución
    useEffect(() => {
        if (isRunning) setConsoleState('half');
    }, [isRunning]);

    const tabBtnClass = () =>
        `flex-1 flex flex-col items-center justify-center gap-1.5 relative group active:bg-white/5 transition-colors`;

    const tabIconClass = (active: boolean) =>
        `w-5 h-5 transition-colors ${active ? 'text-emerald-400' : 'text-slate-500'}`;

    const tabLabelClass = (active: boolean) =>
        `font-mono text-[9px] uppercase tracking-[0.15em] transition-colors ${
            active
                ? isDark ? 'text-white' : 'text-slate-900'
                : 'text-slate-500'
        }`;

    return createPortal(
        <div className={`fixed inset-0 z-[200] flex flex-col font-sans h-[100dvh] ${isDark ? 'bg-[#050505] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>

            {/* Header */}
            <header
                className={`shrink-0 h-16 flex items-center px-4 border-b relative z-50 ${isDark ? 'border-emerald-500/10 bg-[#0a0b0e]' : 'border-slate-200 bg-white'}`}
                style={{ boxShadow: 'inset 0 -1px 0 rgba(16,185,129,0.15)' }}
            >
                <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
                    <button
                        onClick={onBack}
                        className={`shrink-0 w-10 h-10 flex items-center justify-center border transition-colors
                            ${isDark
                                ? 'bg-white/5 text-slate-300 active:bg-white/10 border-emerald-500/10'
                                : 'bg-slate-100 text-slate-600 active:bg-slate-200 border-slate-200'
                            }`}
                    >
                        <div className="w-5 h-5">{Icons.arrowLeft}</div>
                    </button>

                    <div className="flex flex-col overflow-hidden min-w-0">
                        <span className={`font-mono text-sm uppercase tracking-[0.1em] truncate leading-tight block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {activeChallenge.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                            {activeChallenge.variants.length > 1 ? (
                                <div className="relative inline-flex items-center">
                                    <select
                                        value={activeVariant.language}
                                        onChange={e => {
                                            const v = activeChallenge.variants.find(v => v.language === e.target.value);
                                            if (v) onVariantChange(v);
                                        }}
                                        className="appearance-none font-mono text-[10px] text-emerald-500 font-bold uppercase bg-transparent border-none outline-none pr-4 cursor-pointer"
                                    >
                                        {activeChallenge.variants.map(v => (
                                            <option key={v.language} value={v.language} className={isDark ? 'bg-[#0a0b0e] text-emerald-500' : 'bg-white text-emerald-600'}>
                                                {v.language.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-0 pointer-events-none text-emerald-500/60">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            ) : (
                                <span className="font-mono text-[10px] text-emerald-500 font-bold uppercase">
                                    {activeVariant.language}
                                </span>
                            )}
                            <span className={`w-0.5 h-2 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`} />
                            <span className="font-mono text-[10px] text-amber-500 font-bold uppercase tracking-[0.15em]">
                                {activeChallenge.difficulty}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={`flex-1 relative w-full overflow-hidden ${isDark ? 'bg-[#050505]' : 'bg-slate-50'}`}>

                {/* Tab: Misión */}
                {activeTab === 'mission' && (
                    <div className="absolute inset-0 overflow-y-auto p-5 pb-24">
                        <div style={{ background: 'linear-gradient(to bottom, transparent, rgba(16,185,129,0.25), transparent)', padding: '1px' }}>
                            <div className={`p-6 border border-emerald-500/15 ${isDark ? 'bg-[#0f1115]' : 'bg-white'}`}>
                                <div className="mb-4">
                                    <h2 className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Misión</h2>
                                </div>
                                <p className={`text-sm leading-7 mb-6 whitespace-pre-line ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    {activeChallenge.description}
                                </p>

                                {activeChallenge.example_output && (
                                    <div className="mb-6 space-y-2">
                                        <span className={`font-mono text-[10px] uppercase tracking-[0.25em] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            Output esperado
                                        </span>
                                        <div className={`p-3 border font-mono text-xs relative overflow-hidden ${isDark ? 'bg-[#050505] border-emerald-500/10 text-slate-300' : 'bg-white border-emerald-500/15 text-slate-700'}`}>
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500" />
                                            <pre className="whitespace-pre-wrap pl-2">{activeChallenge.example_output}</pre>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => onTabChange('code')}
                                    style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                                    className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.2em] font-bold transition-colors"
                                >
                                    Resolver misión →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Solución */}
                {activeTab === 'solution' && (
                    <div className="absolute inset-0 flex flex-col">
                        {!isSolved ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60">
                                <div className={`p-4 mb-4 ${isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                                    {Icons.lock}
                                </div>
                                <h3 className={`font-mono text-sm uppercase tracking-[0.15em] mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    No disponible
                                </h3>
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 max-w-xs leading-relaxed">
                                    Completa la misión para desbloquear la solución
                                </p>
                                <button
                                    onClick={() => onTabChange('code')}
                                    style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                                    className="mt-6 px-6 h-9 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-mono text-[10px] uppercase tracking-[0.2em] font-bold transition-colors border border-emerald-500/20"
                                >
                                    Ir al editor
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={`shrink-0 px-4 py-2.5 border-b flex items-center justify-between ${isDark ? 'bg-[#0a0b0e] border-emerald-500/10' : 'bg-slate-100 border-slate-200'}`}>
                                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-500 flex items-center gap-2">
                                        {Icons.check} Solución de referencia
                                    </span>
                                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-400">Read Only</span>
                                </div>
                                <div className="flex-1 relative min-h-0">
                                    <MonacoEditorMobile
                                        code={activeVariant.solution_code ?? '// Solución no disponible'}
                                        language={activeVariant.language}
                                        theme={isDark}
                                        editable={false}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Tab: Código */}
                <div className={`absolute inset-0 flex flex-col ${activeTab === 'code' ? 'visible opacity-100' : 'invisible opacity-0'}`}>

                    {/* Editor */}
                    <div className={`flex-1 relative min-h-0 ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                        <div className="absolute inset-0">
                            <MonacoEditorMobile
                                code={code}
                                language={activeVariant.language}
                                onChange={val => onCodeChange(val || '')}
                                theme={isDark}
                                editable={true}
                            />
                        </div>
                    </div>

                    {/* Terminal — 3 estados */}
                    <div className={`shrink-0 border-t flex flex-col transition-all duration-300 ease-in-out relative z-40
                        ${isDark ? 'bg-[#0f1115] border-emerald-500/10' : 'bg-slate-100 border-slate-200'}
                        ${CONSOLE_HEIGHT[consoleState]}`}>

                        <div className={`h-12 shrink-0 flex items-center justify-between px-4 border-b ${isDark ? 'bg-[#16181d] border-emerald-500/10' : 'bg-slate-200 border-slate-300'}`}>
                            <button
                                onClick={cycleConsole}
                                className="flex-1 flex items-center gap-3 h-full text-left"
                                aria-label={`Consola — ${consoleState === 'collapsed' ? 'Abrir mitad' : consoleState === 'half' ? 'Expandir' : 'Cerrar'}`}
                            >
                                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
                                    {Icons.terminal} Terminal
                                    {isRunning && (
                                        <span className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 border border-t-emerald-500 border-slate-600 animate-spin" />
                                            <span className="text-emerald-500 text-[9px]">Ejecutando...</span>
                                        </span>
                                    )}
                                </span>
                                <span className="font-mono text-[9px] text-emerald-500/60 tracking-widest">
                                    {CONSOLE_ICON[consoleState]}
                                </span>
                            </button>
                            <div className="w-24 shrink-0 pl-2">
                                <RunButton
                                    isRunning={isRunning}
                                    onClick={onRun}
                                    label="RUN"
                                    loadingLabel="..."
                                    className="!h-8 text-[10px] w-full"
                                />
                            </div>
                        </div>

                        {consoleState !== 'collapsed' && (
                            <div className={`flex-1 p-3 font-mono text-[11px] overflow-y-auto ${isDark ? 'bg-[#0a0b0e]' : 'bg-slate-50'}`}>
                                {consoleOutput.length === 0 ? (
                                    <span className="text-slate-600">· Esperando ejecución...</span>
                                ) : (
                                    consoleOutput.map((log, i) => (
                                        <div key={i} className={`mb-1.5 ${log.type === 'success' ? 'text-emerald-400' : log.type === 'error' ? 'text-rose-400' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <span className="opacity-50 mr-2 select-none">$</span>
                                            <span className="whitespace-pre-wrap">{log.message}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* FAB Freya — visible en código y misión */}
                {activeTab !== 'solution' && (
                    <button
                        onClick={onToggleFreya}
                        aria-label="Abrir asistente Freya"
                        className={`absolute z-[90] w-12 h-12 flex items-center justify-center shadow-xl transition-all border right-4
                            ${showFreya
                                ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20'
                                : isDark
                                    ? 'bg-[#16181d]/90 backdrop-blur-md text-slate-300 border-emerald-500/10 hover:bg-[#1e2128]/90'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                        style={{ bottom: activeTab === 'code' ? CONSOLE_FAB_OFFSET[consoleState] : '80px' }}
                    >
                        <span className="w-5 h-5">{Icons.assistant}</span>
                    </button>
                )}
            </main>

            {/* Footer Tabs */}
            <div className={`shrink-0 h-16 border-t flex pb-safe z-50 ${isDark ? 'bg-[#0a0b0e] border-emerald-500/10' : 'bg-white border-slate-200'}`}>
                <button onClick={() => onTabChange('mission')} className={tabBtnClass()}>
                    {activeTab === 'mission' && (
                        <div className="absolute top-0 w-12 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                    )}
                    <div className={tabIconClass(activeTab === 'mission')}>{Icons.document}</div>
                    <span className={tabLabelClass(activeTab === 'mission')}>Misión</span>
                </button>

                <div className={`w-px h-8 self-center ${isDark ? 'bg-emerald-500/10' : 'bg-slate-200'}`} />

                <button onClick={() => onTabChange('code')} className={tabBtnClass()}>
                    {activeTab === 'code' && (
                        <div className="absolute top-0 w-12 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                    )}
                    <div className={tabIconClass(activeTab === 'code')}>{Icons.code}</div>
                    <span className={tabLabelClass(activeTab === 'code')}>Código</span>
                </button>

                <div className={`w-px h-8 self-center ${isDark ? 'bg-emerald-500/10' : 'bg-slate-200'}`} />

                <button onClick={() => onTabChange('solution')} className={tabBtnClass()}>
                    {activeTab === 'solution' && (
                        <div className="absolute top-0 w-12 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                    )}
                    <div className={tabIconClass(activeTab === 'solution')}>{Icons.key}</div>
                    <span className={tabLabelClass(activeTab === 'solution')}>Solución</span>
                </button>
            </div>

            {/* Freya bottom-sheet */}
            {showFreya && (
                <div className="fixed inset-0 z-[300] flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onToggleFreya} />
                    <div className={`relative h-[85dvh] overflow-hidden border-t shadow-2xl ${isDark ? 'bg-[#0a0b0e] border-emerald-500/15' : 'bg-white border-slate-200'}`}>
                        <div
                            className="w-full flex justify-center pt-3 pb-1 absolute top-0 z-10 pointer-events-none"
                            style={{ background: isDark ? 'linear-gradient(to bottom, rgba(10,11,14,1), transparent)' : 'linear-gradient(to bottom, rgba(255,255,255,1), transparent)' }}
                        >
                            <div className={`w-12 h-1.5 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                        </div>
                        <ChatAsistente
                            context={{
                                source: 'challenges',
                                currentTopic: activeChallenge.title,
                                language: activeVariant.language,
                                currentCode: code,
                            }}
                        />
                    </div>
                </div>
            )}

            {isMobile
                ? <ProposeMissionMobile isOpen={showPropose} onClose={onClosePropose} />
                : <ProposeMissionModal isOpen={showPropose} onClose={onClosePropose} />
            }
        </div>,
        document.body
    );
};
