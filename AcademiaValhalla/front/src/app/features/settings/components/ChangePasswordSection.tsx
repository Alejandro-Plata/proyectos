import { useChangePassword } from '../hooks';
import { SettingsInput } from './SettingsInput';
import { Toast } from '../../../components/Toast';
import { Icons } from '../../../components/Icons';

interface Props {
    isOAuthOnly: boolean;
}

export const ChangePasswordSection = ({ isOAuthOnly }: Props) => {
    const {
        form, errors, isLoading, notification,
        handleChange, handleSubmit, dismissNotification,
    } = useChangePassword();

    if (isOAuthOnly) {
        return (
            <div className="flex items-center gap-3 p-4 border border-amber-500/20 bg-amber-500/[0.04]">
                <div className="text-amber-500 w-5 h-5 shrink-0 flex items-center justify-center">{Icons.alertTriangle}</div>
                <p className="text-sm text-amber-700 dark:text-amber-400 font-mono text-[11px] uppercase tracking-[0.1em]">
                    Tu cuenta usa inicio de sesión con Google/GitHub. No tienes contraseña local configurada.
                </p>
            </div>
        );
    }

    return (
        <>
            <Toast
                show={notification.show}
                type={notification.type}
                message={notification.message}
                onDismiss={dismissNotification}
                position="fixed"
            />

            <form onSubmit={handleSubmit} className="space-y-4">
                <SettingsInput
                    label="Contraseña actual"
                    name="current_password"
                    type="password"
                    value={form.current_password}
                    onChange={handleChange}
                    error={errors.current_password}
                    placeholder="••••••••"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SettingsInput
                        label="Nueva contraseña"
                        name="new_password"
                        type="password"
                        value={form.new_password}
                        onChange={handleChange}
                        error={errors.new_password}
                        placeholder="Mínimo 6 caracteres"
                    />
                    <SettingsInput
                        label="Confirmar contraseña"
                        name="confirm_password"
                        type="password"
                        value={form.confirm_password}
                        onChange={handleChange}
                        error={errors.confirm_password}
                        placeholder="Repite la contraseña"
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                        className="px-5 h-9 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-colors disabled:bg-emerald-500/[0.08] disabled:text-emerald-500/30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 flex items-center justify-center animate-spin">
                                    {Icons.spinner}
                                </div>
                                <span>Actualizando...</span>
                            </>
                        ) : (
                            <>
                                <div className="w-4 h-4 flex items-center justify-center">
                                    {Icons.lock}
                                </div>
                                <span>Cambiar contraseña</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </>
    );
};
