import { useState, useRef } from 'react';
import { NoteFormatToolbar } from './NoteFormatToolbar';
import { ShortcutsModal } from './ShortcutsModal';
import { useNoteFormatToolbar } from '../hooks/useNoteFormatToolbar';
import { renderContent } from '../utils/renderContent';

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const NoteTextBlock = ({ value, onChange, placeholder = 'Escribe aquí (soporta **negrita**, *cursiva*, `código`...)' }: Props) => {
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [showShortcuts, setShowShortcuts] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { applyFormat, handleKeyDown } = useNoteFormatToolbar({ textareaRef, value, onChange });

    return (
        <>
        <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1115] overflow-hidden transition-colors focus-within:border-emerald-500/50">

            {/* Toolbar row */}
            <div className="flex items-center justify-between px-2 py-1 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                {mode === 'edit' ? (
                    <div className="overflow-x-auto scrollbar-hide flex-1 min-w-0">
                        <NoteFormatToolbar onAction={applyFormat} onHelp={() => setShowShortcuts(true)} className="min-w-max" />
                    </div>
                ) : (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1.5">
                        Previsualización
                    </span>
                )}

                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setMode(m => m === 'edit' ? 'preview' : 'edit')}
                    className="
                        ml-2 shrink-0 px-2.5 py-1 rounded-md
                        text-[10px] font-bold uppercase tracking-wider
                        transition-colors border
                        text-slate-500 border-slate-200 hover:bg-slate-100
                        dark:text-slate-400 dark:border-white/10 dark:hover:bg-white/5
                    "
                >
                    {mode === 'edit' ? 'Vista previa' : 'Editar'}
                </button>
            </div>

            {/* Content area */}
            {mode === 'edit' ? (
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="
                        w-full p-4 outline-none resize-y min-h-[140px]
                        text-sm leading-7 font-mono
                        bg-transparent
                        text-slate-700 dark:text-slate-300
                        placeholder:text-slate-400 dark:placeholder:text-slate-700
                    "
                />
            ) : (
                <div className="p-4 min-h-[140px]">
                    {value.trim() ? (
                        <div className="text-slate-700 dark:text-slate-300 leading-loose text-sm">
                            {renderContent(value)}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm italic">Sin contenido aún.</p>
                    )}
                </div>
            )}
        </div>

        {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </>);
};
