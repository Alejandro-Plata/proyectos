import { useState } from 'react';
import { forumService } from '../services/forumService';

export const useComment = (initialLikes: number, postId?: string, commentId?: string) => {
    const [isReplying, setIsReplying] = useState(false);
    const [areRepliesVisible, setAreRepliesVisible] = useState(true);

    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
    const [localVotes, setLocalVotes] = useState(initialLikes);

    const handleVote = (type: 'up' | 'down') => {
        const prevVote = userVote;
        const prevVotes = localVotes;
        let newVote: 'up' | 'down' | null;
        let delta: number;

        if (userVote === type) {
            newVote = null;
            delta = type === 'up' ? -1 : 1;
        } else {
            const modifier = userVote ? 2 : 1;
            delta = type === 'up' ? modifier : -modifier;
            newVote = type;
        }

        setUserVote(newVote);
        setLocalVotes(prev => prev + delta);

        if (postId && commentId) {
            const apiValue: 1 | -1 | 0 = newVote === null ? 0 : newVote === 'up' ? 1 : -1;
            forumService.voteComment(postId, commentId, apiValue).catch(() => {
                // Revertir en caso de error
                setUserVote(prevVote);
                setLocalVotes(prevVotes);
            });
        }
    };

    const toggleReply = () => setIsReplying(prev => !prev);
    const toggleRepliesVisibility = () => setAreRepliesVisible(prev => !prev);

    return {
        isReplying,
        setIsReplying,
        toggleReply,
        areRepliesVisible,
        toggleRepliesVisibility,
        userVote,
        localVotes,
        handleVote
    };
};