import { useIsMobile } from '../../../../hooks/useIsMobile';
import { ForgotPasswordDesktop } from './ForgotPasswordDesktop';
import { ForgotPasswordMobile } from './ForgotPasswordMobile';

export const ForgotPasswordPage = () => {
    const isMobile = useIsMobile();
    return isMobile ? <ForgotPasswordMobile /> : <ForgotPasswordDesktop />;
};
