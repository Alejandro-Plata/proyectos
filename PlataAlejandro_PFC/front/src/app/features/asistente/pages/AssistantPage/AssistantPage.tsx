import { useIsMobile } from '../../../../hooks/useIsMobile';
import { AsistenteDesktop } from './AssistantDesktop';
import { AsistenteMobile } from './AssistantMobile';

export const PaginaAsistente = () => {
    const isMobile = useIsMobile();
    return isMobile ? <AsistenteMobile /> : <AsistenteDesktop />;
};
