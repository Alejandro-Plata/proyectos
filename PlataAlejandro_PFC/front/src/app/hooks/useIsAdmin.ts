import { useUser } from '../context/UserContext';

export const useIsAdmin = () => {
    const { user } = useUser();
    return {
        isAdmin: user?.role === 'ADMIN',
        isModerator: user?.role === 'MODERADOR' || user?.role === 'ADMIN',
    };
};
