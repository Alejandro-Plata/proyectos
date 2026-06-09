import type { Message } from '../types/types';

interface PropsEntradaMensaje {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    replyTo?: Message | null;
    onCancelReply?: () => void;
    replyToUsername?: string;
}

export const EntradaMensaje = ({
    value, onChange, onSend, onKeyDown, replyTo, onCancelReply, replyToUsername,
}: PropsEntradaMensaje) => {
    const hasContent = value.trim().length > 0;

    return (
        <div className="border-t border-emerald-500/10 dark:border-emerald-500/8">

            {/* Preview de respuesta */}
            {replyTo && (
                <div className="flex items-start gap-2 px-4 pt-3 pb-0">
                    <div className="flex-1 border-l-2 border-emerald-500/50 pl-3 py-1 bg-emerald-500/[0.04]">
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">
                            Respondiendo a @{replyToUsername ?? 'usuario'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {replyTo.content}
                        </p>
                    </div>
                    {onCancelReply && (
                        <button
                            onClick={onCancelReply}
                            className="shrink-0 mt-1 text-slate-400 hover:text-emerald-500 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            )}

            <div className="flex items-center gap-2 px-4 py-3">
                {/* Textarea */}
                <div className="flex-1 relative flex items-center border border-emerald-500/20 dark:border-emerald-500/15 focus-within:border-emerald-500/50 dark:focus-within:border-emerald-500/40 transition-colors duration-150">
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="escribe un mensaje..."
                        rows={1}
                        className="
                            w-full resize-none px-3 py-1.5 text-sm outline-none leading-5
                            max-h-32 overflow-y-auto
                            bg-transparent
                            text-slate-900 dark:text-white
                            placeholder:text-slate-400/60 dark:placeholder:text-slate-600
                            placeholder:font-mono placeholder:text-xs
                        "
                    />
                    {/* Hint ⏎ */}
                    <span className="hidden sm:block absolute bottom-1.5 right-2 font-mono text-[9px] text-emerald-500/25 pointer-events-none select-none">
                        ⏎
                    </span>
                </div>

                {/* Botón enviar */}
                <button
                    onClick={onSend}
                    disabled={!hasContent}
                    className={`
                        shrink-0 w-9 h-9 flex items-center justify-center
                        transition-all duration-150
                        ${hasContent
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                            : 'bg-emerald-500/[0.08] text-emerald-500/30 cursor-not-allowed border border-emerald-500/15'
                        }
                    `}
                    aria-label="Enviar mensaje"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
