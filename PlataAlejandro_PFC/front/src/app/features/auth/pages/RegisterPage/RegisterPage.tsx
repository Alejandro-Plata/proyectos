import { useIsMobile } from '../../../../hooks/useIsMobile';
import { RegisterDesktop } from './RegisterDesktop';
import { RegisterMobile } from './RegisterMobile';

export const RegisterPage = () => {
    const isMobile = useIsMobile();

    return isMobile ? <RegisterMobile /> : <RegisterDesktop />;
};
