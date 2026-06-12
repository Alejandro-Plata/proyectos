import type { editor } from "monaco-editor";
import type { ReactNode } from "react";

export interface PropsBloqueCodigo {
    code: string;
    language?: string;
}

export interface PropsEditorMonacoDesktop {
    id?: string;
    code: string;
    language?: string;
    editable?: boolean;
    onChange?: (value: string | undefined, event: editor.IModelContentChangedEvent) => void;
    theme?: boolean; // true = dark, false = light
    options?: editor.IStandaloneEditorConstructionOptions;
    filePath?: string;
    showCopyButton?: boolean;
}

export interface IMonacoTypeScript {
    javascriptDefaults: {
        setCompilerOptions: (options: Record<string, unknown>) => void;
        setDiagnosticsOptions: (options: Record<string, unknown>) => void;
    };
    ScriptTarget: { ES2020: number };
    ModuleResolutionKind?: { NodeJs: number };
    ModuleKind?: { CommonJS: number };
}

export interface PropsEditorMonacoMobile {
    id?: string;
    code: string;
    language?: string;
    editable?: boolean;
    onChange?: (value: string | undefined, event: editor.IModelContentChangedEvent) => void;
    theme?: boolean;
    options?: editor.IStandaloneEditorConstructionOptions;
    showCopyButton?: boolean;
}

export interface PropsBarraLateral {
    isOpen: boolean;
    onClose?: () => void;
}

export interface ElementoMenu {
    id: string;
    label: string;
    icon: ReactNode;
    to: string;
}

export interface PropsElementoBarraLateral {
    item: ElementoMenu;
    isExpanded: boolean;
    isActive: boolean;
    onClick?: () => void;
}

export interface PropsBotonEjecutar extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isRunning: boolean;
    label?: string;
    loadingLabel?: string;
    className?: string;
}

/***** Input de búsqueda *****/

export interface PropsEntradaBusqueda extends React.InputHTMLAttributes<HTMLInputElement> {
    action?: ReactNode;
}

export interface PropsLogoValhalla {
    className?: string;
    iconOnly?: boolean;
}

// Backward-compat aliases
export type CodeBlockProps = PropsBloqueCodigo;
export type MonacoEditorDesktopProps = PropsEditorMonacoDesktop;
export type MonacoEditorMobileProps = PropsEditorMonacoMobile;
export type SidebarProps = PropsBarraLateral;
export type MenuItem = ElementoMenu;
export type SidebarItemProps = PropsElementoBarraLateral;
export type RunButtonProps = PropsBotonEjecutar;
export type SearchInputProps = PropsEntradaBusqueda;
export type ValhallaLogoProps = PropsLogoValhalla;
