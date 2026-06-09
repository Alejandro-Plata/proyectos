import { useChatAsistente } from '../hooks/useChatAsistente';
import { MensajeAsistente } from './MensajeAsistente';
import { EntradaAsistente } from './EntradaAsistente';
import { SugerenciasRapidas } from './SuggestionChips';
import type { ContextoAsistente } from '../types/types';

interface PropsChatAsistente {
    contexto?: ContextoAsistente;
    mostrarEncabezado?: boolean;
    isDark?: boolean;
    context?: ContextoAsistente;
    esMobile?: boolean;
}

export const ChatAsistente = ({ contexto, context, mostrarEncabezado = true, esMobile = false }: PropsChatAsistente) => {
    const contextoCombinado = contexto ?? context;
    const { messages: mensajes, status: estado, sendMessage: enviarMensaje, clearChat: limpiarChat, messagesEndRef: refFinalMensajes } = useChatAsistente({ context: contextoCombinado });
    const estaPensando = estado === 'thinking';
    const tieneMensajes = mensajes.length > 0;

    return (
        <div className={`flex flex-col h-full ${esMobile ? 'bg-slate-50 dark:bg-[#050505]' : 'bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5'}`}>

            {mostrarEncabezado && (
                <header className="scanline-bottom shrink-0 flex items-center justify-between px-6 h-16 bg-white dark:bg-[#0a0b0e] border-b border-emerald-500/10">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/logo_freya.png"
                            alt="Freya"
                            className="w-9 h-9 object-cover shrink-0 mix-blend-multiply dark:mix-blend-screen shadow-sm shadow-emerald-500/25 hex-shield"
                        />
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Freya</h2>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
                                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Asistente IA · En línea</p>
                            </div>
                        </div>
                    </div>

                    {tieneMensajes && (
                        <button
                            onClick={limpiarChat}
                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 h-10 px-3 border border-slate-200 dark:border-emerald-500/15 hover:border-emerald-500/40 hover:bg-emerald-500/[0.05] transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            Nueva conversación
                        </button>
                    )}
                </header>
            )}

            <div className={`flex-1 overflow-y-auto scrollbar-hide ${esMobile ? 'bg-slate-50 dark:bg-[#050505]' : 'bg-slate-50 dark:bg-[#050505]'}`}>
                {!tieneMensajes ? (
                    <div className={`flex flex-col items-center justify-center min-h-full px-6 gap-8 ${esMobile ? 'py-8' : 'py-12 gap-10'}`}>
                        <div className="flex flex-col items-center gap-5 text-center">
                            <div className="relative">
                                <img
                                    src="/images/logo_freya.png"
                                    alt="Freya"
                                    className="w-20 h-20 object-cover mix-blend-multiply dark:mix-blend-screen shadow-xl shadow-emerald-500/25"
                                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                                />
                            </div>
                            <div className="space-y-2 text-center">
                                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Hola, soy Freya</h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                                    Tu asistente de programación. Pregúntame cualquier duda sobre código, conceptos o arquitectura.
                                </p>
                            </div>
                        </div>

                        <SugerenciasRapidas alSeleccionar={enviarMensaje} />
                    </div>
                ) : (
                    <div className="px-4 py-6 max-w-3xl mx-auto w-full space-y-1">
                        {mensajes.map((msg) => (
                            <MensajeAsistente key={msg.id} message={msg} />
                        ))}

                        {estaPensando && (
                            <div className="flex items-end gap-2.5 mb-2 pl-0.5">
                                <img
                                    src="/images/logo_freya.png"
                                    alt="Freya"
                                    className="w-7 h-7 object-cover shrink-0 mix-blend-multiply dark:mix-blend-screen shadow-sm shadow-emerald-500/20"
                                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                                />
                                <div
                                    className="flex gap-1.5 px-4 py-3.5 bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
                                >
                                    <span className="w-2 h-2 bg-emerald-500 animate-bounce [animation-delay:0ms]" />
                                    <span className="w-2 h-2 bg-emerald-500 animate-bounce [animation-delay:120ms]" />
                                    <span className="w-2 h-2 bg-emerald-500 animate-bounce [animation-delay:240ms]" />
                                </div>
                            </div>
                        )}

                        <div ref={refFinalMensajes} />
                    </div>
                )}
            </div>

            <EntradaAsistente alEnviar={enviarMensaje} estaPensando={estaPensando} />
        </div>
    );
};
