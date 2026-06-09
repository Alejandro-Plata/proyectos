import { useEffect, useRef } from 'react';
import { MonacoEditorDesktop } from '../../../components/MonacoEditor/MonacoEditorDesktop';
import { TerminalOutput } from './TerminalOutput';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import type { editor } from 'monaco-editor';
import type { VarianteReto as ChallengeVariant } from '../types/types';
import type { LogConsola } from '../types/types';

const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbers: 'on',
    glyphMargin: false,
    folding: true,
    lineDecorationsWidth: 10,
    wordWrap: 'on',
    padding: { top: 16, bottom: 16 },
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    fontLigatures: true,
    renderLineHighlight: 'line',
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

interface ChallengeEditorPanelProps {
    isDark: boolean;
    challengeId: string;
    activeVariant: ChallengeVariant;
    code: string;
    consoleOutput: LogConsola[];
    isRunning: boolean;
    onCodeChange: (val: string) => void;
    onClearConsole: () => void;
}

export const PanelEditorReto = ({
    isDark,
    challengeId,
    activeVariant,
    code,
    consoleOutput,
    isRunning,
    onCodeChange,
    onClearConsole,
}: ChallengeEditorPanelProps) => {
    const ext = SUPPORTED_LANGUAGES[activeVariant.language]?.extension ?? 'txt';
    const terminalRef = useRef<HTMLDivElement>(null);

    // Hacer scroll al inicio de la terminal al empezar ejecución
    useEffect(() => {
        if (isRunning && terminalRef.current) {
            terminalRef.current.scrollTop = 0;
        }
    }, [isRunning]);

    return (
        <div className="flex flex-col h-full relative transition-colors overflow-hidden w-7/12
            bg-slate-50 dark:bg-[#08090b]">

            {/* Editor — ocupa todo el espacio disponible */}
            <div className="flex flex-col flex-1 min-h-0">
                <div className="flex items-center h-9 border-b px-4 select-none flex-shrink-0
                    bg-slate-100 border-emerald-500/15 dark:bg-[#0a0b0e] dark:border-emerald-500/10">
                    <div className="flex items-center gap-2 px-3 py-1 border-t border-x relative top-[1px] font-mono text-[10px]
                        bg-white border-emerald-500/15 text-slate-700 dark:bg-[#16181d] dark:border-emerald-500/10 dark:text-slate-300">
                        <div className="w-1.5 h-1.5 bg-emerald-500" />
                        <span>main.{ext}</span>
                    </div>
                </div>

                <div className="flex-1 relative w-full min-h-0">
                    <MonacoEditorDesktop
                        key={`main-${challengeId}-${activeVariant.language}`}
                        code={code}
                        language={activeVariant.language}
                        onChange={(val: string | undefined) => onCodeChange(val || '')}
                        options={editorOptions}
                        theme={isDark}
                        editable={true}
                    />
                </div>
            </div>

            {/* Terminal — siempre visible debajo del editor */}
            <div className="h-52 flex-shrink-0" ref={terminalRef}>
                <TerminalOutput
                    logs={consoleOutput}
                    isRunning={isRunning}
                    onClear={onClearConsole}
                    isDark={isDark}
                />
            </div>
        </div>
    );
};
