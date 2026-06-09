import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { notesService } from '../services/notesService';
import type { Concept } from '../types/types';

export const useNoteDetail = () => {
    const { noteId } = useParams();
    const [note, setNote] = useState<Concept | undefined>(undefined);
    const [allNotes, setAllNotes] = useState<Concept[]>([]);

    useEffect(() => {
        notesService.getAll().then(setAllNotes);
        
        if (noteId) {
            notesService.getById(noteId).then(foundNote => {
                if (foundNote) {
                    setNote(foundNote);
                }
            });
        }
    }, [noteId]);

    // Scroll al inicio al cambiar de nota
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [noteId]);

    const navigation = useMemo(() => {
        if (!note || allNotes.length === 0) return { prev: null, next: null };
        const sameLanguageNotes = allNotes.filter(n => n.language === note.language);
        const currentIndex = sameLanguageNotes.findIndex(n => n.id === note.id);
        return {
            prev: currentIndex > 0 ? sameLanguageNotes[currentIndex - 1] : null,
            next: currentIndex < sameLanguageNotes.length - 1 ? sameLanguageNotes[currentIndex + 1] : null
        };
    }, [note, allNotes]);

    return { note, navigation, noteId };
};
