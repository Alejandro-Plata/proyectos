import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Block, BlockType } from '../types/types';
import { generateId } from '../utils';
import { API_BASE, authHeaders } from '../../../services/apiClient';
import type { XPRewardResponse } from '../../../services/xpService';
import { useDraft, clearDraft } from '../../../hooks/useDraft';

export const useCreadorNota = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [selectedDifficulty, setSelectedDifficulty] = useState('Básico');
    const [blocks, setBlocks] = useState<Block[]>([
        { id: generateId(), type: 'text', value: '' }
    ]);

    useDraft<{ title: string; blocks: Block[] }>(
        'create-note',
        { title, blocks },
        (v) => { setTitle(v.title); setBlocks(v.blocks); }
    );

    const [isSaving, setIsSaving] = useState(false);
    const [shareToForum, setShareToForum] = useState(false);
    const [communityPending, setCommunityPending] = useState(false);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const addBlock = (type: BlockType) => {
        setBlocks(prev => [...prev, {
            id: generateId(),
            type,
            value: '',
            title: type === 'definition' ? 'Concepto Clave' : undefined,
            language: 'javascript'
        }]);
    };

    const updateBlock = useCallback((id: string, field: keyof Block, content: any) => {
        setBlocks(prevBlocks =>
            prevBlocks.map(b => b.id === id ? { ...b, [field]: content } : b)
        );
    }, []);

    const removeBlock = (id: string) => {
        if (blocks.length === 1 && blocks[0].value === '') return;
        setBlocks(prev => prev.filter(b => b.id !== id));
    };

    const handleSave = async (onXPReward?: (reward: XPRewardResponse, unlockedAchievements: any[]) => void) => {
        setIsSaving(true);
        try {
            const content = blocks.map(b => ({
                type: b.type,
                value: b.value,
                ...(b.title ? { title: b.title } : {}),
                ...(b.type === 'code' && b.language ? { language: b.language } : {}),
            }));

            const firstTextBlock = blocks.find(b => b.type === 'text' && b.value?.trim());

            const res = await fetch(`${API_BASE}/notes`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({
                    title,
                    tags: selectedTags,
                    language: selectedLanguage,
                    difficulty: selectedDifficulty,
                    content,
                    summary: firstTextBlock?.value?.slice(0, 200) ?? '',
                    share_to_community: shareToForum,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                clearDraft('create-note');
                if (data.communityPending) setCommunityPending(true);
                if (data.xpReward && onXPReward) {
                    onXPReward(data.xpReward, data.unlockedAchievements ?? []);
                } else if (!data.communityPending) {
                    navigate('/dashboard/notes', { state: { noteSaved: true } });
                }
            } else {
                navigate('/dashboard/notes');
            }
        } catch {
            navigate('/dashboard/notes');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        title, setTitle,
        selectedTags, setSelectedTags,
        selectedLanguage, setSelectedLanguage,
        selectedDifficulty, setSelectedDifficulty,
        blocks, setBlocks,
        isSaving,
        shareToForum, setShareToForum,
        communityPending, setCommunityPending,
        toggleTag,
        addBlock,
        updateBlock,
        removeBlock,
        handleSave
    };
};
