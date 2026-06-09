import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';

type Step = 'email' | 'code' | 'newPassword' | 'success';

export const usePasswordReset = () => {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestCode = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.requestPasswordReset(email);
            setStep('code');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al enviar el código');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { resetToken: token } = await authService.verifyResetCode(email, code);
            setResetToken(token);
            setStep('newPassword');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Código inválido');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await authService.resetPassword(resetToken, newPassword);
            setStep('success');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al restablecer la contraseña');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        step,
        email, setEmail,
        code, setCode,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        error,
        isLoading,
        handleRequestCode,
        handleVerifyCode,
        handleResetPassword,
        goToLogin: () => navigate('/login'),
    };
};
