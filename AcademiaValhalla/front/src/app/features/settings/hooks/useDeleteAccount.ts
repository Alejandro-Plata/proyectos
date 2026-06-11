import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { servicioAjustes } from '../services/settingsService';

export const useDeleteAccount = () => {
    const { logout } = useUser();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const CONFIRMATION_WORD = 'ELIMINAR';

    const openModal = () => {
        setShowModal(true);
        setConfirmText('');
        setError(null);
    };

    const closeModal = () => {
        setShowModal(false);
        setConfirmText('');
        setError(null);
    };

    const canConfirm = confirmText === CONFIRMATION_WORD;

    const handleDelete = async () => {
        if (!canConfirm) return;

        setIsDeleting(true);
        setError(null);

        try {
            await servicioAjustes.eliminarCuenta();
            logout();
            navigate('/');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
            setIsDeleting(false);
        }
    };

    return {
        showModal,
        confirmText,
        setConfirmText,
        isDeleting,
        error,
        canConfirm,
        CONFIRMATION_WORD,
        openModal,
        closeModal,
        handleDelete,
    };
};

