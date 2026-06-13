import { useState } from 'react';
import type { Message } from '../types/types';
import { formatMessageTime } from '../utils/formatMessageTime';

interface PropsTarjetaMensaje {
    message: Message;
    isOwn: boolean;
    isDark: boolean;
    senderUsername?: string;
    onReply?: (message: Message) => void;
    isGroup?: boolean;
}

function AudioPlayer({ url }: { url: string }) {
    return (
        <audio
            controls
            src={url}
            preload="metadata"
            className="w-full h-8 max-w-[240px]"
            style={{ colorScheme: 'dark' }}
        />
    );
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            <img
                src={src}
                alt=""
                className="max-w-[90vw] max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
            />
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white font-mono text-xl"
            >
                [×]
            </button>
        </div>
    );
}

export const TarjetaMensaje = ({
    message, isOwn, isDark, senderUsername, onReply,
}: PropsTarjetaMensaje) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const timeLabel = formatMessageTime(message.timestamp);
    const { message_type = 'text', attachment_url, content } = message;

    // System messages: centered, no bubble
    if (message_type === 'system') {
        return (
            <div className="flex justify-center py-1">
                <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 px-3 py-1">
                    {content}
                </span>
            </div>
        );
    }

    const replyPreview = message.reply_to_content
        ? message.reply_to_content
        : null;

    return (
        <>
            {lightboxOpen && attachment_url && (
                <Lightbox src={attachment_url} onClose={() => setLightboxOpen(false)} />
            )}
            <div
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                aria-label={`${isOwn ? 'Tú' : (senderUsername ?? 'Usuario')} ${timeLabel}`}
            >
                <div className="flex items-end gap-1.5 max-w-[68%] sm:max-w-[62%]">

                    {/* Reply button — left for own messages */}
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

                        {/* Sender label — incoming messages, or all messages in groups */}
                        {!isOwn && senderUsername && (
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 pl-0.5">
                                @{senderUsername}
                            </span>
                        )}

                        {/* Message card */}
                        <div className={`relative w-full ${
                            isOwn
                                ? 'bg-emerald-500/[0.07] dark:bg-emerald-500/[0.09] border border-emerald-500/25 dark:border-emerald-500/30'
                                : isDark
                                    ? 'bg-[#0f1115] border border-white/[0.06]'
                                    : 'bg-white border border-slate-100'
                        }`}>
                            {/* Accent bar */}
                            <span className={`absolute top-0 bottom-0 w-[2px] ${
                                isOwn ? 'right-0 bg-emerald-500' : 'left-0 bg-emerald-500/50'
                            }`} />

                            <div className={`${isOwn ? 'pl-4 pr-5' : 'pl-5 pr-4'} py-2.5`}>

                                {/* Reply preview */}
                                {replyPreview && (
                                    <div className={`mb-2 pl-3 py-1.5 text-xs border-l-2 border-emerald-500/50 ${
                                        isDark ? 'bg-black/20 text-slate-400' : 'bg-slate-50 text-slate-500'
                                    }`}>
                                        {message.reply_to_sender && (
                                            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">
                                                @{message.reply_to_sender}
                                            </p>
                                        )}
                                        <p className="line-clamp-2 opacity-90 pr-1">{replyPreview}</p>
                                    </div>
                                )}

                                {/* Media content */}
                                {message_type === 'image' && attachment_url && (
                                    <button
                                        onClick={() => setLightboxOpen(true)}
                                        className="block w-full mb-1.5"
                                        title="Ver imagen"
                                    >
                                        <img
                                            src={attachment_url}
                                            alt="Imagen"
                                            className="max-h-[280px] w-full object-cover"
                                            loading="lazy"
                                        />
                                    </button>
                                )}

                                {message_type === 'video' && attachment_url && (
                                    <div className="mb-1.5">
                                        <video
                                            src={attachment_url}
                                            controls
                                            preload="metadata"
                                            className="max-h-[280px] w-full object-cover"
                                            poster={message.attachment_meta?.thumbnailUrl}
                                        />
                                    </div>
                                )}

                                {message_type === 'audio' && attachment_url && (
                                    <div className="mb-1.5">
                                        <AudioPlayer url={attachment_url} />
                                    </div>
                                )}

                                {/* Text / caption */}
                                {(message_type === 'text' || content) && (
                                    <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
                                        isDark ? 'text-slate-100' : 'text-slate-800'
                                    }`}>
                                        {content}
                                    </p>
                                )}

                                {/* Footer */}
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

                    {/* Reply button — right for incoming messages */}
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
        </>
    );
};
