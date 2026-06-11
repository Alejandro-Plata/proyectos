interface SettingsInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    icon?: React.ReactNode;
}

export const SettingsInput = ({
    label, name, value, onChange, error, type = 'text',
    placeholder, disabled, icon
}: SettingsInputProps) => (
    <div>
        
        <label className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-slate-600 dark:text-slate-300 mb-2 select-none">
            <span className="inline-block w-0.5 h-3 bg-emerald-500 shrink-0" />
            {label}
        </label>

        <div className="relative">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    {icon}
                </div>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`
                    w-full text-sm px-3 py-2.5 outline-none bg-transparent text-slate-900 dark:text-white
                    placeholder:text-slate-400/50 dark:placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs
                    border transition-colors
                    ${icon ? 'pl-10' : ''}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${error
                        ? 'border-red-500/30 focus:border-red-500/60'
                        : 'border-emerald-500/20 dark:border-emerald-500/15 focus:border-emerald-500/50'
                    }
                `}
            />
        </div>
        {error && (
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-red-500 dark:text-red-400">{error}</p>
        )}
    </div>
);
