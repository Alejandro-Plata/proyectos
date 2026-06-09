import { useState } from 'react';

const REPORT_REASONS = [
    'Spam o publicidad',
    'Contenido ofensivo o inapropiado',
    'Información incorrecta o engañosa',
    'Fuera de tema',
    'Acoso o comportamiento abusivo',
    'Otro',
];

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => Promise<void>;
}

export const ReportModal = ({ isOpen, onClose, onSubmit }: ReportModalProps) => {
    const [selected, setSelected] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!selected || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onSubmit(selected);
            setSent(true);
            setTimeout(() => {
                setSent(false);
                setSelected('');
                onClose();
            }, 1500);
        } catch {
            // silencioso — el error ya se maneja en el caller
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
            onClick={handleBackdropClick}
        >
            <div
                className="w-full max-w-sm bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-xl shadow-emerald-500/5 animate-in zoom-in-95 duration-150 overflow-hidden"
                style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-500/10 dark:border-emerald-500/[0.07]">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reportar publicación</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {sent ? (
                    <div className="px-5 py-8 text-center">
                        <div className="mb-2 flex justify-center">
                            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
                            Reporte enviado
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="px-5 py-4">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                Selecciona el motivo del reporte:
                            </p>
                            <div className="space-y-1">
                                {REPORT_REASONS.map((reason) => (
                                    <label
                                        key={reason}
                                        className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                                            selected === reason
                                                ? 'bg-rose-50 dark:bg-rose-500/10 border-l-2 border-rose-500'
                                                : 'hover:bg-emerald-500/[0.03]'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="report-reason"
                                            checked={selected === reason}
                                            onChange={() => setSelected(reason)}
                                            className="accent-rose-500 shrink-0"
                                        />
                                        <span className={`text-sm ${selected === reason ? 'text-rose-600 dark:text-rose-400 font-medium' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {reason}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-5 py-4 border-t border-emerald-500/10 dark:border-emerald-500/[0.07] bg-emerald-500/[0.01]">
                            <button
                                onClick={onClose}
                                className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 hover:text-slate-800 dark:hover:text-white px-4 py-2 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!selected || isSubmitting}
                                className="px-4 h-9 border border-red-500/30 hover:border-red-500/60 text-red-500 hover:bg-red-500/[0.06] font-mono text-[11px] uppercase tracking-[0.15em] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
