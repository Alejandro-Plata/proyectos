import { useState, useCallback, useRef } from 'react';

interface PropsEntradaAsistente {
    alEnviar: (message: string) => void;
    estaPensando: boolean;
}

export const EntradaAsistente = ({ alEnviar, estaPensando }: PropsEntradaAsistente) => {
    const [texto, setTexto] = useState('');
    const refAreaTexto = useRef<HTMLTextAreaElement>(null);

    const manejarEnvio = useCallback(() => {
        if (!texto.trim() || estaPensando) return;
        alEnviar(texto.trim());
        setTexto('');
        if (refAreaTexto.current) refAreaTexto.current.style.height = 'auto';
    }, [texto, estaPensando, alEnviar]);

    const manejarTecla = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            manejarEnvio();
        }
    }, [manejarEnvio]);

    const manejarCambio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTexto(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
    };

    const puedeEnviar = texto.trim().length > 0 && !estaPensando;

    return (
        <div className="px-4 pb-4 pt-3 border-t border-slate-200 dark:border-emerald-500/10 bg-white dark:bg-[#050505]">
            <div className="max-w-3xl mx-auto space-y-2">
                <div className={`flex items-center gap-2 bg-slate-50 dark:bg-[#0a0b0e] pl-4 pr-2 py-1.5 transition-colors border ${puedeEnviar ? 'border-emerald-500/50 dark:border-emerald-500/30' : 'border-slate-200 dark:border-emerald-500/15'}`}>
                    <textarea
                        ref={refAreaTexto}
                        value={texto}
                        onChange={manejarCambio}
                        onKeyDown={manejarTecla}
                        placeholder={estaPensando ? 'Freya está pensando...' : 'Escribe tu pregunta...'}
                        disabled={estaPensando}
                        rows={1}
                        className="flex-1 resize-none bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none leading-5 py-1.5 max-h-40 scrollbar-hide disabled:opacity-50"
                    />
                    <button
                        onClick={manejarEnvio}
                        disabled={!puedeEnviar}
                        style={puedeEnviar ? { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' } : undefined}
                        className={`shrink-0 self-end w-9 h-9 flex items-center justify-center transition-colors ${puedeEnviar ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-slate-600 cursor-not-allowed'}`}
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
