import { useState, useCallback } from 'react';

export interface UnlockedAchievement {
    achievement: {
        achievement_id: string;
        title: string;
        description: string;
        rarity: string;
        emblem_url: string | null;
        xp_reward: number;
        trigger_type: string;
    };
    xpResult: any;
    unlocked_at: string;
}

// muestra los logros desbloqueados de uno en uno; al cerrar avanza al siguiente
export function useAchievementUnlock() {
    const [, setQueue] = useState<UnlockedAchievement[]>([]);
    const [currentAchievement, setCurrentAchievement] = useState<UnlockedAchievement | null>(null);
    const [showModal, setShowModal] = useState(false);

    const enqueueAchievements = useCallback((achievements: UnlockedAchievement[]) => {
        if (achievements.length === 0) return;

        setQueue((prev) => {
            const all = [...prev, ...achievements];
            if (!showModal) {
                setCurrentAchievement(all[0]);
                setShowModal(true);
                return all.slice(1);
            }
            return all;
        });
    }, [showModal]);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setTimeout(() => {
            setQueue((prev) => {
                if (prev.length > 0) {
                    setCurrentAchievement(prev[0]);
                    setShowModal(true);
                    return prev.slice(1);
                }
                setCurrentAchievement(null);
                return [];
            });
        }, 400);
    }, []);

    return { currentAchievement, showModal, enqueueAchievements, closeModal };
}
