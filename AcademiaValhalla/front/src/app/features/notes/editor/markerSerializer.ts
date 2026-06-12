interface JSONMark { type: string; attrs?: Record<string, any> }
interface JSONNode { type: string; text?: string; marks?: JSONMark[]; content?: JSONNode[]; attrs?: Record<string, any> }

const applyMark = (mark: JSONMark, text: string): string => {
    switch (mark.type) {
        case 'bold':     return `**${text}**`;
        case 'italic':   return `*${text}*`;
        case 'code':     return `\`${text}\``;
        case 'warning':  return `!!${text}!!`;
        case 'techTerm': return `*'${text}'*`;
        case 'literal':  return `'${text}'`;
        case 'link':     return mark.attrs?.href ?? text;
        default:         return text;
    }
};

const serializeInline = (nodes: JSONNode[] | undefined): string =>
    (nodes ?? []).map(node => {
        if (node.type === 'hardBreak') return '\n';
        if (node.type !== 'text' || node.text == null) return '';

        const text = node.text;
        if (!node.marks || node.marks.length === 0) return text;

        // Apply marks from the outermost inward (last mark wins if nested, but our grammar doesn't nest)
        return node.marks.reduce((acc, mark) => applyMark(mark, acc), text);
    }).join('');

export const markerSerializer = (doc: JSONNode): string => {
    const lines: string[] = (doc.content ?? []).map(block => {
        if (block.type === 'heading') {
            const level = block.attrs?.level ?? 1;
            const prefix = '#'.repeat(level) + ' ';
            return prefix + serializeInline(block.content);
        }
        // paragraph (y cualquier otro bloque desconocido — passthrough)
        return serializeInline(block.content);
    });

    // Eliminar párrafos vacíos del final que Tiptap añade automáticamente
    while (lines.length > 1 && lines[lines.length - 1] === '') {
        lines.pop();
    }

    return lines.join('\n');
};
