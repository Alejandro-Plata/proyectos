import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Block, BlockType } from '../types/types';
import { generateId } from '../utils';
import { notesService } from '../services/notesService';
import { useDraft, clearDraft } from '../../../hooks/useDraft';

export const useEditorNota = (noteId: string) => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [selectedDifficulty, setSelectedDifficulty] = useState('Básico');
    const [blocks, setBlocks] = useState<Block[]>([{ id: generateId(), type: 'text', value: '' }]);
    const [isSaving, setIsSaving] = useState(false);
    const [revisionPending, setRevisionPending] = useState(false);
    const [communityStatus, setCommunityStatus] = useState<string>('personal');

    // Borrador por nota
    useDraft<{ title: string; blocks: Block[] }>(
        `edit-note-${noteId}`,
        { title, blocks },
        (v) => { setTitle(v.title); setBlocks(v.blocks); }
    );

    useEffect(() => {
        notesService.getById(noteId).then(nota => {
            if (!nota) { navigate('/dashboard/notes'); return; }
            setTitle(nota.title);
            setSelectedTags(nota.tags ?? []);
            setSelectedLanguage(nota.language ?? 'javascript');
            setSelectedDifficulty(nota.difficulty ?? 'Básico');
            setCommunityStatus(nota.community_status ?? 'personal');
            setBlocks(
                (nota.content ?? []).map((b: any) => ({
                    id: generateId(),
                    type: b.type,
                    value: b.value,
                    title: b.title,
                    language: b.language,
                }))
            );
            setLoading(false);
        });
    }, [noteId]);

    const toggleTag = (tag: string) =>
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

    const addBlock = (type: BlockType) =>
        setBlocks(prev => [...prev, { id: generateId(), type, value: '', title: type === 'definition' ? 'Concepto Clave' : undefined, language: 'javascript' }]);

    const updateBlock = useCallback((id: string, field: keyof Block, content: any) =>
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: content } : b)), []);

    const removeBlock = (id: string) => {
        if (blocks.length === 1 && blocks[0].value === '') return;
        setBlocks(prev => prev.filter(b => b.id !== id));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const content = blocks.map(b => ({
                type: b.type, value: b.value,
                ...(b.title ? { title: b.title } : {}),
                ...(b.type === 'code' && b.language ? { language: b.language } : {}),
            }));
            const firstText = blocks.find(b => b.type === 'text' && b.value?.trim());
            const result = await notesService.update(noteId, {
                title,
                tags: selectedTags,
                language: selectedLanguage,
                difficulty: selectedDifficulty,
                content,
                summary: firstText?.value?.slice(0, 200) ?? '',
            });
            clearDraft(`edit-note-${noteId}`);
            if (result.revisionPending) {
                setRevisionPending(true);
            } else {
                navigate('/dashboard/notes', { state: { noteSaved: true } });
            }
        } catch {
            navigate('/dashboard/notes');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        loading,
        title, setTitle,
        selectedTags, setSelectedTags,
        selectedLanguage, setSelectedLanguage,
        selectedDifficulty, setSelectedDifficulty,
        blocks, setBlocks,
        isSaving,
        revisionPending, setRevisionPending,
        communityStatus,
        toggleTag, addBlock, updateBlock, removeBlock, handleSave,
    };
};
