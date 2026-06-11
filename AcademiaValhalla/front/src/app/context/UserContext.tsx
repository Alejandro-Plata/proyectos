import { createContext, use } from 'react';
import type { UserContextType } from './types/types';

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    // Usando la sintaxis de React 19 'use'
    const context = use(UserContext);
    if (context === undefined) throw new Error('useUser must be used within a UserProvider');
    return context;
};