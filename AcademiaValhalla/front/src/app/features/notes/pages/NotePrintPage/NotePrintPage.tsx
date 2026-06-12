import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { notesService } from '../../services/notesService';
import type { Concept } from '../../types/types';
import { NotePrintView } from './NotePrintView';
import './notePrint.css';

export const NotePrintPage = () => {
    const { noteId } = useParams<{ noteId: string }>();
    const [note, setNote] = useState<Concept | undefined>();
    const [loading, setLoading] = useState(true);
    const [afterPrint, setAfterPrint] = useState(false);

    const printDate = new Date().toLocaleDateString('es-ES', {
        day: '2-digit', month: 'long', year: 'numeric',
    });

    useEffect(() => {
        if (!noteId) return;
        notesService.getById(noteId).then(n => {
            setNote(n);
            setLoading(false);
        });
    }, [noteId]);

    // Establecer título del documento (sugerencia para nombre del PDF)
    useEffect(() => {
        if (note) {
            document.title = `${note.title} — Academia Valhalla`;
        }
        return () => { document.title = 'Academia Valhalla'; };
    }, [note]);

    // Auto-imprimir tras cargar fuentes e imágenes
    useEffect(() => {
        if (!note) return;

        const triggerPrint = async () => {
            await document.fonts.ready;
            // Esperar a que las imágenes del DOM terminen de cargar
            await Promise.all(
                Array.from(document.images).map(img =>
                    img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })
                )
            );
            window.print();
        };

        const onAfterPrint = () => setAfterPrint(true);
        window.addEventListener('afterprint', onAfterPrint);

        triggerPrint();

        return () => window.removeEventListener('afterprint', onAfterPrint);
    }, [note]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-200">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!note) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 gap-4">
                <p className="text-slate-600 text-sm font-semibold">Apunte no encontrado.</p>
                <Link to="/dashboard/notes" className="text-emerald-600 underline text-sm">
                    Volver a Apuntes
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* Barra post-impresión */}
            {afterPrint && (
                <div className="print-afterbar fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-4 py-3 bg-emerald-500 text-white text-sm font-semibold shadow-lg">
                    <span>¿Todo listo?</span>
                    <Link
                        to={`/dashboard/notes/${noteId}`}
                        className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                        Volver al apunte
                    </Link>
                    <button
                        onClick={() => { setAfterPrint(false); window.print(); }}
                        className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                        Imprimir de nuevo
                    </button>
                </div>
            )}

            <NotePrintView note={note} printDate={printDate} />
        </>
    );
};
