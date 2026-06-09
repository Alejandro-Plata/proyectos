import type { Message } from '../types/types';
import { formatMessageTime } from '../utils/formatMessageTime';

interface PropsTarjetaMensaje {
    message: Message;
    isOwn: boolean;
    isDark: boolean;
    senderUsername?: string;
    onReply?: (message: Message) => void;
}

export const TarjetaMensaje = ({
    message, isOwn, isDark, senderUsername, onReply,
}: PropsTarjetaMensaje) => {
    const timeLabel = formatMessageTime(message.timestamp);

    return (
        <div
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
            aria-label={`${isOwn ? 'Tú' : (senderUsername ?? 'Usuario')} ${timeLabel}: ${message.content}`}
        >
            <div className="flex items-end gap-1.5 max-w-[68%] sm:max-w-[62%]">

                {/* Reply button — izquierda en mensajes propios */}
                {isOwn && onReply && (
                    <button
                        onClick={() => onReply(message)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mb-1 p-1 text-slate-400 hover:text-emerald-500"
                        title="Responder"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </button>
                )}

                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} min-w-0 flex-1`}>

                    {/* Etiqueta del remitente — solo en mensajes entrantes */}
                    {!isOwn && senderUsername && (
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 pl-0.5">
                            @{senderUsername}
                        </span>
                    )}

                    {/* Tarjeta del mensaje */}
                    <div className={`relative w-full ${
                        isOwn
                            ? 'bg-emerald-500/[0.07] dark:bg-emerald-500/[0.09] border border-emerald-500/25 dark:border-emerald-500/30'
                            : isDark
                                ? 'bg-[#0f1115] border border-white/[0.06]'
                                : 'bg-white border border-slate-100'
                    }`}>
                        {/* Barra de acento lateral */}
                        <span className={`absolute top-0 bottom-0 w-[2px] ${
                            isOwn
                                ? 'right-0 bg-emerald-500'
                                : 'left-0 bg-emerald-500/50'
                        }`} />

                        <div className={`${isOwn ? 'pl-4 pr-5' : 'pl-5 pr-4'} py-2.5`}>
                            {/* Reply preview */}
                            {message.reply_to_content && (
                                <div className={`mb-2 pl-3 py-1.5 text-xs border-l-2 border-emerald-500/50 ${
                                    isDark ? 'bg-black/20 text-slate-400' : 'bg-slate-50 text-slate-500'
                                }`}>
                                    {message.reply_to_sender && (
                                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">
                                            @{message.reply_to_sender}
                                        </p>
                                    )}
                                    <p className="line-clamp-2 opacity-90 pr-1">{message.reply_to_content}</p>
                                </div>
                            )}

                            {/* Contenido */}
                            <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
                                isDark ? 'text-slate-100' : 'text-slate-800'
                            }`}>
                                {message.content}
                            </p>

                            {/* Footer: estado (propios) + timestamp */}
                            <div className={`flex items-center gap-2 mt-1.5 ${isOwn ? 'justify-start' : 'justify-end'}`}>
                                {isOwn && (
                                    <span className="font-mono text-[9px] tracking-widest uppercase text-slate-400 dark:text-slate-500">
                                        Entregado
                                    </span>
                                )}
                                <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 ml-auto">
                                    {timeLabel}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reply button — derecha en mensajes ajenos */}
                {!isOwn && onReply && (
                    <button
                        onClick={() => onReply(message)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mb-1 p-1 text-slate-400 hover:text-emerald-500"
                        title="Responder"
                    >
                        <svg className="w-3.5 h-3.5 scale-x-[-1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};
