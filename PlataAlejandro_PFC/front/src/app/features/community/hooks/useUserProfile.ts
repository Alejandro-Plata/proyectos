import { useState, useEffect } from 'react';
import { forumService } from '../services/forumService';
import type { PublicProfile, PublicPost } from '../types/types';

interface UserProfileState {
    profile: PublicProfile | null;
    postsCount: number;
    recentPosts: PublicPost[];
    isLoading: boolean;
    error: string | null;
}

export const useUserProfile = (userId: string | undefined): UserProfileState => {
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [postsCount, setPostsCount] = useState(0);
    const [recentPosts, setRecentPosts] = useState<PublicPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;
        let cancelled = false;
        setIsLoading(true);
        forumService.getUserPublicProfile(userId)
            .then(data => {
                if (!cancelled) {
                    setProfile(data.user);
                    setPostsCount(data.postsCount ?? 0);
                    setRecentPosts(data.recentPosts ?? []);
                }
            })
            .catch(err => { if (!cancelled) setError(err.message); })
            .finally(() => { if (!cancelled) setIsLoading(false); });
        return () => { cancelled = true; };
    }, [userId]);

    return { profile, postsCount, recentPosts, isLoading, error };
};
