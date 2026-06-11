import { useState } from 'react';
import type { ContentRequest, AdminFilters, ReviewRequestPayload, ReviewResponse } from '../../types/types';
import { RequestDetailModal } from './RequestDetailModal';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { AdminListMobile } from '../shared/AdminListMobile';
import { BottomSheet } from '../../../../components/BottomSheet';

interface Props {
    requests: ContentRequest[];
    isDark: boolean;
    onReview: (requestId: string, payload: ReviewRequestPayload) => Promise<ReviewResponse>;
    filters: AdminFilters & { status?: string; content_type?: string };
    onFiltersChange: React.Dispatch<React.SetStateAction<AdminFilters & { status?: string; content_type?: string }>>;
}

const REQ_STATUS_STYLES: Record<string, string> = {
    pending:  'bg-amber-500/[0.08] text-amber-600 border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
    approved: 'bg-emerald-500/[0.08] text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400',
    rejected: 'bg-rose-500/[0.08] text-rose-600 border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400',
};

const REQ_STATUS_LABELS: Record<string, string> = {
    pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada',
};

const selectBase = "appearance-none font-mono text-[10px] uppercase tracking-wider pl-3 pr-8 py-2 outline-none cursor-pointer transition-all bg-transparent text-slate-700 dark:text-slate-300 border border-emerald-500/20 dark:border-emerald-500/15 focus:border-emerald-500/50";

