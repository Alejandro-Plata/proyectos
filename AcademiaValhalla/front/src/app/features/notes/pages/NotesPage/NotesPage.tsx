import { useEffect } from 'react';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { useUser } from '../../../../context/UserContext';
import { useTour } from '../../../../components/Tour/TourProvider';
import { NOTES_TOUR_ID } from '../../tour/tourSteps.notes';
import { NotesPageDesktop } from './NotesPageDesktop';
import { NotesPageMobile } from './NotesPageMobile';

const TOUR_SEEN_KEY = (userId: string) => `valhalla:tour:notes:v1:${userId}`;

export const NotesPage = () => {
    const isMobile = useIsMobile();
    const { user }  = useUser();
    const { start, isActive } = useTour();

    useEffect(() => {
        if (!user?.user_id || isActive) return;
        const key = TOUR_SEEN_KEY(user.user_id);
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, '1');
            start(NOTES_TOUR_ID);
        }
    // Only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.user_id]);

    const handleStartTour = () => start(NOTES_TOUR_ID);

    return isMobile
        ? <NotesPageMobile onStartTour={handleStartTour} />
        : <NotesPageDesktop onStartTour={handleStartTour} />;
};
