import { useCallback } from 'react';

export type FormatAction =
    | 'bold' | 'italic' | 'code'
    | 'warning' | 'techTerm' | 'literal' | 'link'
    | 'h1' | 'h2' | 'h3';

interface FormatConfig {
    prefix: string;
    suffix: string;
    placeholder: string;
    isLine?: boolean;
}

const FORMAT_MAP: Record<FormatAction, FormatConfig> = {
    bold:     { prefix: '**',  suffix: '**',  placeholder: 'texto en negrita' },
    italic:   { prefix: '*',   suffix: '*',   placeholder: 'texto en cursiva' },
    code:     { prefix: '`',   suffix: '`',   placeholder: 'código' },
    warning:  { prefix: '!!',  suffix: '!!',  placeholder: 'advertencia' },
    techTerm: { prefix: "*'",  suffix: "'*",  placeholder: 'NombreDelError' },
    literal:  { prefix: "'",   suffix: "'",   placeholder: 'valor literal' },
    link:     { prefix: '',    suffix: '',     placeholder: 'https://ejemplo.com' },
    h1:       { prefix: '# ',  suffix: '',     placeholder: 'Encabezado principal', isLine: true },
    h2:       { prefix: '## ', suffix: '',     placeholder: 'Sección',              isLine: true },
    h3:       { prefix: '### ',suffix: '',     placeholder: 'Subsección',            isLine: true },
};

interface UseNoteFormatToolbarOptions {
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    value: string;
    onChange: (newValue: string) => void;
}

export const useNoteFormatToolbar = ({ textareaRef, value, onChange }: UseNoteFormatToolbarOptions) => {

    const applyFormat = useCallback((action: FormatAction) => {
        const ta = textareaRef.current;
        if (!ta) return;

        const { selectionStart: start, selectionEnd: end } = ta;
        const selectedText = value.substring(start, end);
        const config = FORMAT_MAP[action];

        if (config.isLine) {
            // Headings: operate at line level
            const lineStart = value.lastIndexOf('\n', start - 1) + 1;
            const lineEnd = value.indexOf('\n', end);
            const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;

            const beforeLine = value.substring(0, lineStart);
            const currentLine = value.substring(lineStart, actualLineEnd);
            const afterLine = value.substring(actualLineEnd);

            // Remove existing heading prefix if present
            const cleanLine = currentLine.replace(/^#{1,6}\s/, '');
            const text = cleanLine || config.placeholder;
            const newLine = config.prefix + text;
            const newValue = beforeLine + newLine + afterLine;
            onChange(newValue);

            const newCursor = beforeLine.length + newLine.length;
            requestAnimationFrame(() => {
                ta.focus();
                ta.setSelectionRange(newCursor, newCursor);
            });
            return;
        }

        if (action === 'link') {
            const url = selectedText.trim() || config.placeholder;
            const insertion = url.startsWith('https://') || url.startsWith('http://')
                ? url
                : `https://${url === config.placeholder ? config.placeholder : url}`;
            const before = value.substring(0, start);
            const after = value.substring(end);
            onChange(before + insertion + after);
            const newCursor = start + insertion.length;
            requestAnimationFrame(() => {
                ta.focus();
                ta.setSelectionRange(newCursor, newCursor);
            });
            return;
        }

        const text = selectedText || config.placeholder;
        const insertion = config.prefix + text + config.suffix;
        const before = value.substring(0, start);
        const after = value.substring(end);
        onChange(before + insertion + after);

        requestAnimationFrame(() => {
            ta.focus();
            if (selectedText) {
                const cursorPos = start + insertion.length;
                ta.setSelectionRange(cursorPos, cursorPos);
            } else {
                // Select placeholder so user can type over it
                const selectStart = start + config.prefix.length;
                const selectEnd = selectStart + config.placeholder.length;
                ta.setSelectionRange(selectStart, selectEnd);
            }
        });
    }, [textareaRef, value, onChange]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!e.ctrlKey && !e.metaKey) return;

        // Ctrl+Shift combos
        if (e.shiftKey) {
            const shiftMap: Record<string, FormatAction> = {
                w: 'warning',
                t: 'techTerm',
                l: 'literal',
            };
            const action = shiftMap[e.key.toLowerCase()];
            if (action) { e.preventDefault(); applyFormat(action); }
            return;
        }

        // Headings: Ctrl+1 / Ctrl+2 / Ctrl+3
        if (e.key === '1') { e.preventDefault(); applyFormat('h1'); return; }
        if (e.key === '2') { e.preventDefault(); applyFormat('h2'); return; }
        if (e.key === '3') { e.preventDefault(); applyFormat('h3'); return; }

        // Common inline formats
        const keyMap: Record<string, FormatAction> = {
            b: 'bold',
            i: 'italic',
            '`': 'code',
            k: 'link',
        };
        const action = keyMap[e.key.toLowerCase()];
        if (action) { e.preventDefault(); applyFormat(action); }
    }, [applyFormat]);

    return { applyFormat, handleKeyDown };
};
