import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../../context/UserContext';
import { useAchievements } from '../../../context/AchievementContext';
import type { FieldErrors } from '../types/types';
import { servicioAjustes } from '../services/settingsService';

interface FormData {
    username: string;
    email: string;
    bio: string;
    avatar_url: string;
    github_url: string;
    linkedin_url: string;
    current_level: number;
}

interface Notification {
    show: boolean;
    message: string;
    type: 'success' | 'error';
}

const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
        case 'username':
            if (value.length < 3) return 'Mínimo 3 caracteres';
            if (value.length > 30) return 'Máximo 30 caracteres';
            if (!/^[a-zA-Z0-9_-]+$/.test(value)) return 'Solo letras, números, guiones y guiones bajos';
            return undefined;
        case 'bio':
            if (value.length > 500) return 'Máximo 500 caracteres';
            return undefined;
        case 'github_url':
            if (value && !/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/.test(value))
                return 'Formato: https://github.com/usuario';
            return undefined;
        case 'linkedin_url':
            if (value && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/.test(value))
                return 'Formato: https://linkedin.com/in/usuario';
            return undefined;
        default:
            return undefined;
    }
};

export const useSettingsForm = () => {
    const { user, updateUser } = useUser();
    const { encolarLogros } = useAchievements();

    const [formData, setFormData] = useState<FormData>({
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || '',
        avatar_url: user?.avatar_url || '',
        github_url: user?.github_url || '',
        linkedin_url: user?.linkedin_url || '',
        current_level: user?.current_level || 1,
    });

    const [errors, setErrors] = useState<FieldErrors>({});
    const [isDirty, setIsDirty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<Notification>({
        show: false,
        message: '',
        type: 'success',
    });

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification.show]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsDirty(true);

        const error = validateField(name, value);
        setErrors(prev => {
            const next = { ...prev };
            if (error) {
                next[name as keyof FieldErrors] = error;
            } else {
                delete next[name as keyof FieldErrors];
            }
            return next;
        });
    }, []);

    const hasErrors = Object.keys(errors).length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const allErrors: FieldErrors = {};
        for (const [key, value] of Object.entries(formData)) {
            if (typeof value === 'string') {
                const err = validateField(key, value);
                if (err) allErrors[key as keyof FieldErrors] = err;
            }
        }

        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
            setNotification({
                show: true,
                message: 'Corrige los errores antes de guardar',
                type: 'error',
            });
            return;
        }

        setIsLoading(true);

        try {
            await updateUser({
                username: formData.username,
                bio: formData.bio,
                github_url: formData.github_url,
                linkedin_url: formData.linkedin_url,
            });

            setIsLoading(false);
            setIsDirty(false);

            setNotification({
                show: true,
                message: 'Perfil actualizado correctamente',
                type: 'success',
            });
        } catch (error: unknown) {
            setIsLoading(false);
            if (error instanceof Error) {
                setNotification({
                    show: true,
                    message: error.message || 'Error al guardar los cambios',
                    type: 'error',
                });
            }
        }
    };

    const dismissNotification = () => {
        setNotification(prev => ({ ...prev, show: false }));
    };

    const handleAvatarUpload = async (file: File) => {
        setIsLoading(true);
        try {
            const res = await servicioAjustes.subirAvatar(file);
            setFormData(prev => ({ ...prev, avatar_url: res.avatar_url }));
            await updateUser({ avatar_url: res.avatar_url });
            if (res.unlockedAchievements && res.unlockedAchievements.length > 0) {
                encolarLogros(res.unlockedAchievements);
            }
            setNotification({
                show: true,
                message: 'Avatar actualizado correctamente',
                type: 'success',
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                setNotification({
                    show: true,
                    message: error.message || 'Error al subir la imagen',
                    type: 'error',
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        user,
        formData,
        errors,
        hasErrors,
        isDirty,
        isLoading,
        notification,
        handleChange,
        handleAvatarUpload,
        handleSubmit,
        dismissNotification,
    };
};

