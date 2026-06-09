import type { FormatAction } from '../hooks/useNoteFormatToolbar';
import { Icons } from '../../../components/Icons';

// Inline SVG for "literal string" — two blockquote marks
const LiteralIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
);

interface ToolbarButton {
    action: FormatAction;
    icon: React.ReactNode;
    label: string;
    shortcut?: string;
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
    { action: 'h1',       icon: <span className="text-[11px] font-black leading-none">H1</span>,  label: 'Encabezado 1',   shortcut: 'Ctrl+1' },
    { action: 'h2',       icon: <span className="text-[11px] font-bold leading-none">H2</span>,   label: 'Encabezado 2',   shortcut: 'Ctrl+2' },
    { action: 'h3',       icon: <span className="text-[11px] font-semibold leading-none">H3</span>, label: 'Encabezado 3', shortcut: 'Ctrl+3' },
    // separator at index 3
    { action: 'bold',     icon: Icons.bold,            label: 'Negrita',          shortcut: 'Ctrl+B' },
    { action: 'italic',   icon: Icons.italic,          label: 'Cursiva',          shortcut: 'Ctrl+I' },
    // separator at index 5
    { action: 'code',     icon: Icons.codeBlock,       label: 'Código inline',    shortcut: 'Ctrl+`' },
    { action: 'techTerm', icon: Icons.terminal,        label: 'Término técnico',  shortcut: 'Ctrl+⇧+T' },
    { action: 'warning',  icon: Icons.alertTriangle,   label: 'Advertencia',      shortcut: 'Ctrl+⇧+W' },
    { action: 'literal',  icon: <LiteralIcon />,       label: 'Valor literal',    shortcut: 'Ctrl+⇧+L' },
    // separator at index 9
    { action: 'link',     icon: Icons.link,            label: 'Enlace',           shortcut: 'Ctrl+K' },
];

const SEPARATORS_BEFORE = new Set([3, 5, 9]);

interface Props {
    onAction: (action: FormatAction) => void;
    onHelp?: () => void;
    className?: string;
}

export const NoteFormatToolbar = ({ onAction, onHelp, className = '' }: Props) => {
    return (
        <div className={`flex items-center gap-0 ${className}`}>
            {TOOLBAR_BUTTONS.map((btn, i) => (
                <span key={btn.action} className="contents">
                    {SEPARATORS_BEFORE.has(i) && (
                        <div className="w-px h-5 bg-slate-200 dark:bg-emerald-500/20 mx-0.5 shrink-0" />
                    )}
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onAction(btn.action);
                        }}
                        title={btn.shortcut ? `${btn.label}  (${btn.shortcut})` : btn.label}
                        className="w-11 h-11 transition-colors text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 flex items-center justify-center shrink-0 active:bg-emerald-500/[0.06]"
                    >
                        <span className="w-5 h-5 flex items-center justify-center">
                            {btn.icon}
                        </span>
                    </button>
                </span>
            ))}

            {onHelp && (
                <>
                    <div className="w-px h-5 bg-slate-200 dark:bg-emerald-500/20 mx-0.5 shrink-0" />
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={onHelp}
                        title="Atajos de teclado"
                        className="w-11 h-11 transition-colors text-slate-400 hover:text-emerald-500 dark:text-slate-500 dark:hover:text-emerald-400 flex items-center justify-center shrink-0 active:bg-emerald-500/[0.06]"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
};
