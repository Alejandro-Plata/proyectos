import { Icons } from '../../../components/Icons';
import type { BlockType } from '../types/types';
import { BLOCK_MODAL_OPTIONS, BLOCK_MODAL_COLORS } from '../utils';

interface BlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (type: BlockType) => void;
}

export const BlockModal = ({ isOpen, onClose, onSelect }: BlockModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white dark:bg-[#0a0b0e] w-full max-w-lg border border-emerald-500/15 dark:border-emerald-500/10 shadow-xl shadow-emerald-500/5 p-6 relative animate-in zoom-in-95 duration-200"
                style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-5 pb-4 border-b border-emerald-500/10 dark:border-emerald-500/[0.07]">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Añadir bloque</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                        {Icons.close}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {BLOCK_MODAL_OPTIONS.map((opt) => {
                        const c = BLOCK_MODAL_COLORS[opt.color];
                        return (
                            <button
                                key={opt.type}
                                onClick={() => onSelect(opt.type as BlockType)}
                                className={`flex flex-col items-start p-4 border border-emerald-500/15 dark:border-emerald-500/10 ${c.bg} ${c.hoverBg} transition-colors text-left`}
                            >
                                <div className={`p-2 ${c.iconBg} mb-3 transition-colors`}>
                                    {opt.type === 'text' && Icons.document}
                                    {opt.type === 'definition' && Icons.lightbulb}
                                    {opt.type === 'code' && Icons.code}
                                    {opt.type === 'image' && Icons.image}
                                </div>
                                <span className={`text-xs font-bold text-slate-800 dark:text-white ${c.text} mb-1 font-mono uppercase tracking-[0.15em]`}>
                                    {opt.label}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {opt.desc}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Footer border */}
                <div className="mt-5 pt-4 border-t border-emerald-500/10 dark:border-emerald-500/[0.07]" />
            </div>
        </div>
    );
};
