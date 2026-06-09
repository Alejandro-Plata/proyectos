import { useIsMobile } from '../../../../hooks/useIsMobile';
import { LoginDesktop } from './LoginDesktop';
import { LoginMobile } from './LoginMobile';

export const LoginPage = () => {
    const isMobile = useIsMobile();

    return isMobile ? <LoginMobile /> : <LoginDesktop />;
};
