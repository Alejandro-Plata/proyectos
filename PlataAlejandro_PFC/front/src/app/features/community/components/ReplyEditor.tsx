import { useState } from "react";
import { Icons } from "../../../components/Icons";
import type { ReplyEditorProps } from "../types/types";

export const ReplyEditor = ({ placeholder, autoFocus, onCancel, compact = false, onSubmit }: ReplyEditorProps) => {
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!text.trim()) return;
        if (onSubmit) {
            setIsSubmitting(true);
            try {
                await onSubmit(text.trim());
                setText('');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setText('');
            if (onCancel) onCancel();
        }
    };

    return (
        <div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2 select-none pointer-events-none">
                <span className="inline-block w-0.5 h-3 bg-emerald-500 shrink-0" />
                {compact ? 'Respuesta' : 'Comentario'}
            </div>
            <div className={`relative border transition-colors ${compact ? 'bg-slate-50 dark:bg-[#0f1115] border-emerald-500/15 dark:border-emerald-500/10' : 'bg-white dark:bg-[#0a0b0e] border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5'} focus-within:border-emerald-500/40`}>
            <textarea
                autoFocus={autoFocus}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder}
                disabled={isSubmitting}
                className="w-full bg-transparent border-none outline-none px-3 pt-3 pb-3 text-sm min-h-[100px] text-slate-900 dark:text-white placeholder:text-slate-400 resize-y disabled:opacity-60"
            />
            <div className={`flex items-center justify-between px-3 py-2 border-t ${compact ? 'border-emerald-500/10 dark:border-emerald-500/[0.07]' : 'border-emerald-500/10 dark:border-emerald-500/[0.07]'}`}>
                <div className="flex gap-1 text-slate-400">
                    {[Icons.bold, Icons.italic, Icons.code, Icons.image].map((icon, i) => (
                        <button key={i} className="p-1.5 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-500/[0.05] transition-colors">
                            <div className="w-4 h-4">{icon}</div>
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 hover:text-slate-800 dark:hover:text-white px-3 py-1.5 transition-colors"
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={!text.trim() || isSubmitting}
                        style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                        className="px-4 h-8 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? '...' : 'Responder'}
                    </button>
                </div>
            </div>
            </div>
        </div>
    );
};
