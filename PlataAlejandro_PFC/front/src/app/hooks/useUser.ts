import { use } from "react";
import { UserContext } from "../context/UserContext";

export const useUser = () => {
    // En React 19 puedes usar 'use' en lugar de 'useContext'
    const context = use(UserContext); 
    if (context === undefined) throw new Error('useUser must be used within a UserProvider');
    return context;
};