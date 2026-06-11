interface Props {
    titulo: string;
    descripcion?: string;
    textoConfirmar?: string;
    onConfirmar: () => void;
    onCancelar: () => void;
}

export const ModalConfirmacion = ({
    titulo,
    descripcion,
    textoConfirmar = 'Eliminar',
    onConfirmar,
    onCancelar,
}: Props) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancelar} />
        <div className="relative z-10 w-full max-w-sm bg-white dark:bg-[#0a0b0e] border border-rose-500/25 dark:border-rose-500/20 shadow-2xl shadow-rose-500/10">

            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-rose-500/15 bg-rose-500/[0.03]">
                <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] text-rose-500">⚠</span>
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-900 dark:text-white font-bold">
                        Confirmar eliminación
                    </h2>
                </div>
                <button
                    onClick={onCancelar}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                    aria-label="Cerrar"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5 space-y-1.5">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{titulo}</p>
                {descripcion && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{descripcion}</p>
                )}
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 flex gap-3 justify-end">
                <button
                    onClick={onCancelar}
                    className="font-mono text-[10px] uppercase tracking-wider px-4 py-2 border border-slate-300/60 dark:border-slate-600/50 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={onConfirmar}
                    className="font-mono text-[10px] uppercase tracking-wider px-4 py-2 border border-rose-500/50 bg-rose-500/[0.08] text-rose-600 dark:text-rose-400 hover:bg-rose-500/15 hover:border-rose-500/70 transition-colors"
                >
                    {textoConfirmar}
                </button>
            </div>
        </div>
    </div>
);
