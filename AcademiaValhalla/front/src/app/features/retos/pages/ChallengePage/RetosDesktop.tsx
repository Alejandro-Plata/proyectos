import { useState, useEffect } from 'react';
import { useRetos } from '../../hooks/useRetos';
import { useTheme } from '../../../../hooks/useTheme';
import { setFreyaOpen } from '../../../../hooks/useFreyaOpen';
import { Icons } from '../../../../components/Icons';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import type { Reto as Challenge, VarianteReto as ChallengeVariant } from '../../types/types';
import { useFiltrosRetos, useEditorReto } from '../../hooks';
import { runCode } from '../../utils';
import { FreyaModal } from '../../components/FreyaModal';
import { ProposeMissionModal } from '../../components/ProposeMissionModal';
import { BarraLateralRetos } from '../../components/BarraLateralRetos';
import { EncabezadoReto } from '../../components/EncabezadoReto';
import { PanelGuiaReto } from '../../components/PanelGuiaReto';
import { PanelSolucionReto } from '../../components/PanelSolucionReto';
import { PanelEditorReto } from '../../components/PanelEditorReto';
import { TabBar } from '../../../../components/TabBar';
import { useXPReward } from '../../../../hooks/useXPReward';
import ModalRecompensaXP from '../../components/ModalRecompensaXP';
import { challengesService } from '../../services/challengesService';
import { useUser } from '../../../../context/UserContext';
import { useAchievements } from '../../../../context/AchievementContext';

