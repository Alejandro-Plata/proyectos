import type { ContentPart } from "../features/community";

export const parseContent = (content: string): ContentPart[] => {
    const regex = /```(\w+)?\s*([\s\S]*?)```/g;
    const parts: ContentPart[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            // TypeScript ahora sabe que "text" es válido para ContentPart
            parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
        }
        parts.push({ type: 'code', language: match[1] || 'javascript', value: match[2].trim() });
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < content.length) {
        parts.push({ type: 'text', value: content.slice(lastIndex) });
    }

    // Añadir la posibilidad de adjuntar imagen

    return parts;

};