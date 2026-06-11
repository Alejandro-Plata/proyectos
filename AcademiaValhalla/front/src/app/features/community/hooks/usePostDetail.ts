import { useState, useEffect, useMemo } from 'react';
import type { Thread, ForumComment } from '../types/types';
import { forumService } from '../services/forumService';
import { transformPost, transformComments } from '../utils/transformThread';
import type { LogroDesbloqueado } from '../../../hooks/useDesbloqueoLogro';
import type { XPRewardResponse } from '../../../services/xpService';
import { useAchievements } from '../../../context/AchievementContext';

export const usePostDetail = (postId: string) => {
    const { encolarLogros } = useAchievements();
    const [thread, setThread] = useState<Thread | null>(null);
    const [comments, setComments] = useState<ForumComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
    const [localLikes, setLocalLikes] = useState(0);

    const loadPost = (cancelled: { current: boolean }) => {
        setIsLoading(true);
        forumService.getPost(postId)
            .then(data => {
                if (!cancelled.current) {
                    const t = transformPost(data);
                    setThread(t);
                    setLocalLikes(t.likes);
                    setComments(transformComments(data.comentarios ?? data.user_comments ?? []));
                }
            })
            .catch(err => {
                if (!cancelled.current) setError(err.message);
            })
            .finally(() => {
                if (!cancelled.current) setIsLoading(false);
            });
    };

    useEffect(() => {
        const cancelled = { current: false };
        loadPost(cancelled);
        return () => { cancelled.current = true; };
    }, [postId]);

    const sortedComments = useMemo(() => {
        return [...comments].sort((a, b) => {
            if (a.isOfficialSolution) return -1;
            if (b.isOfficialSolution) return 1;
            return b.likes - a.likes;
        });
    }, [comments]);

    const handleVote = async (type: 'up' | 'down') => {
        const voteValue = type === 'up' ? 1 : -1;
        const prevVote = userVote;
        let delta: number;
        let newVote: 'up' | 'down' | null;

        if (userVote === type) {
            newVote = null;
            delta = -voteValue;
        } else {
            delta = userVote ? voteValue * 2 : voteValue;
            newVote = type;
        }

        // Optimistic update
        setUserVote(newVote);
        setLocalLikes(prev => prev + delta);

        try {
            await forumService.votePost(postId, newVote === null ? 0 : voteValue as 1 | -1);
        } catch {
            // Revert on error
            setUserVote(prevVote);
            setLocalLikes(prev => prev - delta);
        }
    };

    const addComment = async (content: string, parentId?: string | null) => {
        const result = await forumService.createComment(postId, {
            content,
            parent_user_comment_id: parentId || null,
        });
        if (result?.unlockedAchievements?.length > 0) {
            encolarLogros(result.unlockedAchievements);
        }
        // Reload to get fresh comments from server
        const data = await forumService.getPost(postId);
        setComments(transformComments(data.comentarios ?? data.user_comments ?? []));
    };

    const toggleSolution = async (commentId: string): Promise<{
        xpRewardForAuthor: XPRewardResponse | null;
        unlockedAchievements: LogroDesbloqueado[];
    }> => {
        try {
            const result = await forumService.markCommentAsSolution(postId, commentId);
            setComments(prev => prev.map(c => ({
                ...c,
                isOfficialSolution: c.id === commentId ? true : false,
            })));
            return {
                xpRewardForAuthor: result.xpRewardForAuthor ?? null,
                unlockedAchievements: result.unlockedAchievements ?? [],
            };
        } catch {
            return { xpRewardForAuthor: null, unlockedAchievements: [] };
        }
    };

    const deletePost = async () => {
        await forumService.deletePost(postId);
    };

    const deleteComment = async (commentId: string) => {
        await forumService.deleteComment(postId, commentId);
        setComments(prev => {
            const removeById = (list: ForumComment[]): ForumComment[] =>
                list.filter(c => c.id !== commentId).map(c => ({
                    ...c,
                    replies: removeById(c.replies ?? []),
                }));
            return removeById(prev);
        });
    };

    return {
        thread,
        comments: sortedComments,
        totalComments: comments.length,
        isLoading,
        error,
        userVote,
        localLikes,
        handleVote,
        addComment,
        toggleSolution,
        deletePost,
        deleteComment,
    };
};
