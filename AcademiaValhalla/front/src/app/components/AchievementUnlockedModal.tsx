import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { UnlockedAchievement } from '../hooks/useAchievementUnlock';
import { getAchievementIcon } from '../utils/achievementIcons';
import { getEmblemUrl } from '../utils/getAvatarUrl';

gsap.registerPlugin(useGSAP);

const RARITY_CONFIG = {
    common: {
        glow: 'rgba(100,116,139,0.4)',
        badge: 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-white/[0.04] dark:text-slate-400 dark:border-white/10',
        label: 'Común',
        accent: '#64748b',
    },
    rare: {
        glow: 'rgba(6,182,212,0.4)',
        badge: 'bg-cyan-500/[0.08] text-cyan-600 border border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-400',
        label: 'Raro',
        accent: '#06b6d4',
    },
    epic: {
        glow: 'rgba(168,85,247,0.5)',
        badge: 'bg-violet-500/[0.08] text-violet-600 border border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400',
        label: 'Épico',
        accent: '#a855f7',
    },
    legendary: {
        glow: 'rgba(245,158,11,0.6)',
        badge: 'bg-amber-500/[0.08] text-amber-600 border border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
        label: 'Legendario',
        accent: '#f59e0b',
    },
};

interface Props {
    achievement: UnlockedAchievement;
    visible: boolean;
    onClose: () => void;
}

function spawnParticles(container: HTMLElement, color: string) {
    for (let i = 0; i < 24; i++) {
        const p = document.createElement('div');
        p.style.cssText = `
            position: absolute; top: 50%; left: 50%;
            width: ${4 + Math.random() * 5}px;
            height: ${4 + Math.random() * 5}px;
            border-radius: 50%;
            background: ${color};
            pointer-events: none;
            z-index: 10;
        `;
        container.appendChild(p);

        const angle = (i / 24) * Math.PI * 2;
        const dist = 60 + Math.random() * 80;
        gsap.fromTo(
            p,
            { x: 0, y: 0, autoAlpha: 1, scale: 1 },
            {
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                autoAlpha: 0,
                scale: 0.3,
                duration: 0.8 + Math.random() * 0.4,
                ease: 'power2.out',
                onComplete: () => p.remove(),
            }
        );
    }
}

export default function AchievementUnlockedModal({ achievement, visible, onClose }: Props) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<gsap.core.Tween | null>(null);

    const rarity = achievement.achievement.rarity as keyof typeof RARITY_CONFIG;
    const config = RARITY_CONFIG[rarity] ?? RARITY_CONFIG.common;

    useGSAP(() => {
        if (!visible || !overlayRef.current || !cardRef.current || !badgeRef.current) return;

        timerRef.current?.kill();

        const tl = gsap.timeline();

        tl.fromTo(overlayRef.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.3 }
        )
        .fromTo(cardRef.current,
            { autoAlpha: 0, y: 40, scale: 0.88 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
            '-=0.15'
        )
        .fromTo(badgeRef.current,
            { autoAlpha: 0, scale: 0.3, rotation: -20 },
            { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' },
            '-=0.2'
        )
        .call(() => {
            if (particlesRef.current) {
                spawnParticles(particlesRef.current, config.accent);
            }
        });

        timerRef.current = gsap.delayedCall(4.5, onClose);

        return () => {
            tl.kill();
            timerRef.current?.kill();
        };
    }, { dependencies: [visible, achievement.achievement.achievement_id] });

    useEffect(() => {
        if (!visible && cardRef.current && overlayRef.current) {
            gsap.to(cardRef.current, { autoAlpha: 0, y: 20, scale: 0.95, duration: 0.25, ease: 'power2.in' });
            gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.25 });
        }
    }, [visible]);

    if (!visible && !achievement) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ opacity: 0 }}
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            <div
                ref={cardRef}
                className="relative z-10 w-full max-w-sm bg-white dark:bg-[#0a0b0e] notched-diag border border-emerald-500/20 dark:border-emerald-500/15 shadow-2xl overflow-hidden text-center"
                style={{ opacity: 0 }}
            >
                {/* Glow de fondo basado en rareza */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(ellipse at top, ${config.glow} 0%, transparent 60%)`,
                    }}
                />

                {/* Partículas */}
                <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

                {/* Header */}
                <div className="pt-8 pb-4 px-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 mb-4">
                        ¡Logro Desbloqueado!
                    </p>

                    {/* Emblema */}
                    <div
                        ref={badgeRef}
                        className="relative mx-auto w-24 h-24 flex items-center justify-center mb-5 border"
                        style={{
                            clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
                            background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
                            borderColor: config.accent,
                            boxShadow: `0 0 24px ${config.glow}`,
                            opacity: 0,
                        }}
                    >
                        {getEmblemUrl(achievement.achievement.emblem_url) ? (
                            <img
                                src={getEmblemUrl(achievement.achievement.emblem_url)!}
                                alt={achievement.achievement.title}
                                className="w-16 h-16 object-contain"
                            />
                        ) : (
                            <span style={{ color: config.accent }}>
                                {getAchievementIcon(achievement.achievement.trigger_type, 'w-12 h-12')}
                            </span>
                        )}
                    </div>

                    {/* Rareza badge */}
                    <span
                        style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
                        className={`inline-flex items-center px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] font-bold mb-3 ${config.badge}`}
                    >
                        {config.label}
                    </span>

                    <h2 className="font-mono font-bold uppercase tracking-[0.1em] text-xl text-slate-900 dark:text-white mb-2">
                        {achievement.achievement.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {achievement.achievement.description}
                    </p>
                </div>

                {/* XP footer */}
                {achievement.achievement.xp_reward > 0 && (
                    <div className="mx-6 mb-6 mt-2 py-3 px-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20">
                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-emerald-600 dark:text-emerald-400">
                            +{achievement.achievement.xp_reward} XP ganado
                        </p>
                    </div>
                )}

                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="w-full py-4 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors border-t border-emerald-500/10"
                >
                    Continuar
                </button>
            </div>
        </div>
    );
}
