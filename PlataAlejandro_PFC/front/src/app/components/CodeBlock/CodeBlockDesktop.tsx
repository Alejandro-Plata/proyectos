import { useState } from "react";
import { Icons } from '../Icons';
import { MonacoEditorDesktop } from "../MonacoEditor/MonacoEditorDesktop";
import type { CodeBlockProps } from "../types/types";


export const CodeBlockDesktop = ({ code, language = 'javascript' }: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);

    // Calcula altura aproximada de cada línea de código: 20px por línea + padding extra
    const lineCount = code.split('\n').length;
    const height = Math.min(Math.max(lineCount * 20 + 20, 100), 500);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-4 overflow-hidden border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5 bg-[#0a0b0e]" style={{ clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)' }}>

            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 bg-emerald-500/[0.03] border-b border-emerald-500/10 select-none">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                    {language}
                </span>

                <button
                    onClick={handleCopy}
                    className={`
                        p-1.5 transition-colors duration-200 flex items-center gap-1.5
                        ${copied
                            ? 'text-emerald-500'
                            : 'text-emerald-500/40 hover:text-emerald-500'
                        }
                    `}
                    title={copied ? "Copiado!" : "Copiar código"}
                >
                    {copied ? (
                        <>
                            <div className="w-3.5 h-3.5">{Icons.check}</div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Copiado</span>
                        </>
                    ) : (
                        <div className="w-4 h-4">{Icons.clipboard}</div>
                    )}
                </button>
            </div>

            <div style={{ height: `${height}px` }} className="relative w-full">
                <MonacoEditorDesktop
                    code={code}
                    language={language}
                    editable={false}
                    theme={true} 
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        renderLineHighlight: 'none',
                        contextmenu: false,
                        folding: false,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13,
                        padding: { top: 16, bottom: 16 }
                    }}
                />
            </div>
        </div>
    );
};

