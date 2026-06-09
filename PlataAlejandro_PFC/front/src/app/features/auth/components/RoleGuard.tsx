import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';

interface RoleGuardProps {
    allowedRoles: Array<'ADMIN' | 'MODERADOR' | 'USUARIO'>;
    redirectTo?: string;
}

export const RoleGuard = ({ allowedRoles, redirectTo = '/dashboard' }: RoleGuardProps) => {
    const { user, isLoading } = useUser();

    if (isLoading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(user.role)) return <Navigate to={redirectTo} replace />;

    return <Outlet />;
};
