import { PerfilMobile } from './PerfilMobile';
import { PerfilDesktop } from './PerfilDesktop';
import { useIsMobile } from '../../../../hooks/useIsMobile';

export const PaginaPerfil = () => {
    const isMobile = useIsMobile();

    return isMobile ? <PerfilMobile /> : <PerfilDesktop />;
};
