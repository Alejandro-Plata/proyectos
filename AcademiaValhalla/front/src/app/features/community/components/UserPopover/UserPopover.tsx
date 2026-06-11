import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../../../components/Icons';
import { getAvatarUrl } from '../../../../utils/getAvatarUrl';

interface UserPopoverProps {
    userId: string;
    username: string;
    avatarUrl?: string;
    children: ReactNode;
    onReply?: () => void;
}

export const UserPopover = ({ userId, username, avatarUrl, children, onReply }: UserPopoverProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleViewProfile = () => {
        setOpen(false);
        navigate(`/dashboard/community/profile/${userId}`);
    };

    const handleSendMessage = () => {
        setOpen(false);
        navigate(`/dashboard/messages?startWith=${userId}`);
    };

    const handleReply = () => {
        setOpen(false);
        onReply?.();
    };

    return (
        <div ref={ref} className="relative inline-flex">
            <span
                onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
                className="cursor-pointer"
            >
                {children}
            </span>

            {open && (
                <div className="absolute z-50 top-full left-0 mt-1 w-52 bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-lg shadow-emerald-500/10 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">

                    <div className="flex items-center gap-2.5 p-3 border-b border-emerald-500/10 bg-emerald-500/[0.03]">
                        <div className="w-8 h-8 shrink-0">
                            <img src={getAvatarUrl(username, avatarUrl)} alt={username} className="w-full h-full hex-shield object-cover" />
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">@{username}</span>
                        </div>
                    </div>

                    <div className="py-1">
                        <button
                            onClick={handleViewProfile}
                            className="w-full flex items-center gap-2.5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-600 dark:text-slate-400 hover:bg-emerald-500/[0.05] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                        >
                            <div className="w-4 h-4 text-slate-400">{Icons.user}</div>
                            Ver perfil
                        </button>

                        <button
                            onClick={handleSendMessage}
                            className="w-full flex items-center gap-2.5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-600 dark:text-slate-400 hover:bg-emerald-500/[0.05] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                        >
                            <div className="w-4 h-4 text-slate-400">{Icons.message}</div>
                            Enviar mensaje
                        </button>

                        {onReply && (
                            <button
                                onClick={handleReply}
                                className="w-full flex items-center gap-2.5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-600 dark:text-slate-400 hover:bg-emerald-500/[0.05] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                            >
                                <div className="w-4 h-4 text-slate-400">{Icons.message}</div>
                                Responder
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
