import React, { Fragment } from "react";

type ContentRenderer = (content: string) => React.ReactNode;

export const renderContent: ContentRenderer = (content) => {
    if (!content) return null;

    const regex = /(#{1,6} .*?(?=\n|$)|(?:\*\*.*?\*\*)|(?:__.*?__)|(?:`.*?`)|(?:\*'.*?'\*)|(?:\*.*?\*)|(?:!!.*?!!)|(?:'.*?')|(?:https:\/\/[^\s]+))/g;

    const parseSegments = (textToParse: string): React.ReactNode[] => {
        const parts = textToParse.split(regex);

        return parts.map((part, index) => {
            const key = `seg-${index}`;

            if (!part) return null;

            const headerMatch = part.match(/^(#{1,6})\s(.*)/);
            if (headerMatch) {
                const level = headerMatch[1].length;
                const innerText = headerMatch[2];

                let headerClasses = "block font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3";

                if (level === 1) headerClasses += " text-4xl border-b border-slate-200 dark:border-slate-700 pb-2";
                else if (level === 2) headerClasses += " text-2xl font-semibold text-slate-800 dark:text-slate-200";
                else headerClasses += " text-xl font-semibold text-slate-800 dark:text-slate-300";

                return (
                    <span
                        key={key}
                        role="heading"
                        aria-level={level}
                        className={headerClasses}
                    >
                        {parseSegments(innerText)}
                    </span>
                );
            }

            // CONCEPTOS CLAVE (**texto**)
            if (part.startsWith('**') && part.endsWith('**')) {
                const text = part.slice(2, -2);
                return (
                    <strong key={key} className="font-semibold text-slate-900 dark:text-slate-100">
                        {text}
                    </strong>
                );
            }

            // CÓDIGO INLINE (__texto__ o `texto`)
            if ((part.startsWith('__') && part.endsWith('__')) || (part.startsWith('`') && part.endsWith('`'))) {
                const text = part.startsWith('__') ? part.slice(2, -2) : part.slice(1, -1);
                return (
                    <code
                        key={key}
                        className="
                            font-mono text-[0.9em] font-medium
                            text-emerald-800 dark:text-emerald-200
                            bg-emerald-50/80 dark:bg-emerald-900/20
                            border border-emerald-200/50 dark:border-emerald-800/50
                            px-1.5 py-0.5 mx-0.5 rounded-[4px]
                            align-baseline
                        "
                    >
                        {text}
                    </code>
                );
            }

            // ÉNFASIS / CURSIVA (*texto*)
            if (part.startsWith('*') && part.endsWith('*')) {
                const text = part.slice(1, -1);
                return (
                    <em key={key} className="italic text-slate-600 dark:text-slate-400 font-serif">
                        {text}
                    </em>
                );
            }

            // TÉRMINO TÉCNICO / ERROR (*'texto'*)
            if (part.startsWith("*'") && part.endsWith("'*")) {
                const text = part.slice(2, -2);
                return (
                    <span
                        key={key}
                        className="
                            font-mono text-[0.9em]
                            text-rose-700 dark:text-rose-300
                            bg-rose-50 dark:bg-rose-900/20
                            px-1 rounded mx-0.5
                        "
                    >
                        {text}
                    </span>
                );
            }

            // IMPORTANTE / ADVERTENCIA (!!texto!!)
            if (part.startsWith('!!') && part.endsWith('!!')) {
                const text = part.slice(2, -2);
                return (
                    <span
                        key={key}
                        className="
                            font-medium
                            text-amber-800 dark:text-amber-200
                            bg-amber-50 dark:bg-amber-900/20
                            border-b-2 border-amber-100 dark:border-amber-800/30
                            px-1 rounded-t
                        "
                    >
                        {text}
                    </span>
                );
            }

            // LITERALES / STRINGS ('texto')
            if (part.startsWith("'") && part.endsWith("'")) {
                const text = part.slice(1, -1);
                return (
                    <span key={key} className="text-teal-700 dark:text-teal-300 font-medium tracking-tight">
                        '{text}'
                    </span>
                );
            }

            // ENLACES
            if (part.startsWith("https://")) {
                return (
                    <a
                        key={key}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            font-medium
                            text-emerald-700 dark:text-emerald-400
                            hover:text-emerald-900 dark:hover:text-emerald-200
                            underline decoration-emerald-300/40 dark:decoration-emerald-500/40
                            underline-offset-4 hover:decoration-emerald-600/80 hover:decoration-2
                            transition-all mx-1
                        "
                    >
                        {part.length > 35 ? 'Referencia ↗' : part}
                    </a>
                );
            }

            // TEXTO PLANO
            const newlineRegex = /\\n|\n/g;
            if (newlineRegex.test(part)) {
                return part.split(newlineRegex).map((line, i, arr) => (
                    <Fragment key={`${key}-line-${i}`}>
                        {line}
                        {i < arr.length - 1 && <span className="block" />}
                    </Fragment>
                ));
            }

            return <span key={key}>{part}</span>;
        });
    };

    return (
        <span className="block text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-normal antialiased tracking-wide">
            {parseSegments(content)}
        </span>
    );
};

