import type { ReactNode } from "react";

export interface ElementoNavegacion {
    id: string;
    label: string;
    icon: ReactNode;
    to: string;
}

// Backward-compat alias
export type NavItem = ElementoNavegacion;
