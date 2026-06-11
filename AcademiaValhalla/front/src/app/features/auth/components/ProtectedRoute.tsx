import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { Icons } from '../../../components/Icons';

export const ProtectedRoute = () => {
    const { user, isAuthenticated, isLoading } = useUser();

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#050505]">
                <div className="animate-spin text-emerald-500">
                    {Icons.spinner}
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.is_banned) {
        return <Navigate to="/banned" replace />;
    }

    return <Outlet />;
};
