import { useParams } from 'react-router-dom';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { UserProfileDesktop } from './UserProfileDesktop';
import { UserProfileMobile } from './UserProfileMobile';

export const UserProfilePage = () => {
    const { userId } = useParams<{ userId: string }>();
    const isMobile = useIsMobile();

    return isMobile
        ? <UserProfileMobile userId={userId} />
        : <UserProfileDesktop userId={userId} />;
};
