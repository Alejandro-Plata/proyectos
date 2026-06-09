import { createPortal } from 'react-dom';

interface BottomSheetProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const BottomSheet = ({ open, onClose, title, children }: BottomSheetProps) => {
    if (!open) return null;
    return createPortal(
        <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[200]">
            <button
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <div
                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#0a0b0e] border-t border-emerald-500/15 dark:border-emerald-500/10 animate-in slide-in-from-bottom duration-200 max-h-[90dvh] flex flex-col"
                style={{ paddingBottom: 'var(--safe-pb)' }}
            >
                <div className="shrink-0 flex justify-center pt-2 pb-1">
                    <div className="w-12 h-1.5 bg-emerald-500/20" />
                </div>
                {title && (
                    <div className="shrink-0 px-4 pb-3 border-b border-emerald-500/10">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        </div>,
        document.body
    );
};