export const RetosDesktop = () => {
    const { challenges = [], isLoading, deleteChallenge } = useRetos();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { updateUser, user } = useUser();
    const isModOrAdmin = user?.role === 'ADMIN' || user?.role === 'MODERADOR';
    const { xpReward, showModal, triggerXPModal, closeModal } = useXPReward();
    const { encolarLogros } = useAchievements();

    const safeChallenges: Challenge[] = Array.isArray(challenges) ? challenges : [];

    const {
        isFiltersOpen,
        setIsFiltersOpen,
        selectedLang,
        setSelectedLang,
        selectedTags,
        toggleTag,
        filteredChallenges,
        searchQuery,
        setSearchQuery,
        visibleTags,
        tagPage,
        totalTagPages,
        setTagPage,
    } = useFiltrosRetos({ safeChallenges });

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
        clearConsole,
    } = useEditorReto('');

    const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
    const [activeVariant, setActiveVariant] = useState<ChallengeVariant | null>(null);
    const [leftPanelTab, setLeftPanelTab] = useState<'guide' | 'solution'>('guide');
    const [showFreya, setShowFreya] = useState(false);
    const [showPropose, setShowPropose] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        setFreyaOpen(showFreya);
        return () => setFreyaOpen(false);
    }, [showFreya]);

    const handleSelectChallenge = (challenge: Challenge) => {
        const firstVariant = challenge.variants[0] ?? null;
        setActiveChallenge(challenge);
        setActiveVariant(firstVariant);
        resetEditor(firstVariant?.starter_code ?? '');
        setLeftPanelTab('guide');
        clearConsole();
        setIsSolved(false);
    };

    useEffect(() => {
        if (filteredChallenges.length > 0 && !activeChallenge) {
            handleSelectChallenge(filteredChallenges[0]);
        }
    }, [filteredChallenges]);

    const handleVariantChange = (variant: ChallengeVariant) => {
        setActiveVariant(variant);
        resetEditor(variant.starter_code);
        clearConsole();
        setIsSolved(false);
    };

    const handleRunCode = async () => {
        if (!activeVariant || !activeChallenge) return;
        setIsRunning(true);
        setConsoleOutput([{ type: 'log', message: '> Ejecutando tests...' }]);

        const testCode = activeVariant.test_cases
            .sort((a, b) => a.sort_order - b.sort_order)
            .map(tc => tc.test_code)
            .join('\n');

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

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-100 text-slate-500 dark:bg-[#050505] dark:text-slate-400">
                <div className="flex items-center gap-3 text-sm">
                    <LoadingSpinner size="sm" />
                    Cargando misiones...
                </div>
            </div>
        );
    }

    const leftPanelTabs = [
        { key: 'guide', label: 'Guía', icon: Icons.document },
        { key: 'solution', label: 'Solución', icon: Icons.key },
    ];

    return (
        <div className="flex h-screen w-full font-sans overflow-hidden items-center justify-center transition-colors duration-300
            bg-slate-100 text-slate-600 dark:bg-[#050505] dark:text-slate-300">

            <div className="flex w-full max-w-[1600px] h-[95vh] my-auto rounded-xl shadow-2xl relative overflow-hidden transition-colors duration-300
                bg-white border border-slate-200 dark:bg-[#050505] dark:border-white/10">

                <BarraLateralRetos
                    isDark={isDark}
                    collapsed={sidebarCollapsed}
                    challenges={filteredChallenges}
                    activeChallenge={activeChallenge}
                    onSelect={handleSelectChallenge}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    isFiltersOpen={isFiltersOpen}
                    onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
                    selectedLang={selectedLang}
                    onLangChange={setSelectedLang}
                    selectedTags={selectedTags}
                    onToggleTag={toggleTag}
                    visibleTags={visibleTags}
                    tagPage={tagPage}
                    totalTagPages={totalTagPages}
                    onTagPageChange={setTagPage}
                />

                <main className="flex-1 flex flex-col min-w-0 relative h-full transition-all duration-300 ease-in-out
                    bg-white dark:bg-[#050505]">

                    <EncabezadoReto
                        isDark={isDark}
                        activeChallenge={activeChallenge}
                        activeVariant={activeVariant}
                        showFreya={showFreya}
                        isRunning={isRunning}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
                        onVariantChange={handleVariantChange}
                        onToggleFreya={() => setShowFreya(prev => !prev)}
                        onOpenPropose={() => setShowPropose(true)}
                        onRun={handleRunCode}
                        onDeleteChallenge={isModOrAdmin && activeChallenge ? () => {
                            if (confirm('¿Eliminar esta misión? Esta acción no se puede deshacer.')) {
                                deleteChallenge(activeChallenge.id).then(() => setActiveChallenge(null)).catch(() => {});
                            }
                        } : undefined}
                    />

                    {activeChallenge && activeVariant ? (
                        <div className="flex-1 flex flex-row overflow-hidden relative">

                            <div className="flex flex-col border-r overflow-hidden transition-colors h-full w-5/12
                                bg-slate-50 border-slate-200 dark:bg-[#0a0b0e] dark:border-white/5">

                                <TabBar
                                    tabs={leftPanelTabs}
                                    activeTab={leftPanelTab}
                                    onChange={(k) => setLeftPanelTab(k as 'guide' | 'solution')}
                                    fullWidth
                                    className="shrink-0"
                                />

                                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                                    {leftPanelTab === 'guide' && (
                                        <PanelGuiaReto
                                            activeChallenge={activeChallenge}
                                            activeVariant={activeVariant}
                                        />
                                    )}
                                    {leftPanelTab === 'solution' && (
                                        <PanelSolucionReto
                                            isDark={isDark}
                                            isSolved={isSolved}
                                            challengeId={activeChallenge.id.toString()}
                                            activeVariant={activeVariant}
                                        />
                                    )}
                                </div>
                            </div>

                            <PanelEditorReto
                                isDark={isDark}
                                challengeId={activeChallenge.id.toString()}
                                activeVariant={activeVariant}
                                code={code}
                                consoleOutput={consoleOutput}
                                isRunning={isRunning}
                                onCodeChange={setCode}
                                onClearConsole={clearConsole}
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-50">
                            <p className="text-sm text-slate-500">Selecciona una misión para comenzar.</p>
                        </div>
                    )}
                </main>
            </div>

            <FreyaModal
                isOpen={showFreya}
                onClose={() => setShowFreya(false)}
                isDark={isDark}
                context={activeChallenge && activeVariant ? {
                    source: 'challenges',
                    currentTopic: activeChallenge.title,
                    language: activeVariant.language,
                    currentCode: code,
                } : undefined}
            />

            <ProposeMissionModal
                isOpen={showPropose}
                onClose={() => setShowPropose(false)}
            />

            {xpReward && (
                <ModalRecompensaXP
                    reward={xpReward}
                    visible={showModal}
                    onClose={handleCloseXPModal}
                />
            )}

        </div>
    );
};
