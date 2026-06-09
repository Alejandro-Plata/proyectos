import { useState } from "react";

export const useLanding = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const currentYear = new Date().getFullYear();

    return { isMobileMenuOpen, toggleMobileMenu, currentYear };
};

export const INITIAL_CODE = `// ¡Bienvenido a Valhalla!
// Prueba nuestro editor en línea!

const saludar = (nombre) => {
    return \`¡Hola, \${nombre}!
Bienvenido a Academia Valhalla.\`;
}

console.log(saludar("Vikingo"));
`;