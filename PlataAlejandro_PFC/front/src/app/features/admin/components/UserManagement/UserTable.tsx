import type { AdminUser, UpdateUserPayload } from '../../types/types';
import { getAvatarUrl } from '../../../../utils/getAvatarUrl';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { AdminListMobile } from '../shared/AdminListMobile';

interface Props {
    users: AdminUser[];
    onUpdateUser: (userId: string, payload: UpdateUserPayload) => Promise<void>;
    onDeleteUser: (userId: string) => Promise<void>;
}

export const UserTable = ({ users, onUpdateUser, onDeleteUser }: Props) => {
    const isMobile = useIsMobile();

    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/50 mb-2">· sin datos</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">No se encontraron usuarios en la plataforma.</p>
            </div>
        );
    }

    if (isMobile) {
        return (
            <AdminListMobile
                items={users}
                keyExtractor={(u) => u.user_id}
                renderHeader={(u) => (
                    <div className="flex items-center gap-3">
                        <img src={getAvatarUrl(u.username, u.avatar_url)} className="w-10 h-10 hex-shield object-cover shrink-0" alt="" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">@{u.username}</p>
                            <p className="text-xs text-slate-500 truncate font-mono">{u.email}</p>
                        </div>
                        <span className={`shrink-0 inline-flex px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] font-bold border ${
                            u.is_banned
                                ? 'bg-rose-500/[0.08] text-rose-600 border-rose-500/30'
                                : 'bg-emerald-500/[0.08] text-emerald-600 border-emerald-500/30'
                        }`}>
                            {u.is_banned ? 'Baneado' : 'Activo'}
                        </span>
                    </div>
                )}
                renderBody={(u) => (
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                        <dt className="text-slate-500 font-mono uppercase tracking-wider">Nivel</dt>
                        <dd className="text-slate-900 dark:text-white font-mono">{u.current_level}</dd>
                        <dt className="text-slate-500 font-mono uppercase tracking-wider">Registro</dt>
                        <dd className="text-slate-500 font-mono">{new Date(u.created_at).toLocaleDateString('es-ES')}</dd>
                    </dl>
                )}
                renderActions={(u) => (
                    <>
                        <select
                            value={u.role}
                            onChange={(e) => onUpdateUser(u.user_id, { role: e.target.value as AdminUser['role'] })}
                            className="flex-1 min-h-[44px] font-mono text-[11px] uppercase px-3 border border-emerald-500/20 bg-white dark:bg-[#0f1115] text-slate-700 dark:text-slate-300 outline-none"
                        >
                            <option value="USUARIO">Usuario</option>
                            <option value="MODERADOR">Moderador</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                        <button
                            onClick={() => onUpdateUser(u.user_id, { is_banned: !u.is_banned })}
                            className={`flex-1 min-h-[44px] font-mono text-[11px] uppercase tracking-wider border transition-colors ${
                                u.is_banned
                                    ? 'border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10'
                                    : 'border-amber-500/30 text-amber-600 hover:bg-amber-500/10'
                            }`}
                        >
                            {u.is_banned ? 'Desbanear' : 'Banear'}
                        </button>
                        <button
                            onClick={() => { if (confirm(`¿Eliminar @${u.username}?`)) onDeleteUser(u.user_id); }}
                            className="basis-full min-h-[44px] font-mono text-[11px] uppercase tracking-wider border border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
                        >
                            Eliminar cuenta
                        </button>
                    </>
                )}
                emptyMessage="No se encontraron usuarios"
            />
        );
    }

    return (
        <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-emerald-500/10 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                            <th className="py-3 px-5 font-medium">Usuario</th>
                            <th className="py-3 px-5 font-medium">Email</th>
                            <th className="py-3 px-5 font-medium">Rol</th>
                            <th className="py-3 px-5 font-medium text-center">Nivel</th>
                            <th className="py-3 px-5 font-medium">Estado</th>
                            <th className="py-3 px-5 font-medium">Registro</th>
                            <th className="py-3 px-5 font-normal text-right">· acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700 dark:text-slate-300">
                        {users.map((u) => (
                            <tr
                                key={u.user_id}
                                className="group border-b border-emerald-500/[0.06] hover:bg-emerald-500/[0.04] dark:hover:bg-emerald-500/[0.05] transition-colors"
                            >
                                <td className="py-3 px-5">
                                    <div className="flex items-center gap-3">
                                        <div className="relative shrink-0 w-9 h-9">
                                            <img
                                                src={getAvatarUrl(u.username, u.avatar_url)}
                                                className="w-9 h-9 hex-shield object-cover"
                                                alt={u.username}
                                            />
                                        </div>
                                        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-900 dark:text-white">{u.username}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-5 text-xs text-slate-500 dark:text-slate-400 font-mono">{u.email}</td>
                                <td className="py-3 px-5">
                                    <select
                                        value={u.role}
                                        onChange={(e) => onUpdateUser(u.user_id, { role: e.target.value as AdminUser['role'] })}
                                        className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1.5 outline-none cursor-pointer transition-colors bg-transparent text-slate-700 dark:text-slate-300 border border-emerald-500/20 dark:border-emerald-500/15 focus:border-emerald-500/50"
                                    >
                                        <option value="USUARIO">USUARIO</option>
                                        <option value="MODERADOR">MODERADOR</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td className="py-3 px-5 text-center">
                                    <span className="inline-flex items-center justify-center w-7 h-7 bg-emerald-500/[0.08] dark:bg-emerald-500/10 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        {u.current_level}
                                    </span>
                                </td>
                                <td className="py-3 px-5">
                                    <span className={`inline-flex items-center px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] font-bold border ${
                                        u.is_banned
                                            ? 'bg-rose-500/[0.08] text-rose-600 border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400'
                                            : 'bg-emerald-500/[0.08] text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400'
                                    }`}>
                                        {u.is_banned ? 'Baneado' : 'Activo'}
                                    </span>
                                </td>
                                <td className="py-3 px-5 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                    {new Date(u.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </td>
                                <td className="py-3 px-5 text-right space-x-2">
                                    <button
                                        onClick={() => onUpdateUser(u.user_id, { is_banned: !u.is_banned })}
                                        className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border transition-colors ${
                                            u.is_banned
                                            ? 'border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/[0.06] dark:text-emerald-400 dark:hover:bg-emerald-500/10'
                                            : 'border-amber-500/30 text-amber-600 hover:bg-amber-500/[0.06] dark:text-amber-400 dark:hover:bg-amber-500/10'
                                        }`}
                                    >
                                        {u.is_banned ? 'Desbanear' : 'Banear'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm(`¿Eliminar la cuenta de ${u.username}? Esta acción es irreversible.`)) {
                                                onDeleteUser(u.user_id);
                                            }
                                        }}
                                        className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-rose-500/30 text-rose-600 hover:bg-rose-500/[0.06] dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
