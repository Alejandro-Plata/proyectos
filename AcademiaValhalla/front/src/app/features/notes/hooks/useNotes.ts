import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import type { LanguageType, Difficulty, Concept } from "../types/types";
import { notesService } from "../services/notesService";

export const useNotes = () => {
    const location = useLocation();
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>('general');
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Todas');
    const [searchQuery, setSearchQuery] = useState('');
    const [allNotes, setAllNotes] = useState<Concept[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const languages: LanguageType[] = ['general', 'java', 'javascript', 'python', 'php', 'csharp', 'go', 'typescript'];
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
            // 'general' actúa como "todas" — muestra notas de cualquier lenguaje
            const matchesLanguage = selectedLanguage === 'general' || note.language === selectedLanguage;
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
