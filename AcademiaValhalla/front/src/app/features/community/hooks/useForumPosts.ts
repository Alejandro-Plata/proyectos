import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Thread, ThreadCategory } from '../types/types';
import { forumService } from '../services/forumService';
import { transformPost } from '../utils/transformThread';
import { CATEGORY_TO_POST_TYPE } from '../config/postTypeMap';

export const useForumPosts = () => {
    const [posts, setPosts] = useState<Thread[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ThreadCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setError(null);

        const params: { post_type?: string } = {};
        if (selectedCategory !== 'all') {
            params.post_type = CATEGORY_TO_POST_TYPE[selectedCategory];
        }

        forumService.getPosts(params)
            .then(data => {
                if (!cancelled) {
                    setPosts((data.data || []).map((p: any) => transformPost(p)));
                }
            })
            .catch(err => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => { cancelled = true; };
    }, [selectedCategory]);

    const filteredPosts = useMemo(() => {
        if (!searchQuery.trim()) return posts;
        const q = searchQuery.toLowerCase();
        return posts.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q)
        );
    }, [posts, searchQuery]);

    const activeUsers = useMemo(() => {
        const ids = new Set(posts.map(p => p.author.id));
        return ids.size;
    }, [posts]);

    const votePost = useCallback(async (postId: string, type: 'up' | 'down') => {
        const clicked: 1 | -1 = type === 'up' ? 1 : -1;

        // Capture values from fresh state inside the updater to avoid stale closure
        let prevVote: 0 | 1 | -1 = 0;
        let nextVote: 0 | 1 | -1 = 0;

        setPosts(prev => prev.map(p => {
            if (p.id !== postId) return p;
            prevVote = p.userVote as 0 | 1 | -1;
            nextVote = prevVote === clicked ? 0 : clicked;
            const delta = nextVote - prevVote;
            return { ...p, likes: p.likes + delta, userVote: nextVote };
        }));

        try {
            await forumService.votePost(postId, nextVote);
        } catch {
            setPosts(prev => prev.map(p => {
                if (p.id !== postId) return p;
                const delta = nextVote - prevVote;
                return { ...p, likes: p.likes - delta, userVote: prevVote };
            }));
        }
    }, []);

    return {
        posts: filteredPosts,
        isLoading,
        error,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeUsers,
        votePost,
    };
};
