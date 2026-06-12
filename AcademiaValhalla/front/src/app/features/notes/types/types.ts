import type { ReactNode } from 'react';

export interface Contenido {
    type: "text" | "code" | "image" | "definition";
    value: string;
    title?: string;
    language?: string;
    filename?: string;
}

export type Dificultad = "Todas" | "Básico" | "Intermedio" | "Avanzado";

export type EstadoComunidad = 'personal' | 'pending' | 'approved' | 'rejected';

export interface RevisionResumen {
    revision_id: string;
    status: 'pending' | 'approved' | 'rejected';
    review_comment?: string | null;
    created_at: string;
}

export interface Concepto {
    id: string;
    title: string;
    description?: string;
    shortDescription: string;
    summary: string;
    language: string;
    tags: string[];
    difficulty: Dificultad;
    content: Contenido[];
    community_status?: EstadoComunidad;
    source?: FuenteApunte;
    pendingRevision?: RevisionResumen | null;
    rejectedRevision?: RevisionResumen | null;
}

export type TipoLenguaje = 'general' | 'java' | 'javascript' | 'python' | 'php' | 'csharp' | 'go' | 'typescript';

export type TipoBloque = 'text' | 'code' | 'image' | 'definition';

export interface Bloque {
    id: string;
    type: TipoBloque;
    value: string;
    title?: string;
    language?: string;
    file?: File;
}

export type FuenteApunte = 'personal' | 'community';

export interface Apunte {
    id: string;
    source?: FuenteApunte;
    language: string;
}

export interface PropsTarjetaApunte {
    note: Concepto;
}

export interface PropsCajaDefinicion {
    title?: ReactNode;
    children: ReactNode;
}

export interface ConfigLenguaje {
    id: string;
    label: string;
    ext: string;
}

// Backward-compat aliases
export type CommunityStatus = EstadoComunidad;
export type Content = Contenido;
export type Difficulty = Dificultad;
export type Concept = Concepto;
export type LanguageType = TipoLenguaje;
export type BlockType = TipoBloque;
export type Block = Bloque;
export type NoteSource = FuenteApunte;
export type Note = Apunte;
export type NoteCardProps = PropsTarjetaApunte;
export type DefinitionBoxProps = PropsCajaDefinicion;
export type LanguageConfig = ConfigLenguaje;
