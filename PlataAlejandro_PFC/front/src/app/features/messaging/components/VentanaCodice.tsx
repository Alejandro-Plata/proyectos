import { useState, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { TarjetaMensaje } from './TarjetaMensaje';
import { EntradaMensaje } from './EntradaMensaje';
import type { Message } from '../types/types';
import { getAvatarUrl } from '../../../utils/getAvatarUrl';

/* Typing indicator */
const TYPING_WORDS = ['compilando_respuesta', 'forjando_palabras', 'tallando_runas'];

function IndicadorEscribiendo() {
    const [wordIdx, setWordIdx] = useState(0);
    const [cursorOn, setCursorOn] = useState(true);

    useEffect(() => {
        const t = setInterval(() => setWordIdx(i => (i + 1) % TYPING_WORDS.length), 3000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setCursorOn(v => !v), 600);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="flex items-center gap-2 px-1">
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                <span className="text-emerald-500">{'>'}</span>{' '}
                {TYPING_WORDS[wordIdx]}
                <span
                    className="inline-block ml-0.5 text-emerald-500"
                    style={{ opacity: cursorOn ? 1 : 0, transition: 'opacity 150ms' }}
                >
                    █
                </span>
            </span>
        </div>
    );
}

/* ─── Separador de día ──────────────────────────────────────── */
const MONTHS_ES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
const pad2 = (n: number) => String(n).padStart(2, '0');

function getSeparatorLabel(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    if (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
    ) return 'HOY';
    const ayer = new Date(now);
    ayer.setDate(now.getDate() - 1);
    if (
        date.getFullYear() === ayer.getFullYear() &&
        date.getMonth() === ayer.getMonth() &&
        date.getDate() === ayer.getDate()
    ) return 'AYER';
    if (date.getFullYear() === now.getFullYear()) return `${pad2(date.getDate())} ${MONTHS_ES[date.getMonth()]}`;
    return `${pad2(date.getDate())} ${MONTHS_ES[date.getMonth()]} ${date.getFullYear()}`;
}

function isSameDay(a: string, b: string): boolean {
    const da = new Date(a), db = new Date(b);
    return da.getFullYear() === db.getFullYear() &&
           da.getMonth() === db.getMonth() &&
           da.getDate() === db.getDate();
}

/* ─── Estilos de fondo HUD ──────────────────────────────────── */
const hudDark: React.CSSProperties = {
    backgroundColor: '#050505',
    backgroundImage: [
        'linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)',
    ].join(', '),
    backgroundSize: '32px 32px',
};
const hudLight: React.CSSProperties = {
    backgroundColor: '#f8fafc',
    backgroundImage: [
        'linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)',
    ].join(', '),
    backgroundSize: '32px 32px',
};

/* ─── Componente principal ──────────────────────────────────── */
interface PropsVentanaCodice {
    isDark: boolean;
    onBack?: () => void;
}

export const VentanaCodice = ({ isDark, onBack }: PropsVentanaCodice) => {
    const {
        activeConversation, messages, currentUserId, typingUserId,
        draft, replyTo, handleInputChange, handleSend, handleKeyDown,
        handleReply, handleCancelReply, scrollContainerRef, messagesEndRef,
        showScrollBtn, handleScroll, scrollToBottom,
    } = useChat();

    const getUsername = (userId: string) =>
        userId === currentUserId ? 'Tú' : (activeConversation?.participant.username ?? 'usuario');

    /* ── Estado vacío ── */
    if (!activeConversation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center" style={isDark ? hudDark : hudLight}>
                <div className="w-14 h-14 rounded-full mb-4 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-emerald-500/60">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                </div>
                <div className="flex items-center gap-3 mb-2">
                </div>
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center max-w-[200px]">
                    Selecciona una conversación para empezar
                </p>
            </div>
        );
    }

    const participant = activeConversation.participant;
    const statusText = participant.is_online ? 'En línea' : 'Desconectado';

    return (
        <div className="flex flex-col h-full">
            {/* ── Cabecera ── */}
            <div className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-[#0a0b0e] shrink-0 z-10">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="p-1.5 -ml-1 text-slate-400 hover:text-emerald-500 transition-colors"
                        aria-label="Volver"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}

                {/* Avatar hex-shield */}
                <div className="relative shrink-0 w-9 h-9">
                    <img
                        src={getAvatarUrl(participant.username, participant.avatar_url)}
                        alt={participant.username}
                        className="w-9 h-9 hex-shield object-cover"
                    />
                    {participant.is_online && (
                        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0a0b0e]" />
                    )}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        @{participant.username}
                    </h2>
                    <p className="font-mono text-[10px] uppercase tracking-widest truncate text-slate-400 dark:text-slate-500">
                        {participant.is_online ? '◆' : '◇'} {statusText}
                    </p>
                </div>
            </div>

            {/* Línea divisoria emerald degradada */}
            <div
                className="h-px shrink-0"
                style={{ background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.25), transparent)' }}
            />

            {/* ── Área de mensajes ── */}
            <div className="relative flex-1 min-h-0">
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="h-full overflow-y-auto px-4 py-5 sm:px-6 space-y-3"
                    style={isDark ? hudDark : hudLight}
                >
                    {messages.map((msg: Message, idx: number) => {
                        const showSeparator = idx === 0 || !isSameDay(messages[idx - 1].timestamp, msg.timestamp);
                        return (
                            <div key={msg.id}>
                                {showSeparator && (
                                    <div className="flex items-center gap-3 py-3">
                                        <span className="flex-1 h-px bg-emerald-500/15" />
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">
                                            {getSeparatorLabel(msg.timestamp)}
                                        </span>
                                        <span className="flex-1 h-px bg-emerald-500/15" />
                                    </div>
                                )}
                                <TarjetaMensaje
                                    message={msg}
                                    isOwn={msg.sender_id === currentUserId}
                                    isDark={isDark}
                                    senderUsername={msg.sender_id !== currentUserId ? participant.username : undefined}
                                    onReply={handleReply}
                                />
                            </div>
                        );
                    })}

                    {typingUserId && <IndicadorEscribiendo />}
                    <div ref={messagesEndRef} className="h-2" />
                </div>

                {/* Scroll al fondo */}
                {showScrollBtn && (
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-3 right-3 z-10 w-8 h-8 flex items-center justify-center transition-all duration-150 bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 animate-in fade-in slide-in-from-bottom-2 duration-200"
                        aria-label="Ir al final"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>

            {/* ── Input ── */}
            <div className="bg-white dark:bg-[#0a0b0e] shrink-0">
                <EntradaMensaje
                    value={draft}
                    onChange={handleInputChange}
                    onSend={handleSend}
                    onKeyDown={handleKeyDown}
                    replyTo={replyTo}
                    onCancelReply={handleCancelReply}
                    replyToUsername={replyTo ? getUsername(replyTo.sender_id) : undefined}
                />
            </div>
        </div>
    );
};
