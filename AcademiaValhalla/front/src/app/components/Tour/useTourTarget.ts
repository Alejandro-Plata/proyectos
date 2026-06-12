import { useState, useEffect, useRef } from 'react';
import type { TargetRect } from './tourTypes';

const PAD = 8; // padding alrededor del spotlight en px

export const useTourTarget = (selector: string | undefined, active: boolean): TargetRect | null => {
    const [rect, setRect] = useState<TargetRect | null>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (!active || !selector) {
            setRect(null);
            return;
        }

        const measure = () => {
            const el = document.querySelector<HTMLElement>(selector);
            if (!el) { setRect(null); return; }
            const r = el.getBoundingClientRect();
            setRect({
                x: r.x - PAD,
                y: r.y - PAD,
                width: r.width + PAD * 2,
                height: r.height + PAD * 2,
            });
        };

        measure();

        // Scroll al elemento si está fuera del viewport
        const el = document.querySelector<HTMLElement>(selector);
        if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });

        const onScroll = () => { rafRef.current = requestAnimationFrame(measure); };
        const onResize = () => { rafRef.current = requestAnimationFrame(measure); };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });

        const ro = new ResizeObserver(() => { rafRef.current = requestAnimationFrame(measure); });
        if (el) ro.observe(el);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            ro.disconnect();
            cancelAnimationFrame(rafRef.current);
        };
    }, [selector, active]);

    return rect;
};
