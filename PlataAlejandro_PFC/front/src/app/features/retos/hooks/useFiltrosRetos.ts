import { useState, useMemo } from 'react';
import type { Reto as Challenge } from '../types/types';

const ETIQUETAS_POR_PAGINA = 8;

interface OpcionesUseFiltrosRetos {
    safeChallenges: Challenge[];
    initialLang?: string;
}

interface RetornoUseFiltrosRetos {
    isFiltersOpen: boolean;
    setIsFiltersOpen: (open: boolean) => void;
    selectedLang: string;
    setSelectedLang: (lang: string) => void;
    selectedTags: string[];
    toggleTag: (tag: string) => void;
    availableTags: string[];
    filteredChallenges: Challenge[];
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    visibleTags: string[];
    tagPage: number;
    totalTagPages: number;
    setTagPage: (page: number) => void;
}

export const useFiltrosRetos = ({
    safeChallenges = [],
    initialLang = 'all'
}: OpcionesUseFiltrosRetos): RetornoUseFiltrosRetos => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState<string>(initialLang);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [tagPage, setTagPage] = useState(0);

    const availableTags = useMemo(() => {
        const tags = new Set<string>();
        safeChallenges.forEach(c => c.tags.forEach((t: string) => tags.add(t)));
        return Array.from(tags).sort();
    }, [safeChallenges]);

    const totalTagPages = Math.max(1, Math.ceil(availableTags.length / ETIQUETAS_POR_PAGINA));

    const visibleTags = useMemo(() => {
        const start = tagPage * ETIQUETAS_POR_PAGINA;
        return availableTags.slice(start, start + ETIQUETAS_POR_PAGINA);
    }, [availableTags, tagPage]);

    const filteredChallenges = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        return safeChallenges.filter(c => {
            const matchLang =
                selectedLang === 'all' ||
                c.available_languages.some(l => l.toLowerCase() === selectedLang.toLowerCase());
            const matchTags =
                selectedTags.length === 0 ||
                selectedTags.some(tag => c.tags.includes(tag));
            const matchSearch =
                !query ||
                c.title.toLowerCase().includes(query) ||
                c.tags.some(t => t.toLowerCase().includes(query));
            return matchLang && matchTags && matchSearch;
        });
    }, [selectedLang, selectedTags, searchQuery, safeChallenges]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return {
        isFiltersOpen,
        setIsFiltersOpen,
        selectedLang,
        setSelectedLang,
        selectedTags,
        toggleTag,
        availableTags,
        filteredChallenges,
        searchQuery,
        setSearchQuery,
        visibleTags,
        tagPage,
        totalTagPages,
        setTagPage,
    };
};
