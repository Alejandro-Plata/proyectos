import { useState, useCallback, useRef, useEffect } from 'react';
import { useMessaging } from '../../../hooks/useMessaging';
import { useUser } from '../../../context/UserContext';
import type { Message } from '../types/types';

export const useChat = () => {
    const {
        activeConversation,
        messages,
        sendMessage,
        sendCommand,
        typingUserId,
        isLoading,
    } = useMessaging();
    const { user } = useUser();

    const [draft, setDraft] = useState('');
    const [replyTo, setReplyTo] = useState<Message | null>(null);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    // auto-scroll solo si el usuario ya estaba cerca del final
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        if (isNearBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleScroll = useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        setShowScrollBtn(distanceFromBottom > 80);
    }, []);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        setReplyTo(null);
    }, [activeConversation?.id]);

    const handleReply = useCallback((msg: Message) => setReplyTo(msg), []);
    const handleCancelReply = useCallback(() => setReplyTo(null), []);

    const handleSend = useCallback(() => {
        if (!draft.trim()) return;
        sendMessage(draft, replyTo?.id);
        setDraft('');
        setReplyTo(null);

        if (activeConversation) {
            sendCommand({ type: 'stop_typing', payload: { conversation_id: activeConversation.id } });
        }
    }, [draft, replyTo, sendMessage, sendCommand, activeConversation]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    const handleInputChange = useCallback(
        (value: string) => {
            setDraft(value);
            if (!activeConversation) return;

            sendCommand({ type: 'typing', payload: { conversation_id: activeConversation.id } });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                sendCommand({ type: 'stop_typing', payload: { conversation_id: activeConversation.id } });
            }, 2000);
        },
        [activeConversation, sendCommand]
    );

    return {
        activeConversation,
        messages,
        currentUserId: user?.user_id ?? '',
        typingUserId,
        isLoading,
        draft,
        replyTo,
        handleInputChange,
        handleSend,
        handleKeyDown,
        handleReply,
        handleCancelReply,
        scrollContainerRef,
        messagesEndRef,
        showScrollBtn,
        handleScroll,
        scrollToBottom,
    };
};
