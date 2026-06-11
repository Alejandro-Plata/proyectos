import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ThreadCategory } from '../types/types';
import { forumService } from '../services/forumService';
import { CATEGORY_TO_POST_TYPE } from '../config/postTypeMap';
import { useRichEditor } from './useRichEditor';
import { useAchievements } from '../../../context/AchievementContext';
import { useDraft, clearDraft } from '../../../hooks/useDraft';

export const useCreatePost = () => {
    const [selectedCategory, setSelectedCategory] = useState<ThreadCategory | null>(null);
    const [title, setTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { encolarLogros } = useAchievements();

    const editor = useRichEditor();

    useDraft('create-post-title', title, setTitle);
    useDraft<ThreadCategory | null>('create-post-category', selectedCategory, setSelectedCategory);

    const canPublish = title.trim().length > 0 && selectedCategory !== null && editor.hasContent;

    const handlePublish = async () => {
        if (!canPublish || !selectedCategory) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const contentParts = editor.toContentParts();
            const result = await forumService.createPost({
                title: title.trim(),
                content: contentParts,
                post_type: CATEGORY_TO_POST_TYPE[selectedCategory],
            });
            if (result?.unlockedAchievements?.length > 0) {
                encolarLogros(result.unlockedAchievements);
            }
            clearDraft('create-post-title');
            clearDraft('create-post-category');
            navigate(-1);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al publicar');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        selectedCategory, setSelectedCategory,
        title, setTitle,
        editor,
        isSubmitting,
        error,
        canPublish,
        handlePublish,
    };
};
