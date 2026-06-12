import type { TourStep, TargetRect } from './tourTypes';

interface Props {
    step: TourStep;
    currentIndex: number;
    totalSteps: number;
    targetRect: TargetRect | null;
    onNext: () => void;
    onPrev: () => void;
    onStop: () => void;
}

const TOOLTIP_W = 320;
const TOOLTIP_H_APPROX = 200;
const GAP = 12;

function computePosition(
    rect: TargetRect | null,
    placement: TourStep['placement'] = 'auto',
): React.CSSProperties {
    if (!rect) {
        return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const spaceBottom = vh - (rect.y + rect.height);
    const spaceTop    = rect.y;
    const spaceRight  = vw - (rect.x + rect.width);
    const spaceLeft   = rect.x;

    let resolved = placement;
    if (placement === 'auto') {
        if (spaceBottom >= TOOLTIP_H_APPROX + GAP) resolved = 'bottom';
        else if (spaceTop >= TOOLTIP_H_APPROX + GAP) resolved = 'top';
        else if (spaceRight >= TOOLTIP_W + GAP) resolved = 'right';
        else resolved = 'left';
    }

    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;

    let top: number, left: number;

    switch (resolved) {
        case 'bottom':
            top  = rect.y + rect.height + GAP;
            left = Math.max(8, Math.min(centerX - TOOLTIP_W / 2, vw - TOOLTIP_W - 8));
            break;
        case 'top':
            top  = rect.y - TOOLTIP_H_APPROX - GAP;
            left = Math.max(8, Math.min(centerX - TOOLTIP_W / 2, vw - TOOLTIP_W - 8));
            break;
        case 'right':
            top  = Math.max(8, Math.min(centerY - TOOLTIP_H_APPROX / 2, vh - TOOLTIP_H_APPROX - 8));
            left = rect.x + rect.width + GAP;
            break;
        default: // left
            top  = Math.max(8, Math.min(centerY - TOOLTIP_H_APPROX / 2, vh - TOOLTIP_H_APPROX - 8));
            left = rect.x - TOOLTIP_W - GAP;
    }

    return { position: 'fixed', top: `${top}px`, left: `${left}px` };
}

export const TourTooltip = ({ step, currentIndex, totalSteps, targetRect, onNext, onPrev, onStop }: Props) => {
    const posStyle = computePosition(targetRect, step.placement);
    const isFirst = currentIndex === 0;
    const isLast  = currentIndex === totalSteps - 1;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-title"
            style={{ ...posStyle, width: `${TOOLTIP_W}px`, zIndex: 110 }}
            className="bg-white dark:bg-[#0e0f12] border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 animate-in fade-in zoom-in-95 duration-200"
            onKeyDown={e => {
                if (e.key === 'ArrowRight' || e.key === 'Enter') { e.stopPropagation(); onNext(); }
                if (e.key === 'ArrowLeft')                        { e.stopPropagation(); onPrev(); }
                if (e.key === 'Escape')                           { e.stopPropagation(); onStop(); }
            }}
        >
            {/* Borde superior esmeralda */}
            <div className="h-px bg-emerald-500/60" />

            <div className="p-5">
                {/* Contador */}
                <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                        {currentIndex + 1} / {totalSteps}
                    </span>
                    <button
                        onClick={onStop}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        aria-label="Cerrar tutorial"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Título */}
                <h2 id="tour-title" className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {step.title}
                </h2>

                {/* Cuerpo */}
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
                    {step.body}
                </div>

                {/* Controles */}
                <div className="flex items-center justify-between gap-2">
                    <button
                        onClick={onPrev}
                        disabled={isFirst}
                        className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
                    >
                        ← Anterior
                    </button>
                    <button
                        onClick={onNext}
                        className="px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
                    >
                        {isLast ? 'Terminar' : 'Siguiente →'}
                    </button>
                </div>
            </div>
        </div>
    );
};
