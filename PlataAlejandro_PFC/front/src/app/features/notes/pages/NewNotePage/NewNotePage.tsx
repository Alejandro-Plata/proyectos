import { useIsMobile } from '../../../../hooks/useIsMobile';
import { NewNoteDesktop } from './NewNoteDesktop';
import { NewNoteMobile } from './NewNoteMobile';

export const NewNotePage = () => {
    const isMobile = useIsMobile();

    return isMobile ? <NewNoteMobile /> : <NewNoteDesktop />;
};
