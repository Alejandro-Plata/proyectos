interface PropsSugerenciasRapidas {
    alSeleccionar: (text: string) => void;
}

const SUGERENCIAS = [
    { label: '¿Qué es una función?',    text: '¿Qué es una función en programación y para qué sirve?' },
    { label: 'Bucles for y while',       text: 'Explícame los bucles for y while con ejemplos en JavaScript' },
    { label: '¿Cómo funciona REST?',     text: '¿Cómo funciona una API REST? Explícame los conceptos básicos' },
    { label: 'Arrays en JavaScript',     text: 'Dame un ejemplo práctico de arrays y sus métodos más usados' },
    { label: 'Promesas y async/await',   text: '¿Qué son las promesas en JavaScript y cómo funciona async/await?' },
    { label: 'Patrones de diseño',       text: '¿Cuáles son los patrones de diseño más importantes?' },
];

export const SugerenciasRapidas = ({ alSeleccionar }: PropsSugerenciasRapidas) => (
    <div className="w-full max-w-xl grid grid-cols-2 gap-2">
        {SUGERENCIAS.map((s) => (
            <button
                key={s.text}
                onClick={() => alSeleccionar(s.text)}
                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                className="px-4 py-3 text-left bg-white dark:bg-[#0a0b0e] border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] dark:hover:bg-emerald-500/[0.06] transition-colors group shadow-sm shadow-emerald-500/5"
            >
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-600 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 leading-snug transition-colors line-clamp-2">
                    {s.label}
                </span>
            </button>
        ))}
    </div>
);
