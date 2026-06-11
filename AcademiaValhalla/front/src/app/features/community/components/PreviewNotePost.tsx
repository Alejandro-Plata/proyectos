import { CodeBlockDesktop } from '../../../components/CodeBlock/CodeBlockDesktop';
import { renderContent } from '../../notes/utils/renderContent';
import { getAvatarUrl } from '../../../utils/getAvatarUrl';

interface ContentBlock {
    type: 'text' | 'code';
    value: string;
    language?: string;
}

interface NoteAuthor {
    username: string;
    avatar_url?: string;
}

interface PreviewNotePostProps {
    title: string;
    content: ContentBlock[];
    author: NoteAuthor;
    submittedAt: string;
    tags?: string[];
    language?: string;
    difficulty?: string;
    definitions?: Array<{ term: string; description: string }>;
    /** false en el modal de admin: oculta botones interactivos */
    interactive?: boolean;
}

export const PreviewNotePost = ({
    title,
    content,
    author,
    submittedAt,
    tags = [],
    language,
    difficulty,
    definitions = [],
    interactive = false,
}: PreviewNotePostProps) => {
    return (
        <article className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-emerald-500/10 dark:border-emerald-500/[0.07]">
                <div className="flex items-center gap-3 mb-4">
                    <img
                        src={getAvatarUrl(author.username, author.avatar_url)}
                        className="hex-shield w-10 h-10 object-cover"
                        alt="avatar"
                    />
                    <div>
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em]">
                            <span className="text-slate-500 dark:text-slate-400">@{author.username}</span>
                            <span className="text-emerald-500/30">·</span>
                            <span className="text-slate-400">{new Date(submittedAt).toLocaleDateString('es-ES')}</span>
                        </div>
                    </div>
                </div>

                <h1 className="font-mono text-xl uppercase tracking-[0.1em] text-slate-900 dark:text-white mb-3">
                    {title}
                </h1>

                <div className="flex flex-wrap gap-2">
                    {language && (
                        <span
                            className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-violet-500/30 bg-violet-500/[0.08] text-violet-600 dark:text-violet-400"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
                        >
                            {language}
                        </span>
                    )}
                    {difficulty && (
                        <span
                            className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-cyan-500/30 bg-cyan-500/[0.08] text-cyan-600 dark:text-cyan-400"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
                        >
                            {difficulty}
                        </span>
                    )}
                    {tags.map((t) => (
                        <span
                            key={t}
                            className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-emerald-500/20 dark:border-emerald-500/10 text-slate-500 dark:text-slate-400"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
                        >
                            #{t}
                        </span>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {content.map((block, i) =>
                    block.type === 'code' ? (
                        <CodeBlockDesktop key={i} code={block.value} language={block.language ?? 'plaintext'} />
                    ) : (
                        <div key={i}>{renderContent(block.value)}</div>
                    )
                )}
            </div>

            {/* Definitions */}
            {definitions.length > 0 && (
                <div className="px-6 pb-6 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block w-1 h-3.5 bg-emerald-500" />
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Definiciones clave</p>
                    </div>
                    {definitions.map((d, i) => (
                        <div key={i} className="p-3 border border-emerald-500/15 dark:border-emerald-500/10 text-sm">
                            <span className="font-bold text-slate-800 dark:text-white font-mono">{d.term}: </span>
                            <span className="text-slate-600 dark:text-slate-300">{d.description}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer — acciones deshabilitadas en modo preview */}
            {interactive ? (
                <div className="px-6 pb-6 pt-2 border-t border-emerald-500/10 flex items-center gap-4 text-slate-400">
                    <button className="flex items-center gap-1.5 text-sm font-mono uppercase tracking-[0.15em] hover:text-emerald-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        Responder
                    </button>
                </div>
            ) : (
                <div className="px-6 pb-4 pt-2 border-t border-emerald-500/10">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400/50 text-center">
                        Vista previa · Los botones interactivos no están disponibles
                    </p>
                </div>
            )}
        </article>
    );
};
