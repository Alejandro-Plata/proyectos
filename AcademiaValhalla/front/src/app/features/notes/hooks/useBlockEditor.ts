import { useState } from 'react';
import type { Block, BlockType } from '../types/types';
import { generateId } from '../utils';

interface UseBlockEditorOptions {
    initialBlock?: Block | null;
}

interface UseBlockEditorReturn {
    activeTab: BlockType;
    setActiveTab: (tab: BlockType) => void;
    content: string;
    setContent: (content: string) => void;
    extra: { title: string; language: string };
    setExtra: (extra: { title: string; language: string }) => void;
    createBlock: () => Block;
    resetForm: () => void;
}

export const useBlockEditor = ({ initialBlock }: UseBlockEditorOptions = {}): UseBlockEditorReturn => {
    const [activeTab, setActiveTab] = useState<BlockType>(initialBlock?.type || 'text');
    const [content, setContent] = useState(initialBlock?.value || '');
    const [extra, setExtra] = useState({
        title: initialBlock?.title || '',
        language: initialBlock?.language || 'javascript'
    });

    const createBlock = (): Block => ({
        id: initialBlock?.id || generateId(),
        type: activeTab,
        value: content,
        title: activeTab === 'definition' ? extra.title : undefined,
        language: activeTab === 'code' ? extra.language : undefined
    });

    const resetForm = () => {
        setContent('');
        setExtra({ title: '', language: 'javascript' });
    };

    return {
        activeTab,
        setActiveTab,
        content,
        setContent,
        extra,
        setExtra,
        createBlock,
        resetForm
    };
};
