import { Icons } from '../../../components/Icons';
import { Badge } from '../../../components/Badge';
import type { Reto as Challenge, VarianteReto as ChallengeVariant } from '../types/types';

interface ChallengeGuidePanelProps {
    activeChallenge: Challenge;
    activeVariant: ChallengeVariant;
}

export const PanelGuiaReto = ({ activeChallenge, activeVariant }: ChallengeGuidePanelProps) => (
    <div className="p-8">
        {/* Section header BB-3 */}
        <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">La misión</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
            {activeChallenge.tags.map(t => (
                <Badge key={t} variant="language" color="text-slate-600 dark:text-slate-400" border="border-emerald-500/15 dark:border-emerald-500/10" bg="bg-white dark:bg-white/5">
                    #{t}
                </Badge>
            ))}
        </div>

        <div className="mb-8 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            <p>{activeChallenge.description}</p>
        </div>

        {activeChallenge.example_output && (
            <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 block">
                    Output esperado
                </span>
                <div className="p-4 border font-mono text-xs relative overflow-hidden bg-white border-emerald-500/15 text-slate-700 dark:bg-[#050505] dark:border-emerald-500/10 dark:text-slate-300">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500" />
                    <pre className="whitespace-pre-wrap pl-2">{activeChallenge.example_output}</pre>
                </div>
            </div>
        )}

        <div className="mt-6 space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 block">
                Tests
            </span>
            {activeVariant.test_cases.map((tc, i) => (
                <div key={tc.id} className="flex items-center gap-2 px-3 py-2 border text-xs bg-slate-50 border-emerald-500/15 text-slate-500 dark:bg-white/[0.02] dark:border-emerald-500/10 dark:text-slate-400">
                    <span className="w-4 h-4 flex items-center justify-center text-[9px] shrink-0 font-mono text-emerald-500/60">
                        {i + 1}
                    </span>
                    {tc.is_hidden ? (
                        <span className="flex items-center gap-1 opacity-50">{Icons.lock} Test oculto #{i + 1}</span>
                    ) : (
                        <span>{tc.name}</span>
                    )}
                </div>
            ))}
        </div>
    </div>
);
