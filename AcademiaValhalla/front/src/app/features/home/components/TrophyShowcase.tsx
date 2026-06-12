import { useState, useEffect } from 'react';
import type { Trophy } from '../types/types';
import { fetchUserAchievements } from '../services/dashboardService';
import { getAchievementIcon } from '../../../utils/achievementIcons';
import { getEmblemUrl } from '../../../utils/getAvatarUrl';

const RARITY_STYLES: Record<string, string> = {
    common: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10',
    rare: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    epic: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 dark:border-fuchsia-500/20',
    legendary: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
};

const RARITY_ES: Record<string, string> = {
    common: 'Común',
    rare: 'Raro',
    epic: 'Épico',
    legendary: 'Legendario',
};

export const TrophyShowcase = () => {
    const [trophies, setTrophies] = useState<Trophy[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUserAchievements()
            .then((data) => {
                setTrophies(data);
                if (data.length > 0) setSelectedId(data[0].achievement_id);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const selectedTrophy = trophies.find((t) => t.achievement_id === selectedId) ?? trophies[0] ?? null;
    const unlockedCount = trophies.filter((t) => t.is_unlocked).length;

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 p-10 flex items-center justify-center shadow-sm shadow-emerald-500/5 transition-colors duration-300">
                <div className="w-6 h-6 border-[3px] border-slate-200 border-t-emerald-500 dark:border-white/10 dark:border-t-emerald-500 animate-spin" />
            </div>
        );
    }

    if (trophies.length === 0) {
        return (
            <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 p-10 text-center shadow-sm shadow-emerald-500/5 transition-colors duration-300">
                <svg className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Sin logros disponibles aún</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5 overflow-hidden flex flex-col md:flex-row transition-colors duration-300">

            {/* Panel de Detalles (Izquierda en Desktop, Arriba en Mobile) */}
            <div className="md:w-2/5 p-6 border-b md:border-b-0 md:border-r border-emerald-500/10 bg-slate-50 dark:bg-white/[0.02]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Insignia</h2>
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 bg-white dark:bg-[#050505] px-2 py-1 border border-emerald-500/15 dark:border-emerald-500/10">
                        {unlockedCount} / {trophies.length}
                    </span>
                </div>

                {selectedTrophy && (
                    <div className="flex flex-col items-center text-center">
                        {/* hex-shield emblem — BB-11 */}
                        <div className={`w-28 h-28 mb-5 flex items-center justify-center border transition-all duration-300 ${
                            selectedTrophy.is_unlocked
                                ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-transparent dark:from-emerald-500/10 shadow-[0_0_30px_-8px_rgba(16,185,129,0.65)]'
                                : 'border-emerald-500/10 bg-white dark:bg-[#050505] opacity-70 grayscale'
                        }`}>
                            {getEmblemUrl(selectedTrophy.emblem_url) ? (
                                <img
                                    src={getEmblemUrl(selectedTrophy.emblem_url)!}
                                    alt={selectedTrophy.title}
                                    className="hex-shield w-20 h-20 object-contain"
                                />
                            ) : (
                                <span className={selectedTrophy.is_unlocked ? 'text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'text-slate-400 dark:text-slate-600'}>
                                    {getAchievementIcon(selectedTrophy.trigger_type, 'w-16 h-16')}
                                </span>
                            )}
                        </div>

                        <span className={`font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border mb-3 ${RARITY_STYLES[selectedTrophy.rarity] ?? RARITY_STYLES['common']}`}>
                            {RARITY_ES[selectedTrophy.rarity] ?? selectedTrophy.rarity}
                        </span>

                        <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-slate-900 dark:text-white mb-2 leading-tight">
                            {selectedTrophy.title}
                        </h3>

                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                            {selectedTrophy.description}
                        </p>

                        {selectedTrophy.xp_reward > 0 && (
                            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 mb-3">
                                +{selectedTrophy.xp_reward} XP al desbloquear
                            </p>
                        )}

                        {!selectedTrophy.is_unlocked && (
                            <div className="w-full mt-2">
                                <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-1.5">
                                    <span>Progreso</span>
                                    <span>{selectedTrophy.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                                    <div
                                        className="h-full bg-slate-400 dark:bg-slate-500 transition-all duration-500"
                                        style={{ width: `${selectedTrophy.progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {selectedTrophy.is_unlocked && selectedTrophy.unlocked_at && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                Desbloqueado el {new Date(selectedTrophy.unlocked_at).toLocaleDateString('es-ES')}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Cuadrícula de Insignias */}
            <div className="md:w-3/5 p-6">
                <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Colección</h2>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {trophies.map((trophy) => (
                        <button
                            key={trophy.achievement_id}
                            onClick={() => setSelectedId(trophy.achievement_id)}
                            className={`relative aspect-square flex items-center justify-center transition-all duration-200 border ${
                                selectedId === trophy.achievement_id
                                    ? 'border-emerald-500 ring-1 ring-emerald-500'
                                    : 'border-emerald-500/15 dark:border-emerald-500/10 hover:border-emerald-500/40'
                            } ${
                                trophy.is_unlocked
                                    ? 'bg-gradient-to-br from-emerald-500/15 to-transparent dark:from-emerald-500/10 shadow-[0_0_18px_-6px_rgba(16,185,129,0.6)] hover:from-emerald-500/25'
                                    : 'bg-slate-50 dark:bg-[#050505] hover:bg-white dark:hover:bg-white/5'
                            }`}
                        >
                            {getEmblemUrl(trophy.emblem_url) ? (
                                <img
                                    src={getEmblemUrl(trophy.emblem_url)!}
                                    alt={trophy.title}
                                    className={`hex-shield w-4/5 h-4/5 object-contain transition-all duration-300 ${
                                        trophy.is_unlocked ? 'opacity-100' : 'opacity-30 grayscale'
                                    }`}
                                />
                            ) : (
                                <span className={`transition-all duration-300 ${trophy.is_unlocked ? 'text-emerald-500 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'text-slate-400 dark:text-slate-600 opacity-40'}`}>
                                    {getAchievementIcon(trophy.trigger_type, 'w-11 h-11')}
                                </span>
                            )}
                            {trophy.is_unlocked && (
                                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-[#0a0b0e] flex items-center justify-center z-10">
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
