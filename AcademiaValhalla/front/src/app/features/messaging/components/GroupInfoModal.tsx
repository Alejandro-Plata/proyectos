import { useState, useCallback, useEffect, useRef } from 'react';
import { useMessaging } from '../../../hooks/useMessaging';
import { useUser } from '../../../context/UserContext';
import { messagingService } from '../services/messagingService';
import { getAvatarUrl } from '../../../utils/getAvatarUrl';
import type { ConversationGroup } from '../types/types';

type UserResult = { user_id: string; username: string; avatar_url?: string };
type Role = 'owner' | 'admin' | 'member';

interface GroupInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: ConversationGroup;
    isDark: boolean;
}

const CLIP_TR = 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)';
const ROLE_ORDER: Record<Role, number> = { owner: 0, admin: 1, member: 2 };
const ROLE_LABEL: Record<Role, string> = { owner: 'Creador', admin: 'Admin', member: '' };

export const GroupInfoModal = ({ isOpen, onClose, group }: GroupInfoModalProps) => {
    const { user } = useUser();
    const { updateGroup, addGroupParticipants, removeGroupParticipant, updateGroupRole, leaveGroup } = useMessaging();

    const myId = user?.user_id ?? '';
    const myRole: Role = (group.participants.find(p => p.user_id === myId)?.role as Role) ?? 'member';
    const canManage = myRole === 'owner' || myRole === 'admin';
    const isOwner = myRole === 'owner';

    // Edición de nombre
    const [editingName, setEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState(group.name);
    const [savingName, setSavingName] = useState(false);

    // Avatar
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Añadir miembros
    const [showAdd, setShowAdd] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [selected, setSelected] = useState<UserResult[]>([]);
    const [adding, setAdding] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const [busyUser, setBusyUser] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { setNameDraft(group.name); }, [group.name]);

    useEffect(() => {
        if (!showAdd) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!query.trim()) { setResults([]); return; }
        debounceRef.current = setTimeout(async () => {
            setSearching(true);
            try {
                const r = await messagingService.searchUsers(query.trim());
                const existing = new Set(group.participants.map(p => p.user_id));
                setResults(r.filter(u => !existing.has(u.user_id)));
            } catch { setResults([]); }
            finally { setSearching(false); }
        }, 400);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [query, showAdd, group.participants]);

    const toggleSelect = useCallback((u: UserResult) => {
        setSelected(prev => prev.some(s => s.user_id === u.user_id)
            ? prev.filter(s => s.user_id !== u.user_id)
            : [...prev, u]);
    }, []);

    if (!isOpen) return null;

    const handleSaveName = async () => {
        const name = nameDraft.trim();
        if (!name || name === group.name) { setEditingName(false); return; }
        setSavingName(true); setError(null);
        try { await updateGroup(group.id, { name }); setEditingName(false); }
        catch (e: any) { setError(e?.message ?? 'Error al renombrar'); }
        finally { setSavingName(false); }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingAvatar(true); setError(null);
        try { await updateGroup(group.id, { avatar: file }); }
        catch (err: any) { setError(err?.message ?? 'Error al subir la foto'); }
        finally { setUploadingAvatar(false); if (avatarInputRef.current) avatarInputRef.current.value = ''; }
    };

    const handleAddMembers = async () => {
        if (selected.length === 0) return;
        setAdding(true); setError(null);
        try {
            await addGroupParticipants(group.id, selected.map(u => u.user_id));
            setSelected([]); setQuery(''); setResults([]); setShowAdd(false);
        } catch (e: any) { setError(e?.message ?? 'Error al añadir'); }
        finally { setAdding(false); }
    };

    const handleKick = async (uid: string) => {
        setBusyUser(uid); setError(null);
        try { await removeGroupParticipant(group.id, uid); }
        catch (e: any) { setError(e?.message ?? 'Error al expulsar'); }
        finally { setBusyUser(null); }
    };

    const handleRole = async (uid: string, role: 'admin' | 'member') => {
        setBusyUser(uid); setError(null);
        try { await updateGroupRole(group.id, uid, role); }
        catch (e: any) { setError(e?.message ?? 'Error al cambiar rol'); }
        finally { setBusyUser(null); }
    };

    const handleLeave = async () => {
        if (!window.confirm('¿Seguro que quieres salir del grupo?')) return;
        try { await leaveGroup(group.id); onClose(); }
        catch (e: any) { setError(e?.message ?? 'Error al salir'); }
    };

    const canKick = (target: { user_id: string; role?: string }) => {
        if (target.user_id === myId) return false;
        if (target.role === 'owner') return false;
        if (isOwner) return true;
        return myRole === 'admin' && target.role === 'member';
    };

    const sorted = [...group.participants].sort((a, b) =>
        (ROLE_ORDER[(a.role as Role) ?? 'member'] - ROLE_ORDER[(b.role as Role) ?? 'member'])
        || a.username.localeCompare(b.username)
    );

    return (
        <div
            className="absolute inset-0 z-30 flex flex-col bg-white dark:bg-[#0a0b0e]"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 shrink-0">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                    Info del grupo
                </h3>
                <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center font-mono text-xs text-slate-400 hover:text-emerald-500 border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 transition-colors"
                    style={{ clipPath: CLIP_TR }}
                    aria-label="Cerrar"
                >[×]</button>
            </div>
            <div className="h-px mx-5 shrink-0" style={{ background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.3), transparent)' }} />

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

                {/* Avatar + nombre */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative w-20 h-20">
                        <div className="w-20 h-20 hex-shield flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 overflow-hidden">
                            {group.avatar_url ? (
                                <img src={group.avatar_url} alt={group.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-mono text-lg font-bold text-emerald-500">
                                    {group.name.slice(0, 2).toUpperCase()}
                                </span>
                            )}
                        </div>
                        {canManage && (
                            <>
                                <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                                <button
                                    onClick={() => avatarInputRef.current?.click()}
                                    disabled={uploadingAvatar}
                                    title="Cambiar foto"
                                    className="absolute -bottom-1 -right-1 w-7 h-7 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-black transition-colors disabled:opacity-60"
                                >
                                    {uploadingAvatar ? (
                                        <span className="font-mono text-xs animate-pulse">⠿</span>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </>
                        )}
                    </div>

                    {editingName && canManage ? (
                        <div className="flex items-center gap-2 w-full max-w-[260px]">
                            <input
                                value={nameDraft}
                                onChange={(e) => setNameDraft(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') { setEditingName(false); setNameDraft(group.name); } }}
                                maxLength={100}
                                autoFocus
                                className="flex-1 px-2 py-1.5 text-sm text-center outline-none bg-transparent text-slate-900 dark:text-white border-b-2 border-emerald-500/40 focus:border-emerald-400"
                            />
                            <button onClick={handleSaveName} disabled={savingName} className="shrink-0 w-7 h-7 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-black disabled:opacity-60" title="Guardar">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white text-center">{group.name}</h2>
                            {canManage && (
                                <button onClick={() => setEditingName(true)} className="text-slate-400 hover:text-emerald-500 transition-colors" title="Renombrar">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                            )}
                        </div>
                    )}
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        {group.participants.length} miembros
                    </p>
                </div>

                {error && <p className="text-xs text-red-500 text-center">{error}</p>}

                {/* Añadir miembros */}
                {canManage && (
                    <div>
                        {!showAdd ? (
                            <button
                                onClick={() => setShowAdd(true)}
                                className="w-full flex items-center justify-center gap-2 py-2 font-mono text-[10px] uppercase tracking-widest text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/[0.06] transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                Añadir miembros
                            </button>
                        ) : (
                            <div className="border border-emerald-500/20 p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Añadir miembros</span>
                                    <button onClick={() => { setShowAdd(false); setSelected([]); setQuery(''); }} className="font-mono text-[10px] text-slate-400 hover:text-emerald-500">[×]</button>
                                </div>
                                {selected.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {selected.map(u => (
                                            <span key={u.user_id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                                                {u.username}
                                                <button onClick={() => toggleSelect(u)} className="hover:text-red-500 ml-0.5">×</button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Buscar usuarios..."
                                    className="w-full px-2 py-1.5 text-sm outline-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border-b-2 border-emerald-500/40 focus:border-emerald-400"
                                />
                                {searching && <p className="font-mono text-[10px] text-slate-400">Buscando...</p>}
                                {results.length > 0 && (
                                    <div className="max-h-32 overflow-y-auto space-y-0.5">
                                        {results.map(u => {
                                            const sel = selected.some(s => s.user_id === u.user_id);
                                            return (
                                                <button key={u.user_id} onClick={() => toggleSelect(u)} className={`w-full flex items-center gap-2 px-2 py-1.5 text-left transition-colors border-l-2 ${sel ? 'bg-emerald-500/[0.08] border-emerald-500' : 'hover:bg-emerald-500/5 border-transparent'}`}>
                                                    <div className="w-7 h-7 hex-shield overflow-hidden shrink-0">
                                                        <img src={getAvatarUrl(u.username, u.avatar_url)} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="flex-1 text-xs font-semibold text-slate-800 dark:text-white truncate">{u.username}</span>
                                                    {sel && <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                                <button
                                    onClick={handleAddMembers}
                                    disabled={selected.length === 0 || adding}
                                    className={`w-full py-2 font-mono text-[10px] uppercase tracking-widest transition-all ${selected.length > 0 && !adding ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-emerald-500/10 text-emerald-500/30 cursor-not-allowed border border-emerald-500/15'}`}
                                >
                                    {adding ? 'Añadiendo...' : `Añadir${selected.length ? ` (${selected.length})` : ''}`}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Lista de participantes */}
                <div className="space-y-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 mb-1.5">Participantes</p>
                    {sorted.map(p => {
                        const role = (p.role as Role) ?? 'member';
                        const isMe = p.user_id === myId;
                        return (
                            <div key={p.user_id} className="flex items-center gap-2.5 py-1.5">
                                <div className="w-9 h-9 hex-shield overflow-hidden shrink-0">
                                    <img src={getAvatarUrl(p.username, p.avatar_url)} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[13px] font-semibold text-slate-900 dark:text-white truncate block">
                                        {p.username}{isMe && <span className="text-slate-400 font-normal"> (tú)</span>}
                                    </span>
                                    {ROLE_LABEL[role] && (
                                        <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-500/80">{ROLE_LABEL[role]}</span>
                                    )}
                                </div>

                                {/* Acciones */}
                                <div className="flex items-center gap-1 shrink-0">
                                    {isOwner && !isMe && role !== 'owner' && (
                                        <button
                                            onClick={() => handleRole(p.user_id, role === 'admin' ? 'member' : 'admin')}
                                            disabled={busyUser === p.user_id}
                                            title={role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                                            className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-1 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/40 transition-colors disabled:opacity-50"
                                        >
                                            {role === 'admin' ? '− admin' : '+ admin'}
                                        </button>
                                    )}
                                    {canKick(p) && (
                                        <button
                                            onClick={() => handleKick(p.user_id)}
                                            disabled={busyUser === p.user_id}
                                            title="Expulsar"
                                            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Salir del grupo */}
                <button
                    onClick={handleLeave}
                    className="w-full flex items-center justify-center gap-2 py-2.5 font-mono text-[10px] uppercase tracking-widest text-red-500 border border-red-500/30 hover:bg-red-500/[0.06] transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Salir del grupo
                </button>
            </div>
        </div>
    );
};
