import { useState } from "react";
import { Icons } from "../Icons";
import { MonacoEditorMobile } from "../MonacoEditor/MonacoEditorMobile"; 
import type { CodeBlockProps } from "../types/types";

export const CodeBlockMobile = ({ code, language = 'javascript' }: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);

    // Calcula altura aproximada de cada línea de código: 18px por línea + padding extra
    const lineCount = code.split('\n').length;
    const height = Math.min(Math.max(lineCount * 18 + 20, 80), 400);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-4 overflow-hidden border border-emerald-500/15 dark:border-emerald-500/10 bg-[#0a0b0e]" style={{ clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)' }}>

            {/* Header */}
            <div className="flex justify-between items-center px-3 py-2 bg-emerald-500/[0.03] border-b border-emerald-500/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {language}
                </span>

                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 p-1 transition-colors"
                >
                    {copied ? (
                        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                            <div className="w-3 h-3">{Icons.check}</div> Copiado
                        </span>
                    ) : (
                        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-500/40 hover:text-emerald-500 transition-colors">
                            Copiar
                        </span>
                    )}
                </button>
            </div>

            <div style={{ height: `${height}px` }} className="relative w-full overflow-hidden">
                <MonacoEditorMobile
                    code={code}
                    language={language}
                    editable={false}
                    showCopyButton={false}
                />
            </div>
        </div>
    );
};

