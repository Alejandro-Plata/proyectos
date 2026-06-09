import { LandingMobile } from './pages/LandingPage/LandingMobile';
import { LandingDesktop } from './pages/LandingPage/LandingDesktop';
import { useIsMobile } from '../../hooks/useIsMobile';

export const LandingPage = () => {
    const isMobile = useIsMobile();

    return isMobile ? <LandingMobile /> : <LandingDesktop />;
};