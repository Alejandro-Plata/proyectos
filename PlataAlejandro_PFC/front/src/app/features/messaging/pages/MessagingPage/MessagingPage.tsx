import { useIsMobile } from '../../../../hooks/useIsMobile';
import { MessagingDesktop } from './MessagingDesktop';
import { MessagingMobile } from './MessagingMobile';

export const MessagingPage = () => {
    const isMobile = useIsMobile();
    return isMobile ? <MessagingMobile /> : <MessagingDesktop />;
};
