import { useIsMobile } from '../../../../hooks/useIsMobile';
import { RetosDesktop } from './RetosDesktop';
import { RetosMobile } from './RetosMobile';

export const PaginaRetos = () => {
    const isMobile = useIsMobile();
    return isMobile ? <RetosMobile /> : <RetosDesktop />;
};
