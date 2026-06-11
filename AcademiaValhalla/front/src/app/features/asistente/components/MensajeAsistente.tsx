import React from 'react';
import type { ChatMessage as MensajeChat } from '../types/types';

const AvatarFreya = () => (
    <img
        src="/images/logo_freya.png"
        alt="Freya"
        className="w-7 h-7 shrink-0 object-cover mix-blend-multiply dark:mix-blend-screen shadow-sm shadow-emerald-500/20"
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
    />
);

function TextoPlano({ text }: { text: string }) {
    const lineas = text.split('\n');
    return (
        <>
            {lineas.map((linea, i) => (
                <React.Fragment key={i}>
                    {linea}
                    {i < lineas.length - 1 && <br />}
                </React.Fragment>
            ))}
        </>
    );
}

function ContenidoEnLinea({ text }: { text: string }) {
    const expresionRegular = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    const nodos: React.ReactNode[] = [];
    let ultimo = 0;
    let m: RegExpExecArray | null;
    let i = 0;

    while ((m = expresionRegular.exec(text)) !== null) {
        if (m.index > ultimo) nodos.push(<TextoPlano key={i++} text={text.slice(ultimo, m.index)} />);
        const p = m[0];
        if (p.startsWith('**')) {
            nodos.push(<strong key={i++} className="font-semibold text-slate-900 dark:text-slate-100">{p.slice(2, -2)}</strong>);
        } else if (p.startsWith('*')) {
            nodos.push(<em key={i++} className="italic text-slate-600 dark:text-slate-400">{p.slice(1, -1)}</em>);
        } else {
            nodos.push(
                <code key={i++} className="font-mono text-[0.875em] bg-slate-100 dark:bg-white/10 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5">
                    {p.slice(1, -1)}
                </code>
            );
        }
        ultimo = m.index + p.length;
    }
    if (ultimo < text.length) nodos.push(<TextoPlano key={i++} text={text.slice(ultimo)} />);
    return <>{nodos}</>;
}

function parsearContenido(content: string): React.ReactNode[] {
    const nodos: React.ReactNode[] = [];
    const expresionRegularCodigo = /```(\w*)\n?([\s\S]*?)```/g;
    let ultimo = 0;
    let k = 0;
    let m: RegExpExecArray | null;

    while ((m = expresionRegularCodigo.exec(content)) !== null) {
        if (m.index > ultimo) {
            nodos.push(
                <p key={k++} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    <ContenidoEnLinea text={content.slice(ultimo, m.index).replace(/^\n+|\n+$/g, '')} />
                </p>
            );
        }
        const lenguaje = m[1] || 'code';
        const codigo = m[2].trimEnd();
        nodos.push(
            <div key={k++} className="my-2 overflow-hidden border border-emerald-500/15 dark:border-emerald-500/10">
                <div className="flex items-center px-4 py-2 bg-slate-100 dark:bg-[#111214] border-b border-emerald-500/10">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">{lenguaje}</span>
                </div>
                <pre className="p-4 overflow-x-auto bg-slate-50 dark:bg-[#0f1115] text-slate-800 dark:text-emerald-300 font-mono text-xs leading-relaxed">
                    <code>{codigo}</code>
                </pre>
            </div>
        );
        ultimo = m.index + m[0].length;
    }

    if (ultimo < content.length) {
        nodos.push(
            <p key={k++} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                <ContenidoEnLinea text={content.slice(ultimo).replace(/^\n+|\n+$/g, '')} />
            </p>
        );
    }

    return nodos.length > 0 ? nodos : [
        <p key={0} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            <ContenidoEnLinea text={content} />
        </p>
    ];
}

interface PropsMensajeAsistente {
    message: MensajeChat;
}

export const MensajeAsistente = ({ message: mensaje }: PropsMensajeAsistente) => {
    const esUsuario = mensaje.role === 'user';

    if (esUsuario) {
        return (
            <div className="flex justify-end mb-2">
                <div
                    className="max-w-[75%] bg-emerald-500 text-white px-4 py-3 text-sm leading-relaxed shadow-sm shadow-emerald-500/20 border border-emerald-500/15"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}
                >
                    <p className="whitespace-pre-wrap break-words">{mensaje.content}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-end gap-2.5 mb-2">
            <AvatarFreya />
            <div
                className="max-w-[80%] bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 px-4 py-3 shadow-sm space-y-2"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
            >
                {parsearContenido(mensaje.content)}
            </div>
        </div>
    );
};
