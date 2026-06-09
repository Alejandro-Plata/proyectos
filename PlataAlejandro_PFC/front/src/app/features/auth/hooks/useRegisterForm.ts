import { useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';


// 1. Exportamos la interfaz para que los componentes la puedan usar si necesitan
export interface RegisterFormInputs {
    username: string;
    email: string;
    password: string;
    passwordConfirmed: string;
    termsAccepted: boolean;
}

export const useRegisterForm = () => {
    const navigate = useNavigate();
    const { register: registerUser, error: authError } = useUser();
    
    const [isPending, startTransition] = useTransition();

    // Inicializamos el formulario
    const formMethods = useForm<RegisterFormInputs>({ 
        mode: 'onChange' 
    });

    const { handleSubmit, getValues } = formMethods;

    // Lógica interna del envío
    const handleRegister: SubmitHandler<RegisterFormInputs> = (data) => {
        startTransition(async () => {
            try {
                await registerUser({
                    username: data.username,
                    email: data.email,
                    password: data.password
                });
                navigate('/dashboard');
            } catch (err) {
                console.error("Error en registro:", err);
            }
        });
    };

    return {
        // Exponemos todo lo que React Hook Form nos da (register, formState, etc.)
        ...formMethods,
        // Exponemos una función 'onSubmit' ya preparada para conectar al <form>
        onSubmit: handleSubmit(handleRegister),
        // Exponemos el estado de carga y error
        isPending,
        authError,
        // Helper para validación cruzada (por si no quieres exponer todo formMethods)
        getValues 
    };
};