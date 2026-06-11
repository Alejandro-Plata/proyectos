import { Icons } from '../../../components/Icons';

interface DeleteAccountModalProps {
    show: boolean;
    confirmText: string;
    onConfirmTextChange: (value: string) => void;
    confirmationWord: string;
    canConfirm: boolean;
    isDeleting: boolean;
    error: string | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DeleteAccountModal = ({
    show, confirmText, onConfirmTextChange, confirmationWord,
    canConfirm, isDeleting, error, onConfirm, onCancel
}: DeleteAccountModalProps) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="notched-diag w-full max-w-lg max-h-[85vh] flex flex-col bg-white dark:bg-[#0a0b0e] border border-emerald-500/20 dark:border-emerald-500/15 shadow-2xl shadow-emerald-500/10 overflow-hidden animate-in zoom-in-95 duration-200"
            >
                {/* header */}
                <div className="px-6 py-4 flex items-start justify-between border-b border-emerald-500/10 bg-emerald-500/[0.03]">
                    <div className="flex items-center gap-2">
                        <span className="h-px w-4 bg-red-500/50" />
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-red-500/80">· zona de peligro</h3>
                    </div>
                    <button onClick={onCancel} className="text-slate-400 hover:text-emerald-500 transition-colors">✕</button>
                </div>

                {/* body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-red-500/10 border border-red-500/20 mx-auto mb-4">
                        <div className="w-5 h-5 text-red-600 dark:text-red-500">{Icons.flame}</div>
                    </div>

                    <h3 className="font-mono text-[13px] uppercase tracking-[0.15em] text-slate-900 dark:text-white text-center mb-2">
                        ¿Eliminar cuenta permanentemente?
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                        Esta acción es <strong className="text-red-600 dark:text-red-400">irreversible</strong>.
                        Se eliminarán todos tus datos: publicaciones, comentarios, progreso en misiones, apuntes y mensajes.
                    </p>

                    <div className="mb-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">
                            Escribe <code className="px-1.5 py-0.5 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold">{confirmationWord}</code> para confirmar:
                        </p>
                        <div className="relative">
                            <span className="absolute -top-[1px] left-3 z-10 pointer-events-none select-none">
                                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-red-500/50 bg-white dark:bg-[#0a0b0e] px-1">confirmación</span>
                            </span>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => onConfirmTextChange(e.target.value)}
                                className="w-full text-sm px-3 pt-3 pb-2.5 outline-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400/60 dark:placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs border border-red-500/20 dark:border-red-500/15 focus:border-red-500/50 transition-colors"
                                placeholder={confirmationWord}
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 mb-4 text-center font-mono text-[11px]">{error}</p>
                    )}
                </div>

                {/* footer */}
                <div className="px-6 py-4 border-t border-emerald-500/10 bg-emerald-500/[0.03] flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-4 h-9 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/[0.06] font-mono text-[11px] uppercase tracking-[0.15em] transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={!canConfirm || isDeleting}
                        className="px-4 h-9 border border-red-500/30 hover:border-red-500/60 text-red-500 hover:bg-red-500/[0.06] font-mono text-[11px] uppercase tracking-[0.15em] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isDeleting ? (
                            <><div className="w-4 h-4 animate-spin">{Icons.spinner}</div>Eliminando...</>
                        ) : (
                            'Eliminar cuenta'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
