import { useState, useRef, useCallback } from 'react';
import type { ContentPart } from '../types/types';

export type EditorBlockType = 'text' | 'code' | 'definition' | 'image';

export interface EditorBlock {
    id: string;
    type: EditorBlockType;
    value: string;
    language?: string;
    title?: string;
}

export const useRichEditor = (initialContent = '') => {
    const [blocks, setBlocks] = useState<EditorBlock[]>([
        { id: crypto.randomUUID(), type: 'text', value: initialContent },
    ]);
    const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

    const registerRef = useCallback((id: string, el: HTMLTextAreaElement | null) => {
        textareaRefs.current[id] = el;
    }, []);

    const insertMarkdown = useCallback((blockId: string, prefix: string, suffix: string = prefix) => {
        const textarea = textareaRefs.current[blockId];
        if (!textarea) return;
        const { selectionStart, selectionEnd, value } = textarea;
        const selected = value.substring(selectionStart, selectionEnd);
        const before = value.substring(0, selectionStart);
        const after = value.substring(selectionEnd);
        const newValue = `${before}${prefix}${selected || 'texto'}${suffix}${after}`;
        setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, value: newValue } : b));
        requestAnimationFrame(() => {
            textarea.focus();
            const cursorEnd = selectionStart + prefix.length + (selected || 'texto').length;
            textarea.setSelectionRange(
                selectionStart + prefix.length,
                selected ? selectionEnd + prefix.length : cursorEnd,
            );
        });
    }, []);

    const toolbarActions = useCallback((blockId: string) => ({
        bold:   () => insertMarkdown(blockId, '**'),
        italic: () => insertMarkdown(blockId, '_'),
        code:   () => insertMarkdown(blockId, '`'),
        link:   () => insertMarkdown(blockId, '[', '](url)'),
        list:   () => insertMarkdown(blockId, '\n- ', ''),
        image:  () => insertMarkdown(blockId, '![alt](', ')'),
    }), [insertMarkdown]);

    const addBlock = useCallback((type: EditorBlockType, afterBlockId?: string) => {
        const newBlock: EditorBlock = {
            id: crypto.randomUUID(),
            type,
            value: '',
            ...(type === 'code' ? { language: 'javascript' } : {}),
            ...(type === 'definition' ? { title: 'Concepto clave' } : {}),
        };
        setBlocks(prev => {
            if (!afterBlockId) {
                // Add at end; if last block is text and new is code, insert text after too
                const arr = [...prev, newBlock];
                if (type === 'code') arr.push({ id: crypto.randomUUID(), type: 'text', value: '' });
                return arr;
            }
            const idx = prev.findIndex(b => b.id === afterBlockId);
            const result = [...prev];
            result.splice(idx + 1, 0, newBlock);
            if (type === 'code') result.splice(idx + 2, 0, { id: crypto.randomUUID(), type: 'text', value: '' });
            return result;
        });
    }, []);

    // Kept for backward compat
    const addCodeBlock = useCallback((afterBlockId: string) => addBlock('code', afterBlockId), [addBlock]);

    const updateBlock = useCallback((blockId: string, value: string) => {
        setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, value } : b));
    }, []);

    const updateBlockTitle = useCallback((blockId: string, title: string) => {
        setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, title } : b));
    }, []);

    const updateLanguage = useCallback((blockId: string, language: string) => {
        setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, language } : b));
    }, []);

    const removeBlock = useCallback((blockId: string) => {
        setBlocks(prev => {
            if (prev.length === 1) return [{ id: crypto.randomUUID(), type: 'text' as const, value: '' }];
            const idx = prev.findIndex(b => b.id === blockId);
            if (idx === -1) return prev;
            const result = [...prev];
            const removed = result[idx];
            result.splice(idx, 1);
            // Merge adjacent text blocks when a non-text block is removed
            if (removed.type !== 'text' && idx > 0 && idx < result.length
                && result[idx - 1].type === 'text' && result[idx]?.type === 'text') {
                const sep = result[idx - 1].value && result[idx].value ? '\n' : '';
                result[idx - 1] = { ...result[idx - 1], value: result[idx - 1].value + sep + result[idx].value };
                result.splice(idx, 1);
            }
            return result.length === 0
                ? [{ id: crypto.randomUUID(), type: 'text' as const, value: '' }]
                : result;
        });
    }, []);

    const removeCodeBlock = removeBlock;

    const toContentParts = useCallback((): ContentPart[] => {
        return blocks
            .filter(b => b.value.trim().length > 0 || (b.type === 'definition' && b.title?.trim()))
            .map(b => ({
                type: b.type,
                value: b.value,
                ...(b.type === 'code' && b.language ? { language: b.language } : {}),
                ...(b.type === 'definition' && b.title ? { title: b.title } : {}),
            }));
    }, [blocks]);

    const hasContent = blocks.some(b => b.value.trim().length > 0);
    const plainContent = blocks.map(b => b.value).join('\n');

    return {
        blocks,
        registerRef,
        toolbarActions,
        addBlock,
        addCodeBlock,
        updateBlock,
        updateBlockTitle,
        updateLanguage,
        removeBlock,
        removeCodeBlock,
        toContentParts,
        hasContent,
        plainContent,
    };
};
