import { Icons } from '../../../components/Icons';
import { MonacoEditorDesktop } from '../../../components/MonacoEditor/MonacoEditorDesktop';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import type { editor } from 'monaco-editor';
import type { VarianteReto as ChallengeVariant } from '../types/types';

const readOnlyOptions: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbers: 'off',
    glyphMargin: false,
    folding: true,
    lineDecorationsWidth: 10,
    wordWrap: 'on',
    padding: { top: 16, bottom: 16 },
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    fontLigatures: true,
    renderLineHighlight: 'none',
    readOnly: true,
    domReadOnly: true,
    contextmenu: false,
    quickSuggestions: false,
    scrollbar: {
        vertical: 'visible',
        horizontal: 'auto',
        useShadows: false,
        verticalScrollbarSize: 10,
    },
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    automaticLayout: true,
};

interface ChallengeSolutionPanelProps {
    isDark: boolean;
    isSolved: boolean;
    challengeId: string;
    activeVariant: ChallengeVariant;
}

export const PanelSolucionReto = ({ isDark, isSolved, challengeId, activeVariant }: ChallengeSolutionPanelProps) => {
    const ext = SUPPORTED_LANGUAGES[activeVariant.language]?.extension ?? 'txt';

    if (!isSolved) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60">
                <div className="p-4 mb-4 bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500">
                    {Icons.lock}
                </div>
                <h3 className="font-mono text-sm uppercase tracking-[0.15em] mb-2 text-slate-800 dark:text-white">
                    No disponible
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">
                    Completa la misión para desbloquear
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col">
            <div className="px-4 py-3 border-b flex justify-between items-center
                bg-slate-50 border-emerald-500/15 dark:bg-[#16181d] dark:border-emerald-500/10">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-500 flex items-center gap-2">
                    {Icons.check} SOLUCION_REF.{ext.toUpperCase()}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-400">Read Only</span>
            </div>
            <div className="flex-1 relative">
                <MonacoEditorDesktop
                    key={`solution-${challengeId}-${activeVariant.language}`}
                    code={activeVariant.solution_code ?? '// Solución no disponible'}
                    language={activeVariant.language}
                    theme={isDark}
                    options={readOnlyOptions}
                    editable={false}
                />
            </div>
        </div>
    );
};
