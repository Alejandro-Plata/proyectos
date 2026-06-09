import { useState } from 'react';
import { servicioAjustes } from '../services/settingsService';
import type { FieldErrors } from '../types/types';

interface PasswordForm {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

interface PasswordNotification {
    show: boolean;
    message: string;
    type: 'success' | 'error';
}

export const useChangePassword = () => {
    const [form, setForm] = useState<PasswordForm>({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    const [errors, setErrors] = useState<FieldErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<PasswordNotification>({
        show: false,
        message: '',
        type: 'success',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => {
            const next = { ...prev };
            delete next[name as keyof FieldErrors];
            return next;
        });
    };

    const validate = (): boolean => {
        const newErrors: FieldErrors = {};

        if (!form.current_password) {
            newErrors.current_password = 'Introduce tu contraseña actual';
        }

        if (!form.new_password) {
            newErrors.new_password = 'Introduce una nueva contraseña';
        } else if (form.new_password.length < 6) {
            newErrors.new_password = 'Mínimo 6 caracteres';
        } else if (form.new_password === form.current_password) {
            newErrors.new_password = 'Debe ser diferente a la actual';
        }

        if (!form.confirm_password) {
            newErrors.confirm_password = 'Confirma tu nueva contraseña';
        } else if (form.new_password !== form.confirm_password) {
            newErrors.confirm_password = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);

        try {
            await servicioAjustes.cambiarContrasena(form);

            setForm({ current_password: '', new_password: '', confirm_password: '' });
            setNotification({
                show: true,
                message: 'Contraseña actualizada correctamente',
                type: 'success',
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                setNotification({
                    show: true,
                    message: error.message,
                    type: 'error',
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const dismissNotification = () => {
        setNotification(prev => ({ ...prev, show: false }));
    };

    return {
        form,
        errors,
        isLoading,
        notification,
        handleChange,
        handleSubmit,
        dismissNotification,
    };
};

