import { createPortal } from 'react-dom';
import type { TourStep, TargetRect } from './tourTypes';
import { useTourTarget } from './useTourTarget';
import { TourTooltip } from './TourTooltip';

interface Props {
    step: TourStep;
    currentIndex: number;
    totalSteps: number;
    onNext: () => void;
    onPrev: () => void;
    onStop: () => void;
}

export const TourOverlay = ({ step, currentIndex, totalSteps, onNext, onPrev, onStop }: Props) => {
    const selector = step.target ? `[data-tour="${step.target}"]` : undefined;
    const targetRect = useTourTarget(selector, true);

    return createPortal(
        <>
            <Backdrop rect={targetRect} interactive={step.interactive} onStop={onStop} />
            <TourTooltip
                step={step}
                currentIndex={currentIndex}
                totalSteps={totalSteps}
                targetRect={targetRect}
                onNext={onNext}
                onPrev={onPrev}
                onStop={onStop}
            />
        </>,
        document.body,
    );
};

/* ---- Backdrop con spotlight ---- */

function Backdrop({
    rect,
    interactive,
    onStop,
}: {
    rect: TargetRect | null;
    interactive?: boolean;
    onStop: () => void;
}) {
    if (!rect) {
        return (
            <div
                className="fixed inset-0"
                style={{ zIndex: 100, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
                onClick={onStop}
            />
        );
    }

    const { x, y, width, height } = rect;

    // SVG spotlight: full-viewport rect with a hole cut out
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const rx = 6; // border-radius of spotlight hole

    return (
        <>
            {/* SVG backdrop con agujero */}
            <svg
                className="fixed inset-0 pointer-events-none"
                style={{ zIndex: 100, width: vw, height: vh }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <mask id="tour-spotlight-mask">
                        {/* Todo blanco = visible */}
                        <rect x={0} y={0} width={vw} height={vh} fill="white" />
                        {/* Agujero negro = transparente */}
                        <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            rx={rx}
                            ry={rx}
                            fill="black"
                        />
                    </mask>
                </defs>
                {/* Overlay oscuro con agujero */}
                <rect
                    x={0}
                    y={0}
                    width={vw}
                    height={vh}
                    fill="rgba(0,0,0,0.60)"
                    mask="url(#tour-spotlight-mask)"
                />
            </svg>

            {/* Click-to-close layer (excluyendo spotlight) */}
            <div
                className="fixed inset-0"
                style={{ zIndex: 101 }}
                onClick={onStop}
            />

            {/* Ring alrededor del spotlight */}
            <div
                className="fixed pointer-events-none"
                style={{
                    zIndex: 102,
                    left: x - 2,
                    top: y - 2,
                    width: width + 4,
                    height: height + 4,
                    borderRadius: rx + 2,
                    boxShadow: '0 0 0 2px rgba(16,185,129,0.7)',
                    animation: 'tour-ring-pulse 2s ease-in-out infinite',
                }}
            />

            {/* Si el paso es interactivo, poner un pass-through encima del spotlight */}
            {interactive && (
                <div
                    className="fixed"
                    style={{
                        zIndex: 103,
                        left: x,
                        top: y,
                        width,
                        height,
                        borderRadius: rx,
                        pointerEvents: 'auto',
                    }}
                />
            )}
        </>
    );
}
