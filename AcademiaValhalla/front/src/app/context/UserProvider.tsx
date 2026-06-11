import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { UserContext } from './UserContext';
import { type User, type RegisterPayload, type LoginPayload } from './types/types';


const STORAGE_KEY = 'user'; 

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Carga inicial
    useEffect(() => {
        const initAuth = async () => {
            const storedUser = authService.getCurrentUser();
            if (storedUser) {
                setUserState(storedUser);
                // Opcional: Validar token con el servidor al iniciar
                // try {
                //    const freshUser = await authService.getProfile();
                //    updateLocalState({ ...freshUser, token: storedUser.token });
                // } catch (e) { logout(); }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const updateLocalState = (newUser: User) => {
        setUserState(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    };

    const login = async (data: LoginPayload) => {
        setIsLoading(true);
        setError(null);
        try {
            const loggedUser = await authService.login(data);
            updateLocalState(loggedUser); // Usamos el helper
        } catch (err: unknown) {
            if(err instanceof Error) {
                setError(err.message || 'Error al iniciar sesión');
                throw err;
            }
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterPayload) => {
        setIsLoading(true);
        setError(null);
        try {
            const newUser = await authService.register(data);
            updateLocalState(newUser); // Usamos el helper
        } catch (err: unknown) {
            if(err instanceof Error) {
                setError(err.message || 'Error en el registro');
                throw err;
            }
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUserState(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const updateUser = async (data: Partial<User>) => {
        
            const updatedUser = await authService.updateProfile(data);
            
            if (user) {
                const mergedUser = { ...user, ...updatedUser };
                updateLocalState(mergedUser);
            }

    };

    const refreshUser = async () => {
        try {
            // Lee el token desde localStorage (no desde React state, que puede estar desactualizado tras OAuth redirect)
            const storedUser = authService.getCurrentUser();
            if (storedUser?.token) {
                const freshData = await authService.getProfile();
                const mergedUser = { ...freshData, token: storedUser.token };
                updateLocalState(mergedUser);
            }
        } catch (err) {
            console.error("Error refreshing user", err);
        }
    };

    return (
        <UserContext 
            value={{ 
                user, 
                isAuthenticated: !!user, 
                isLoading, 
                error, 
                login, 
                register, 
                logout, 
                updateUser, // Exponemos
                refreshUser // Exponemos
            }}
        >
            {children}
        </UserContext>
    );
};