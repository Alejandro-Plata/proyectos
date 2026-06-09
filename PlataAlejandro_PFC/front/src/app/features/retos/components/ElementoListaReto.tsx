import { Icons } from '../../../components/Icons';
import { DifficultyDots } from './DifficultyDots';
import { Badge } from '../../../components/Badge';
import { SUPPORTED_LANGUAGES, LANGUAGE_BADGE_COLORS } from '../data/languages';
import type { Reto as Challenge } from '../types/types';

interface ChallengeListItemProps {
    challenge: Challenge;
    isActive: boolean;
    isDark: boolean;
    onClick: () => void;
}

export const ElementoListaReto = ({ challenge, isActive, isDark, onClick }: ChallengeListItemProps) => {
    const completedLangs = Object.entries(challenge.completion_status ?? {})
        .filter(([, done]) => done)
        .map(([lang]) => lang);
    const isCompleted = completedLangs.length > 0;

    const itemClass = isActive
        ? 'bg-emerald-500/[0.08] text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500 pl-[10px]'
        : isCompleted
            ? 'bg-transparent border-l-2 border-emerald-500/30 text-slate-500 hover:bg-emerald-500/[0.04] hover:text-emerald-600 dark:border-emerald-500/20 dark:text-slate-400'
            : 'bg-transparent border-l-2 border-transparent text-slate-500 hover:bg-emerald-500/[0.04] hover:text-emerald-600 dark:text-slate-400';

    return (
        <button
            onClick={onClick}
            className={`w-full group relative flex flex-col p-3.5 text-left transition-all duration-200 ${itemClass}`}
        >
            <div className="flex items-center gap-2 mb-1 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 overflow-hidden flex-1">
                    {isCompleted && (
                        <span className="shrink-0 text-emerald-500" title="Completado">{Icons.check}</span>
                    )}
                    <span className={`font-mono text-[11px] uppercase tracking-[0.15em] truncate ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                        {challenge.title}
                    </span>
                </div>
                <span className="shrink-0">
                    <DifficultyDots level={challenge.difficulty} isDark={isDark} compact />
                </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
                {challenge.available_languages.map(lang => {
                    const done = challenge.completion_status?.[lang];
                    const langColor = LANGUAGE_BADGE_COLORS[lang.toLowerCase()]
                        ?? 'bg-slate-500/10 text-slate-500 border-slate-400/30 dark:text-slate-400 dark:border-slate-400/25';
                    return (
                        <Badge
                            key={lang}
                            variant="language"
                            className={`flex items-center gap-1 border ${done
                                ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
                                : langColor
                            }`}
                        >
                            {SUPPORTED_LANGUAGES[lang]?.label
                                .replace('JavaScript', 'JS')
                                .replace('TypeScript', 'TS')
                                .replace('Python', 'PY') ?? lang.toUpperCase()}
                            {done && <span>✓</span>}
                        </Badge>
                    );
                })}
            </div>
        </button>
    );
};
