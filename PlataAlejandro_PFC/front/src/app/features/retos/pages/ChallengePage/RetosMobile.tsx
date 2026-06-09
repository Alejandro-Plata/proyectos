import { useState, useMemo, useEffect } from 'react';
import { useRetos } from '../../hooks/useRetos';
import { useFiltrosRetos, useEditorReto } from '../../hooks';
import type { Reto as Challenge, VarianteReto as ChallengeVariant } from '../../types/types';
import { runCode } from '../../utils';
import { setFreyaOpen } from '../../../../hooks/useFreyaOpen';
import { VistaExplorarRetos } from '../../components/VistaExplorarRetos';
import { VistaEspacioTrabajo } from '../../components/VistaEspacioTrabajo';
import { useXPReward } from '../../../../hooks/useXPReward';
import ModalRecompensaXP from '../../components/ModalRecompensaXP';
import { useAchievements } from '../../../../context/AchievementContext';
import { challengesService } from '../../services/challengesService';
import { useUser } from '../../../../context/UserContext';

export const RetosMobile = () => {
    const { challenges, isLoading, deleteChallenge } = useRetos();
    const { updateUser, user } = useUser();
    const isModOrAdmin = user?.role === 'ADMIN' || user?.role === 'MODERADOR';
    const { xpReward, showModal, triggerXPModal, closeModal } = useXPReward();
    const { encolarLogros } = useAchievements();

    const safeChallenges = Array.isArray(challenges) ? challenges : [];

    const {
        selectedLang,
        setSelectedLang,
        filteredChallenges,
        searchQuery,
        setSearchQuery,
        visibleTags,
        tagPage,
        totalTagPages,
        setTagPage,
        selectedTags,
        toggleTag,
    } = useFiltrosRetos({ safeChallenges, initialLang: 'all' });

    const {
        code,
        setCode,
        consoleOutput,
        setConsoleOutput,
        isRunning,
        setIsRunning,
        isSolved,
        setIsSolved,
        resetEditor,
    } = useEditorReto('// Escribe tu código aquí...');

    const [viewMode, setViewMode] = useState<'browsing' | 'active'>('browsing');
    const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
    const [activeVariant, setActiveVariant] = useState<ChallengeVariant | null>(null);
    const [activeTab, setActiveTab] = useState<'mission' | 'code' | 'solution'>('mission');
    const [isConsoleOpen, setIsConsoleOpen] = useState(true);
    const [showFreya, setShowFreya] = useState(false);
    const [showPropose, setShowPropose] = useState(false);

    useEffect(() => {
        setFreyaOpen(showFreya);
        return () => setFreyaOpen(false);
    }, [showFreya]);

    const availableLanguages = useMemo(() => {
        const langs = new Set<string>();
        safeChallenges.forEach(c => c.available_languages.forEach(l => langs.add(l)));
        return Array.from(langs).sort();
    }, [safeChallenges]);

    const handleChallengeClick = (challenge: Challenge) => {
        const firstVariant = challenge.variants[0] ?? null;
        setActiveChallenge(challenge);
        setActiveVariant(firstVariant);
        setViewMode('active');
        setActiveTab('mission');
        resetEditor(firstVariant?.starter_code || '// Escribe tu código aquí...');
    };

    const handleBackToBrowse = () => {
        setViewMode('browsing');
        setActiveChallenge(null);
        setActiveVariant(null);
        setShowFreya(false);
    };

    const handleVariantChange = (variant: ChallengeVariant) => {
        setActiveVariant(variant);
        resetEditor(variant.starter_code);
    };

    const handleRunCode = async () => {
        if (!activeChallenge || !activeVariant) return;
        setIsRunning(true);
        setConsoleOutput([{ type: 'log', message: '> Ejecutando tests...' }]);

        const testCode = activeVariant.test_cases.map(tc => tc.test_code).join('\n\n');
        const result = await runCode({
            code,
            testCode,
            language: activeVariant.language,
            executionTemplate: activeVariant.execution_template,
        });

        setConsoleOutput(result.logs);

        if (result.passed) {
            setIsSolved(true);
            const progressResult = await challengesService.updateProgress(activeChallenge.id, {
                status: 'COMPLETADO',
                user_solution: code,
            });
            if (progressResult.xpReward) {
                triggerXPModal(progressResult.xpReward);
            }
            if (progressResult.unlockedAchievements?.length > 0) {
                encolarLogros(progressResult.unlockedAchievements);
            }
        }

        setIsRunning(false);
        setIsConsoleOpen(true);
    };

    const handleCloseXPModal = () => {
        if (xpReward) {
            updateUser({
                experience_points: xpReward.newTotalXP,
                current_level: xpReward.newLevel,
            });
        }
        closeModal();
    };

    if (viewMode === 'browsing') {
        return (
            <VistaExplorarRetos
                isLoading={isLoading}
                filteredChallenges={filteredChallenges}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedLang={selectedLang}
                onLangChange={setSelectedLang}
                availableLanguages={availableLanguages}
                visibleTags={visibleTags}
                tagPage={tagPage}
                totalTagPages={totalTagPages}
                selectedTags={selectedTags}
                onTagPageChange={setTagPage}
                onToggleTag={toggleTag}
                onChallengeClick={handleChallengeClick}
                showPropose={showPropose}
                onOpenPropose={() => setShowPropose(true)}
                onClosePropose={() => setShowPropose(false)}
                onDeleteChallenge={isModOrAdmin ? (c) => {
                    if (confirm('¿Eliminar esta misión? Esta acción no se puede deshacer.')) {
                        deleteChallenge(c.id).catch(() => {});
                    }
                } : undefined}
            />
        );
    }

    if (!activeChallenge || !activeVariant) return null;

    return (
        <>
            <VistaEspacioTrabajo
                activeChallenge={activeChallenge}
                activeVariant={activeVariant}
                code={code}
                consoleOutput={consoleOutput}
                isRunning={isRunning}
                isSolved={isSolved}
                activeTab={activeTab}
                isConsoleOpen={isConsoleOpen}
                showFreya={showFreya}
                showPropose={showPropose}
                onBack={handleBackToBrowse}
                onVariantChange={handleVariantChange}
                onCodeChange={setCode}
                onRun={handleRunCode}
                onTabChange={setActiveTab}
                onToggleConsole={() => setIsConsoleOpen(prev => !prev)}
                onToggleFreya={() => setShowFreya(prev => !prev)}
                onOpenPropose={() => setShowPropose(true)}
                onClosePropose={() => setShowPropose(false)}
            />
            {xpReward && (
                <ModalRecompensaXP
                    reward={xpReward}
                    visible={showModal}
                    onClose={handleCloseXPModal}
                />
            )}

        </>
    );
};
