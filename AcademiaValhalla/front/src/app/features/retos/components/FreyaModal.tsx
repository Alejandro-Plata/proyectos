import { ChatAsistente } from '../../asistente/components/ChatAsistente';
import { Icons } from '../../../components/Icons';
import type { AssistantContext } from '../../asistente/types/types';

interface FreyaModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDark: boolean;
    context?: AssistantContext;
}

export const FreyaModal = ({ isOpen, onClose, isDark, context }: FreyaModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={`
            fixed bottom-6 right-6 z-50
            w-[420px] h-[560px]
            shadow-2xl overflow-hidden
            flex flex-col
            border
            animate-in slide-in-from-bottom-4 fade-in duration-300
            bg-white border-emerald-500/15 shadow-emerald-500/5
            dark:bg-[#0a0b0e] dark:border-emerald-500/10 dark:shadow-black/50
        `}
            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
        >
            {/* Barra de título */}
            <div className={`
                flex items-center justify-between px-4 py-2.5 border-b shrink-0
                bg-slate-50 border-emerald-500/15 dark:bg-[#0f1115] dark:border-emerald-500/10
            `}>
                <div className="flex items-center gap-2">
                    <img src="/images/logo_freya.png" alt="Freya" className="w-6 h-6 object-cover mix-blend-multiply dark:mix-blend-screen" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-800 dark:text-white">
                        Freya · Asistente
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center transition-colors hover:bg-slate-100 text-slate-500 dark:hover:bg-white/10 dark:text-slate-400"
                >
                    {Icons.close}
                </button>
            </div>

            {/* Chat sin cabecera interna */}
            <div className="flex-1 overflow-hidden">
                <ChatAsistente isDark={isDark} context={context} mostrarEncabezado={false} />
            </div>
        </div>
    );
};
