import { useIsMobile } from '../../../../hooks/useIsMobile';
import { NotesPageDesktop } from './NotesPageDesktop';
import { NotesPageMobile } from './NotesPageMobile';

export const NotesPage = () => {
    const isMobile = useIsMobile();

    return isMobile ? <NotesPageMobile /> : <NotesPageDesktop />;
};
