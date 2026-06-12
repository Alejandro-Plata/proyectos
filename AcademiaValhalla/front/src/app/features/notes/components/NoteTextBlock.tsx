import { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor } from '@tiptap/react';
import { NoteFormatToolbar } from './NoteFormatToolbar';
import { ShortcutsModal } from './ShortcutsModal';
import type { FormatAction } from '../hooks/useNoteFormatToolbar';
import { getExtensions } from '../editor/extensions';
import { markerParser } from '../editor/markerParser';
import { markerSerializer } from '../editor/markerSerializer';
import { RichTextEditor } from '../editor/RichTextEditor';

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

// CSS para las comillas del mark "literal" (Tailwind no puede generar ::before/::after con content arbitrario)
const LITERAL_QUOTES_STYLE = `.ProseMirror [data-mark="literal"]::before,.ProseMirror [data-mark="literal"]::after{content:"'"}`;

export const NoteTextBlock = ({ value, onChange, placeholder = 'Escribe aquí…' }: Props) => {
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [, setTick] = useState(0); // fuerza re-render cuando cambia el estado del editor
    const lastSerializedRef = useRef<string>(value);

    const editor = useEditor({
        extensions: getExtensions(placeholder),
        content: markerParser(value),
        editorProps: {
            attributes: {
                class: [
                    'outline-none min-h-[140px] p-4',
                    'text-sm leading-7',
                    'text-slate-700 dark:text-slate-300',
                    '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:dark:text-slate-100 [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:border-b [&_h1]:border-slate-200 [&_h1]:dark:border-slate-700 [&_h1]:pb-1',
                    '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-800 [&_h2]:dark:text-slate-200 [&_h2]:mt-3 [&_h2]:mb-1',
                    '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:dark:text-slate-300 [&_h3]:mt-2 [&_h3]:mb-1',
                    '[&_strong]:font-semibold [&_strong]:text-slate-900 [&_strong]:dark:text-slate-100',
                    '[&_em]:italic [&_em]:text-slate-600 [&_em]:dark:text-slate-400 [&_em]:font-serif',
                    '[&_code]:font-mono [&_code]:text-emerald-800 [&_code]:dark:text-emerald-200 [&_code]:bg-emerald-50/80 [&_code]:dark:bg-emerald-900/20 [&_code]:border [&_code]:border-emerald-200/50 [&_code]:dark:border-emerald-800/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:mx-0.5 [&_code]:rounded [&_code]:text-[0.9em]',
                    '[&_a]:text-emerald-700 [&_a]:dark:text-emerald-400 [&_a]:underline [&_a]:underline-offset-4',
                    'focus:outline-none',
                ].join(' '),
            },
        },
        onUpdate: ({ editor }) => {
            const serialized = markerSerializer(editor.getJSON());
            lastSerializedRef.current = serialized;
            onChange(serialized);
        },
    });

    // Suscripción a transacciones para mantener el estado activo de la toolbar sincronizado
    useEffect(() => {
        if (!editor) return;
        const handler = () => setTick(t => t + 1);
        editor.on('transaction', handler);
        return () => { editor.off('transaction', handler); };
    }, [editor]);

    // Sincronización: si value cambia desde fuera (ej: useDraft restaura borrador)
    useEffect(() => {
        if (!editor || editor.isDestroyed) return;
        if (value === lastSerializedRef.current) return;
        lastSerializedRef.current = value;
        editor.commands.setContent(markerParser(value), { emitUpdate: false });
    }, [value, editor]);

    const applyFormat = useCallback((action: FormatAction) => {
        if (!editor) return;
        const chain = editor.chain().focus();

        switch (action) {
            case 'bold':     chain.toggleBold().run(); break;
            case 'italic':   chain.toggleItalic().run(); break;
            case 'code':     chain.toggleCode().run(); break;
            case 'warning':  chain.toggleMark('warning').run(); break;
            case 'techTerm': chain.toggleMark('techTerm').run(); break;
            case 'literal':  chain.toggleMark('literal').run(); break;
            case 'link': {
                const prev = editor.getAttributes('link').href ?? '';
                const url = window.prompt('URL:', prev);
                if (url === null) break;
                if (url === '') chain.unsetLink().run();
                else chain.setLink({ href: url.startsWith('http') ? url : `https://${url}` }).run();
                break;
            }
            case 'h1': chain.toggleHeading({ level: 1 }).run(); break;
            case 'h2': chain.toggleHeading({ level: 2 }).run(); break;
            case 'h3': chain.toggleHeading({ level: 3 }).run(); break;
        }
    }, [editor]);

    return (
        <>
            <style>{LITERAL_QUOTES_STYLE}</style>

            <div
                className="rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1115] overflow-hidden transition-colors focus-within:border-emerald-500/50"
                data-tour="create-toolbar"
            >
                {/* Toolbar */}
                <div className="flex items-center px-2 py-1 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                    <div className="overflow-x-auto scrollbar-hide flex-1 min-w-0">
                        <NoteFormatToolbar
                            onAction={applyFormat}
                            onHelp={() => setShowShortcuts(true)}
                            editor={editor}
                            className="min-w-max"
                        />
                    </div>
                </div>

                {/* Editor WYSIWYG */}
                <RichTextEditor editor={editor} />
            </div>

            {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
        </>
    );
};
