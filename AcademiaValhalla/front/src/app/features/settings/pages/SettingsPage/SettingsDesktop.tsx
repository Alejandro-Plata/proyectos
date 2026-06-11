import { useSettingsForm, useDeleteAccount, useUnsavedChangesWarning } from '../../hooks';
import { getAvatarUrl } from '../../../../utils/getAvatarUrl';
import { Toast } from '../../../../components/Toast';
import { Icons } from '../../../../components/Icons';
import { SettingsSection } from '../../components/SettingsSection';
import { SettingsInput } from '../../components/SettingsInput';
import { ChangePasswordSection } from '../../components/ChangePasswordSection';
import { DeleteAccountModal } from '../../components/DeleteAccountModal';

export const SettingsDesktop = () => {
    const {
        user, formData, errors, hasErrors, isDirty,
        isLoading, notification, handleChange, handleAvatarUpload, handleSubmit, dismissNotification,
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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020202] flex justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative">

            <Toast show={notification.show} type={notification.type}
                message={notification.message} onDismiss={dismissNotification} position="fixed" />

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

            <div className="max-w-3xl w-full space-y-8">

                {/* Header BB-4 */}
                <div>
                    <div className="mb-6">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Ajustes</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Configuración de cuenta</p>
                    </div>
                    <div className="flex items-center gap-2 border border-emerald-500/15 dark:border-emerald-500/10 bg-white dark:bg-[#0a0b0e] px-3 py-1.5 w-fit shadow-sm shadow-emerald-500/5">
                        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-300">
                            Nivel {formData.current_level}
                        </span>
                        <div className="h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* 1. Identidad Pública */}
                    <SettingsSection title="Identidad Pública">
                        <div className="flex flex-col sm:flex-row gap-8">
                            <div className="flex flex-col items-center space-y-3">
                                <label className="relative group cursor-pointer block">
                                    <img
                                        src={getAvatarUrl(formData.username, formData.avatar_url)}
                                        alt="Avatar"
                                        className="h-24 w-24 hex-shield object-cover bg-slate-100"
                                    />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white font-mono text-[10px] uppercase tracking-[0.15em]">Cambiar</span>
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={onFileChange} disabled={isLoading} />
                                </label>
                            </div>
                            <div className="flex-1 space-y-5">
                                <SettingsInput
                                    label="Nombre de usuario"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    error={errors.username}
                                />
                                <div>
                                    <div className="relative">
                                        <label className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-slate-600 dark:text-slate-300 mb-2 select-none">
                                            <span className="inline-block w-0.5 h-3 bg-emerald-500 shrink-0" />
                                            Biografía
                                        </label>
                                        <textarea
                                            name="bio"
                                            rows={3}
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className={`block w-full text-sm px-3 pt-3 pb-2.5 transition-colors resize-none outline-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400/60 dark:placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs border ${
                                                errors.bio
                                                    ? 'border-red-500/30 focus:border-red-500/60'
                                                    : 'border-emerald-500/20 dark:border-emerald-500/15 focus:border-emerald-500/50'
                                            }`}
                                            placeholder="Cuéntanos qué tecnologías te gustan..."
                                        />
                                    </div>
                                    <div className="mt-1 flex justify-between">
                                        {errors.bio && <p className="text-xs text-red-500 font-mono">{errors.bio}</p>}
                                        <p className={`text-xs ml-auto font-mono ${formData.bio.length > 500 ? 'text-red-500' : 'text-slate-400'}`}>
                                            {formData.bio.length}/500
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SettingsSection>

                    <SettingsSection title="Conexiones" subtitle="Enlaza tus perfiles profesionales">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <SettingsInput
                                label="GitHub"
                                name="github_url"
                                value={formData.github_url}
                                onChange={handleChange}
                                error={errors.github_url}
                                icon={Icons.gitHub}
                                placeholder="https://github.com/usuario"
                            />
                            <SettingsInput
                                label="LinkedIn"
                                name="linkedin_url"
                                value={formData.linkedin_url}
                                onChange={handleChange}
                                error={errors.linkedin_url}
                                icon={Icons.briefcase}
                                placeholder="https://linkedin.com/in/usuario"
                            />
                        </div>
                    </SettingsSection>

                    {/* Barra flotante de guardar */}
                    <div className={`fixed bottom-6 right-1 transform -translate-x-1/2 z-50 transition-all duration-300 ${
                        isDirty && !hasErrors ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
                    }`}>
                        <div className="flex items-center gap-4 px-6 py-3 shadow-2xl border backdrop-blur-md bg-white/90 dark:bg-[#0a0b0e]/90 border-emerald-500/15 dark:border-emerald-500/10">
                            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-700 dark:text-slate-200">Cambios sin guardar</span>
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                                className="px-5 h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors disabled:bg-emerald-500/[0.08] disabled:text-emerald-500/30 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <><div className="w-4 h-4 animate-spin">{Icons.spinner}</div>Guardando...</>
                                ) : (
                                    <><div className="w-4 h-4">{Icons.check}</div>Guardar</>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                {/* 3. Seguridad */}
                <SettingsSection title="Seguridad" subtitle="Tu correo y contraseña">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 p-4 border border-emerald-500/15 dark:border-emerald-500/10 bg-emerald-500/[0.03]">
                            <div className="text-slate-500 dark:text-slate-400">
                                {Icons.email}
                            </div>
                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Correo Electrónico</p>
                                <p className="text-sm text-slate-900 dark:text-white mt-0.5">{formData.email}</p>
                            </div>
                        </div>
                        <ChangePasswordSection isOAuthOnly={isOAuthOnly} />
                    </div>
                </SettingsSection>

                {/* Zona de Peligro */}
                <div className="mt-12 pt-8 border-t border-emerald-500/15 dark:border-emerald-500/10 pb-16 md:pb-0">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="h-px w-4 bg-red-500/50" />
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-500 flex items-center gap-2">
                            <div className="w-3.5 h-3.5">{Icons.flame}</div>
                            Zona de peligro
                        </h4>
                    </div>
                    <div className="flex md:flex-row md:items-center md:justify-between flex-col gap-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Si quieres eliminar tu cuenta permanentemente, no hay vuelta atrás.
                        </p>
                        <button
                            type="button"
                            onClick={deleteAccount.openModal}
                            className="px-4 h-9 border border-red-500/30 hover:border-red-500/60 text-red-500 hover:bg-red-500/[0.06] font-mono text-[11px] uppercase tracking-[0.15em] transition-colors"
                        >
                            Eliminar cuenta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
