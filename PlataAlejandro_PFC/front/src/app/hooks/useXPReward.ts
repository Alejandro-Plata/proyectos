import { useState, useCallback } from 'react';
import type { XPRewardResponse } from '../services/xpService';

interface UseXPRewardReturn {
    xpReward: XPRewardResponse | null;
    showModal: boolean;
    triggerXPModal: (reward: XPRewardResponse) => void;
    closeModal: () => void;
}

export function useXPReward(): UseXPRewardReturn {
    const [xpReward, setXpReward] = useState<XPRewardResponse | null>(null);
    const [showModal, setShowModal] = useState(false);

    const triggerXPModal = useCallback((reward: XPRewardResponse) => {
        setXpReward(reward);
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setTimeout(() => setXpReward(null), 500);
    }, []);

    return { xpReward, showModal, triggerXPModal, closeModal };
}
