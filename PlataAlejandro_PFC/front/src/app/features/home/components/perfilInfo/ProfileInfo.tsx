import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { User } from "../../../../context/types/types";
import { calculateLevelFromXP } from "../../../../utils/consts/xpConsts";
import { getAvatarUrl } from "../../../../utils/getAvatarUrl";

gsap.registerPlugin(useGSAP);

interface Props {
    user: User;
    xpPercentage?: number;
}

export const ProfileInfo = ({ user }: Props) => {
    const barRef = useRef<HTMLDivElement>(null);
    const xpTextRef = useRef<HTMLSpanElement>(null);

    const levelInfo = calculateLevelFromXP(user.experience_points);

    useGSAP(() => {
        const obj = { val: 0 };
        gsap.fromTo(barRef.current, { width: '0%' }, {
            width: `${levelInfo.progressPercent}%`,
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.3,
        });
        gsap.to(obj, {
            val: user.experience_points,
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.3,
            onUpdate: () => {
                if (xpTextRef.current) {
                    xpTextRef.current.textContent =
                        `${Math.round(obj.val).toLocaleString()} / ${levelInfo.requiredForNextLevel} XP`;
                }
            },
        });
    }, { dependencies: [user.experience_points] });

    return (
        <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 p-6 sm:p-8 shadow-sm shadow-emerald-500/5 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 transition-colors duration-300">
            {/* Avatar BB-11 — hex-shield wrapper, no rounded-full */}
            <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 dark:bg-[#0f1115] border-2 border-emerald-500/30 flex items-center justify-center overflow-hidden">
                    <img
                        src={getAvatarUrl(user.username, user.avatar_url)}
                        alt="Avatar"
                        className="hex-shield w-full h-full object-cover"
                    />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-white dark:bg-[#050505] p-1">
                    <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono text-xs uppercase tracking-[0.15em] px-3 py-1.5 border border-slate-700 dark:border-slate-200 shadow-sm">
                        LVL {user.current_level || 1}
                    </div>
                </div>
            </div>

            {/* Info, Bio, Redes & Progreso */}
            <div className="flex-1 w-full flex flex-col justify-center mt-2 md:mt-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">

                    {/* Datos de Usuario */}
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="font-mono text-2xl sm:text-3xl uppercase tracking-[0.1em] text-slate-900 dark:text-white leading-tight">
                                {user.username}
                            </h1>
                            {/* Badge de Rol */}
                            {user.role !== 'USUARIO' && (
                                <span className={`font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border ${
                                    user.role === 'ADMIN'
                                        ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400'
                                        : 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400'
                                }`}>
                                    {user.role}
                                </span>
                            )}
                        </div>

                        {/* Bio */}
                        {user.bio ? (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-lg leading-relaxed">
                                {user.bio}
                            </p>
                        ) : (
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">
                                Desarrollador en formación
                            </p>
                        )}

                        {/* Redes Sociales */}
                        {(user.github_url || user.linkedin_url) && (
                            <div className="flex items-center gap-3 mt-3">
                                {user.github_url && (
                                    <a href={user.github_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                                    </a>
                                )}
                                {user.linkedin_url && (
                                    <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#0A66C2] dark:text-slate-500 dark:hover:text-[#0A66C2] transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Progreso Numérico */}
                    <div className="text-left sm:text-right shrink-0 mt-4 sm:mt-0">
                        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 block mb-1">
                            Progreso
                        </span>
                        <span className="font-mono text-sm text-slate-700 dark:text-slate-300">
                            <span ref={xpTextRef}>
                                0 / {levelInfo.requiredForNextLevel} XP
                            </span>
                        </span>
                    </div>
                </div>

                {/* Barra de progreso con GSAP */}
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 overflow-hidden border border-emerald-500/15 dark:border-emerald-500/10 mt-auto">
                    <div
                        ref={barRef}
                        className="h-full bg-emerald-500 dark:bg-emerald-400"
                        style={{ width: '0%' }}
                    />
                </div>
            </div>
        </div>
    );
};
