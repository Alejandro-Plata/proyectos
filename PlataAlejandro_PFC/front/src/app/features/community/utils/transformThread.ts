import type { Thread, ForumComment, ApiComment } from '../types/types';
import { POST_TYPE_TO_CATEGORY } from '../config/postTypeMap';
import { getRankInfo } from './rankHelper';
import { formatTimeAgo } from './timeUtils';
import { getAvatarUrl } from '../../../utils/getAvatarUrl';

function transformAuthor(author: any) {
    const { rank, rankGradient } = getRankInfo();
    if (!author) {
        return { id: '', name: '[Usuario eliminado]', avatar: getAvatarUrl('deleted', undefined), rank, rankGradient };
    }
    return {
        id: author.user_id,
        name: author.username,
        avatar: getAvatarUrl(author.username, author.avatar_url),
        rank,
        rankGradient,
    };
}

export function transformPost(post: any): Thread {
    const blocks = Array.isArray(post.content) ? post.content : [];
    const excerpt = blocks
        .filter((b: any) => b.type === 'text')
        .map((b: any) => b.value)
        .join(' ')
        .slice(0, 160);

    // Backend returns Spanish alias 'autor'; fall back to English for safety
    const author = post.autor ?? post.author;

    return {
        id: post.post_id,
        title: post.title,
        excerpt,
        content: blocks,
        author: transformAuthor(author),
        category: POST_TYPE_TO_CATEGORY[post.post_type as string] ?? 'discussion',
        likes: post.upvote_count || 0,
        comments: post.comment_count ?? post.comentarios?.length ?? post.user_comments?.length ?? 0,
        timestamp: formatTimeAgo(post.created_at),
        viewCount: post.view_count || 0,
        userVote: (post.userVote as 1 | -1 | 0) ?? 0,
        isSolved: post.has_solution ?? false,
    };
}

function transformComment(comment: any): ForumComment {
    // Backend returns 'respuestas' for nested replies
    const replies = comment.respuestas ?? comment.replies ?? [];
    const author = comment.autor ?? comment.author;
    return {
        id: comment.user_comment_id,
        author: transformAuthor(author),
        content: comment.content,
        likes: 0,
        timestamp: formatTimeAgo(comment.created_at ?? comment.createdAt),
        replies: replies.map(transformComment),
        isOfficialSolution: comment.is_solution ?? false,
        parentId: comment.parent_user_comment_id || null,
    };
}

export function transformComments(comments: ApiComment[]): ForumComment[] {
    return comments.map(transformComment);
}
