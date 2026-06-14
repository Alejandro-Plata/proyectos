import { useRef, useState, useEffect, useMemo, useCallback } from 'react';

interface AudioMessageProps {
    src: string;
    seed?: string;
    isDark?: boolean;
    durationSec?: number;
}

const BAR_COUNT = 32;

function useWaveform(seed: string, count: number): number[] {
    return useMemo(() => {
        let h = 0;
        for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
        return Array.from({ length: count }, () => {
            h = (h * 1103515245 + 12345) & 0x7fffffff;
            return 0.25 + (h % 1000) / 1000 * 0.75;
        });
    }, [seed, count]);
}

const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export const AudioMessage = ({
    src,
    seed = '',
    isDark = false,
    durationSec,
}: AudioMessageProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const bars = useWaveform(seed, BAR_COUNT);

    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(durationSec ?? 0);
    const [current, setCurrent] = useState(0);

    const pendingColor = isDark ? 'bg-emerald-500/25' : 'bg-emerald-500/20';

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        const onTime = () => {
            setCurrent(el.currentTime);
            if (el.duration && isFinite(el.duration)) {
                setProgress(el.currentTime / el.duration);
            }
        };
        const onMeta = () => { if (isFinite(el.duration)) setDuration(el.duration); };
        const onPlay  = () => setPlaying(true);
        const onPause = () => setPlaying(false);
        const onEnd   = () => { setPlaying(false); setProgress(0); setCurrent(0); };

        el.addEventListener('timeupdate', onTime);
        el.addEventListener('loadedmetadata', onMeta);
        el.addEventListener('play', onPlay);
        el.addEventListener('pause', onPause);
        el.addEventListener('ended', onEnd);
        return () => {
            el.removeEventListener('timeupdate', onTime);
            el.removeEventListener('loadedmetadata', onMeta);
            el.removeEventListener('play', onPlay);
            el.removeEventListener('pause', onPause);
            el.removeEventListener('ended', onEnd);
        };
    }, []);

    // Reset state when src changes (e.g. new blob URL in preview)
    useEffect(() => {
        setPlaying(false);
        setProgress(0);
        setCurrent(0);
        setDuration(durationSec ?? 0);
    }, [src, durationSec]);

    const toggle = useCallback(() => {
        const el = audioRef.current;
        if (!el) return;
        if (playing) {
            el.pause();
        } else {
            setLoading(true);
            el.play().catch(() => {}).finally(() => setLoading(false));
        }
    }, [playing]);

    const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const el = audioRef.current;
        if (!el || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        el.currentTime = ratio * duration;
    }, [duration]);

    const displayTime = (playing || current > 0) ? current : duration;

    return (
        <div className="flex items-center gap-2.5 w-full min-w-0">
            <audio ref={audioRef} src={src} preload="metadata" className="hidden" />

            {/* Play / pause — cuadrado, mismo patrón que botón enviar */}
            <button
                onClick={toggle}
                type="button"
                aria-label={playing ? 'Pausar' : 'Reproducir'}
                className="shrink-0 w-7 h-7 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
            >
                {loading ? (
                    <span className="font-mono text-xs leading-none animate-pulse select-none">⠿</span>
                ) : playing ? (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <rect x="5" y="3.5" width="3.5" height="13" />
                        <rect x="11.5" y="3.5" width="3.5" height="13" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M5 3.5l11 6.5-11 6.5V3.5Z" />
                    </svg>
                )}
            </button>

            {/* Forma de onda — clic para buscar */}
            <div
                onClick={seek}
                role="slider"
                aria-valuenow={Math.round(progress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                className="flex-1 min-w-0 flex items-center gap-[2px] h-7 cursor-pointer overflow-hidden"
            >
                {bars.map((amp, i) => {
                    const played = i / bars.length <= progress;
                    return (
                        <span
                            key={i}
                            className={`flex-1 min-w-0 max-w-[3px] transition-colors ${played ? 'bg-emerald-500' : pendingColor}`}
                            style={{ height: `${Math.round(amp * 100)}%` }}
                        />
                    );
                })}
            </div>

            {/* Tiempo */}
            <span className="shrink-0 font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
                {displayTime > 0 ? fmt(displayTime) : '--:--'}
            </span>
        </div>
    );
};
