import { useLocation, useNavigate } from "react-router-dom";
import { Icons } from "../components/Icons";
import type { MenuItem } from "../components/types/types";
import { useMemo } from "react";
import { useUser } from "../context/UserContext";

const BASE_MENU_ITEMS: MenuItem[] = [
    {
        id: 'profile',
        label: 'Perfil',
        to: '/dashboard',
        icon: Icons.profile
    },
    {
        id: 'notes',
        label: 'Biblioteca',
        to: '/dashboard/notes',
        icon: Icons.notes
    },
    {
        id: 'challenges',
        label: 'Misiones',
        to: '/dashboard/challenges',
        icon: Icons.challenges
    },
    {
        id: 'community',
        label: 'Comunidad',
        to: '/dashboard/community',
        icon: Icons.community
    },
    {
        id: 'messages',
        label: 'Mensajes',
        to: '/dashboard/messages',
        icon: Icons.message
    },
    {
        id: 'assistant',
        label: 'Asistente',
        to: '/dashboard/assistant',
        icon: Icons.assistant
    }
];

const ADMIN_ITEM: MenuItem = {
    id: 'admin',
    label: 'Admin',
    to: '/dashboard/admin',
    icon: Icons.admin,
};

// Kept for backwards-compatibility (non-admin callers)
export const MENU_ITEMS = BASE_MENU_ITEMS;

export const useSidebar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();

    const menuItems = useMemo<MenuItem[]>(() => {
        const isStaff = user?.role === 'ADMIN' || user?.role === 'MODERADOR';
        return isStaff ? [...BASE_MENU_ITEMS, ADMIN_ITEM] : BASE_MENU_ITEMS;
    }, [user?.role]);

    const activeSection = useMemo(() => {
        const matchingItems = menuItems.filter(item =>
            pathname === item.to || pathname.startsWith(`${item.to}/`)
        );

        if (matchingItems.length > 0) {
            const bestMatch = matchingItems.sort((a, b) => b.to.length - a.to.length)[0];
            return bestMatch.id;
        }

        return 'overview';
    }, [pathname, menuItems]);

    const setActiveSection = (id: string) => {
        const item = menuItems.find(i => i.id === id);
        if (item) navigate(item.to);
    };

    const signOut = () => {
        navigate('/login');
    };

    return { menuItems, activeSection, setActiveSection, signOut };
};

export const useHeader = () => {
    const location = useLocation();
    const { user: contextUser } = useUser();

    // Lógica para determinar el título según la ruta actual
    const getCurrentSectionTitle = () => {
        const path = location.pathname;

        if (path === '/dashboard') return 'Mi perfil';
        if (path === '/dashboard/settings') return 'Ajustes';
        if (path === '/dashboard/messages') return 'Chat';
        if (path === '/dashboard/community') return 'Foro';
        if (path === '/dashboard/profile') return 'Privacidad';
        
        if (path.includes('/dashboard/notes')) return 'Apuntes y Notas';
        if (path.includes('/dashboard/challenges')) return 'Retos de Programación';
        if (path.includes('/dashboard/admin')) return 'Panel de Administración';
        if (path.includes('/dashboard/assistant')) return 'Asistente Freya';

        const currentItem = MENU_ITEMS.find(item => item.to === path);
        if (currentItem) return currentItem.label;

        return 'Explorando';
    };

    const safeUser = {
        name: contextUser?.username || 'Usuario desconocido',
        level: contextUser?.current_level || 1,
        
        username: contextUser?.username || 'desconocido',
        current_level: contextUser?.current_level || 1,
        avatar_url: contextUser?.avatar_url, 
        email: contextUser?.email,
        role: contextUser?.role || 'USUARIO'
    };

    return {
        user: safeUser,
        currentTitle: getCurrentSectionTitle()
    };
};