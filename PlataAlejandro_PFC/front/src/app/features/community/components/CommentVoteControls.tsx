import { Icons } from '../../../components/Icons';
import { kFormatter } from '../../../utils/kFormatter';

interface CommentVoteControlsProps {
    localVotes: number;
    userVote: 'up' | 'down' | null;
    onVote: (type: 'up' | 'down') => void;
}

export const CommentVoteControls = ({ localVotes, userVote, onVote }: CommentVoteControlsProps) => (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 border border-emerald-500/10 dark:border-emerald-500/[0.07] p-0.5">
        <button
            onClick={() => onVote('up')}
            aria-label="Votar positivo"
            aria-pressed={userVote === 'up'}
            className={`p-1 hover:bg-white dark:hover:bg-white/10 transition-colors ${userVote === 'up' ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-500'}`}
        >
            <div className="w-4 h-4">{Icons.arrowUp}</div>
        </button>
        <span className={`font-mono text-[10px] font-bold px-1 ${userVote ? (userVote === 'up' ? 'text-emerald-500' : 'text-rose-500') : 'text-slate-600 dark:text-slate-300'}`}>
            {kFormatter(localVotes)}
        </span>
        <button
            onClick={() => onVote('down')}
            aria-label="Votar negativo"
            aria-pressed={userVote === 'down'}
            className={`p-1 hover:bg-white dark:hover:bg-white/10 transition-colors ${userVote === 'down' ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
        >
            <div className="w-4 h-4">{Icons.arrowDown}</div>
        </button>
    </div>
);
