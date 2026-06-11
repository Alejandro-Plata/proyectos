import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { XPRewardResponse } from '../../../services/xpService';
import { XP_MODAL_MESSAGES } from '../../../utils/consts/xpConsts';

gsap.registerPlugin(useGSAP);

interface PropsModalRecompensaXP {
    reward: XPRewardResponse;
    visible: boolean;
    onClose: () => void;
}

export default function ModalRecompensaXP({ reward, visible, onClose }: PropsModalRecompensaXP) {
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const xpCounterRef = useRef<HTMLSpanElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);
    const levelBadgeRef = useRef<HTMLDivElement>(null);
    const shineRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!visible || !containerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                onComplete: () => {
                    gsap.delayedCall(4, () => handleClose());
                },
            });

            tl.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
            tl.fromTo(cardRef.current,
                { autoAlpha: 0, scale: 0.5, y: 60, rotateX: 15 },
                { autoAlpha: 1, scale: 1, y: 0, rotateX: 0, duration: 0.6, ease: 'back.out(1.7)' },
                '-=0.1'
            );
            tl.fromTo(shineRef.current, { x: '-100%' }, { x: '200%', duration: 0.8, ease: 'power2.inOut' }, '-=0.3');

            const xpObj = { val: 0 };
            tl.to(xpObj, {
                val: reward.xpGained,
                duration: 1.2,
                ease: 'power2.out',
                onUpdate: () => {
                    if (xpCounterRef.current) {
                        xpCounterRef.current.textContent = `+${Math.round(xpObj.val)} XP`;
                    }
                },
            }, '-=0.4');

            if (reward.leveledUp) {
                tl.fromTo(progressBarRef.current, { width: '0%' }, { width: '100%', duration: 0.8, ease: 'power2.inOut' }, '-=0.6');
                tl.to(progressBarRef.current, { backgroundColor: '#fbbf24', duration: 0.2 });
                tl.fromTo(levelBadgeRef.current, { scale: 0, rotation: -180 }, { scale: 1.3, rotation: 0, duration: 0.5, ease: 'back.out(2)' });
                tl.to(levelBadgeRef.current, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.4)' });
                tl.call(() => spawnParticles(particlesRef.current), [], '-=0.5');
                tl.set(progressBarRef.current, { width: '0%', backgroundColor: '#10b981' });
                tl.to(progressBarRef.current, { width: `${reward.progressPercent}%`, duration: 0.6, ease: 'power2.out' });
            } else {
                const prevPercent = Math.max(0, reward.progressPercent - Math.round((reward.xpGained / reward.requiredForNextLevel) * 100));
                tl.fromTo(progressBarRef.current, { width: `${prevPercent}%` }, { width: `${reward.progressPercent}%`, duration: 1, ease: 'power2.out' }, '-=0.6');
            }
        }, containerRef);

        return () => ctx.revert();
    }, { dependencies: [visible, reward], scope: containerRef });

    function handleClose() {
        if (!cardRef.current || !overlayRef.current) { onClose(); return; }
        const tl = gsap.timeline({ onComplete: onClose });
        tl.to(cardRef.current, { autoAlpha: 0, scale: 0.8, y: 30, duration: 0.3, ease: 'power2.in' });
        tl.to(overlayRef.current, { autoAlpha: 0, duration: 0.2 }, '-=0.1');
    }

    if (!visible) return null;

    const esSubidaNivel = reward.leveledUp;

    return (
        <div ref={containerRef} className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div ref={overlayRef} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} style={{ visibility: 'hidden' }} />
            <div
                ref={cardRef}
                className="relative z-10 w-[90vw] max-w-sm notched-diag overflow-hidden bg-white dark:bg-[#0a0b0e] border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 p-6 text-center"
                style={{ visibility: 'hidden', perspective: '600px' }}
            >
                <div ref={shineRef} className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" style={{ transform: 'translateX(-100%)' }} />
                <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

                <h2 className={`font-mono text-[11px] uppercase tracking-[0.3em] mb-1 ${esSubidaNivel ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {esSubidaNivel ? XP_MODAL_MESSAGES.LEVEL_UP_TITLE : XP_MODAL_MESSAGES.XP_GAINED_TITLE}
                </h2>
                <p className="font-mono text-slate-500 dark:text-gray-400 text-[10px] uppercase tracking-[0.15em] mb-4">
                    {esSubidaNivel ? XP_MODAL_MESSAGES.LEVEL_UP_SUBTITLE : XP_MODAL_MESSAGES.XP_GAINED_SUBTITLE}
                </p>

                <div className="mb-4">
                    <span ref={xpCounterRef} className="text-4xl font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">+0 XP</span>
                </div>

                <div ref={levelBadgeRef} className="mb-4">
                    <div
                        style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                        className={`inline-flex items-center gap-2 px-4 py-2 ${esSubidaNivel ? 'bg-amber-100 border border-amber-400/60 dark:bg-amber-500/20 dark:border-amber-500/50' : 'bg-emerald-100 border border-emerald-400/60 dark:bg-emerald-500/20 dark:border-emerald-500/50'}`}
                    >
                        <svg className={`w-5 h-5 ${esSubidaNivel ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.5 17.5L3 6V3h3l11.5 11.5m0 0l-1.5 1.5m1.5-1.5L21 21m-8.5-8.5L15 11"/></svg>
                        <span className={`font-mono font-bold text-lg ${esSubidaNivel ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {XP_MODAL_MESSAGES.CURRENT_LEVEL_LABEL}: {reward.newLevel}
                        </span>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-gray-400 mb-1">
                        <span>LVL {reward.newLevel}</span>
                        <span>{reward.currentLevelXP} / {reward.requiredForNextLevel} XP</span>
                        <span>LVL {reward.newLevel + 1}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 dark:bg-gray-700 overflow-hidden">
                        <div ref={progressBarRef} className="h-full bg-emerald-500" style={{ width: '0%' }} />
                    </div>
                </div>

                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-gray-500 mt-2">
                    {reward.requiredForNextLevel - reward.currentLevelXP} XP para el siguiente nivel
                </p>

                <button
                    onClick={handleClose}
                    style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                    className="mt-4 px-6 h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors"
                >
                    ¡Entendido!
                </button>
            </div>
        </div>
    );
}

function spawnParticles(container: HTMLDivElement | null) {
    if (!container) return;
    const colors = ['#fbbf24', '#10b981', '#60a5fa', '#f472b6', '#a78bfa'];
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full';
        const size = gsap.utils.random(4, 10);
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = '50%';
        particle.style.top = '50%';
        container.appendChild(particle);
        gsap.to(particle, {
            x: gsap.utils.random(-150, 150),
            y: gsap.utils.random(-200, 50),
            autoAlpha: 0,
            scale: gsap.utils.random(0.5, 1.5),
            duration: gsap.utils.random(0.8, 1.5),
            ease: 'power2.out',
            onComplete: () => particle.remove(),
        });
    }
}
