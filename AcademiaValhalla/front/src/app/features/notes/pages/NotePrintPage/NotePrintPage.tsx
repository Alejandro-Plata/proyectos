import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { notesService } from '../../services/notesService';
import type { Concept } from '../../types/types';
import { NotePrintView } from './NotePrintView';
import './notePrint.css';

type ExportStatus = 'generating' | 'done' | 'error';

export const NotePrintPage = () => {
    const { noteId } = useParams<{ noteId: string }>();
    const [note, setNote] = useState<Concept | undefined>();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<ExportStatus>('generating');
    const sheetRef = useRef<HTMLDivElement>(null);

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

    const downloadPdf = async () => {
        if (!sheetRef.current || !note) return;
        setStatus('generating');
        try {
            await document.fonts.ready;
            // Esperar a que las imágenes del DOM terminen de cargar
            await Promise.all(
                Array.from(document.images).map(img =>
                    img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })
                )
            );

            const { default: html2pdf } = await import('html2pdf.js');
            const safeName = note.title.replace(/[\\/:*?"<>|]/g, '').trim() || 'apunte';

            // pagebreak no figura en los tipos del paquete pero sí lo soporta en runtime
            const pdfOptions = {
                margin: 0,
                filename: `${safeName}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
                pagebreak: { mode: ['css', 'legacy'] },
            };

            sheetRef.current.classList.add('pdf-exporting');
            try {
                await html2pdf()
                    .set(pdfOptions)
                    .from(sheetRef.current)
                    .save();
            } finally {
                sheetRef.current.classList.remove('pdf-exporting');
            }

            setStatus('done');
        } catch (err) {
            console.error('Error generando PDF:', err);
            setStatus('error');
        }
    };

    // Auto-descargar al cargar la nota
    useEffect(() => {
        if (!note) return;
        downloadPdf();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {/* Barra de estado de exportación */}
            <div className={`print-afterbar fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-4 py-3 text-white text-sm font-semibold shadow-lg ${
                status === 'error' ? 'bg-rose-500' : 'bg-emerald-500'
            }`}>
                {status === 'generating' && (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generando PDF…</span>
                    </>
                )}
                {status === 'done' && (
                    <>
                        <span>PDF descargado ✓</span>
                        <Link
                            to={`/dashboard/notes/${noteId}`}
                            className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                            Volver al apunte
                        </Link>
                        <button
                            onClick={downloadPdf}
                            className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                            Descargar de nuevo
                        </button>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <span>Error al generar el PDF</span>
                        <button
                            onClick={downloadPdf}
                            className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                            Reintentar
                        </button>
                        <Link
                            to={`/dashboard/notes/${noteId}`}
                            className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                            Volver al apunte
                        </Link>
                    </>
                )}
            </div>

            <div ref={sheetRef}>
                <NotePrintView note={note} printDate={printDate} />
            </div>
        </>
    );
};
