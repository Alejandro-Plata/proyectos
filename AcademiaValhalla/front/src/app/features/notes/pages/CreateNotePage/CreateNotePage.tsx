import { useIsMobile } from '../../../../hooks/useIsMobile';
import { CrearNotaDesktop } from './CreateNoteDesktop';
import { CrearNotaMobile } from './CreateNoteMobile';

export const CreateNotePage = () => {
    const isMobile = useIsMobile();

    return isMobile ? <CrearNotaMobile /> : <CrearNotaDesktop />;
};
