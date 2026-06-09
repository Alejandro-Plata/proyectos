import { useIsMobile } from '../../hooks/useIsMobile';
import { PanelDesktop } from './PanelDesktop';
import { PanelMobile } from './PanelMobile';

export const LayoutPanel = () => {
    const isMobile = useIsMobile();

    return isMobile ? <PanelMobile /> : <PanelDesktop />;
};
