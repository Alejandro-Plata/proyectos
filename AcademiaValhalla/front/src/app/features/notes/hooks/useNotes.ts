import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import type { FiltroLenguaje, Difficulty, Concept } from "../types/types";
import { notesService } from "../services/notesService";

/** Etiqueta legible para cada opción del filtro de lenguaje. */
export const etiquetaLenguaje = (lang: FiltroLenguaje): string => {
    if (lang === 'todos') return 'Todo tipo';
    if (lang === 'general') return 'Temática general';
    if (lang === 'csharp') return 'C#';
    if (lang === 'javascript') return 'JavaScript';
    if (lang === 'typescript') return 'TypeScript';
    if (lang === 'php') return 'PHP';
    return lang.charAt(0).toUpperCase() + lang.slice(1);
};

export const useNotes = () => {
    const location = useLocation();
    const [selectedLanguage, setSelectedLanguage] = useState<FiltroLenguaje>('todos');
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Todas');
    const [searchQuery, setSearchQuery] = useState('');
    const [allNotes, setAllNotes] = useState<Concept[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 'todos' = sin filtrar · 'general' = solo temática general · resto = lenguaje concreto
    const languages: FiltroLenguaje[] = ['todos', 'general', 'java', 'javascript', 'python', 'php', 'csharp', 'go', 'typescript'];
    const difficulties: Difficulty[] = ['Todas', 'Básico', 'Intermedio', 'Avanzado'];

    const cargarNotas = useCallback(() => {
        setIsLoading(true);
        Promise.all([
            notesService.getAll().catch(() => []),
            notesService.getCommunity().catch(() => []),
        ]).then(([personal, community]) => {
            // Evitar duplicados: si una nota personal ya está aprobada, no la mostramos dos veces en comunidad
            const personalIds = new Set(personal.map(n => n.id));
            const uniqueCommunity = community.filter(n => !personalIds.has(n.id));
            setAllNotes([...personal, ...uniqueCommunity]);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    // Recargar cada vez que el usuario llega a esta página (location.key cambia en cada navegación)
    useEffect(() => {
        cargarNotas();
    }, [location.key, cargarNotas]);

    const filteredNotes = useMemo(() => {
        return allNotes.filter(note => {
            const matchesLanguage =
                selectedLanguage === 'todos' ||
                note.language === selectedLanguage;
            const matchesDifficulty = selectedDifficulty === 'Todas' || note.difficulty === selectedDifficulty;
            const query = searchQuery.toLowerCase();
            const matchesSearch = !query ||
                note.title.toLowerCase().includes(query) ||
                note.shortDescription.toLowerCase().includes(query) ||
                note.tags.some((tag: string) => tag.toLowerCase().includes(query));

            return matchesLanguage && matchesDifficulty && matchesSearch;
        });
    }, [allNotes, selectedLanguage, selectedDifficulty, searchQuery]);

    return {
        languages,
        difficulties,
        selectedLanguage,
        setSelectedLanguage,
        selectedDifficulty,
        setSelectedDifficulty,
        searchQuery,
        setSearchQuery,
        filteredNotes,
        isLoading,
        recargarNotas: cargarNotas,
    };
};
