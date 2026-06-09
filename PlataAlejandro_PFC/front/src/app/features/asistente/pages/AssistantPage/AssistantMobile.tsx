import { useChatAsistente } from '../../hooks/useChatAsistente';
import { MensajeAsistente } from '../../components/MensajeAsistente';
import { EntradaAsistente } from '../../components/EntradaAsistente';
import { SugerenciasRapidas } from '../../components/SuggestionChips';
import { useTheme } from '../../../../hooks/useTheme';

export const AsistenteMobile = () => {
    const { isDarkMode: isDark } = useTheme();
    const {
        messages: mensajes,
        status: estado,
        sendMessage: enviarMensaje,
        clearChat: limpiarChat,
        messagesEndRef: refFinalMensajes,
    } = useChatAsistente({});

    const estaPensando = estado === 'thinking';
    const tieneMensajes = mensajes.length > 0;

    return (
        <div className={`flex flex-col h-[calc(100dvh-56px-88px)] ${isDark ? 'bg-[#050505]' : 'bg-slate-50'}`}>

            {/* Subencabezado nativo con estado y botón reset */}
            <div className={`shrink-0 flex items-center justify-between px-4 h-11 border-b ${isDark ? 'border-emerald-500/10 bg-[#0a0b0e]' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
                    <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {estaPensando ? 'Pensando...' : 'En línea'}
                    </span>
                </div>
                {tieneMensajes && (
                    <button
                        onClick={limpiarChat}
                        className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors ${isDark ? 'text-slate-500 hover:text-emerald-400' : 'text-slate-400 hover:text-emerald-600'}`}
                    >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Nueva sesión
                    </button>
                )}
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto">
                {!tieneMensajes ? (
                    <div className="flex flex-col items-center justify-center h-full px-5 gap-7 pb-4">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="relative">
                                <img
                                    src="/images/logo_freya.png"
                                    alt="Freya"
                                    className="w-16 h-16 object-cover mix-blend-multiply dark:mix-blend-screen shadow-xl shadow-emerald-500/20"
                                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                                />
                            </div>
                            <div>
                                <h2 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Hola, soy Freya</h2>
                                <p className={`text-sm leading-relaxed max-w-[260px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Tu asistente de programación. Pregúntame cualquier duda.
                                </p>
                            </div>
                        </div>
                        <SugerenciasRapidas alSeleccionar={enviarMensaje} />
                    </div>
                ) : (
                    <div className="px-4 py-4 space-y-1">
                        {mensajes.map((msg) => (
                            <MensajeAsistente key={msg.id} message={msg} />
                        ))}

                        {estaPensando && (
                            <div className="flex items-end gap-2 mb-2">
                                <img
                                    src="/images/logo_freya.png"
                                    alt="Freya"
                                    className="w-6 h-6 object-cover shrink-0 mix-blend-multiply dark:mix-blend-screen"
                                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                                />
                                <div
                                    className={`flex gap-1.5 px-3 py-3 border ${isDark ? 'bg-[#0a0b0e] border-emerald-500/10' : 'bg-white border-emerald-500/15'}`}
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
                                >
                                    <span className="w-1.5 h-1.5 bg-emerald-500 animate-bounce [animation-delay:0ms]" />
                                    <span className="w-1.5 h-1.5 bg-emerald-500 animate-bounce [animation-delay:120ms]" />
                                    <span className="w-1.5 h-1.5 bg-emerald-500 animate-bounce [animation-delay:240ms]" />
                                </div>
                            </div>
                        )}

                        <div ref={refFinalMensajes} />
                    </div>
                )}
            </div>

            {/* Input */}
            <EntradaAsistente alEnviar={enviarMensaje} estaPensando={estaPensando} />
        </div>
    );
};
