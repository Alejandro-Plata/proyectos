import { Icons } from '../../../components/Icons';
import { RunButton } from '../../../components/RunButton';
import { DifficultyDots } from './DifficultyDots';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import type { Reto as Challenge, VarianteReto as ChallengeVariant } from '../types/types';

interface ChallengeHeaderProps {
    isDark: boolean;
    activeChallenge: Challenge | null;
    activeVariant: ChallengeVariant | null;
    showFreya: boolean;
    isRunning: boolean;
    sidebarCollapsed: boolean;
    onToggleSidebar: () => void;
    onVariantChange: (variant: ChallengeVariant) => void;
    onToggleFreya: () => void;
    onOpenPropose: () => void;
    onRun: () => void;
    onDeleteChallenge?: () => void;
}

export const EncabezadoReto = ({
    isDark,
    activeChallenge,
    activeVariant,
    showFreya,
    isRunning,
    sidebarCollapsed,
    onToggleSidebar,
    onVariantChange,
    onToggleFreya,
    onOpenPropose,
    onRun,
    onDeleteChallenge,
}: ChallengeHeaderProps) => (
    <header className="h-16 flex items-center justify-between px-6 border-b shrink-0 z-20 backdrop-blur-md transition-colors
        bg-white/80 border-emerald-500/15 dark:bg-[#0a0b0e]/80 dark:border-emerald-500/10 relative gap-4"
        style={{ boxShadow: 'inset 0 -1px 0 rgba(16,185,129,0.15)' }}>

        {/* =========================================
            LADO IZQUIERDO: Contexto y Metadatos
        ========================================= */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
                onClick={onToggleSidebar}
                title={sidebarCollapsed ? 'Mostrar lista' : 'Ocultar lista'}
                className="w-8 h-8 flex items-center justify-center shrink-0 transition-colors
                    hover:bg-slate-100 text-slate-500 dark:hover:bg-white/10 dark:text-slate-400"
            >
                <div className="w-5 h-5">
                    {Icons.list}
                </div>
            </button>

            <div className="flex items-center gap-3 min-w-0 border-l border-emerald-500/15 dark:border-emerald-500/10 pl-4">
                <h1 className="font-mono text-sm uppercase tracking-[0.15em] truncate text-slate-800 dark:text-white">
                    {activeChallenge?.title ?? 'Selecciona una misión'}
                </h1>
                {activeChallenge && <DifficultyDots level={activeChallenge.difficulty} isDark={isDark} compact />}

                {activeChallenge && (
                    <button
                        onClick={onOpenPropose}
                        title="Proponer una nueva misión"
                        className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:text-slate-500 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 shrink-0 transition-colors"
                    >
                        <span className="w-4 h-4 flex items-center justify-center">{Icons.plus}</span>
                    </button>
                )}
            </div>
        </div>

        {/* =========================================
            CENTRO: Entorno de Ejecución (Lenguaje)
        ========================================= */}
        <div className="hidden md:flex shrink-0 items-center justify-center">
            {activeChallenge && activeChallenge.variants.length > 1 && (
                <div className="relative inline-flex items-center group">
                    <select
                        value={activeVariant?.language ?? ''}
                        onChange={e => {
                            const variant = activeChallenge.variants.find(v => v.language === e.target.value);
                            if (variant) onVariantChange(variant);
                        }}
                        className="appearance-none pl-4 pr-9 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.15em] border outline-none cursor-pointer transition-all
                            bg-slate-50 border-emerald-500/20 text-slate-600 hover:border-emerald-500/50 hover:text-emerald-600
                            dark:bg-[#16181d] dark:border-emerald-500/20 dark:text-slate-300 dark:hover:border-emerald-500/50 dark:hover:text-emerald-400"
                    >
                        {activeChallenge.variants.map(v => (
                            <option
                                key={v.language}
                                value={v.language}
                                className="bg-white text-slate-800 dark:bg-[#16181d] dark:text-slate-300"
                            >
                                {SUPPORTED_LANGUAGES[v.language]?.label ?? v.language}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 pointer-events-none text-slate-400 group-hover:text-emerald-500 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            )}

            {activeChallenge && activeChallenge.variants.length === 1 && (
                <span className="px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.15em] border
                    bg-slate-50 border-emerald-500/20 text-emerald-600
                    dark:bg-[#16181d] dark:border-emerald-500/20 dark:text-emerald-400">
                    {SUPPORTED_LANGUAGES[activeVariant?.language ?? '']?.label ?? activeVariant?.language}
                </span>
            )}
        </div>

        {/* =========================================
            LADO DERECHO: Acciones e IA
        ========================================= */}
        <div className="flex items-center justify-end gap-3 flex-1 shrink-0 min-w-0">

            {onDeleteChallenge && activeChallenge && (
                <button
                    onClick={onDeleteChallenge}
                    title="Eliminar misión"
                    className="flex items-center gap-1.5 h-8 px-3 font-mono text-[10px] uppercase tracking-[0.15em] font-bold border border-transparent hover:border-rose-500/30 text-slate-400 hover:text-rose-500 hover:bg-rose-500/[0.06] transition-colors shrink-0"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                </button>
            )}

            <div className="relative group shrink-0">
                <button
                    onClick={onToggleFreya}
                    title="Pedir ayuda o diagnosticar con Freya"
                    className={`
                        flex items-center justify-center transition-all duration-300 overflow-hidden
                        h-8 px-2 border font-mono font-bold uppercase tracking-[0.15em]
                        ${showFreya
                            ? 'bg-[#16181d] border-emerald-500 text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]'
                            : 'bg-slate-100 border-emerald-500/20 text-slate-500 hover:bg-slate-200 dark:bg-[#16181d] dark:border-emerald-500/10 dark:text-slate-400 dark:hover:border-emerald-500/30'
                        }`}
                >
                    <span className="w-4 h-4 flex items-center justify-center shrink-0">
                        {Icons.assistant}
                    </span>

                    <span
                        className={`text-[9px] leading-none overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out flex items-center
                        ${showFreya
                            ? 'max-w-[50px] ml-1.5 opacity-100'
                            : 'max-w-0 ml-0 opacity-0 group-hover:max-w-[50px] group-hover:ml-1.5 group-hover:opacity-100'
                        }`}
                    >
                        FREYA
                    </span>
                </button>
            </div>

            <div className="w-px h-6 bg-emerald-500/15 dark:bg-emerald-500/10 shrink-0" />

            <div className="shrink-0">
                <RunButton
                    isRunning={isRunning}
                    onClick={onRun}
                    label="EJECUTAR"
                    loadingLabel="EJECUTANDO..."
                    disabled={!activeVariant}
                />
            </div>
        </div>
    </header>
);
