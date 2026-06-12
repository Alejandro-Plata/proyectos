import { useParams } from 'react-router-dom';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { EditNoteDesktop } from './EditNoteDesktop';
import { EditNoteMobile } from './EditNoteMobile';

export const EditNotePage = () => {
    const { noteId } = useParams<{ noteId: string }>();
    const isMobile = useIsMobile();

    if (!noteId) return null;

    return isMobile
        ? <EditNoteMobile noteId={noteId} />
        : <EditNoteDesktop noteId={noteId} />;
};
