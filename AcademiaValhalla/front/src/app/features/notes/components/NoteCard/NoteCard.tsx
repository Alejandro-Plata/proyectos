import React from 'react';
import type { NoteCardProps } from '../../types/types';
import { Link } from 'react-router-dom';
import { Icons } from '../../../../components/Icons';
import { Badge } from '../../../../components/Badge';

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {

    const getDifficultyConfig = (level: string) => {
        switch (level) {
            case 'Básico': return { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20' };
            case 'Intermedio': return { color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10', border: 'border-cyan-200 dark:border-cyan-500/20' };
            case 'Avanzado': return { color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10', border: 'border-purple-200 dark:border-purple-500/20' };
            default: return { color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-500/10', border: 'border-slate-200 dark:border-slate-500/20' };
        }
    };

    const getLanguageColor = (lang: string) => {
        switch (lang.toLowerCase()) {
            case 'javascript':
            case 'js':
                return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 group-hover:border-orange-400 dark:group-hover:border-orange-500/30';
            case 'c#':
            case 'csharp':
                return 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20 group-hover:border-violet-400 dark:group-hover:border-violet-500/30';
            case 'java':
                return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 group-hover:border-red-400 dark:group-hover:border-red-500/30';
            case 'python':
                return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 group-hover:border-blue-400 dark:group-hover:border-blue-500/30';
            case 'react':
            case 'jsx':
            case 'tsx':
                return 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20 group-hover:border-cyan-400 dark:group-hover:border-cyan-500/30';
            default:
                return 'text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 group-hover:border-slate-300 dark:group-hover:border-white/10';
        }
    };

    const config = getDifficultyConfig(note.difficulty);

    return (
        <Link to={`${note.id}`} className="block h-full group">
            <div className="relative h-full flex flex-col bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden transition-colors hover:border-emerald-500/30 dark:hover:border-emerald-500/20 shadow-sm shadow-emerald-500/5">

                <div className="p-7 flex flex-col h-full relative z-10">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-5">
                        <div className="w-8 h-8 bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-300 border border-emerald-500/15 dark:border-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                            {Icons.code}
                        </div>

                        <Badge variant="language" className={getLanguageColor(note.language)}>
                            {note.language}
                        </Badge>

                        <Badge variant="difficulty" bg={config.bg} color={config.color} border={config.border}>
                            {note.difficulty}
                        </Badge>
                    </div>

                    {/* Título */}
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {note.title}
                    </h3>

                    {/* Descripción */}
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-6 flex-1">
                        {note.shortDescription}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-emerald-500/10 dark:border-emerald-500/[0.07] mt-auto">
                        <div className="flex gap-3 overflow-hidden">
                            {note.tags.slice(0, 2).map((tag: string) => (
                                <span key={tag} className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-[0.15em]">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <div className="w-8 h-8 bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
