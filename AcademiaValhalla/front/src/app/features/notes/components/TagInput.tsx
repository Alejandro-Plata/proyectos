import { useState } from 'react';

interface Props {
    tags: string[];
    onChange: (tags: string[]) => void;
    maxTags?: number;
}

/** Entrada de etiquetas libres: el usuario escribe y pulsa Enter (o coma) para añadir. */
export const TagInput = ({ tags, onChange, maxTags = 8 }: Props) => {
    const [input, setInput] = useState('');

    const normalize = (raw: string) =>
        raw.trim().replace(/^#+/, '').replace(/\s+/g, '-').slice(0, 24);

    const addTag = () => {
        const tag = normalize(input);
        if (!tag) return;
        if (tags.length >= maxTags) { setInput(''); return; }
        if (!tags.some(t => t.toLowerCase() === tag.toLowerCase())) {
            onChange([...tags, tag]);
        }
        setInput('');
    };

    const removeTag = (tag: string) => onChange(tags.filter(t => t !== tag));

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {tags.map(tag => (
                <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-mono bg-slate-800 dark:bg-white text-white dark:text-black border border-slate-800 dark:border-white"
                >
                    #{tag}
                    <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-rose-400 dark:hover:text-rose-500 transition-colors"
                        title={`Quitar ${tag}`}
                    >
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </span>
            ))}

            {tags.length < maxTags && (
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag}
                    placeholder={tags.length === 0 ? 'Escribe una etiqueta y pulsa Enter…' : 'Añadir…'}
                    className="flex-1 min-w-[140px] bg-transparent border border-dashed border-slate-200 dark:border-white/10 rounded-sm px-2.5 py-1 text-[11px] font-mono text-slate-600 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-emerald-500/50 transition-colors"
                />
            )}
        </div>
    );
};
