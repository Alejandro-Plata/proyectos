import { useIsMobile } from '../../../../hooks/useIsMobile';
import { PanelAdminDesktop } from './PanelAdminDesktop';
import { PanelAdminMobile } from './PanelAdminMobile';

export const PaginaAdmin = () => {
    const isMobile = useIsMobile();
    return isMobile ? <PanelAdminMobile /> : <PanelAdminDesktop />;
};
