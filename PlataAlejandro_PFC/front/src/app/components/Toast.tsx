import { Icons } from './Icons';

interface ToastProps {
    show: boolean;
    type: 'success' | 'error';
    message: string;
    onDismiss: () => void;
    /** Posición. Default: 'fixed' (Desktop). Usar 'relative' para Mobile. */
    position?: 'fixed' | 'relative';
    /** Acción opcional con botón inline. */
    action?: { label: string; onClick: () => void };
}

export const Toast = ({ show, type, message, onDismiss, position = 'fixed', action }: ToastProps) => {
    const isSuccess = type === 'success';

    const positionClass = position === 'fixed'
        ? `fixed top-24 right-6 z-50 transition-all duration-300 transform ${show ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}`
        : `transition-all duration-300 ${show ? 'opacity-100 max-h-20 mb-4' : 'opacity-0 max-h-0 overflow-hidden mb-0'}`;

    return (
        <div className={positionClass} role={type === 'error' ? 'alert' : 'status'} aria-live={type === 'error' ? 'assertive' : 'polite'} aria-atomic="true">
            <div
                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                className={`flex items-center gap-3 px-4 py-3 shadow-lg border backdrop-blur-md ${
                isSuccess
                    ? 'bg-white/90 dark:bg-[#0a0b0e]/90 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-white/90 dark:bg-[#0a0b0e]/90 border-red-500/30 text-red-700 dark:text-red-400'
            }`}>
                <div
                    style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
                    className={`p-1 shrink-0 ${isSuccess ? 'bg-emerald-100 dark:bg-emerald-500/10' : 'bg-red-100 dark:bg-red-500/10'}`}
                >
                    {isSuccess
                        ? <div className="w-4 h-4">{Icons.check}</div>
                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    }
                </div>
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold">{isSuccess ? '¡Hecho!' : 'Error'}</p>
                    <p className="text-xs opacity-90">{message}</p>
                </div>
                {action && (
                    <button
                        onClick={() => { action.onClick(); onDismiss(); }}
                        style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
                        className={`shrink-0 ml-1 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] font-bold border transition-colors ${
                            isSuccess
                                ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                                : 'border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/10'
                        }`}
                    >
                        {action.label}
                    </button>
                )}
                <button onClick={onDismiss} className="ml-2 hover:opacity-70 shrink-0">
                    <div className="w-4 h-4">{Icons.close}</div>
                </button>
            </div>
        </div>
    );
};
