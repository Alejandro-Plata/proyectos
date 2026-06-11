import { useState } from 'react';
import type { AdminAchievement } from '../../types/types';
import { TRIGGER_TYPE_LABELS, RARITY_LABELS, ACHIEVEMENT_STATUS_LABELS } from '../../types/types';
import { AchievementFormModal } from './AchievementFormModal';
import { getEmblemUrl } from '../../../../utils/getAvatarUrl';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { AdminListMobile } from '../shared/AdminListMobile';

interface Props {
    achievements: AdminAchievement[];
    onDelete: (id: string) => void;
    onCreate: (data: FormData) => Promise<void>;
    onUpdate: (id: string, data: FormData) => Promise<void>;
    onStatusChange: (id: string, status: 'pending' | 'published') => Promise<void>;
}

const RARITY_STYLES: Record<string, string> = {
    common:    'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/[0.04] dark:text-slate-400 dark:border-white/10',
    rare:      'bg-cyan-500/[0.08] text-cyan-600 border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-400',
    epic:      'bg-violet-500/[0.08] text-violet-600 border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400',
    legendary: 'bg-amber-500/[0.08] text-amber-600 border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
};

export function AchievementTable({ achievements, onDelete, onCreate, onUpdate, onStatusChange }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<AdminAchievement | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const isMobile = useIsMobile();

    const handleSave = async (data: FormData) => {
        if (editing) {
            await onUpdate(editing.achievement_id, data);
        } else {
            await onCreate(data);
        }
    };

    const emblemPlaceholder = (
        <div className="w-10 h-10 bg-emerald-500/[0.08] dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-emerald-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {achievements.length} logro{achievements.length !== 1 ? 's' : ''}
                </p>
                <button
                    onClick={() => { setEditing(null); setShowForm(true); }}
                    className="min-h-[44px] font-mono text-[10px] uppercase tracking-wider px-4 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/[0.06] transition-colors"
                >
                    + Nuevo logro
                </button>
            </div>

            {achievements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 border border-emerald-500/15 dark:border-emerald-500/10">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/50 mb-2">Sin logros</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Crea el primer logro usando el botón de arriba.</p>
                </div>
            ) : isMobile ? (
                <AdminListMobile
                    items={achievements}
                    keyExtractor={(a) => a.achievement_id}
                    renderHeader={(a) => (
                        <div className="flex items-center gap-3">
                            {getEmblemUrl(a.emblem_url)
                                ? <img src={getEmblemUrl(a.emblem_url)!} alt={a.title} className="w-10 h-10 object-cover border border-emerald-500/20 shrink-0" />
                                : emblemPlaceholder
                            }
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate font-mono uppercase tracking-wide">{a.title}</p>
                                <span className={`inline-flex px-1.5 py-0 font-mono text-[10px] uppercase tracking-wider font-bold border ${RARITY_STYLES[a.rarity] ?? ''}`}>
                                    {RARITY_LABELS[a.rarity] ?? a.rarity}
                                </span>
                            </div>
                        </div>
                    )}
                    renderBody={(a) => (
                        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                            <dt className="text-slate-500 font-mono uppercase tracking-wider">Tipo</dt>
                            <dd className="text-slate-700 dark:text-slate-300 font-mono text-[10px]">{TRIGGER_TYPE_LABELS[a.trigger_type] ?? a.trigger_type}</dd>
                            <dt className="text-slate-500 font-mono uppercase tracking-wider">Umbral</dt>
                            <dd className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{a.threshold}</dd>
                            <dt className="text-slate-500 font-mono uppercase tracking-wider">XP</dt>
                            <dd className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">+{a.xp_reward}</dd>
                            <dt className="text-slate-500 font-mono uppercase tracking-wider">Estado</dt>
                            <dd>
                                <select
                                    value={a.status ?? 'pending'}
                                    onChange={(e) => onStatusChange(a.achievement_id, e.target.value as 'pending' | 'published')}
                                    className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 border outline-none cursor-pointer transition-colors bg-transparent ${
                                        a.status === 'published'
                                            ? 'text-emerald-600 border-emerald-500/30 dark:text-emerald-400'
                                            : 'text-slate-500 border-emerald-500/20 dark:text-slate-400'
                                    }`}
                                >
                                    {Object.entries(ACHIEVEMENT_STATUS_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </dd>
                        </dl>
                    )}
                    renderActions={(a) => (
                        <>
                            <button
                                onClick={() => { setEditing(a); setShowForm(true); }}
                                className="flex-1 min-h-[44px] font-mono text-[11px] uppercase tracking-wider border border-emerald-500/20 text-slate-600 dark:text-slate-400 hover:text-emerald-600 hover:border-emerald-500/40 transition-colors"
                            >
                                Editar
                            </button>
                            {confirmDelete === a.achievement_id ? (
                                <>
                                    <button
                                        onClick={() => { onDelete(a.achievement_id); setConfirmDelete(null); }}
                                        className="flex-1 min-h-[44px] font-mono text-[11px] uppercase tracking-wider border border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
                                    >
                                        Confirmar
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(null)}
                                        className="flex-1 min-h-[44px] font-mono text-[11px] uppercase tracking-wider border border-emerald-500/20 text-slate-500 hover:border-emerald-500/40 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setConfirmDelete(a.achievement_id)}
                                    className="flex-1 min-h-[44px] font-mono text-[11px] uppercase tracking-wider border border-rose-500/20 text-rose-500 hover:border-rose-500/40 hover:bg-rose-500/10 transition-colors"
                                >
                                    Eliminar
                                </button>
                            )}
                        </>
                    )}
                    emptyMessage="No hay logros creados"
                />
            ) : (
                <div className="overflow-x-auto border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-emerald-500/10 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                <th className="text-left px-4 py-3 font-medium">Emblema</th>
                                <th className="text-left px-4 py-3 font-medium">Título</th>
                                <th className="text-left px-4 py-3 font-medium">Tipo</th>
                                <th className="text-center px-4 py-3 font-medium">Umbral</th>
                                <th className="text-center px-4 py-3 font-medium">XP</th>
                                <th className="text-center px-4 py-3 font-medium">Rareza</th>
                                <th className="text-center px-4 py-3 font-medium">Activo</th>
                                <th className="text-center px-4 py-3 font-normal">· estado</th>
                                <th className="text-right px-4 py-3 font-normal">· acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {achievements.map((a) => (
                                <tr
                                    key={a.achievement_id}
                                    className="border-b border-emerald-500/[0.06] hover:bg-emerald-500/[0.04] dark:hover:bg-emerald-500/[0.05] transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        {getEmblemUrl(a.emblem_url) ? (
                                            <img src={getEmblemUrl(a.emblem_url)!} alt={a.title} className="w-10 h-10 object-cover border border-emerald-500/20 dark:border-emerald-500/15" />
                                        ) : (
                                            <div className="w-10 h-10 bg-emerald-500/[0.08] dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-emerald-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-900 dark:text-white">{a.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[200px] mt-0.5">{a.description}</p>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                        {TRIGGER_TYPE_LABELS[a.trigger_type] ?? a.trigger_type}
                                    </td>
                                    <td className="px-4 py-3 text-center font-mono text-sm text-emerald-600 dark:text-emerald-400">
                                        {a.threshold}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">+{a.xp_reward} XP</span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${RARITY_STYLES[a.rarity]}`}>
                                            {RARITY_LABELS[a.rarity] ?? a.rarity}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-block w-2 h-2 rounded-full ${a.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <select
                                            value={a.status ?? 'pending'}
                                            onChange={(e) => onStatusChange(a.achievement_id, e.target.value as 'pending' | 'published')}
                                            className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 border outline-none cursor-pointer transition-colors bg-transparent ${
                                                a.status === 'published'
                                                    ? 'text-emerald-600 border-emerald-500/30 dark:text-emerald-400'
                                                    : 'text-slate-500 border-emerald-500/20 dark:text-slate-400'
                                            }`}
                                        >
                                            {Object.entries(ACHIEVEMENT_STATUS_LABELS).map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => { setEditing(a); setShowForm(true); }}
                                                className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 border border-emerald-500/20 text-slate-500 dark:text-slate-400 hover:text-emerald-600 hover:border-emerald-500/40 transition-colors"
                                            >
                                                Editar
                                            </button>
                                            {confirmDelete === a.achievement_id ? (
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => { onDelete(a.achievement_id); setConfirmDelete(null); }}
                                                        className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/[0.06] transition-colors"
                                                    >
                                                        OK
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDelete(null)}
                                                        className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 border border-emerald-500/20 text-slate-500 hover:border-emerald-500/40 transition-colors"
                                                    >
                                                        No
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setConfirmDelete(a.achievement_id)}
                                                    className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 border border-rose-500/20 text-rose-500 hover:border-rose-500/40 hover:bg-rose-500/[0.06] transition-colors"
                                                >
                                                    Eliminar
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <AchievementFormModal
                    initial={editing}
                    onSave={handleSave}
                    onClose={() => { setShowForm(false); setEditing(null); }}
                />
            )}
        </div>
    );
}
