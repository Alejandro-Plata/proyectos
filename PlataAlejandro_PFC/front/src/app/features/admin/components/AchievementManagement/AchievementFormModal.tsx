import { useState, useRef } from 'react';
import type { AdminAchievement, AchievementTriggerType } from '../../types/types';
import { TRIGGER_TYPE_LABELS, RARITY_LABELS, ACHIEVEMENT_STATUS_LABELS } from '../../types/types';

interface Props {
    initial?: AdminAchievement | null;
    onSave: (data: FormData) => Promise<void>;
    onClose: () => void;
}

const TRIGGER_TYPES = Object.keys(TRIGGER_TYPE_LABELS) as AchievementTriggerType[];
const RARITIES = Object.keys(RARITY_LABELS) as Array<'common' | 'rare' | 'epic' | 'legendary'>;

const RARITY_COLORS = {
    common:    'text-slate-500',
    rare:      'text-cyan-500',
    epic:      'text-violet-500',
    legendary: 'text-amber-500',
};

export function AchievementFormModal({ initial, onSave, onClose }: Props) {
    const [title, setTitle] = useState(initial?.title ?? '');
    const [description, setDescription] = useState(initial?.description ?? '');
    const [triggerType, setTriggerType] = useState<AchievementTriggerType>(
        initial?.trigger_type ?? 'challenge_count'
    );
    const [threshold, setThreshold] = useState(String(initial?.threshold ?? 1));
    const [xpReward, setXpReward] = useState(String(initial?.xp_reward ?? 0));
    const [rarity, setRarity] = useState<'common' | 'rare' | 'epic' | 'legendary'>(
        initial?.rarity ?? 'common'
    );
    const [displayOrder, setDisplayOrder] = useState(String(initial?.display_order ?? 0));
    const [isActive, setIsActive] = useState(initial?.is_active ?? true);
    const [status, setStatus] = useState<'pending' | 'published'>(initial?.status ?? 'pending');
    const [emblemFile, setEmblemFile] = useState<File | null>(null);
    const [emblemPreview, setEmblemPreview] = useState<string | null>(initial?.emblem_url ?? null);
    const [isSaving, setIsSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setEmblemFile(file);
        setEmblemPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const fd = new FormData();
            fd.append('title', title);
            fd.append('description', description);
            fd.append('trigger_type', triggerType);
            fd.append('threshold', threshold);
            fd.append('xp_reward', xpReward);
            fd.append('rarity', rarity);
            fd.append('display_order', displayOrder);
            fd.append('is_active', String(isActive));
            fd.append('status', status);
            if (emblemFile) fd.append('emblem', emblemFile);
            await onSave(fd);
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    const inputBase =
        'w-full text-sm px-3 py-2.5 outline-none border transition-colors bg-transparent text-slate-900 dark:text-white border-emerald-500/20 dark:border-emerald-500/15 focus:border-emerald-500/50 placeholder:text-slate-400/60 dark:placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0a0b0e] border border-emerald-500/20 dark:border-emerald-500/15 shadow-2xl shadow-emerald-500/10 overflow-y-auto max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-emerald-500/10 bg-emerald-500/[0.03]">
                    <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                        {initial ? 'Editar logro' : 'Nuevo logro'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-emerald-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Emblema */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="w-16 h-16 border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 flex items-center justify-center overflow-hidden transition-colors shrink-0"
                        >
                            {emblemPreview ? (
                                <img src={emblemPreview} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <svg className="w-7 h-7 text-emerald-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                            )}
                        </button>
                        <div className="flex-1 min-w-0">
                            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Emblema (opcional)</p>
                            <p className="text-xs text-slate-500">PNG, JPG, WebP, SVG o GIF — máx. 2 MB</p>
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                                {emblemPreview ? 'Cambiar imagen' : 'Subir imagen'}
                            </button>
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>

                    {/* Título */}
                    <div>
                        <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Título *</label>
                        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ej: Primeros Pasos" className={inputBase} />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Descripción *</label>
                        <textarea
                            required rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="ej: Completa tu primer reto de programación."
                            className={`${inputBase} resize-none`}
                        />
                    </div>

                    {/* Tipo de disparo + Umbral */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Tipo de métrica *</label>
                            <select value={triggerType} onChange={(e) => setTriggerType(e.target.value as AchievementTriggerType)} className={inputBase}>
                                {TRIGGER_TYPES.map((t) => (
                                    <option key={t} value={t}>{TRIGGER_TYPE_LABELS[t]}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Umbral *</label>
                            <input required type="number" min={0} value={threshold} onChange={(e) => setThreshold(e.target.value)} className={inputBase} />
                        </div>
                    </div>

                    {/* XP + Rareza */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">XP al desbloquear</label>
                            <input type="number" min={0} value={xpReward} onChange={(e) => setXpReward(e.target.value)} className={inputBase} />
                        </div>
                        <div>
                            <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Rareza *</label>
                            <select value={rarity} onChange={(e) => setRarity(e.target.value as typeof rarity)} className={`${inputBase} ${RARITY_COLORS[rarity]}`}>
                                {RARITIES.map((r) => (
                                    <option key={r} value={r}>{RARITY_LABELS[r]}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Orden + Activo */}
                    <div className="grid grid-cols-2 gap-3 items-end">
                        <div>
                            <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Orden de visualización</label>
                            <input type="number" min={0} value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className={inputBase} />
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer pb-2">
                            <div
                                onClick={() => setIsActive((v) => !v)}
                                className={`relative w-10 h-5 rounded-full transition-colors ${isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-5' : ''}`} />
                            </div>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                {isActive ? 'Activo' : 'Inactivo'}
                            </span>
                        </label>
                    </div>

                    {/* Estado de publicación */}
                    <div>
                        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Estado</label>
                        <div className="flex border border-emerald-500/20 dark:border-emerald-500/15 overflow-hidden">
                            {(Object.entries(ACHIEVEMENT_STATUS_LABELS) as [string, string][]).map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setStatus(value as 'pending' | 'published')}
                                    className={`flex-1 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                                        status === value
                                            ? value === 'published'
                                                ? 'bg-emerald-500 text-black'
                                                : 'bg-slate-500 text-white'
                                            : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-emerald-500/[0.04]'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 font-mono text-[10px] uppercase tracking-wider border border-emerald-500/20 text-slate-500 dark:text-slate-400 hover:border-emerald-500/40 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 py-2.5 font-mono text-[10px] uppercase tracking-wider bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                        >
                            {isSaving ? 'Guardando...' : initial ? 'Guardar cambios' : 'Crear logro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
