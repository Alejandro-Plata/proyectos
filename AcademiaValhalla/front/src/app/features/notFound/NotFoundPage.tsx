import { NotFoundDesktop } from './components/NotFoundPage/NotFoundDesktop';
import { NotFoundMobile } from './components/NotFoundPage/NotFoundMobile';
import { useIsMobile } from '../../hooks/useIsMobile';

export const NotFoundPage = () => {
    const isMobile = useIsMobile();

    return isMobile ? <NotFoundMobile /> : <NotFoundDesktop />;
};