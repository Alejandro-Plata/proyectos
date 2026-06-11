import { Icons } from '../../../../components/Icons';
import { useSettingsForm, useDeleteAccount, useUnsavedChangesWarning } from '../../hooks';
import { getAvatarUrl } from '../../../../utils/getAvatarUrl';
import { Toast } from '../../../../components/Toast';
import { ChangePasswordSection } from '../../components/ChangePasswordSection';
import { ThemeToggleSection } from '../../components/ThemeToggleSection';
import { DeleteAccountModal } from '../../components/DeleteAccountModal';

export const SettingsMobile = () => {
    const {
        user,
        formData,
        errors,
        hasErrors,
        isDirty,
        isLoading,
        notification,
        handleChange,
        handleAvatarUpload,
        handleSubmit,
        dismissNotification,
    } = useSettingsForm();

    const deleteAccount = useDeleteAccount();
    useUnsavedChangesWarning(isDirty);

    if (!user) return null;

    const isOAuthOnly = !!(user.google_id || user.github_id) && !user.has_password;

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleAvatarUpload(e.target.files[0]);
        }
    };

    const sectionClass = 'bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5 overflow-hidden';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-200 font-sans pb-32">

            <Toast
                show={notification.show}
                type={notification.type}
                message={notification.message}
                onDismiss={dismissNotification}
                position="fixed"
            />

            <DeleteAccountModal
                show={deleteAccount.showModal}
                confirmText={deleteAccount.confirmText}
                onConfirmTextChange={deleteAccount.setConfirmText}
                confirmationWord={deleteAccount.CONFIRMATION_WORD}
                canConfirm={deleteAccount.canConfirm}
                isDeleting={deleteAccount.isDeleting}
                error={deleteAccount.error}
                onConfirm={deleteAccount.handleDelete}
                onCancel={deleteAccount.closeModal}
            />

            {/* Header BB-4 */}
            <div className="px-4 pt-8 pb-6 border-b border-emerald-500/15 dark:border-emerald-500/10 bg-white dark:bg-[#0a0b0e]">
                <div className="mb-3">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Ajustes</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Configuración de cuenta</p>
                </div>
                <div className="flex items-center gap-1.5 border border-emerald-500/15 dark:border-emerald-500/10 bg-emerald-500/[0.03] px-3 py-1.5 w-fit">
                    <div className="w-1.5 h-1.5 bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-700 dark:text-slate-300">Nivel {formData.current_level}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="px-4 pt-6 space-y-4">

                {/* Identidad */}
                <div className={sectionClass}>
                    <div className="p-5">
                        <div className="mb-5">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Identidad</h2>
                        </div>
                        <div className="flex items-center gap-4 mb-5">
                            <div className="flex flex-col items-center gap-2 shrink-0">
                                <img
                                    src={getAvatarUrl(formData.username, formData.avatar_url)}
                                    alt="Avatar"
                                    className="h-16 w-16 hex-shield object-cover bg-slate-200 dark:bg-slate-800"
                                />
                                <label className="cursor-pointer min-h-[44px] px-3 flex items-center border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-emerald-500/[0.05] transition-colors">
                                    {isLoading ? 'Subiendo...' : 'Cambiar foto'}
                                    <input type="file" accept="image/*" className="hidden" onChange={onFileChange} disabled={isLoading} />
                                </label>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="relative">
                                    <span className="absolute -top-[1px] left-3 z-10 pointer-events-none select-none">
                                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-500/50 bg-white dark:bg-[#0a0b0e] px-1">Nombre de usuario</span>
                                    </span>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`w-full text-sm px-3 pt-3 pb-2.5 outline-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400/60 dark:placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs border transition-colors ${
                                            errors.username
                                                ? 'border-red-500/30 focus:border-red-500/60'
                                                : 'border-emerald-500/20 dark:border-emerald-500/15 focus:border-emerald-500/50'
                                        }`}
                                    />
                                </div>
                                {errors.username && <p className="mt-1 text-xs text-red-500 font-mono">{errors.username}</p>}
                            </div>
                            <div>
                                <div className="relative">
                                    <span className="absolute -top-[1px] left-3 z-10 pointer-events-none select-none">
                                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-500/50 bg-white dark:bg-[#0a0b0e] px-1">Bio</span>
                                    </span>
                                    <textarea
                                        name="bio"
                                        rows={3}
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className={`w-full text-sm px-3 pt-3 pb-2.5 outline-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400/60 dark:placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs border transition-colors resize-none ${
                                            errors.bio
                                                ? 'border-red-500/30 focus:border-red-500/60'
                                                : 'border-emerald-500/20 dark:border-emerald-500/15 focus:border-emerald-500/50'
                                        }`}
                                        placeholder="Cuéntanos qué tecnologías te gustan..."
                                    />
                                </div>
                                <div className="mt-1 flex justify-between">
                                    {errors.bio && <p className="text-xs text-red-500 font-mono">{errors.bio}</p>}
                                    <p className={`font-mono text-[10px] ml-auto ${formData.bio.length > 500 ? 'text-red-500' : 'text-slate-600'}`}>
                                        {formData.bio.length}/500
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conexiones */}
                <div className={sectionClass}>
                    <div className="p-5 space-y-4">
                        <div className="mb-1">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Conexiones</h2>
                        </div>
                        <div>
                            <div className="relative">
                                <span className="absolute -top-[1px] left-3 z-10 pointer-events-none select-none">
                                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-500/50 bg-white dark:bg-[#0a0b0e] px-1">GitHub</span>
                                </span>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 top-2">{Icons.gitHub}</div>
                                <input
                                    type="text"
                                    name="github_url"
                                    value={formData.github_url}
                                    onChange={handleChange}
                                    className={`w-full text-sm px-3 pl-10 pt-3 pb-2.5 outline-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400/60 dark:placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs border transition-colors ${
                                        errors.github_url
                                            ? 'border-red-500/30 focus:border-red-500/60'
                                            : 'border-emerald-500/20 dark:border-emerald-500/15 focus:border-emerald-500/50'
                                    }`}
                                    placeholder="https://github.com/usuario"
                                />
                            </div>
                            {errors.github_url && <p className="mt-1 text-xs text-red-500 font-mono">{errors.github_url}</p>}
                        </div>
                        <div>
                            <div className="relative">
                                <span className="absolute -top-[1px] left-3 z-10 pointer-events-none select-none">
                                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-500/50 bg-white dark:bg-[#0a0b0e] px-1">LinkedIn</span>
                                </span>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500 opacity-60 top-2">{Icons.briefcase}</div>
                                <input
                                    type="text"
                                    name="linkedin_url"
                                    value={formData.linkedin_url}
                                    onChange={handleChange}
                                    className={`w-full text-sm px-3 pl-10 pt-3 pb-2.5 outline-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400/60 dark:placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs border transition-colors ${
                                        errors.linkedin_url
                                            ? 'border-red-500/30 focus:border-red-500/60'
                                            : 'border-emerald-500/20 dark:border-emerald-500/15 focus:border-emerald-500/50'
                                    }`}
                                    placeholder="https://linkedin.com/in/usuario"
                                />
                            </div>
                            {errors.linkedin_url && <p className="mt-1 text-xs text-red-500 font-mono">{errors.linkedin_url}</p>}
                        </div>
                    </div>
                </div>

                {/* Barra flotante de guardar */}
                <div
                    className={`fixed left-4 right-4 z-50 transition-all duration-300 ${
                        isDirty && !hasErrors ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
                    }`}
                    style={{ bottom: 'var(--fab-bottom)' }}
                >
                    <div className="flex items-center gap-4 px-5 py-3 shadow-2xl border backdrop-blur-md bg-white/90 dark:bg-[#0a0b0e]/90 border-emerald-500/15 dark:border-emerald-500/10">
                        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-700 dark:text-slate-300 flex-1">Cambios sin guardar</span>
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                            className="px-5 h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors disabled:bg-emerald-500/[0.08] disabled:text-emerald-500/30 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 flex items-center justify-center animate-spin">
                                        {Icons.spinner}
                                    </div>
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        {Icons.check}
                                    </div>
                                    <span>Guardar</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Seguridad */}
            <div className="px-4 mt-4 space-y-4">
                <div className={sectionClass}>
                    <div className="p-5 space-y-4">
                        <div className="mb-1">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Seguridad</h2>
                        </div>
                        <div className="flex items-center gap-3 p-3 border border-emerald-500/15 dark:border-emerald-500/10 bg-emerald-500/[0.03]">
                            <div className="text-slate-500 dark:text-slate-400">{Icons.email}</div>
                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Correo Electrónico</p>
                                <p className="text-sm text-slate-900 dark:text-white mt-0.5">{formData.email}</p>
                            </div>
                        </div>
                        <ChangePasswordSection isOAuthOnly={isOAuthOnly} />
                    </div>
                </div>

                {/* Apariencia */}
                <div className={sectionClass}>
                    <div className="p-5">
                        <div className="mb-4">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Apariencia</h2>
                        </div>
                        <ThemeToggleSection />
                    </div>
                </div>

                {/* Zona de Peligro */}
                <div className="pt-6 border-t border-emerald-500/15 dark:border-emerald-500/10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="h-px w-4 bg-red-500/50" />
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-500 flex items-center gap-2">
                            <div className="w-3.5 h-3.5">{Icons.flame}</div>
                            Zona de peligro
                        </h4>
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500 mb-4">Si quieres eliminar tu cuenta permanentemente, no hay vuelta atrás.</p>
                    <button
                        type="button"
                        onClick={deleteAccount.openModal}
                        className="w-full px-4 h-9 border border-red-500/30 hover:border-red-500/60 text-red-500 hover:bg-red-500/[0.06] font-mono text-[11px] uppercase tracking-[0.15em] transition-colors"
                    >
                        Eliminar cuenta
                    </button>
                </div>
            </div>
        </div>
    );
};