export const RequestsTable = ({ requests, onReview, filters, onFiltersChange }: Props) => {
    const [selected, setSelected] = useState<ContentRequest | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const isMobile = useIsMobile();

    const activeFilterCount = [filters.status, filters.content_type].filter(Boolean).length;

    const desktopFilters = (
        <div className="flex flex-wrap gap-3">
            <div className="relative">
                <select
                    value={filters.status ?? ''}
                    onChange={(e) => onFiltersChange((f) => ({ ...f, status: e.target.value || undefined, page: 1 }))}
                    className={selectBase}
                >
                    <option value="">Todos los estados</option>
                    <option value="pending">Pendientes</option>
                    <option value="approved">Aprobadas</option>
                    <option value="rejected">Rechazadas</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500/50">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
            <div className="relative">
                <select
                    value={filters.content_type ?? ''}
                    onChange={(e) => onFiltersChange((f) => ({ ...f, content_type: e.target.value || undefined, page: 1 }))}
                    className={selectBase}
                >
                    <option value="">Todos los tipos</option>
                    <option value="challenge">Retos</option>
                    <option value="note">Apuntes</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500/50">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
        </div>
    );

    const filterSheet = (
        <>
            <button
                onClick={() => setShowFilters(true)}
                className="min-h-[44px] px-4 border border-emerald-500/20 font-mono text-[11px] uppercase tracking-wider flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:border-emerald-500/40 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
                Filtros
                {activeFilterCount > 0 && (
                    <span className="bg-emerald-500 text-black font-bold px-1.5 py-0.5 text-[10px] font-mono leading-none">
                        {activeFilterCount}
                    </span>
                )}
            </button>
            <BottomSheet open={showFilters} onClose={() => setShowFilters(false)} title="Filtrar solicitudes">
                <div className="p-4 space-y-4">
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-2">Estado</p>
                        <div className="flex flex-col gap-1">
                            {[['', 'Todos'], ['pending', 'Pendientes'], ['approved', 'Aprobadas'], ['rejected', 'Rechazadas']].map(([val, label]) => (
                                <button
                                    key={val}
                                    onClick={() => onFiltersChange((f) => ({ ...f, status: val || undefined, page: 1 }))}
                                    className={`min-h-[44px] text-left px-4 font-mono text-sm border transition-colors ${
                                        (filters.status ?? '') === val
                                            ? 'border-emerald-500/40 bg-emerald-500/[0.08] text-emerald-600 dark:text-emerald-400'
                                            : 'border-emerald-500/15 text-slate-600 dark:text-slate-300 hover:border-emerald-500/30'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-2">Tipo</p>
                        <div className="flex flex-col gap-1">
                            {[['', 'Todos'], ['challenge', 'Retos'], ['note', 'Apuntes']].map(([val, label]) => (
                                <button
                                    key={val}
                                    onClick={() => onFiltersChange((f) => ({ ...f, content_type: val || undefined, page: 1 }))}
                                    className={`min-h-[44px] text-left px-4 font-mono text-sm border transition-colors ${
                                        (filters.content_type ?? '') === val
                                            ? 'border-emerald-500/40 bg-emerald-500/[0.08] text-emerald-600 dark:text-emerald-400'
                                            : 'border-emerald-500/15 text-slate-600 dark:text-slate-300 hover:border-emerald-500/30'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => { onFiltersChange((f) => ({ ...f, status: undefined, content_type: undefined, page: 1 })); setShowFilters(false); }}
                        className="w-full min-h-[44px] font-mono text-[11px] uppercase tracking-wider border border-slate-200 dark:border-white/10 text-slate-500 hover:border-emerald-500/30 transition-colors"
                    >
                        Restablecer filtros
                    </button>
                </div>
            </BottomSheet>
        </>
    );

    return (
        <div className="space-y-6">
            <div>{isMobile ? filterSheet : desktopFilters}</div>

            {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">Sin resultados</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">No hay solicitudes que coincidan con los filtros.</p>
                </div>
            ) : isMobile ? (
                <AdminListMobile
                    items={requests}
                    keyExtractor={(r) => r.id}
                    renderHeader={(r) => (
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate font-mono uppercase tracking-wide">{r.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`inline-flex px-1.5 py-0 font-mono text-[10px] uppercase tracking-wider font-bold border ${
                                    r.content_type === 'challenge'
                                        ? 'bg-amber-500/[0.08] text-amber-600 border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400'
                                        : 'bg-violet-500/[0.08] text-violet-600 border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400'
                                }`}>
                                    {r.content_type === 'challenge' ? 'Reto' : 'Apunte'}
                                </span>
                                <span className={`inline-flex px-1.5 py-0 font-mono text-[10px] uppercase tracking-wider font-bold border ${REQ_STATUS_STYLES[r.status] ?? ''}`}>
                                    {REQ_STATUS_LABELS[r.status] ?? r.status}
                                </span>
                            </div>
                        </div>
                    )}
                    renderBody={(r) => (
                        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                            <dt className="text-slate-500 font-mono uppercase tracking-wider">Autor</dt>
                            <dd className="text-slate-700 dark:text-slate-300 font-mono">{r.author_username}</dd>
                            <dt className="text-slate-500 font-mono uppercase tracking-wider">Enviada</dt>
                            <dd className="text-slate-500 font-mono">{new Date(r.submitted_at).toLocaleDateString('es-ES')}</dd>
                        </dl>
                    )}
                    renderActions={(r) => (
                        <button
                            onClick={() => setSelected(r)}
                            className="basis-full min-h-[44px] font-mono text-[11px] uppercase tracking-wider border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                        >
                            Revisar →
                        </button>
                    )}
                    emptyMessage="No hay solicitudes"
                />
            ) : (
                <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-emerald-500/10 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                    <th className="py-3 px-5 font-medium">Título</th>
                                    <th className="py-3 px-5 font-medium">Autor</th>
                                    <th className="py-3 px-5 font-medium">Tipo</th>
                                    <th className="py-3 px-5 font-medium">Estado</th>
                                    <th className="py-3 px-5 font-medium">Enviada</th>
                                    <th className="py-3 px-5 font-medium text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700 dark:text-slate-300">
                                {requests.map((r) => (
                                    <tr
                                        key={r.id}
                                        onClick={() => setSelected(r)}
                                        className="group border-b border-emerald-500/[0.06] hover:bg-emerald-500/[0.04] dark:hover:bg-emerald-500/[0.05] transition-colors cursor-pointer"
                                    >
                                        <td className="py-3 px-5 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-900 dark:text-white max-w-[200px] truncate" title={r.title}>
                                            {r.title}
                                        </td>
                                        <td className="py-3 px-5 font-mono text-[10px] text-slate-500 dark:text-slate-400">{r.author_username}</td>
                                        <td className="py-3 px-5">
                                            <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
                                                r.content_type === 'challenge'
                                                    ? 'bg-amber-500/[0.08] text-amber-600 border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400'
                                                    : 'bg-violet-500/[0.08] text-violet-600 border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400'
                                            }`}>
                                                {r.content_type === 'challenge' ? 'Reto' : 'Apunte'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-5">
                                            <span className={`inline-flex px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] font-bold border ${REQ_STATUS_STYLES[r.status] ?? ''}`}>
                                                {REQ_STATUS_LABELS[r.status] ?? r.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-5 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                            {new Date(r.submitted_at).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="py-3 px-5 text-right">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelected(r); }}
                                                className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/[0.06] dark:text-emerald-400 dark:hover:bg-emerald-500/10 transition-colors"
                                            >
                                                Revisar →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selected && (
                <RequestDetailModal
                    request={selected}
                    onReview={onReview}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
};
