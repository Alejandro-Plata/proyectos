interface Props {
    onClose: () => void;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
const MOD = isMac ? '⌘' : 'Ctrl';

const SHORTCUTS = [
    { keys: [MOD, 'B'],        label: 'Negrita' },
    { keys: [MOD, 'I'],        label: 'Cursiva' },
    { keys: [MOD, '`'],        label: 'Código inline' },
    { keys: [MOD, 'K'],        label: 'Enlace' },
    { keys: [MOD, '1'],        label: 'Encabezado H1' },
    { keys: [MOD, '2'],        label: 'Encabezado H2' },
    { keys: [MOD, '3'],        label: 'Encabezado H3' },
    { keys: [MOD, '⇧', 'W'],   label: 'Advertencia' },
    { keys: [MOD, '⇧', 'T'],   label: 'Término técnico' },
    { keys: [MOD, '⇧', 'L'],   label: 'Valor literal' },
];

export const ShortcutsModal = ({ onClose }: Props) => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div
            className="relative z-10 w-full max-w-sm bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-xl shadow-emerald-500/5 overflow-hidden"
            style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}
        >

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-500/10 dark:border-emerald-500/[0.07]">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Atajos de teclado</h2>
                <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Shortcuts list */}
            <div className="py-2">
                {SHORTCUTS.map(({ keys, label }) => (
                    <div
                        key={label}
                        className="flex items-center justify-between px-5 py-2.5 hover:bg-emerald-500/[0.03] transition-colors"
                    >
                        <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
                        <div className="flex items-center gap-1">
                            {keys.map((k, i) => (
                                <span key={i} className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 text-[10px] font-bold font-mono bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-emerald-500/15 dark:border-emerald-500/10">
                                    {k}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-emerald-500/10 dark:border-emerald-500/[0.07] bg-emerald-500/[0.02]">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-mono uppercase tracking-[0.15em]">
                    Los atajos funcionan mientras el cursor está en el área de texto.
                </p>
            </div>
        </div>
    </div>
);
