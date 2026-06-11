import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTransition } from "react";


export interface LoginFormInputs {
    username: string;
    password: string;
}

export const useLoginForm = () => {

    const navigate = useNavigate();
        const { login: loginUser, error: authError } = useUser();
    
        const [isPending, startTransition] = useTransition();
        
            const formMethods = useForm<LoginFormInputs>({ 
                mode: 'onChange' 
            });
        
            const { handleSubmit } = formMethods;

            const handleLogin: SubmitHandler<LoginFormInputs> = (data) => {
                startTransition(async () => {
                    try {
                        await loginUser({
                            username: data.username,
                            password: data.password
                        });
                        navigate('/dashboard');
                    } catch (err) {
                        console.error("Error en el login:", err);
                    }
                });
            };

        return {
            ...formMethods,
            onSubmit: handleSubmit(handleLogin),
            isPending,
            authError
        };

}