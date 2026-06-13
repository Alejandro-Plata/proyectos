import { useRef, useEffect, useState, useCallback } from 'react';
import type { Message, MessageType } from '../types/types';
import { AudioMessage } from './AudioMessage';

type RecordState = 'idle' | 'recording' | 'preview';

interface AttachmentPreview {
    file: File;
    localUrl: string;
    type: 'image' | 'video';
}

interface PropsEntradaMensaje {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onSendMedia?: (file: File, messageType: MessageType, caption?: string, replyToId?: string, onProgress?: (pct: number) => void) => Promise<void>;
    replyTo?: Message | null;
    onCancelReply?: () => void;
    replyToUsername?: string;
    conversationId?: string;
    isDark?: boolean;
}

export const EntradaMensaje = ({
    value, onChange, onSend, onKeyDown, onSendMedia,
    replyTo, onCancelReply, replyToUsername, isDark = false,
}: PropsEntradaMensaje) => {
    const hasContent = value.trim().length > 0;
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const recordTimerRef = useRef<ReturnType<typeof setInterval>>(undefined);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearInterval(recordTimerRef.current);
            if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
        };
    }, []);

    const [attachment, setAttachment] = useState<AttachmentPreview | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [recordState, setRecordState] = useState<RecordState>('idle');
    const [recordSec, setRecordSec] = useState(0);
    const [uploadPct, setUploadPct] = useState<number | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Phase 1: autofocus when reply is set
    const prevReplyRef = useRef<Message | null | undefined>(null);
    useEffect(() => {
        if (replyTo !== prevReplyRef.current) {
            prevReplyRef.current = replyTo;
            if (replyTo !== null) textareaRef.current?.focus();
        }
    }, [replyTo]);

    const clearAttachment = useCallback(() => {
        if (attachment) URL.revokeObjectURL(attachment.localUrl);
        setAttachment(null);
        setAudioBlob(null);
        setRecordState('idle');
        setUploadPct(null);
        setUploadError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [attachment]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        const localUrl = URL.createObjectURL(file);
        setAttachment({ file, localUrl, type });
        setAudioBlob(null);
    }, []);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : MediaRecorder.isTypeSupported('audio/mp4')
                    ? 'audio/mp4'
                    : 'audio/webm';
            const mr = new MediaRecorder(stream, { mimeType });
            audioChunksRef.current = [];
            mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
            mr.onstop = () => {
                stream.getTracks().forEach(t => t.stop());
                const blob = new Blob(audioChunksRef.current, { type: mimeType });
                setAudioBlob(blob);
                setRecordState('preview');
                setRecordSec(0);
                clearInterval(recordTimerRef.current);
            };
            mr.start(100);
            mediaRecorderRef.current = mr;
            setRecordState('recording');
            setRecordSec(0);
            recordTimerRef.current = setInterval(() => setRecordSec(s => s + 1), 1000);
        } catch (err) {
            console.error('[MediaRecorder]', err);
        }
    }, []);

    const stopRecording = useCallback(() => {
        mediaRecorderRef.current?.stop();
        clearInterval(recordTimerRef.current);
    }, []);

    const discardAudio = useCallback(() => {
        setAudioBlob(null);
        setRecordState('idle');
    }, []);

    const handleSendMedia = useCallback(async (mediaFile: File, mediaType: MessageType, caption?: string) => {
        if (!onSendMedia) return;
        setUploadPct(0);
        setUploadError(null);
        try {
            await onSendMedia(mediaFile, mediaType, caption, replyTo?.id, (pct) => setUploadPct(pct));
            clearAttachment();
            if (onCancelReply) onCancelReply();
        } catch (err: any) {
            setUploadError(err?.message ?? 'Error al enviar');
            setUploadPct(null);
        }
    }, [onSendMedia, replyTo, clearAttachment, onCancelReply]);

    const handleSendAttachment = useCallback(() => {
        if (attachment) {
            handleSendMedia(attachment.file, attachment.type, value.trim() || undefined);
        } else if (audioBlob) {
            const ext = audioBlob.type.includes('mp4') ? 'm4a' : 'webm';
            const audioFile = new File([audioBlob], `audio-${Date.now()}.${ext}`, { type: audioBlob.type });
            handleSendMedia(audioFile, 'audio', value.trim() || undefined);
        }
    }, [attachment, audioBlob, value, handleSendMedia]);

    const formatSec = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const hasMedia = !!attachment || !!audioBlob;

    return (
        <div className="border-t border-emerald-500/10 dark:border-emerald-500/8">

            {/* Reply preview */}
            {replyTo && (
                <div className="flex items-start gap-2 px-4 pt-3 pb-0">
                    <div className="flex-1 border-l-2 border-emerald-500/50 pl-3 py-1 bg-emerald-500/[0.04]">
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">
                            Respondiendo a @{replyToUsername ?? 'usuario'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {replyTo.content || (replyTo.message_type === 'image' ? '📷 Foto' : replyTo.message_type === 'video' ? '🎥 Vídeo' : replyTo.message_type === 'audio' ? '🎤 Audio' : '')}
                        </p>
                    </div>
                    {onCancelReply && (
                        <button onClick={onCancelReply} className="shrink-0 mt-1 text-slate-400 hover:text-emerald-500 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            )}

            {/* Attachment preview */}
            {attachment && (
                <div className="px-4 pt-3 pb-0">
                    <div className="relative inline-block">
                        {attachment.type === 'image' ? (
                            <img src={attachment.localUrl} alt="Preview" className="max-h-36 max-w-full object-contain border border-emerald-500/20" />
                        ) : (
                            <video src={attachment.localUrl} className="max-h-36 max-w-full border border-emerald-500/20" muted />
                        )}
                        <button
                            onClick={clearAttachment}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-400"
                        >×</button>
                    </div>
                </div>
            )}

            {/* Audio preview — reproductor + descartar + enviar en una sola fila */}
            {audioBlob && recordState === 'preview' && (
                <div className="flex items-center gap-2 px-4 pt-3 pb-0">
                    <div className="flex-1 border border-emerald-500/20 px-2 py-1">
                        <AudioMessage src={URL.createObjectURL(audioBlob)} isDark={isDark} />
                    </div>
                    <button
                        onClick={discardAudio}
                        title="Descartar"
                        className="shrink-0 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    {uploadPct === null && (
                        <button
                            onClick={handleSendAttachment}
                            title="Enviar audio"
                            className="shrink-0 w-9 h-9 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-black transition-all"
                            aria-label="Enviar audio"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                            </svg>
                        </button>
                    )}
                </div>
            )}

            {/* Upload progress */}
            {uploadPct !== null && (
                <div className="px-4 pt-2">
                    <div className="h-1 w-full bg-emerald-500/10">
                        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${uploadPct}%` }} />
                    </div>
                    <p className="font-mono text-[10px] text-emerald-500/60 mt-0.5">Subiendo... {uploadPct}%</p>
                </div>
            )}
            {uploadError && (
                <p className="px-4 pt-1 text-xs text-red-500">{uploadError}</p>
            )}

            {/* Recording indicator */}
            {recordState === 'recording' && (
                <div className="flex items-center gap-2 px-4 pt-3 pb-0">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{formatSec(recordSec)}</span>
                    <button
                        onClick={stopRecording}
                        className="ml-auto font-mono text-[10px] px-2 py-1 border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                        [DETENER]
                    </button>
                </div>
            )}

            <div className="flex items-center gap-2 px-4 py-3">

                {/* Media buttons (only in idle, not recording) */}
                {recordState === 'idle' && !hasMedia && (
                    <>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            hidden
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="shrink-0 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors"
                            title="Adjuntar imagen o vídeo"
                            type="button"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                            </svg>
                        </button>
                        <button
                            onClick={startRecording}
                            className="shrink-0 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors"
                            title="Grabar nota de voz"
                            type="button"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Textarea */}
                {!hasMedia && recordState !== 'recording' && (
                    <div className="flex-1 relative flex items-center border border-emerald-500/20 dark:border-emerald-500/15 focus-within:border-emerald-500/50 dark:focus-within:border-emerald-500/40 transition-colors duration-150">
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyDown={onKeyDown}
                            placeholder={hasMedia ? 'Añade un pie de foto...' : 'escribe un mensaje...'}
                            rows={1}
                            className="
                                w-full resize-none px-3 py-1.5 text-sm outline-none leading-5
                                max-h-32 overflow-y-auto bg-transparent
                                text-slate-900 dark:text-white
                                placeholder:text-slate-400/60 dark:placeholder:text-slate-600
                                placeholder:font-mono placeholder:text-xs
                            "
                        />
                        <span className="hidden sm:block absolute bottom-1.5 right-2 font-mono text-[9px] text-emerald-500/25 pointer-events-none select-none">
                            ⏎
                        </span>
                    </div>
                )}

                {/* Caption field — solo para imagen/vídeo, no para audio */}
                {attachment && recordState !== 'recording' && (
                    <div className="flex-1 relative flex items-center border border-emerald-500/20 dark:border-emerald-500/15 focus-within:border-emerald-500/50 transition-colors">
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendAttachment(); } }}
                            placeholder="Pie de foto opcional..."
                            rows={1}
                            className="w-full resize-none px-3 py-1.5 text-sm outline-none leading-5 max-h-24 overflow-y-auto bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400/60 dark:placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs"
                        />
                    </div>
                )}

                {/* Send button — texto sin adjunto */}
                {!hasMedia && recordState === 'idle' && (
                    <button
                        onClick={onSend}
                        disabled={!hasContent}
                        className={`shrink-0 w-9 h-9 flex items-center justify-center transition-all duration-150 ${
                            hasContent
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                                : 'bg-emerald-500/[0.08] text-emerald-500/30 cursor-not-allowed border border-emerald-500/15'
                        }`}
                        aria-label="Enviar mensaje"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                        </svg>
                    </button>
                )}

                {/* Send media button — solo para imagen/vídeo (audio tiene su propio botón arriba) */}
                {attachment && uploadPct === null && (
                    <button
                        onClick={handleSendAttachment}
                        className="shrink-0 w-9 h-9 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-black transition-all"
                        aria-label="Enviar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};
