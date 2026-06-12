import { INLINE_MARKER_REGEX } from './markerGrammar';

interface TextNode {
    type: 'text';
    text: string;
    marks?: { type: string; attrs?: Record<string, any> }[];
}

interface BlockNode {
    type: 'paragraph' | 'heading';
    attrs?: { level: number };
    content?: TextNode[];
}

interface JSONDoc {
    type: 'doc';
    content: BlockNode[];
}

const parseInline = (text: string): TextNode[] => {
    if (!text) return [];

    const parts = text.split(INLINE_MARKER_REGEX);
    const nodes: TextNode[] = [];

    for (const part of parts) {
        if (!part) continue;

        // **negrita**
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            nodes.push({ type: 'text', text: part.slice(2, -2), marks: [{ type: 'bold' }] });
        }
        // __código inline__
        else if (part.startsWith('__') && part.endsWith('__') && part.length > 4) {
            nodes.push({ type: 'text', text: part.slice(2, -2), marks: [{ type: 'code' }] });
        }
        // `código inline`
        else if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
            nodes.push({ type: 'text', text: part.slice(1, -1), marks: [{ type: 'code' }] });
        }
        // *'término técnico'*  — debe ir antes que *cursiva*
        else if (part.startsWith("*'") && part.endsWith("'*") && part.length > 4) {
            nodes.push({ type: 'text', text: part.slice(2, -2), marks: [{ type: 'techTerm' }] });
        }
        // *cursiva*
        else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
            nodes.push({ type: 'text', text: part.slice(1, -1), marks: [{ type: 'italic' }] });
        }
        // !!advertencia!!
        else if (part.startsWith('!!') && part.endsWith('!!') && part.length > 4) {
            nodes.push({ type: 'text', text: part.slice(2, -2), marks: [{ type: 'warning' }] });
        }
        // 'literal'
        else if (part.startsWith("'") && part.endsWith("'") && part.length > 2) {
            nodes.push({ type: 'text', text: part.slice(1, -1), marks: [{ type: 'literal' }] });
        }
        // https?:// enlace
        else if (/^https?:\/\//.test(part)) {
            nodes.push({
                type: 'text',
                text: part,
                marks: [{ type: 'link', attrs: { href: part, target: '_blank', rel: 'noopener noreferrer', class: null } }],
            });
        }
        // texto plano (incluye saltos \n dentro de un párrafo — poco habitual pero posible)
        else {
            nodes.push({ type: 'text', text: part });
        }
    }

    return nodes;
};

export const markerParser = (text: string): JSONDoc => {
    if (!text?.trim()) {
        return { type: 'doc', content: [{ type: 'paragraph' }] };
    }

    const lines = text.split('\n');
    const blocks: BlockNode[] = [];

    for (const line of lines) {
        const headingMatch = line.match(/^(#{1,3}) (.+)/);
        if (headingMatch) {
            const level = headingMatch[1].length as 1 | 2 | 3;
            const content = parseInline(headingMatch[2]);
            blocks.push({ type: 'heading', attrs: { level }, content });
        } else {
            const content = parseInline(line);
            blocks.push({ type: 'paragraph', content: content.length > 0 ? content : undefined });
        }
    }

    if (blocks.length === 0) {
        blocks.push({ type: 'paragraph' });
    }

    return { type: 'doc', content: blocks };
};
