import type { ContentRequest, ReviewRequestPayload, ReviewResponse } from '../../types/types';
import { ChallengeReviewModal } from './ChallengeReviewModal';
import { NoteReviewModal } from './NoteReviewModal';

interface Props {
    request: ContentRequest;
    onReview: (requestId: string, payload: ReviewRequestPayload) => Promise<ReviewResponse>;
    onClose: () => void;
}

export const RequestDetailModal = ({ request, onReview, onClose }: Props) => {
    if (!request) return null;
    return request.content_type === 'challenge'
        ? <ChallengeReviewModal request={request} onReview={onReview} onClose={onClose} />
        : <NoteReviewModal request={request} onReview={onReview} onClose={onClose} />;
};
